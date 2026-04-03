import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "Home": "Home",
      "Find Workers": "Find Workers",
      "Search": "Search",
      "Bookings": "Bookings",
      "Messages": "Messages",
      "Wallet": "Wallet",
      "Profile": "Profile",
      "Login": "Login",
      "Dashboard": "Dashboard",
      "Inbox": "Inbox",
      "Find Elite Local Workers, Fast.": "Find Elite Local Workers, Fast.",
      "What help do you need?": "What help do you need?",
      "Categories": "Categories",
      "Introducing Skill Exchange": "Introducing Skill Exchange",
      "Explore Barter Jobs": "Explore Barter Jobs",
      "Top Rated Near You": "Top Rated Near You",
      "Zero Fees": "Zero Fees",
      "Worker Dashboard": "Worker Dashboard",
      "Total Earnings": "Total Earnings",
      "Jobs Completed": "Jobs Completed",
      "Avg Rating": "Avg Rating",
      "Profile Settings": "Profile Settings",
      "Job Requests": "Job Requests"
    }
  },
  hi: {
    translation: {
      "Home": "मुख्य पृष्ठ",
      "Find Workers": "कार्यकर्ता खोजें",
      "Search": "खोज",
      "Bookings": "बुकिंग",
      "Messages": "संदेश",
      "Wallet": "बटुआ",
      "Profile": "प्रोफ़ाइल",
      "Login": "लॉग इन",
      "Dashboard": "डैशबोर्ड",
      "Inbox": "इनबॉक्स",
      "Find Elite Local Workers, Fast.": "तेज़ी से बेहतरीन स्थानीय कार्यकर्ता खोजें।",
      "What help do you need?": "आपको क्या मदद चाहिए?",
      "Categories": "श्रेणियाँ",
      "Introducing Skill Exchange": "स्किल एक्सचेंज का परिचय",
      "Explore Barter Jobs": "बार्टर जॉब्स खोजें",
      "Top Rated Near You": "आपके पास शीर्ष रेटेड",
      "Zero Fees": "शून्य शुल्क",
      "Worker Dashboard": "कार्यकर्ता डैशबोर्ड",
      "Total Earnings": "कुल कमाई",
      "Jobs Completed": "कार्य पूरे हुए",
      "Avg Rating": "औसत रेटिंग",
      "Profile Settings": "प्रोफ़ाइल सेटिंग",
      "Job Requests": "नौकरी के अनुरोध"
    }
  },
  pa: {
    translation: {
      "Home": "ਘਰ",
      "Find Workers": "ਕਾਮੇ ਲੱਭੋ",
      "Search": "ਖੋਜ",
      "Bookings": "ਬੁਕਿੰਗਾਂ",
      "Messages": "ਸੁਨੇਹੇ",
      "Wallet": "ਵਾਲਿਟ",
      "Profile": "ਪ੍ਰੋਫਾਈਲ",
      "Login": "ਲਾਗਿਨ",
      "Dashboard": "ਡੈਸ਼ਬੋਰਡ",
      "Inbox": "ਇਨਬਾਕਸ",
      "Find Elite Local Workers, Fast.": "ਤੇਜ਼ੀ ਨਾਲ ਵਧੀਆ ਸਥਾਨਕ ਕਾਮੇ ਲੱਭੋ।",
      "What help do you need?": "ਤੁਹਾਨੂੰ ਕੀ ਮਦਦ ਚਾਹੀਦੀ ਹੈ?",
      "Categories": "ਸ਼੍ਰੇਣੀਆਂ",
      "Introducing Skill Exchange": "ਸਕਿੱਲ ਐਕਸਚੇਂਜ ਪੇਸ਼ ਕਰ ਰਿਹਾ ਹੈ",
      "Explore Barter Jobs": "ਬਾਰਟਰ ਨੌਕਰੀਆਂ ਦੀ ਪੜਚੋਲ ਕਰੋ",
      "Top Rated Near You": "ਤੁਹਾਡੇ ਨੇੜੇ ਚੋਟੀ ਦੇ ਰੇਟ ਕੀਤੇ",
      "Zero Fees": "ਜ਼ੀਰੋ ਫੀਸ",
      "Worker Dashboard": "ਵਰਕਰ ਡੈਸ਼ਬੋਰਡ",
      "Total Earnings": "ਕੁੱਲ ਕਮਾਈ",
      "Jobs Completed": "ਕੰਮ ਮੁਕੰਮਲ",
      "Avg Rating": "ਔਸਤ ਰੇਟਿੰਗ",
      "Profile Settings": "ਪ੍ਰੋਫਾਈਲ ਸੈਟਿੰਗਾਂ",
      "Job Requests": "ਨੌਕਰੀ ਦੀਆਂ ਬੇਨਤੀਆਂ"
    }
  },
  mr: {
    translation: {
      "Home": "मुख्यपृष्ठ",
      "Find Workers": "कामगार शोधा",
      "Search": "शोध",
      "Bookings": "बुकिंग",
      "Messages": "संदेश",
      "Wallet": "पाकीट",
      "Profile": "प्रोफाइल",
      "Login": "लॉगिन",
      "Dashboard": "डॅशबोर्ड",
      "Inbox": "इनबॉक्स",
      "Find Elite Local Workers, Fast.": "उत्कृष्ट स्थानिक कामगार वेगाने शोधा.",
      "What help do you need?": "तुम्हाला काय मदत हवी आहे?",
      "Categories": "श्रेणी",
      "Introducing Skill Exchange": "कौशल्य देवाणघेवाण सादर करत आहोत",
      "Explore Barter Jobs": "बार्टर जॉब्स एक्सप्लोर करा",
      "Top Rated Near You": "तुमच्या जवळचे टॉप रेट केलेले",
      "Zero Fees": "शून्य शुल्क",
      "Worker Dashboard": "कामगार डॅशबोर्ड",
      "Total Earnings": "एकूण कमाई",
      "Jobs Completed": "पूर्ण झालेली कामे",
      "Avg Rating": "सरासरी रेटिंग",
      "Profile Settings": "प्रोफाइल सेटिंग्ज",
      "Job Requests": "नोकरीच्या विनंत्या"
    }
  },
  bn: {
    translation: {
      "Home": "হোম",
      "Find Workers": "কর্মী খুঁজুন",
      "Search": "অনুসন্ধান",
      "Bookings": "বুকিং",
      "Messages": "বার্তা",
      "Wallet": "ওয়ালেট",
      "Profile": "প্রোফাইল",
      "Login": "লগইন",
      "Dashboard": "ড্যাশবোর্ড",
      "Inbox": "ইনবক্স",
      "Find Elite Local Workers, Fast.": "দ্রুত সেরা স্থানীয় কর্মীদের খুঁজুন।",
      "What help do you need?": "আপনার কী সাহায্য দরকার?",
      "Categories": "বিভাগ",
      "Introducing Skill Exchange": "স্কিল এক্সচেঞ্জ পরিচয়",
      "Explore Barter Jobs": "বার্টার কাজগুলি অন্বেষণ করুন",
      "Top Rated Near You": "আপনার কাছাকাছি শীর্ষ রেট করা",
      "Zero Fees": "শূন্য ফি",
      "Worker Dashboard": "কর্মী ড্যাশবোর্ড",
      "Total Earnings": "মোট আয়",
      "Jobs Completed": "সম্পন্ন কাজ",
      "Avg Rating": "গড় রেটিং",
      "Profile Settings": "প্রোফাইল সেটিংস",
      "Job Requests": "কাজের অনুরোধ"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
