'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Language = 'en' | 'fa'

type Translations = {
    [key in Language]: {
        [key: string]: string
    }
}

const translations: Translations = {
    en: {
        // Header
        'header.signin': 'Sign In',
        'header.dashboard': 'Dashboard',

        // Landing Page
        'landing.title': 'Create more content in less time',
        'landing.subtitle': 'Abbasagha is a modern video creation platform that helps teams make great content faster.',
        'landing.getStarted': 'Get started',
        'landing.seeInAction': 'See Abbasagha in action',
        'landing.watchDemo': 'Watch how easy it is to create professional videos',
        'landing.trustedBy': 'Trusted by teams at',
        'landing.everythingYouNeed': 'Everything you need to create',
        'landing.smartEditing': 'Smart Editing',
        'landing.smartEditingDesc': 'AI-powered tools that make video editing faster and easier than ever.',
        'landing.autoSubtitles': 'Auto Subtitles',
        'landing.autoSubtitlesDesc': 'Generate accurate subtitles automatically in over 60 languages.',
        'landing.teamCollaboration': 'Team Collaboration',
        'landing.teamCollaborationDesc': 'Work together in real-time with comments, reviews, and shared projects.',

        // Sign In
        'signin.title': 'Sign in to continue',
        'signin.description': 'Abbasagha works better when you\'re signed in. Sign in to save content to a workspace, share with others, and more.',
        'signin.continueWithGoogle': 'Continue with Google',
        'signin.continueWithFacebook': 'Continue with Facebook',
        'signin.continueWithEmail': 'Continue with email',
        'signin.enterEmail': 'Enter your email',
        'signin.ssoOption': 'Sign in with Single Sign-On (SSO) instead',
        'signin.terms': 'By using Abbasagha, you agree to our',
        'signin.termsOfService': 'Terms of Service',
        'signin.privacyPolicy': 'Privacy Policy',

        // Dashboard
        'dashboard.home': 'Home',
        'dashboard.myProjects': 'My Projects',
        'dashboard.createNew': 'Create new',
        'dashboard.repurpose': 'Repurpose',
        'dashboard.translate': 'Translate',
        'dashboard.generate': 'Generate',
        'dashboard.dateCreated': 'Date created',
        'dashboard.upgrade': 'UPGRADE',
        'dashboard.newFolder': 'New Folder',
        'dashboard.items': 'items',
        'dashboard.name': 'Name',
        'dashboard.lastModified': 'Last modified',
        'dashboard.noProjectsYet': 'No projects yet',
        'dashboard.getStartedFirst': 'Get started by creating your first video project',
        'dashboard.createNewProject': 'Create new project',

        // Create Page
        'create.uploadContent': 'Upload Content',
        'create.pressToUpload': 'Press to upload',
        'create.dragAndDrop': 'or drag and drop',
        'create.supportedFormats': 'MP4, MOV, AVI, WMV, MP3, WAV, M4A files supported',
        'create.pasteVideoUrl': 'Paste a video URL e.g. https://www.youtube.com/watch?v=...',
        'create.importFromUrl': 'Import from URL',
        'create.importFrom': 'Import from',
        'create.trySample': 'Try a sample',
        'create.blankCanvas': 'Start with a blank canvas',
        'create.chooseAspectRatio': 'Choose an aspect ratio to start creating',
        'create.getStartedDesc': 'To get started, upload a file or try the sample video.',

        // Timeline
        'timeline.autoSubtitle': 'Auto Subtitle',
        'timeline.addText': 'Add Text',
        'timeline.translateDub': 'Translate & Dub',
        'timeline.export': 'Export',
        'timeline.back': '← Back',
        'timeline.timeline': 'Timeline',
        'timeline.subtitleEditor': 'Subtitle Editor',
        'timeline.tools': 'Tools',

        // Auto Subtitle
        'autoSubtitle.originalLang': 'Original language',
        'autoSubtitle.targetLang': 'Translation target',
        'autoSubtitle.model': 'Transcription Model',
        'autoSubtitle.quotaRemaining': 'Remaining transcription quota',
        'autoSubtitle.minutes': 'minutes',
        'autoSubtitle.upgradeQuota': 'Upgrade for quota purchase',
        'autoSubtitle.processing': 'Processing...',
        'autoSubtitle.runningLow': 'Running low on quota. Consider upgrading for unlimited access.',
        'autoSubtitle.estimatedCost': 'Estimated cost',
        'autoSubtitle.accuracy': 'Accuracy',

        // Subtitle Editor
        'subtitleEditor.subtitleEditor': 'Subtitle Editor',
        'subtitleEditor.charactersPerSubtitle': 'Characters per subtitle',
        'subtitleEditor.fontSize': 'Font Size',
        'subtitleEditor.color': 'Color',
        'subtitleEditor.textAlignment': 'Text Alignment',
        'subtitleEditor.left': 'Left',
        'subtitleEditor.center': 'Center',
        'subtitleEditor.right': 'Right',
        'subtitleEditor.addSubtitle': 'Add subtitle',
        'subtitleEditor.duplicate': 'Duplicate',
        'subtitleEditor.delete': 'Delete',
        'subtitleEditor.enterText': 'Enter subtitle text...',
        'subtitleEditor.characters': 'characters',

        // Export
        'export.title': 'EXPORT PROJECT',
        'export.type': 'Type',
        'export.format': 'Format',
        'export.resolution': 'Resolution',
        'export.compressionLevel': 'Compression Level',
        'export.smallerFile': 'Smaller File',
        'export.higherQuality': 'Higher Quality',
        'export.estimatedSize': 'Estimated output file size',
        'export.exporting': 'Exporting...',
        'export.complete': 'Export Complete!',
        'export.ready': 'Your video is ready to download',
        'export.download': 'Download Video',
        'export.watermarkNotice': 'Upgrade to export without the Abbasagha watermark on your projects',
        'export.recentExports': 'RECENT EXPORTS',

        // Common
        'common.loading': 'Loading...',
        'common.cancel': 'Cancel',
        'common.save': 'Save',
        'common.delete': 'Delete',
        'common.edit': 'Edit',
        'common.close': 'Close',
    },
    fa: {
        // Header
        'header.signin': 'ورود',
        'header.dashboard': 'داشبورد',

        // Landing Page
        'landing.title': 'ایجاد محتوای بیشتر در زمان کمتر',
        'landing.subtitle': 'عباس‌آقا یک پلتفرم مدرن ایجاد ویدیو است که به تیم‌ها کمک می‌کند محتوای عالی را سریع‌تر تولید کنند.',
        'landing.getStarted': 'شروع کنید',
        'landing.seeInAction': 'عباس‌آقا را در عمل ببینید',
        'landing.watchDemo': 'ببینید که ایجاد ویدیوهای حرفه‌ای چقدر آسان است',
        'landing.trustedBy': 'مورد اعتماد تیم‌های',
        'landing.everythingYouNeed': 'همه چیزی که برای ایجاد نیاز دارید',
        'landing.smartEditing': 'ویرایش هوشمند',
        'landing.smartEditingDesc': 'ابزارهای مبتنی بر هوش مصنوعی که ویرایش ویدیو را سریع‌تر و آسان‌تر از همیشه می‌کند.',
        'landing.autoSubtitles': 'زیرنویس خودکار',
        'landing.autoSubtitlesDesc': 'ایجاد زیرنویس دقیق به صورت خودکار در بیش از ۶۰ زبان.',
        'landing.teamCollaboration': 'همکاری تیمی',
        'landing.teamCollaborationDesc': 'با نظرات، بازبینی‌ها و پروژه‌های مشترک به صورت بلادرنگ با یکدیگر کار کنید.',

        // Sign In
        'signin.title': 'برای ادامه وارد شوید',
        'signin.description': 'عباس‌آقا زمانی که وارد شده‌اید بهتر کار می‌کند. وارد شوید تا محتوا را در فضای کاری ذخیره کنید، با دیگران به اشتراک بگذارید و بیشتر.',
        'signin.continueWithGoogle': 'ادامه با گوگل',
        'signin.continueWithFacebook': 'ادامه با فیسبوک',
        'signin.continueWithEmail': 'ادامه با ایمیل',
        'signin.enterEmail': 'ایمیل خود را وارد کنید',
        'signin.ssoOption': 'در عوض با Single Sign-On (SSO) وارد شوید',
        'signin.terms': 'با استفاده از عباس‌آقا، شما با',
        'signin.termsOfService': 'شرایط خدمات',
        'signin.privacyPolicy': 'حریم خصوصی',

        // Dashboard
        'dashboard.home': 'خانه',
        'dashboard.myProjects': 'پروژه‌های من',
        'dashboard.createNew': 'ایجاد جدید',
        'dashboard.repurpose': 'بازسازی',
        'dashboard.translate': 'ترجمه',
        'dashboard.generate': 'تولید',
        'dashboard.dateCreated': 'تاریخ ایجاد',
        'dashboard.upgrade': 'ارتقاء',
        'dashboard.newFolder': 'پوشه جدید',
        'dashboard.items': 'آیتم',
        'dashboard.name': 'نام',
        'dashboard.lastModified': 'آخرین تغییر',
        'dashboard.noProjectsYet': 'هنوز پروژه‌ای نیست',
        'dashboard.getStartedFirst': 'با ایجاد اولین پروژه ویدیویی خود شروع کنید',
        'dashboard.createNewProject': 'ایجاد پروژه جدید',

        // Create Page
        'create.uploadContent': 'آپلود محتوا',
        'create.pressToUpload': 'برای آپلود کلیک کنید',
        'create.dragAndDrop': 'یا کشیده و رها کنید',
        'create.supportedFormats': 'فایل‌های MP4, MOV, AVI, WMV, MP3, WAV, M4A پشتیبانی می‌شوند',
        'create.pasteVideoUrl': 'لینک ویدیو را کپی کنید مثل https://www.youtube.com/watch?v=...',
        'create.importFromUrl': 'وارد کردن از لینک',
        'create.importFrom': 'وارد کردن از',
        'create.trySample': 'نمونه را امتحان کنید',
        'create.blankCanvas': 'با صفحه خالی شروع کنید',
        'create.chooseAspectRatio': 'نسبت تصویر را انتخاب کنید تا شروع به ایجاد کنید',
        'create.getStartedDesc': 'برای شروع، فایلی آپلود کنید یا ویدیو نمونه را امتحان کنید.',

        // Timeline
        'timeline.autoSubtitle': 'زیرنویس خودکار',
        'timeline.addText': 'افزودن متن',
        'timeline.translateDub': 'ترجمه و دوبلاژ',
        'timeline.export': 'خروجی',
        'timeline.back': '← بازگشت',
        'timeline.timeline': 'خط زمان',
        'timeline.subtitleEditor': 'ویرایشگر زیرنویس',
        'timeline.tools': 'ابزارها',

        // Auto Subtitle
        'autoSubtitle.originalLang': 'زبان اصلی',
        'autoSubtitle.targetLang': 'زبان مقصد ترجمه',
        'autoSubtitle.model': 'مدل رونویسی',
        'autoSubtitle.quotaRemaining': 'کوتای رونویسی باقی‌مانده',
        'autoSubtitle.minutes': 'دقیقه',
        'autoSubtitle.upgradeQuota': 'ارتقاء برای خرید کوتا',
        'autoSubtitle.processing': 'در حال پردازش...',
        'autoSubtitle.runningLow': 'کوتا کم است. برای دسترسی نامحدود ارتقاء را در نظر بگیرید.',
        'autoSubtitle.estimatedCost': 'هزینه تخمینی',
        'autoSubtitle.accuracy': 'دقت',

        // Subtitle Editor
        'subtitleEditor.subtitleEditor': 'ویرایشگر زیرنویس',
        'subtitleEditor.charactersPerSubtitle': 'کاراکتر در هر زیرنویس',
        'subtitleEditor.fontSize': 'اندازه فونت',
        'subtitleEditor.color': 'رنگ',
        'subtitleEditor.textAlignment': 'تراز متن',
        'subtitleEditor.left': 'چپ',
        'subtitleEditor.center': 'وسط',
        'subtitleEditor.right': 'راست',
        'subtitleEditor.addSubtitle': 'افزودن زیرنویس',
        'subtitleEditor.duplicate': 'کپی',
        'subtitleEditor.delete': 'حذف',
        'subtitleEditor.enterText': 'متن زیرنویس را وارد کنید...',
        'subtitleEditor.characters': 'کاراکتر',

        // Export
        'export.title': 'خروجی پروژه',
        'export.type': 'نوع',
        'export.format': 'فرمت',
        'export.resolution': 'رزولوشن',
        'export.compressionLevel': 'سطح فشرده‌سازی',
        'export.smallerFile': 'فایل کوچک‌تر',
        'export.higherQuality': 'کیفیت بالاتر',
        'export.estimatedSize': 'اندازه تخمینی فایل خروجی',
        'export.exporting': 'در حال خروجی‌گیری...',
        'export.complete': 'خروجی‌گیری کامل شد!',
        'export.ready': 'ویدیو شما آماده دانلود است',
        'export.download': 'دانلود ویدیو',
        'export.watermarkNotice': 'برای خروجی بدون واترمارک عباس‌آقا ارتقاء دهید',
        'export.recentExports': 'خروجی‌های اخیر',

        // Common
        'common.loading': 'در حال بارگذاری...',
        'common.cancel': 'انصراف',
        'common.save': 'ذخیره',
        'common.delete': 'حذف',
        'common.edit': 'ویرایش',
        'common.close': 'بستن',
    }
}

type LanguageContextType = {
    language: Language
    setLanguage: (lang: Language) => void
    t: (key: string) => string
    isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('en')

    useEffect(() => {
        // Check for saved language preference
        const savedLanguage = localStorage.getItem('language') as Language
        if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'fa')) {
            setLanguage(savedLanguage)
        }
    }, [])

    useEffect(() => {
        // Apply RTL/LTR direction to document
        if (language === 'fa') {
            document.documentElement.dir = 'rtl'
            document.documentElement.lang = 'fa'
        } else {
            document.documentElement.dir = 'ltr'
            document.documentElement.lang = 'en'
        }

        // Save language preference
        localStorage.setItem('language', language)
    }, [language])

    const t = (key: string): string => {
        return translations[language][key] || key
    }

    const isRTL = language === 'fa'

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
}