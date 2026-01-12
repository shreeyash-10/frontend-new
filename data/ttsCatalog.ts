// Re-export types from voiceService for backward compatibility
import type { VoiceDefinition, LanguageDefinition } from '../services/voiceService';

export type { VoiceDefinition, LanguageDefinition };

export const characterLimit = 500;

export const defaultScriptPresets = {
  Greeting: "Hello there! Thanks for dialing into IndusLabs. We’re here to support your customer needs—whether that’s product assistance, technical guidance, or general help. How can I assist your customers today?",
  Support: "Hey there, this is your IndusLabs assistant. I can walk you through the latest coverage options, policy updates, or even help you start a claim in under two minutes, so your customers get fast and accurate support.",
  Announcement: "Good morning everyone, and welcome to the IndusLabs Voice Studio showcase. Today, we’ll demonstrate how real-time multilingual voice automation can seamlessly scale across global enterprise customer support teams.",
  Reminder: "Hey there, just a friendly reminder that your IndusLabs subscription is scheduled to renew tomorrow. You can review, modify, or update your plan preferences anytime directly from your dashboard without any hassle."
} as const;

export type ScriptPresetName = keyof typeof defaultScriptPresets; // 'Greeting' | 'Support' | 'Announcement' | 'Reminder'

export const scriptPresetsByLanguage: Record<string, Record<ScriptPresetName, string>> = {
  ar: {
    Greeting: "مرحباً بك! شكراً لاتصالك بـ إندوس لابز. نحن هنا لمساعدتك في تلبية احتياجات عملائك، سواء كان الأمر متعلقاً بدعم المنتج أو الإرشاد التقني أو أي استفسار عام. كيف يمكنني مساعدتك اليوم؟",
    Support: "مرحباً، أنا مساعدك من إندوس لابز. يمكنني تزويدك بآخر تفاصيل التغطية، تحديثات السياسات، أو بدء مطالبة تأمين في أقل من دقيقتين، لضمان حصول عملائك على دعم سريع ودقيق.",
    Announcement: "صباح الخير جميعاً، ونرحب بكم في عرض إندوس لابز لاستوديو الصوت. اليوم سنوضح كيف يمكن للدعم الصوتي متعدد اللغات في الوقت الفعلي أن يخدم المؤسسات العالمية بكفاءة عالية وعلى نطاق واسع.",
    Reminder: "مرحباً! تذكير بسيط بأن اشتراكك في إندوس لابز سيتم تجديده غداً. يمكنك تعديل تفضيلاتك أو تحديث خطتك في أي وقت من خلال لوحة التحكم بسهولة تامة."
  },
  it: {
    Greeting: "Ciao! Grazie per aver contattato IndusLabs. Siamo qui per assistere i tuoi clienti con supporto sui prodotti, indicazioni tecniche o qualsiasi domanda generale. Come posso aiutarti oggi?",
    Support: "Ciao, sono il tuo assistente IndusLabs. Posso guidarti tra le opzioni di copertura più recenti, aggiornamenti di polizza o avviare una richiesta in meno di due minuti, così i tuoi clienti ricevono assistenza rapida e precisa.",
    Announcement: "Buongiorno a tutti e benvenuti alla demo di IndusLabs Voice Studio. Oggi mostreremo come il supporto vocale multilingue in tempo reale possa scalare facilmente per grandi team di assistenza aziendale.",
    Reminder: "Ciao! Ti ricordiamo che il tuo abbonamento IndusLabs verrà rinnovato domani. Puoi modificare o aggiornare le tue preferenze direttamente dalla dashboard in qualsiasi momento."
  },
  ja: {
    Greeting: "こんにちは！インダスラボへお電話いただきありがとうございます。製品サポート、技術案内、または一般的なご質問など、お客様の対応をお手伝いします。本日どのようなサポートが必要ですか？",
    Support: "どうも、こちらはインダスラボのアシスタントです。最新の補償内容やポリシー更新のご案内、または2分以内での請求手続き開始までサポートできます。お客様に迅速で正確な対応を提供します。",
    Announcement: "おはようございます。インダスラボ・ボイススタジオのデモへようこそ。本日はリアルタイム多言語音声サポートが、企業レベルでどのようにスケールできるかを実演いたします。",
    Reminder: "こんにちは。インダスラボのご契約更新が明日予定されていることをお知らせします。設定の変更やプランの更新は、いつでもダッシュボードから行えます。"
  },
  fr: {
    Greeting: "Bonjour ! Merci d’avoir contacté IndusLabs. Nous sommes disponibles pour assister vos clients, que ce soit pour un support produit, une aide technique ou toute question générale. Comment puis-je vous aider aujourd’hui ?",
    Support: "Bonjour, ici votre assistant IndusLabs. Je peux vous guider à travers les dernières options de couverture, les mises à jour de police ou lancer une déclaration en moins de deux minutes pour offrir un service rapide et précis à vos clients.",
    Announcement: "Bonjour à tous, et bienvenue à la présentation IndusLabs Voice Studio. Aujourd’hui, nous allons démontrer comment l’assistance vocale multilingue en temps réel peut s’adapter facilement aux besoins des grandes équipes d’entreprise.",
    Reminder: "Bonjour ! Petit rappel : votre abonnement IndusLabs sera renouvelé demain. Vous pouvez modifier ou mettre à jour vos préférences à tout moment depuis votre tableau de bord."
  },
  es: {
    Greeting: "¡Hola! Gracias por llamar a IndusLabs. Estamos aquí para ayudarte con las necesidades de tus clientes, ya sea asistencia técnica, información de productos o cualquier consulta general. ¿Cómo puedo ayudarte hoy?",
    Support: "Hola, soy tu asistente de IndusLabs. Puedo guiarte por las opciones de cobertura más recientes, actualizaciones de pólizas o incluso iniciar una reclamación en menos de dos minutos, para que tus clientes reciban soporte rápido y confiable.",
    Announcement: "Buenos días a todos y bienvenidos a la demostración de IndusLabs Voice Studio. Hoy mostraremos cómo el soporte de voz multilingüe en tiempo real puede escalar fácilmente para empresas de nivel global.",
    Reminder: "Hola, solo un recordatorio amistoso: tu suscripción de IndusLabs se renovará mañana. Puedes actualizar tus preferencias cuando quieras desde el panel de control."
  },
  en: {
    Greeting: "Hello there! Thanks for dialing into IndusLabs. We’re here to support your customer needs—whether that’s product assistance, technical guidance, or general help. How can I assist your customers today?",
    Support: "Hey there, this is your IndusLabs assistant. I can walk you through the latest coverage options, policy updates, or even help you start a claim in under two minutes, so your customers get fast and accurate support.",
    Announcement: "Good morning everyone, and welcome to the IndusLabs Voice Studio showcase. Today, we’ll demonstrate how real-time multilingual voice automation can seamlessly scale across global enterprise customer support teams.",
    Reminder: "Hey there, just a friendly reminder that your IndusLabs subscription is scheduled to renew tomorrow. You can review, modify, or update your plan preferences anytime directly from your dashboard without any hassle."
  },
  hi: {
    Greeting: "नमस्कार! इंडस लैब्स को कॉल करने के लिए धन्यवाद। हम आपके ग्राहकों की सहायता के लिए तैयार हैं, चाहे वह प्रोडक्ट सपोर्ट हो, तकनीकी मार्गदर्शन हो या किसी भी तरह की जानकारी। आज मैं आपके ग्राहकों की कैसे मदद कर सकता हूँ?",
    Support: "नमस्ते, मैं आपका इंडस लैब्स सहायक हूँ। मैं आपको नवीनतम कवरेज विकल्प, पॉलिसी अपडेट, या सिर्फ दो मिनट में दावा प्रक्रिया शुरू करने में मदद कर सकता हूँ, ताकि आपके ग्राहकों को तेज और सटीक सहायता मिल सके।",
    Announcement: "सुप्रभात सभी को, और इंडस लैब्स वॉयस स्टूडियो शोकेस में आपका स्वागत है। आज हम दिखाएंगे कि रीयल-टाइम मल्टीलिंगुअल वॉयस सपोर्ट कैसे बड़े एंटरप्राइज़ स्तर पर ग्राहकों की सेवा को सरल और तेज़ बना सकता है।",
    Reminder: "नमस्ते, बस एक छोटा सा रिमाइंडर है कि आपकी इंडस लैब्स सदस्यता कल नवीनीकृत होने वाली है। आप अपने डैशबोर्ड में जाकर कभी भी अपनी योजना को अपडेट या संशोधित कर सकते हैं।"
  },
  bn: {
    Greeting: "হ্যালো! ইন্ডাস ল্যাবসে কল করার জন্য ধন্যবাদ। আপনার গ্রাহকদের সাহায্যের জন্য আমরা সবসময় প্রস্তুত—পণ্য নির্দেশনা, প্রযুক্তিগত সহায়তা বা সাধারণ প্রশ্ন যাই হোক না কেন। আজ আমি কীভাবে তাদের সহায়তা করতে পারি?",
    Support: "হ্যালো, আমি আপনার ইন্ডাস ল্যাবস সহকারী। আমি আপনাকে সর্বশেষ কভারেজ অপশন, নীতি আপডেট বা মাত্র দুই মিনিটে ক্লেইম শুরু করতে সাহায্য করতে পারি, যাতে আপনার গ্রাহকরা দ্রুত এবং নির্ভুল সহায়তা পান।",
    Announcement: "সুপ্রভাত সবাইকে, এবং ইন্ডাস ল্যাবস ভয়েস স্টুডিও শোকেসে আপনাদের স্বাগত। আজ আমরা দেখাব কীভাবে রিয়েল-টाइम বহুভাষিক ভয়েস অটোমেশন বড় এন্টারপ্রাইজ পর্যায়ে গ্রাহক সহায়তাকে আরও সহজ করে তোলে।",
    Reminder: "হ্যালো! শুধু মনে করিয়ে দিচ্ছি যে আপনার ইন্ডাস ল্যাবস সাবস্ক্রিপশন আগামীকাল নবায়ন হবে। যেকোনো সময় ড্যাশবোর্ডে গিয়ে আপনি সেটিংস পরিবর্তন বা পছন্দ আপডেট করতে পারবেন।"
  },
  kn: {
    Greeting: "ನಮಸ್ಕಾರ! ಇಂಡಸ್ ಲ್ಯಾಬ್ಸ್‌ಗೆ ಕರೆ ಮಾಡಿದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು. ಉತ್ಪನ್ನ ಬೆಂಬಲ, ತಾಂತ್ರಿಕ ಮಾರ್ಗದರ್ಶನ ಅಥವಾ ಸಾಮಾನ್ಯ ಸಹಾಯ ಏನೇ ಇರಲಿ, ನಿಮ್ಮ ಗ್ರಾಹಕರಿಗೆ ನಾವು ಸದಾ ಸಹಾಯಕ್ಕೆ ಸಿದ್ಧ. ಇಂದು ನಾನು ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
    Support: "ಹಲೋ, ನಾನು ನಿಮ್ಮ ಇಂಡಸ್ ಲ್ಯಾಬ್ಸ್ ಸಹಾಯಕ. ಇತ್ತೀಚಿನ ಕವರೆಜ್ ವಿವರಗಳು, ಪಾಲಿಸಿ ಅಪ್ಡೇಟ್‌ಗಳು ಅಥವಾ ಎರಡು ನಿಮಿಷಗಳಲ್ಲಿ ಕ್ಲೇಮ್ ಪ್ರಕ್ರಿಯೆ ಪ್ರಾರಂಭಿಸಲು ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಹುದು, ಇದರಿಂದ ನಿಮ್ಮ ಗ್ರಾಹಕರು ವೇಗವಾದ ಮತ್ತು ನಿಖರವಾದ ಬೆಂಬಲವನ್ನು ಪಡೆಯುತ್ತಾರೆ।",
    Announcement: "ಶುಭೋದಯ ಎಲ್ಲರಿಗೂ! ಇಂಡಸ್ ಲ್ಯಾಬ್ಸ್ ವಾಯ್ಸ್ ಸ್ಟುಡಿಯೋ ಪ್ರದರ್ಶನಕ್ಕೆ ಸ್ವಾಗತ. ಇಂದು ನಾವು ರಿಯಲ್-ಟೈಮ್ ಬಹುಭಾಷಾ ವಾಯ್ಸ್ ಸಪೋರ್ಟ್ ಹೇಗೆ ಜಾಗತಿಕ ಎಂಟರ್‌ಪ್ರೈಸ್ ಮಟ್ಟದಲ್ಲಿ ವ್ಯಾಪಕವಾಗಿ ಕೆಲಸ ಮಾಡುತ್ತದೆ ಎಂಬುದನ್ನು ತೋರಿಸುತ್ತೇವೆ।",
    Reminder: "ಹಲೋ, ನಿಮ್ಮ ಇಂಡಸ್ ಲ್ಯಾಬ್ಸ್ ಸಬ್ಸ್ಕ್ರಿಪ್ಶನ್ ನಾಳೆ ನವೀಕರಾಗಲಿದೆ ಎಂಬುದು ಸೌಮ್ಯ ನೆನಪು. ನೀವು ಯಾವುದೇ ಸಮಯದಲ್ಲಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ನಲ್ಲಿ ನಿಮ್ಮ ಆಯ್ಕೆಗಳನ್ನು ಬದಲಾಯಿಸಬಹುದು।"
  },
  mr: {
    Greeting: "नमस्कार! इंडस लॅब्सवर कॉल केल्याबद्दल धन्यवाद. ग्राहकांच्या मदतीसाठी आम्ही नेहमी तयार आहोत—उत्पादन सहाय्यता, तांत्रिक मार्गदर्शन किंवा इतर कोणतीही माहिती हवी असल्यास. आज मी तुमच्या ग्राहकांना कशी मदत करू शकतो?",
    Support: "नमस्कार, मी तुमचा इंडस लॅब्स सहाय्यक बोलतो आहे. मी तुम्हाला नवीन कव्हरेज पर्याय, पॉलिसी अपडेट्स किंवा फक्त दोन मिनिटांत क्लेम सुरू करण्यात मदत करू शकतो, जेणेकरून तुमच्या ग्राहकांना त्वरित आणि अचूक सेवा मिळेल।",
    Announcement: "शुभ सकाळ सर्वांना, आणि इंडस लॅब्स व्हॉइस स्टुडिओ शोकेसमध्ये आपले स्वागत आहे. आज आम्ही दाखवणार आहोत की रिअल-टाइम मल्टीलिंग्वल व्हॉइस ऑटोमेशन मोठ्या एंटरप्राइज़ सपोर्ट टीमसाठी कसे स्केल होते।",
    Reminder: "हाय, फक्त आठवण करून देतो की तुमची इंडस लॅब्स सदस्यता उद्या नूतनीकरण होणार आहे. तुम्ही डॅशबोर्डवरून कधीही तुमची योजना अपडेट करू शकता।"
  },
  te: {
    Greeting: "హలో! ఇండస్ ల్యాబ్స్‌కి కాల్ చేసినందుకు ధన్యవాదాలు. మీ కస్టమర్‌లకు ప్రొడక్ట్ సహాయం, టెక్నికల్ సపోర్ట్ లేదా సాధారణ సమాచారం ఏదైనా కావచ్చును—మేము సహాయానికి సిద్ధంగా ఉన్నాము. ఈ రోజు నేను ఎలా సహాయపడగలను?",
    Support: "హాయ్, నేను మీ ఇండస్ ల్యాబ్స్ అసిస్టెంట్. తాజా కవరేజ్ వివరాలు, పాలసీ అప్‌డేట్స్ లేదా రెండు నిమిషాల్లో క్లెయిమ్ ప్రారంభించడంలో నేను మీకు సహాయం చేయగలను, తద్వారా మీ కస్టమర్‌లకు వేగవంతమైన సహాయం అందుతుంది।",
    Announcement: "శుభోదయం అందరికీ! ఇండస్ ల్యాబ్స్ వాయిస్ స్టూడియో షోకేస్‌కి స్వాగతం. ఎంటర్ప్రైజ్ స్థాయిలో రియల్‌టైమ్ బహుభాషా వాయిస్ సపోర్ట్ ఎలా పని చేస్తుందో ఈరోజు మేము ప్రదర్శించబోతున్నాం।",
    Reminder: "హలో! రేపు మీ ఇండస్ ల్యాబ్స్ సభ్యత్వం రీన్యూ అవుతుంది అని సరళమైన రిమైండర్. మీరు ఎప్పుడైనా డ్యాష్‌బోర్డ్‌లో మీ ప్రిఫరెన్స్‌లను మార్చవచ్చు।"
  },
  bho: {
    Greeting: "प्रणाम! इंडस लैब्स पर कॉल कइले खातिर धन्यवाद। हम आपके ग्राहकन के मदद करे खातिर तैयार बानी, चाहे ओह में प्रोडक्ट सपोर्ट होखे, टेक्निकल जानकारी होखे अथवा आउर कऊनो मदद। आज हम कइसे मदद कर सकत बानी?",
    Support: "नमस्कार, ई इंडस लैब्स के असिस्टेंट हऽ। हम रउरा के नयका कवरेज डिटेल, पॉलिसी अपडेट, भा दू मिनट में क्लेम चालू करे में मदद कर सकिलेनी, जेसे रउरा ग्राहकन के तनीके में सही सहायता मिल सके।",
    Announcement: "सुप्रभात सभे लोग! इंडस लैब्स वॉइस स्टूडियो शोकेस में रउरा स्वागत बा। आज हम देखाइब कि रियल-टाइम मल्टीलिंगुअल सपोर्ट कइसे बड़ा कंपनी में लागू कइल जा सकेला।",
    Reminder: "नमस्कार! बस याद दिलावतानी कि रउरा इंडस लैब्स सब्सक्रिप्शन काल्हे रिन्यू होखे वाला बा। रउरा कभीओ डैशबोर्ड से सेटिंग बदल सकतानी।"
  },
  hne: {
    Greeting: "नमस्ते! इंडस लैब्स मं फोन करे बर धन्यवादी. हमन अपन ग्राहकी के मदद करे बर तियार हवन,चाहे वह प्रोडक्ट सहायता होवय, टेक्निकल बात होवय या कोनो जानकारी। आज का मदद चाही तुमन?",
    Support: "नमस्कार, मैं तुमन के इंडस लैब्स के असिस्टेंट हंव। मैं तुमन ला नवा कवरेज जानकारी, पॉलिसी अपडेट या दू मिनट मं दावा सुरू करे मं मदद कर सकथौं, तैंसे तुमन के ग्राहकी ला फुरती मं सहारा मिलही।",
    Announcement: "सुप्रभात सबो झन ला, इंडस लैब्स वाइस स्टूडियो मं स्वागत हे। आज हमन दिखाबो कि बहुभाषीय वॉयस सपोर्ट कइसे बड़े काम-काज मं अपनाय जाथे।",
    Reminder: "जइया! बस याद करावत हंव कि तुमन के इंडस लैब्स सब्सक्रिप्शन कल नवीनीकृत होही। तुमन डैशबोर्ड ले कभू घलो अपन पसंद बदले सकथौं।"
  },
  mai: {
    Greeting: "प्रणाम! इंडस लैब्स पर कॉल करबाक लेल धन्यवाद। हम अहाँक ग्राहकसभक सहायता करबाक लेल सदैव तैयार छी—उत्पाद समर्थन, तकनीकी जानकारी अथवा अन्य कोनो प्रश्न हो। आजि हम अहाँक कोना सहायत करू?",
    Support: "नमस्कार, हम इंडस लैब्सक सहायक छी। हम अहाँक नवीनतम कवरेज विवरण, पॉलिसी अपडेट अथवा दू मिनटमे दावा प्रक्रिया शुरू करबा मे मदद कए सकैत छी, जकरा सँ अहाँक ग्राहकसभक त्वरित सहायता भेटत।",
    Announcement: "सुप्रभात सभक! इंडस लैब्स वॉयस स्टूडियो मे स्वागत अछि। आइ हम देखब कि वास्तविक समय বহुभाषीय वॉयस सपोर्ट कोना वैश्विक स्तर पर एंटरप्राइज मे लागू कएल जाइत अछि।",
    Reminder: "नमस्कार! बस याद दए रहल छी जे अहाँक इंडस लैब्स सदस्यता काल्हि नवीनीकरण हेबाक अछि। अहाँ डैशबोर्ड सँ कखनो सेहो अपन पसंद बदली सकैत छी।"
  },
  ml: {
    Greeting: "നമസ്കാരം! ഇൻഡസ് ലാബ്സിലേക്ക് വിളിച്ചതിന് നന്ദി. ഉൽപ്പന്ന സഹായം, സാങ്കേതിക പിന്തുണ, അല്ലെങ്കിൽ പൊതുവായ ചോദ്യങ്ങൾ എന്താണെങ്കിലും നിങ്ങളുടെ ഉപഭോക്താക്കൾക്ക് ഞങ്ങൾ സഹായിക്കാൻ തയ്യാറാണ്. ഇന്ന് ഞാൻ എന്തിൽ സഹായിക്കാം?",
    Support: "ഹലോ, ഞാൻ നിങ്ങളുടെ ഇൻഡസ് ലാബ്സ് സഹായി. ഏറ്റവും പുതിയ കവറേജ് വിവരങ്ങൾ, പോളിസി അപ്‌ഡേറ്റുകൾ, അല്ലെങ്കിൽ രണ്ട് മിനിറ്റിനുള്ളിൽ ക്ലെയിം ആരംഭിക്കുന്നത് വരെ ഞാൻ നിങ്ങളെ സഹായിക്കും, ഉപഭോക്താക്കൾക്ക് വേഗത്തിലുള്ള സേവനം ലഭിക്കാനായി।",
    Announcement: "സുപ്രഭാതം എല്ലാവർക്കും! ഇൻഡസ് ലാബ്സ് വോയ്‌സ് സ്റ്റുഡിയോ ഷോക്കേസിലേക്ക് സ്വാഗതം. എന്റർപ്രൈസ് ലെവലിൽ റിയൽടൈം ബഹുഭാഷാ വോയ്‌സ് സപ്പോർട്ട് എങ്ങനെ പ്രവർത്തിക്കുന്നു എന്ന് ഇന്ന് കാണിച്ചുതരാം।",
    Reminder: "ഹലോ! നിങ്ങളുടെ ഇൻഡസ് ലാബ്സ് സബ്സ്ക്രിപ്ഷൻ നാളെയാണ് റിന്യൂ ആകുന്നത് എന്ന് ഒരു ലളിതമായ ഓർമ്മപ്പെടുത്തൽ. ഡാഷ്ബോർഡിൽ ഏത് സമയത്തും നിങ്ങൾക്ക് പ്ലാൻ മാറ്റാനോ അപ്‌ഡേറ്റ് ചെയ്യാനോ കഴിയും।"
  },
  ta: {
    Greeting: "வணக்கம்! இண்டஸ் லாப்ஸிற்கு அழைத்ததற்கு நன்றி. உங்கள் வாடிக்கையாளர்களுக்கான தொழில்நுட்ப உதவி, தயாரிப்பு விளக்கம், அல்லது ஏதேனும் பொது சந்தேகம் இருந்தாலும், உதவத் தயாராக இருப்போம். இன்று எப்படிச் சொல்லி உதவலாம்?",
    Support: "வணக்கம், நான் உங்கள் இண்டஸ் லாப்ஸ் உதவியாளர். புதிய கவரேஜ் விருப்பங்கள், பாலிசி புதுப்பிப்புகள் அல்லது இரண்டு நிமிடங்களில் க்ளெயிம் தொடங்குவது போன்றவற்றில் நான் உதவ முடியும், இதனால் உங்கள் வாடிக்கையாளர்கள் விரைவான சேவையை பெறுவார்கள்।",
    Announcement: "காலை வணக்கம் அனைவருக்கும்! இண்டஸ் லாப்ஸ் வாய் ஸ்டுடியோ நிகழ்ச்சிக்குத் தங்கள் வரவேற்கிறோம். பல மொழிகளில் நேரடி குரல் ஆதரவு எவ்வாறு பெரிய நிறுவனங்களுக்கு விரிவாக பயன்படுத்தப்படுகின்றது என்பதைக் காண்பிக்கிறோம்।",
    Reminder: "வணக்கம்! உங்கள் இண்டஸ் லாப்ஸ் சந்தா நாளை புதுப்பிக்கப்படும் என்பதை நினைவூட்டுகிறோம். நீங்கள் எப்பொழுதும் டாஷ்போர்டில் சென்று உங்கள் முன்னுரிமைகளை மாற்றலாம்।"
  },
  zh: {
    Greeting: "您好！感谢您致电英达思实验室。无论是产品支持、技术咨询还是一般问题，我们都随时准备协助您的客户。请问今天我可以为您提供什么帮助？",
    Support: "您好，这里是英达思实验室的语音助手。我可以为您讲解最新保障计划、政策更新，或在两分钟内帮助您启动理赔流程，让您的客户获得快速、准确的服务。",
    Announcement: "各位早上好，欢迎参加英达思实验室语音展演。今天我们将展示实时多语言语音技术如何在大型企业中实现规模化、高效率的客户支持。",
    Reminder: "您好！友情提醒：您的英达思实验室订阅将于明天续费。您可以随时在控制面板中修改设置或更新方案，无需任何额外流程。"
  },
  pt: {
    Greeting: "Olá! Obrigado por ligar para a IndusLabs. Estamos aqui para ajudar seus clientes com suporte técnico, orientação sobre produtos ou qualquer dúvida geral. Como posso ajudar você hoje?",
    Support: "Olá, aqui é o seu assistente da IndusLabs. Posso explicar as opções de cobertura mais recentes, atualizações de apólice ou até iniciar um pedido de indenização em menos de dois minutos, oferecendo suporte rápido e confiável.",
    Announcement: "Bom dia a todos! Bem-vindos à apresentação do IndusLabs Voice Studio. Hoje vamos demonstrar como o suporte de voz multilíngue em tempo real pode ser escalado com eficiência para equipes de atendimento de grandes empresas.",
    Reminder: "Olá! Apenas um lembrete: sua assinatura da IndusLabs será renovada amanhã. Você pode alterar ou atualizar suas preferências a qualquer momento no painel de controle."
  }
};

// ttsCatalog is now dynamically loaded from the API
// This export is kept for backward compatibility but will be replaced by API data
export const ttsCatalog: LanguageDefinition[] = [];
