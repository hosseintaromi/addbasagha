'use client'

import ThemeToggle from "@/components/ui/ThemeToggle";
import LanguageToggle from "@/components/ui/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SignInPage() {
    const { t, isRTL } = useLanguage()

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-pink-200 to-blue-400 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-colors">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-purple-400/30 dark:from-purple-800/20 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-cyan-400/30 dark:from-cyan-800/20 to-transparent rounded-full blur-3xl"></div>
            </div>

            {/* Theme and Language toggles */}
            <div className={`absolute top-6 flex items-center gap-4 ${isRTL ? 'left-6' : 'right-6'} ${isRTL ? 'flex-row-reverse' : ''}`}>
                <LanguageToggle />
                <ThemeToggle />
            </div>

            {/* Sign in modal */}
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-8 transition-colors">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded flex items-center justify-center">
                            <span className="text-white font-bold text-sm">A</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">ABBASAGHA</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('signin.title')}</h1>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {t('signin.description')}
                    </p>
                </div>

                {/* Social sign in buttons */}
                <div className="space-y-3 mb-6">
                    <button className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white">
                        <svg width="20" height="20" viewBox="0 0 256 262" xmlns="http://www.w3.org/2000/svg">
                            <path d="M255.68 133.35c0-10.72-.96-18.63-3.02-26.78H130.5v50.2h70.44c-1.41 11.8-9.06 29.5-26 41.34l-.24 1.59 37.77 29.33 2.61.26c23.94-22.06 37.7-54.6 37.7-96.94" fill="#4285F4" />
                            <path d="M130.5 261c34.2 0 62.97-11.3 83.98-30.72l-40.02-31.11c-10.8 7.56-25.5 12.86-43.96 12.86-33.65 0-62.23-22.06-72.32-52.7l-1.5.13-39.18 30.36-.51 1.44C36.09 233.67 79.73 261 130.5 261" fill="#34A853" />
                            <path d="M58.18 159.33c-2.8-8.2-4.41-16.96-4.41-26 0-9.04 1.6-17.8 4.33-26l-.07-1.74-39.44-30.7-1.29.62C10.37 93.82 2.5 112.87 2.5 133.33c0 20.46 7.86 39.5 20.31 53.82l35.37-27.82" fill="#FBBC05" />
                            <path d="M130.5 51.74c23.8 0 39.8 10.3 49 18.91l35.68-34.68C194.13 14.23 164.7 1 130.5 1 79.75 1 36.08 28.28 17.6 71.62l37.68 29.15C68.31 73.8 96.88 51.73 130.5 51.73" fill="#EA4335" />
                        </svg>
                        {t('signin.continueWithGoogle')}
                    </button>

                    <button className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        {t('signin.continueWithFacebook')}
                    </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">or</span>
                    <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                </div>

                {/* Email form */}
                <form className="space-y-4 mb-6">
                    <input
                        type="email"
                        placeholder={t('signin.enterEmail')}
                        className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    <button
                        type="submit"
                        className="w-full h-12 rounded-lg bg-black dark:bg-cyan-600 text-white text-sm font-medium hover:bg-gray-800 dark:hover:bg-cyan-700 transition-colors"
                    >
                        {t('signin.continueWithEmail')}
                    </button>
                </form>

                {/* SSO Option */}
                <div className="text-center mb-6">
                    <button className="text-cyan-600 dark:text-cyan-400 text-sm font-medium hover:underline">
                        {t('signin.ssoOption')}
                    </button>
                </div>

                {/* Terms */}
                <p className="text-xs text-center text-gray-500 dark:text-gray-400 leading-relaxed">
                    {t('signin.terms')}{' '}
                    <a href="#" className="text-cyan-600 dark:text-cyan-400 hover:underline">{t('signin.termsOfService')}</a>{' '}
                    and{' '}
                    <a href="#" className="text-cyan-600 dark:text-cyan-400 hover:underline">{t('signin.privacyPolicy')}</a>.
                </p>
            </div>
        </div>
    );
}