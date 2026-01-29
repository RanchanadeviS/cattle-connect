import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ta' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Load saved language preference from localStorage
    const saved = localStorage.getItem('preferredLanguage');
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('preferredLanguage', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Translation dictionaries
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Common
    'app.name': 'HerdHub',
    'welcome': 'Welcome',
    'back': 'Back',
    'save': 'Save',
    'cancel': 'Cancel',
    'edit': 'Edit',
    'delete': 'Delete',
    'loading': 'Loading...',
    'search': 'Search',
    'filter': 'Filter',
    'language': 'Language',
    
    // Auth Page
    'auth.signin': 'Sign In',
    'auth.signup': 'Sign Up',
    'auth.signout': 'Sign Out',
    'auth.demo.title': 'Demo Profile',
    'auth.demo.subtitle': 'Try HerdHub with our demo account',
    'auth.demo.button': 'Continue as Ranchana',
    'auth.demo.history': 'Trading History',
    'auth.demo.sold': 'Sold Cows',
    'auth.demo.purchased': 'Purchased Goats',
    'auth.demo.pending': 'Pending Buffalo',
    'auth.demo.lastmonth': 'last month',
    'auth.demo.thisyear': 'this year',
    'auth.demo.request': 'request',
    'auth.title': 'Sign In to HerdHub',
    'auth.subtitle': 'Access your account or create a new one',
    'auth.verifyotp': 'Verify OTP',
    'auth.otpsent': 'Enter the OTP sent to',
    'auth.method.email': 'Email',
    'auth.method.phone': 'Phone',
    'auth.signinwith': 'Sign in with',
    'auth.password': 'Password',
    'auth.otp': 'OTP',
    'auth.enterotp': 'Enter OTP',
    'auth.sendotp': 'Send OTP',
    'auth.sendingotp': 'Sending OTP...',
    'auth.verifying': 'Verifying...',
    'auth.signingin': 'Signing in...',
    'auth.fullname': 'Full Name',
    'auth.email': 'Email ID',
    'auth.phone': 'Phone Number',
    'auth.age': 'Age',
    'auth.location.city': 'City',
    'auth.location.state': 'State/Region',
    'auth.role': 'Select Role',
    'auth.role.farmer': 'Farmer',
    'auth.role.buyer': 'Buyer',
    'auth.role.seller': 'Seller',
    'auth.role.veterinarian': 'Veterinarian',
    'auth.required': '*',
    'auth.optional': 'Optional',
    'auth.registering': 'Registering...',
    'auth.register': 'Register',
    
    // Navigation
    'nav.home': 'Home',
    'nav.browse': 'Browse',
    'nav.auctions': 'Auctions',
    'nav.messages': 'Messages',
    'nav.profile': 'Profile',
    'nav.account': 'Account',
    'nav.mylistings': 'My Listings',
    'nav.createlisting': 'Create New Listing',
    'nav.sellcattle': 'Sell Cattle',
    
    // Profile
    'profile.title': 'Profile',
    'profile.personalinfo': 'Personal Information',
    'profile.statistics': 'Profile Statistics',
    'profile.quickactions': 'Quick Actions',
    'profile.totallistings': 'Total Listings',
    'profile.activebids': 'Active Bids',
    'profile.completedtrades': 'Completed Trades',
    'profile.viewlistings': 'View My Listings',
    'profile.browsemarket': 'Browse Marketplace',
    'profile.settings': 'Settings',
    'profile.nologin': 'Please log in to view your profile',
    'profile.login': 'Go to Login',
    
    // Toasts
    'toast.success': 'Success',
    'toast.error': 'Error',
    'toast.fillfields': 'Please fill in all required fields',
    'toast.signedin': 'Signed in successfully!',
    'toast.signedout': 'Signed out successfully',
    'toast.verified': 'Verified successfully!',
    'toast.otpsent.phone': 'OTP sent to your phone',
    'toast.otpsent.email': 'OTP sent to your email',
    'toast.otpsent.verify': 'Please verify to complete registration',
    'toast.profileupdated': 'Profile updated successfully',
    'toast.failedupdate': 'Failed to update profile',
    'toast.failedsignout': 'Failed to sign out',
  },
  ta: {
    // Common
    'app.name': 'ஹெர்ட்ஹப்',
    'welcome': 'வரவேற்கிறோம்',
    'back': 'பின்',
    'save': 'சேமி',
    'cancel': 'ரத்து',
    'edit': 'திருத்து',
    'delete': 'நீக்கு',
    'loading': 'ஏற்றுகிறது...',
    'search': 'தேடு',
    'filter': 'வடிகட்டு',
    'language': 'மொழி',
    
    // Auth Page
    'auth.signin': 'உள்நுழை',
    'auth.signup': 'பதிவு செய்',
    'auth.signout': 'வெளியேறு',
    'auth.demo.title': 'டெமோ சுயவிவரம்',
    'auth.demo.subtitle': 'எங்கள் டெமோ கணக்கில் ஹெர்ட்ஹப்பை முயற்சிக்கவும்',
    'auth.demo.button': 'ரஞ்சனாவாக தொடரவும்',
    'auth.demo.history': 'வர்த்தக வரலாறு',
    'auth.demo.sold': 'விற்கப்பட்ட மாடுகள்',
    'auth.demo.purchased': 'வாங்கிய ஆடுகள்',
    'auth.demo.pending': 'நிலுவையில் உள்ள எருமை',
    'auth.demo.lastmonth': 'கடந்த மாதம்',
    'auth.demo.thisyear': 'இந்த ஆண்டு',
    'auth.demo.request': 'கோரிக்கை',
    'auth.title': 'ஹெர்ட்ஹப்பில் உள்நுழைக',
    'auth.subtitle': 'உங்கள் கணக்கை அணுகவும் அல்லது புதியதை உருவாக்கவும்',
    'auth.verifyotp': 'OTP ஐ சரிபார்க்கவும்',
    'auth.otpsent': 'அனுப்பப்பட்ட OTP ஐ உள்ளிடவும்',
    'auth.method.email': 'மின்னஞ்சல்',
    'auth.method.phone': 'தொலைபேசி',
    'auth.signinwith': 'உள்நுழைய பயன்படுத்து',
    'auth.password': 'கடவுச்சொல்',
    'auth.otp': 'OTP',
    'auth.enterotp': 'OTP ஐ உள்ளிடவும்',
    'auth.sendotp': 'OTP அனுப்பு',
    'auth.sendingotp': 'OTP அனுப்புகிறது...',
    'auth.verifying': 'சரிபார்க்கிறது...',
    'auth.signingin': 'உள்நுழைகிறது...',
    'auth.fullname': 'முழு பெயர்',
    'auth.email': 'மின்னஞ்சல் முகவரி',
    'auth.phone': 'தொலைபேசி எண்',
    'auth.age': 'வயது',
    'auth.location.city': 'நகரம்',
    'auth.location.state': 'மாநிலம்/பகுதி',
    'auth.role': 'பாத்திரத்தை தேர்ந்தெடுக்கவும்',
    'auth.role.farmer': 'விவசாயி',
    'auth.role.buyer': 'வாங்குபவர்',
    'auth.role.seller': 'விற்பனையாளர்',
    'auth.role.veterinarian': 'கால்நடை மருத்துவர்',
    'auth.required': '*',
    'auth.optional': 'விருப்பமானது',
    'auth.registering': 'பதிவு செய்கிறது...',
    'auth.register': 'பதிவு செய்',
    
    // Navigation
    'nav.home': 'முகப்பு',
    'nav.browse': 'உலாவு',
    'nav.auctions': 'ஏலங்கள்',
    'nav.messages': 'செய்திகள்',
    'nav.profile': 'சுயவிவரம்',
    'nav.account': 'கணக்கு',
    'nav.mylistings': 'என் பட்டியல்கள்',
    'nav.createlisting': 'புதிய பட்டியல் உருவாக்கு',
    'nav.sellcattle': 'கால்நடை விற்க',
    
    // Profile
    'profile.title': 'சுயவிவரம்',
    'profile.personalinfo': 'தனிப்பட்ட தகவல்',
    'profile.statistics': 'சுயவிவர புள்ளிவிவரங்கள்',
    'profile.quickactions': 'விரைவு செயல்கள்',
    'profile.totallistings': 'மொத்த பட்டியல்கள்',
    'profile.activebids': 'செயலில் உள்ள ஏலங்கள்',
    'profile.completedtrades': 'முடிக்கப்பட்ட வர்த்தகங்கள்',
    'profile.viewlistings': 'என் பட்டியல்களை பார்க்க',
    'profile.browsemarket': 'சந்தையை உலாவவும்',
    'profile.settings': 'அமைப்புகள்',
    'profile.nologin': 'உங்கள் சுயவிவரத்தைப் பார்க்க உள்நுழையவும்',
    'profile.login': 'உள்நுழைவுக்கு செல்லவும்',
    
    // Toasts
    'toast.success': 'வெற்றி',
    'toast.error': 'பிழை',
    'toast.fillfields': 'அனைத்து தேவையான புலங்களையும் நிரப்பவும்',
    'toast.signedin': 'வெற்றிகரமாக உள்நுழைந்தது!',
    'toast.signedout': 'வெற்றிகரமாக வெளியேறியது',
    'toast.verified': 'வெற்றிகரமாக சரிபார்க்கப்பட்டது!',
    'toast.otpsent.phone': 'உங்கள் தொலைபேசிக்கு OTP அனுப்பப்பட்டது',
    'toast.otpsent.email': 'உங்கள் மின்னஞ்சலுக்கு OTP அனுப்பப்பட்டது',
    'toast.otpsent.verify': 'பதிவை முடிக்க சரிபார்க்கவும்',
    'toast.profileupdated': 'சுயவிவரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது',
    'toast.failedupdate': 'சுயவிவரத்தை புதுப்பிக்க முடியவில்லை',
    'toast.failedsignout': 'வெளியேற முடியவில்லை',
  },
  hi: {
    // Common
    'app.name': 'हर्डहब',
    'welcome': 'स्वागत है',
    'back': 'वापस',
    'save': 'सहेजें',
    'cancel': 'रद्द करें',
    'edit': 'संपादित करें',
    'delete': 'हटाएं',
    'loading': 'लोड हो रहा है...',
    'search': 'खोजें',
    'filter': 'फ़िल्टर',
    'language': 'भाषा',
    
    // Auth Page
    'auth.signin': 'साइन इन करें',
    'auth.signup': 'साइन अप करें',
    'auth.signout': 'साइन आउट करें',
    'auth.demo.title': 'डेमो प्रोफ़ाइल',
    'auth.demo.subtitle': 'हमारे डेमो खाते के साथ हर्डहब आज़माएं',
    'auth.demo.button': 'रंचना के रूप में जारी रखें',
    'auth.demo.history': 'व्यापार इतिहास',
    'auth.demo.sold': 'बेची गई गायें',
    'auth.demo.purchased': 'खरीदी गई बकरियां',
    'auth.demo.pending': 'लंबित भैंस',
    'auth.demo.lastmonth': 'पिछले महीने',
    'auth.demo.thisyear': 'इस वर्ष',
    'auth.demo.request': 'अनुरोध',
    'auth.title': 'हर्डहब में साइन इन करें',
    'auth.subtitle': 'अपने खाते तक पहुंचें या नया बनाएं',
    'auth.verifyotp': 'OTP सत्यापित करें',
    'auth.otpsent': 'भेजा गया OTP दर्ज करें',
    'auth.method.email': 'ईमेल',
    'auth.method.phone': 'फ़ोन',
    'auth.signinwith': 'इसके साथ साइन इन करें',
    'auth.password': 'पासवर्ड',
    'auth.otp': 'OTP',
    'auth.enterotp': 'OTP दर्ज करें',
    'auth.sendotp': 'OTP भेजें',
    'auth.sendingotp': 'OTP भेजा जा रहा है...',
    'auth.verifying': 'सत्यापित हो रहा है...',
    'auth.signingin': 'साइन इन हो रहा है...',
    'auth.fullname': 'पूरा नाम',
    'auth.email': 'ईमेल आईडी',
    'auth.phone': 'फ़ोन नंबर',
    'auth.age': 'उम्र',
    'auth.location.city': 'शहर',
    'auth.location.state': 'राज्य/क्षेत्र',
    'auth.role': 'भूमिका चुनें',
    'auth.role.farmer': 'किसान',
    'auth.role.buyer': 'खरीदार',
    'auth.role.seller': 'विक्रेता',
    'auth.role.veterinarian': 'पशु चिकित्सक',
    'auth.required': '*',
    'auth.optional': 'वैकल्पिक',
    'auth.registering': 'पंजीकरण हो रहा है...',
    'auth.register': 'पंजीकरण करें',
    
    // Navigation
    'nav.home': 'होम',
    'nav.browse': 'ब्राउज़ करें',
    'nav.auctions': 'नीलामी',
    'nav.messages': 'संदेश',
    'nav.profile': 'प्रोफ़ाइल',
    'nav.account': 'खाता',
    'nav.mylistings': 'मेरी सूचियां',
    'nav.createlisting': 'नई सूची बनाएं',
    'nav.sellcattle': 'मवेशी बेचें',
    
    // Profile
    'profile.title': 'प्रोफ़ाइल',
    'profile.personalinfo': 'व्यक्तिगत जानकारी',
    'profile.statistics': 'प्रोफ़ाइल सांख्यिकी',
    'profile.quickactions': 'त्वरित क्रियाएं',
    'profile.totallistings': 'कुल सूचियां',
    'profile.activebids': 'सक्रिय बोलियां',
    'profile.completedtrades': 'पूर्ण व्यापार',
    'profile.viewlistings': 'मेरी सूचियां देखें',
    'profile.browsemarket': 'बाज़ार ब्राउज़ करें',
    'profile.settings': 'सेटिंग्स',
    'profile.nologin': 'अपनी प्रोफ़ाइल देखने के लिए लॉग इन करें',
    'profile.login': 'लॉगिन पर जाएं',
    
    // Toasts
    'toast.success': 'सफलता',
    'toast.error': 'त्रुटि',
    'toast.fillfields': 'कृपया सभी आवश्यक फ़ील्ड भरें',
    'toast.signedin': 'सफलतापूर्वक साइन इन किया गया!',
    'toast.signedout': 'सफलतापूर्वक साइन आउट किया गया',
    'toast.verified': 'सफलतापूर्वक सत्यापित किया गया!',
    'toast.otpsent.phone': 'आपके फ़ोन पर OTP भेजा गया',
    'toast.otpsent.email': 'आपके ईमेल पर OTP भेजा गया',
    'toast.otpsent.verify': 'पंजीकरण पूरा करने के लिए सत्यापित करें',
    'toast.profileupdated': 'प्रोफ़ाइल सफलतापूर्वक अपडेट की गई',
    'toast.failedupdate': 'प्रोफ़ाइल अपडेट करने में विफल',
    'toast.failedsignout': 'साइन आउट करने में विफल',
  }
};
