'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function LanguageToggle() {
    const { language, setLanguage, isRTL } = useLanguage()

    return (
        <div className={`flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 flex-shrink-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors min-w-[44px] ${language === 'en'
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
            >
                EN
            </button>
            <button
                onClick={() => setLanguage('fa')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors min-w-[44px] ${language === 'fa'
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
            >
                فا
            </button>
        </div>
    )
}