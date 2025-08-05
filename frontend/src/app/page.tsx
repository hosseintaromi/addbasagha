'use client'

import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LanguageToggle from "@/components/ui/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LandingPage() {
  const { t, isRTL } = useLanguage()
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      {/* Header */}
            <header className={`flex items-center justify-between px-6 py-4 md:px-10 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">ABBASAGHA</span>
        </div>
        <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <LanguageToggle />
          <ThemeToggle />
          <Link 
            href="/signin" 
            className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            {t('header.signin')}
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center px-6 pb-16">
        {/* Hero Section */}
        <div className={`text-center mt-8 md:mt-16 max-w-4xl mx-auto ${isRTL ? 'rtl' : ''}`}>
          <h1 className={`text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight ${isRTL ? 'font-normal' : ''}`}>
            {isRTL ? (
              <span>ایجاد{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-pink-400 to-blue-500 text-transparent bg-clip-text">
                  محتوای بیشتر
                </span>
                {" "}در زمان کمتر
              </span>
            ) : (
              <>
                Create{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-pink-400 to-blue-500 text-transparent bg-clip-text">
                  more content
                </span>
                <br />
                in less time
              </>
            )}
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {t('landing.subtitle')}
          </p>

          <div className="mt-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-cyan-400 hover:bg-cyan-500 text-black px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t('landing.getStarted')}
            </Link>
          </div>
        </div>

        {/* Video Preview */}
        <div className="mt-16 w-full max-w-4xl mx-auto">
          <div className="relative rounded-xl overflow-hidden shadow-2xl bg-gray-900">
            <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('landing.seeInAction')}</h3>
                <p className="text-gray-300 dark:text-gray-200">{t('landing.watchDemo')}</p>
              </div>
            </div>

            {/* Editor Interface Mock */}
            <div className="absolute bottom-0 left-0 right-0 bg-gray-800 h-20 flex items-center px-4">
              <div className="flex items-center gap-4 w-full">
                <div className="w-8 h-8 bg-cyan-400 rounded"></div>
                <div className="flex-1 h-2 bg-gray-600 rounded">
                  <div className="w-1/3 h-full bg-cyan-400 rounded"></div>
                </div>
                <div className="flex gap-2">
                  <div className="w-6 h-6 bg-gray-600 rounded"></div>
                  <div className="w-6 h-6 bg-gray-600 rounded"></div>
                  <div className="w-6 h-6 bg-gray-600 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Logos */}
        <div className="mt-16 w-full max-w-5xl mx-auto">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-8 font-medium">
            {t('landing.trustedBy')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60 grayscale">
            <Image src="/google.svg" alt="Google" width={100} height={30} className="h-8 w-auto" />
            <Image src="/code.svg" alt="Code.org" width={80} height={30} className="h-8 w-auto" />
            <Image src="/dyson.svg" alt="Dyson" width={90} height={30} className="h-8 w-auto" />
            <Image src="/nyu.svg" alt="NYU" width={70} height={30} className="h-8 w-auto" />
            <Image src="/facebook.svg" alt="Facebook" width={110} height={30} className="h-8 w-auto" />
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 w-full max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
            {t('landing.everythingYouNeed')}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t('landing.smartEditing')}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t('landing.smartEditingDesc')}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t('landing.autoSubtitles')}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t('landing.autoSubtitlesDesc')}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t('landing.teamCollaboration')}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t('landing.teamCollaborationDesc')}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
