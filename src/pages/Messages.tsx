import { useState, useEffect, useRef, useMemo } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import api from '../api';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Send, Video, PlayCircle, Mic, User } from 'lucide-react';
import { BackButton } from '../components/BackButton';
import { io, Socket } from 'socket.io-client';

export function Messages() {
  const user = useAuthStore(state => state.user);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initTargetId = searchParams.get('user_id');
  
  const [messages, setMessages] = useState<any[]>([]);
  const [draft, setDraft] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [targetUserId, setTargetUserId] = useState<number | null>(initTargetId ? Number(initTargetId) : null);
  const [, setSocket] = useState<Socket | null>(null);
  
  // Mobile UI toggle state
  const [showContacts, setShowContacts] = useState(!initTargetId);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    
    // Use the same base URL as the API for WebSocket connection
    let socketUrl = api.defaults.baseURL?.split('/api')[0] || '';
    
    // If socketUrl is relative (like '/api' -> ''), use current window location
    if (!socketUrl || !socketUrl.startsWith('http')) {
        socketUrl = window.location.origin;
    }
    
    const newSocket = io(socketUrl);
    setSocket(newSocket);
    
    newSocket.on('connect', () => {
      newSocket.emit('join', user.id);
    });

    newSocket.on('receive_message', (msg) => {
        setMessages(prev => [...prev, msg]);
        scrollToBottom();
    });

    return () => {
        newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (user) fetchMessages();
  }, [user]);

  const fetchMessages = async () => {
    if (!user) return;
    try {
      const res = await api.get(`/messages/${user.id}`);
      setMessages(res.data);
      setTimeout(scrollToBottom, 50);
    } catch (err) {
      console.error(err);
    }
  };

  const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (e?: React.FormEvent, type: 'text' | 'video' | 'audio' = 'text', content: string = draft) => {
    if (e) e.preventDefault();
    if (!content.trim() && type === 'text') return;
    
    const receiverId = targetUserId || (messages.length > 0 ? (messages[messages.length-1].sender_id === user?.id ? messages[messages.length-1].receiver_id : messages[messages.length-1].sender_id) : 1);
    
    try {
      await api.post('/messages', {
        sender_id: user?.id,
        receiver_id: receiverId,
        content,
        type
      });
      setDraft('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleMockMediaMessage = (type: 'video' | 'audio') => {
      setIsRecording(true);
      setTimeout(() => {
          setIsRecording(false);
          sendMessage(undefined, type, `/uploads/mock_recorded_${type}_blob`);
      }, 2000);
  };

  const contacts = useMemo(() => {
      const uniqueContacts = new Map<number, { id: number, name: string, avatar: string }>();
      messages.forEach(m => {
          if (m.sender_id !== user?.id) {
              if (!uniqueContacts.has(m.sender_id)) {
                  uniqueContacts.set(m.sender_id, {
                      id: m.sender_id,
                      name: m.sender_name || `User #${m.sender_id}`,
                      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(m.sender_name || m.sender_id)}`
                  });
              }
          }
          if (m.receiver_id !== user?.id) {
              if (!uniqueContacts.has(m.receiver_id)) {
                  uniqueContacts.set(m.receiver_id, {
                      id: m.receiver_id,
                      name: m.receiver_name || `User #${m.receiver_id}`,
                      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(m.receiver_name || m.receiver_id)}`
                  });
              }
          }
      });
      if (initTargetId) {
          if (!uniqueContacts.has(Number(initTargetId))) {
               uniqueContacts.set(Number(initTargetId), {
                      id: Number(initTargetId),
                      name: `User #${initTargetId}`,
                      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${initTargetId}`
               });
          }
      }
      return Array.from(uniqueContacts.values());
  }, [messages, user, initTargetId]);

  if (!user) return <div className="p-8 text-center text-primary font-bold">Please login to view messages</div>;

  const threadMessages = targetUserId 
    ? messages.filter(m => (m.sender_id === user.id && m.receiver_id === targetUserId) || (m.sender_id === targetUserId && m.receiver_id === user.id))
    : messages;

  const activeContact = contacts.find(c => c.id === targetUserId);

  return (
    <div className="p-2 md:p-6 lg:p-8 max-w-6xl mx-auto h-[88vh] flex flex-col pt-0 mb-16 md:mb-0">
      <div className="pt-2 md:pt-4 z-10 sticky top-16 md:top-0 mb-4 hidden md:block">
         <BackButton />
      </div>
      
      <div className="flex-1 bg-white dark:bg-surface-dark rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] flex overflow-hidden transition-all">
        
        {/* Left Pane: Contacts Sidebar */}
        <div className={`w-full md:w-80 border-r flex flex-col ${!showContacts ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b bg-slate-50 relative">
               <div className="absolute top-4 right-4 md:hidden text-slate-400" onClick={() => navigate(-1)}><BackButton/></div>
               <h2 className="text-xl font-bold text-slate-900">Chats</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
               {contacts.length === 0 ? (
                   <div className="p-8 text-center text-slate-500 font-medium">No conversations yet.</div>
               ) : contacts.map(contact => (
                   <div 
                      key={contact.id} 
                      onClick={() => {
                          setTargetUserId(contact.id);
                          setShowContacts(false);
                          setTimeout(scrollToBottom, 50);
                      }}
                      className={`p-4 flex gap-3 items-center cursor-pointer border-b last:border-0 hover:bg-slate-50 transition ${targetUserId === contact.id ? 'bg-blue-50 border-l-4 border-l-primary' : ''}`}
                   >
                       <img src={contact.avatar} className="w-12 h-12 rounded-full border bg-white" alt="Avatar"/>
                       <div>
                           <h3 className="font-bold text-slate-900">{contact.name}</h3>
                           <p className="text-xs text-slate-500 line-clamp-1">Tap to view thread...</p>
                       </div>
                   </div>
               ))}
            </div>
        </div>

        {/* Right Pane: Active Chat */}
        <div className={`flex-1 flex flex-col bg-slate-50 ${showContacts ? 'hidden md:flex' : 'flex'}`}>
            {targetUserId ? (
                <>
                    {/* Chat Header */}
                    <div className="bg-white p-4 border-b flex items-center gap-4 shadow-sm z-10">
                        <button className="md:hidden p-2 -ml-2 text-slate-500" onClick={() => setShowContacts(true)}>
                            ← Back
                        </button>
                        <img src={activeContact?.avatar} className="w-10 h-10 rounded-full border bg-slate-100" />
                        <div>
                            <h3 className="font-bold text-slate-900">{activeContact?.name}</h3>
                            <p className="text-xs font-semibold text-green-500 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
                            </p>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                        {threadMessages.length === 0 && (
                            <div className="m-auto text-center text-slate-400 font-medium">
                                <User className="w-12 h-12 mx-auto mb-2 opacity-50"/>
                                Say hello to {activeContact?.name}!
                            </div>
                        )}
                        {threadMessages.map(msg => (
                            <div key={msg.id} className={`flex max-w-[75%] flex-col ${msg.sender_id === user.id ? 'self-end' : 'self-start'}`}>
                                <div className={`${msg.sender_id === user.id ? 'bg-primary text-white rounded-l-2xl rounded-tr-2xl' : 'bg-white border text-slate-800 rounded-r-2xl rounded-tl-2xl shadow-sm'} p-3 md:p-4 text-[15px]`}>
                                    {msg.type === 'video' ? (
                                        <div className="flex justify-center flex-col items-center gap-2 cursor-pointer w-48 h-32 bg-slate-900 text-white rounded-xl relative overflow-hidden group">
                                            <PlayCircle className="w-12 h-12 text-white/80 group-hover:scale-110 transition-transform" />
                                            <span className="absolute bottom-2 right-2 text-xs text-white/50 bg-black/50 px-1 rounded">0:15</span>
                                            <span className="text-[10px] uppercase font-bold text-slate-300">Video Message</span>
                                        </div>
                                    ) : msg.type === 'audio' ? (
                                        <div className="flex items-center gap-3 w-48 bg-black/10 p-2 rounded-xl">
                                            <button className="bg-white text-primary rounded-full p-2 shadow-sm"><PlayCircle className="w-5 h-5"/></button>
                                            <div className="flex-1 space-y-1">
                                                <div className="h-1.5 bg-black/20 rounded-full w-full overflow-hidden">
                                                    <div className="h-full bg-primary w-1/3"></div>
                                                </div>
                                                <div className="flex justify-between text-[10px] opacity-70 font-bold"><span>0:00</span><span>0:32</span></div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="leading-snug">{msg.content}</p>
                                    )}
                                </div>
                                <span className={`text-[10px] font-bold mt-1 mx-1 text-slate-400 ${msg.sender_id === user.id ? 'text-right' : 'text-left'}`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="bg-white p-3 md:p-4 border-t">
                        <form onSubmit={(e) => sendMessage(e, 'text')} className="flex items-center gap-2">
                            <button type="button" onClick={() => {}} className="p-3 text-slate-400 hover:text-primary transition-colors hidden sm:block"><User className="w-5 h-5"/></button>
                            <div className="flex-1 bg-slate-100 rounded-full flex items-center px-2 border focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                                <input 
                                    value={draft}
                                    onChange={e => setDraft(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-transparent px-4 py-3 md:py-4 outline-none text-[15px]"
                                />
                                <button type="button" onClick={() => handleMockMediaMessage('video')} className={`p-2 transition-colors ${isRecording ? 'text-red-500 animate-pulse' : 'text-slate-500 hover:text-primary'}`}><Video className="w-5 h-5" /></button>
                                <button type="button" onClick={() => handleMockMediaMessage('audio')} className={`p-2 transition-colors mr-1 ${isRecording ? 'text-red-500 animate-pulse' : 'text-slate-500 hover:text-primary'}`}><Mic className="w-5 h-5" /></button>
                            </div>
                            <button type="submit" disabled={!draft.trim()} className="bg-primary text-white p-3 md:p-4 rounded-full shadow-md hover:bg-primary/90 transition-transform active:scale-95 disabled:opacity-50 disabled:active:scale-100">
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-100">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                        <Send className="w-10 h-10 text-slate-300 ml-2" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-600">Your Messages</h2>
                    <p className="mt-2 text-slate-500">Select a contact from the sidebar to view your conversation.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
