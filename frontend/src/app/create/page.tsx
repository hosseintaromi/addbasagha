'use client'

import { useRouter } from 'next/navigation'
import { useState, useRef } from 'react'
import Image from 'next/image'
import ThemeToggle from "@/components/ui/ThemeToggle";
import LanguageToggle from "@/components/ui/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";

const aspectRatios = [
    { name: '2:3', value: '2:3', width: 2, height: 3 },
    { name: '16:9', value: '16:9', width: 16, height: 9 },
    { name: '1:1', value: '1:1', width: 1, height: 1 },
    { name: '4:5', value: '4:5', width: 4, height: 5 },
    { name: '9:16', value: '9:16', width: 9, height: 16 }
]

export default function CreatePage() {
    const { t, isRTL } = useLanguage()
    const router = useRouter()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [dragActive, setDragActive] = useState(false)
    const [videoUrl, setVideoUrl] = useState('')
    const [selectedRatio, setSelectedRatio] = useState<string | null>(null)
    const [showImportMenu, setShowImportMenu] = useState(false)

    function handleSample() {
        const sample = encodeURIComponent('https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4')
        router.push(`/timeline?src=${sample}`)
    }

    function handleFileUpload(file: File) {
        if (file && (file.type.startsWith('video/') || file.type.startsWith('audio/'))) {
            const url = URL.createObjectURL(file)
            router.push(`/timeline?src=${encodeURIComponent(url)}`)
        }
    }

    function handleUrlSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (videoUrl.trim()) {
            router.push(`/timeline?src=${encodeURIComponent(videoUrl)}`)
        }
    }

    function handleDrag(e: React.DragEvent) {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0])
        }
    }

    function createBlankCanvas(ratio: string) {
        router.push(`/timeline?blank=true&ratio=${ratio}`)
    }

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors'>
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded flex items-center justify-center">
                            <span className="text-white font-bold text-sm">A</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">ABBASAGHA</span>
                    </div>
                    <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <LanguageToggle />
                        <ThemeToggle />
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                            {t('create.getStartedDesc')}
                        </div>
                    </div>
                </div>
            </header>

            <main className='flex flex-col items-center p-6'>
                <div className='w-full max-w-2xl space-y-8'>
                    {/* Upload Section */}
                    <div className='bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-700'>
                        <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center'>{t('create.uploadContent')}</h1>

                        {/* Drag & Drop Area */}
                        <div
                            className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                                }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                accept="video/*,audio/*"
                                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                            />

                            <div className='space-y-4'>
                                <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto'>
                                    <svg className='w-8 h-8 text-blue-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                </div>

                                <div>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className='bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors'
                                    >
                                        {t('create.pressToUpload')}
                                    </button>
                                    <p className='text-gray-500 dark:text-gray-400 text-sm mt-2'>{t('create.dragAndDrop')}</p>
                                </div>

                                <p className='text-xs text-gray-400 dark:text-gray-500'>
                                    {t('create.supportedFormats')}
                                </p>
                            </div>
                        </div>

                        {/* URL Input */}
                        <div className='mt-6'>
                            <form onSubmit={handleUrlSubmit} className='space-y-3'>
                                <input
                                    type='url'
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    placeholder={t('create.pasteVideoUrl')}
                                    className='w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                />
                                {videoUrl && (
                                    <button
                                        type="submit"
                                        className='w-full h-10 bg-gray-900 dark:bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-blue-700 transition-colors'
                                    >
                                        {t('create.importFromUrl')}
                                    </button>
                                )}
                            </form>
                        </div>

                        {/* Import Options */}
                        <div className='flex gap-3 mt-6'>
                            <div className="relative flex-1">
                                <button
                                    onClick={() => setShowImportMenu(!showImportMenu)}
                                    className='w-full h-10 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2'
                                >
                                    {t('create.importFrom')}
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {showImportMenu && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                        <div className="py-1">
                                            <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3">
                                                <Image src="/google.svg" alt="Google Drive" width={16} height={16} />
                                                Google Drive
                                            </button>
                                            <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                                </svg>
                                                Facebook
                                            </button>
                                            <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                                </svg>
                                                YouTube
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleSample}
                                className='flex-1 h-10 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                            >
                                {t('create.trySample')}
                            </button>
                        </div>
                    </div>

                    {/* Start with Blank Canvas */}
                    <div className='bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-700'>
                        <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-6 text-center'>{t('create.blankCanvas')}</h2>

                        <div className='grid grid-cols-5 gap-3'>
                            {aspectRatios.map((ratio) => (
                                <button
                                    key={ratio.value}
                                    onClick={() => {
                                        setSelectedRatio(ratio.value)
                                        createBlankCanvas(ratio.value)
                                    }}
                                    className={`relative group transition-all ${selectedRatio === ratio.value
                                        ? 'ring-2 ring-blue-500'
                                        : 'hover:ring-2 hover:ring-gray-300'
                                        }`}
                                >
                                    <div
                                        className='bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center text-gray-600 group-hover:bg-gray-200 transition-colors'
                                        style={{
                                            aspectRatio: `${ratio.width}/${ratio.height}`,
                                            minHeight: '60px'
                                        }}
                                    >
                                        <span className='text-xs font-medium'>{ratio.name}</span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <p className='text-center text-sm text-gray-500 dark:text-gray-400 mt-4'>
                            {t('create.chooseAspectRatio')}
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}
