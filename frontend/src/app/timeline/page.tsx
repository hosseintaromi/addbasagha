'use client'

import { useState, useRef, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import AutoSubtitlePanel from '@/components/timeline/AutoSubtitlePanel'
import AddTextPanel from '@/components/timeline/AddTextPanel'
import TranslateDubPanel from '@/components/timeline/TranslateDubPanel'
import Timeline from '@/components/timeline/Timeline'
import SubtitleOverlay from '@/components/timeline/SubtitleOverlay'
import TextOverlay from '@/components/timeline/TextOverlay'
import CanvasTextOverlay from '@/components/timeline/CanvasTextOverlay'
import { useLanguage } from '@/contexts/LanguageContext'

export default function TimelinePage() {
    const { t } = useLanguage()
    const search = useSearchParams()
    const src = search.get('src') || 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
    const videoRef = useRef<HTMLVideoElement>(null)
    const [time, setTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [showAuto, setShowAuto] = useState(false)
    const [showText, setShowText] = useState(false)
    const [showTranslate, setShowTranslate] = useState(false)
    const [showMobileSidebar, setShowMobileSidebar] = useState(false)
    const [videoSize, setVideoSize] = useState({ width: 854, height: 480 })

    const handleVideoTimeUpdate = useCallback(() => {
        if (videoRef.current) {
            setTime(videoRef.current.currentTime)
        }
    }, [])

    const handleVideoLoadedMetadata = useCallback(() => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration)
            // Update video size for canvas overlay
            setVideoSize({
                width: videoRef.current.videoWidth || 854,
                height: videoRef.current.videoHeight || 480
            })
        }
    }, [])

    const handleVideoPlay = useCallback(() => {
        setIsPlaying(true)
    }, [])

    const handleVideoPause = useCallback(() => {
        setIsPlaying(false)
    }, [])

    const handleSeek = useCallback((seekTime: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime = seekTime
            setTime(seekTime)
        }
    }, [])

    const handleTimelineTimeUpdate = useCallback((timelineTime: number) => {
        if (videoRef.current && Math.abs(videoRef.current.currentTime - timelineTime) > 0.1) {
            videoRef.current.currentTime = timelineTime
        }
    }, [])

    const togglePlayPause = useCallback(() => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause()
            } else {
                videoRef.current.play()
            }
        }
    }, [isPlaying])

    return (
        <div className='min-h-screen flex flex-col bg-background text-foreground'>
            {/* Mobile-optimized header */}
            <header className='flex items-center justify-between px-2 sm:px-4 py-2 border-b bg-white dark:bg-gray-900'>
                <Link href='/dashboard' className='text-xs sm:text-sm hover:underline p-2 -m-2'>
                    {t('timeline.back')}
                </Link>
                <div className='flex items-center gap-1 sm:gap-2'>
                    <button
                        onClick={togglePlayPause}
                        className='h-7 w-7 sm:h-8 sm:w-8 rounded-md bg-primary text-background text-sm font-medium hover:opacity-80 flex items-center justify-center touch-manipulation'
                    >
                        {isPlaying ? '⏸' : '▶'}
                    </button>
                    <Link href='/export' className='h-7 sm:h-8 px-2 sm:px-4 rounded-md bg-primary text-background text-xs sm:text-sm font-medium hover:opacity-80'>
                        {t('timeline.export')}
                    </Link>
                </div>
            </header>

            {/* Mobile-first responsive layout */}
            <main className='flex flex-1 flex-col lg:flex-row min-h-0'>
                {/* Video container - full width on mobile */}
                <div className='flex-1 relative bg-black min-h-[40vh] lg:min-h-0'>
                    <video
                        ref={videoRef}
                        src={src}
                        className='w-full h-full object-contain max-h-[50vh] lg:max-h-[60vh]'
                        onLoadedMetadata={handleVideoLoadedMetadata}
                        onTimeUpdate={handleVideoTimeUpdate}
                        onPlay={handleVideoPlay}
                        onPause={handleVideoPause}
                        onClick={togglePlayPause}
                        playsInline
                        preload="metadata"
                    />
                    <SubtitleOverlay currentTime={time} />
                    <TextOverlay currentTime={time} />
                    <CanvasTextOverlay
                        currentTime={time}
                        videoWidth={videoSize.width}
                        videoHeight={videoSize.height}
                    />

                    {/* Enhanced mobile video controls */}
                    <div className='absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-black/70 text-white px-2 py-1 rounded text-xs sm:text-sm backdrop-blur-sm'>
                        {Math.floor(time / 60)}:{(time % 60).toFixed(1).padStart(4, '0')} / {Math.floor(duration / 60)}:{(duration % 60).toFixed(1).padStart(4, '0')}
                    </div>

                    {/* Mobile-only fullscreen toggle */}
                    <button
                        onClick={() => {
                            if (videoRef.current) {
                                if (document.fullscreenElement) {
                                    document.exitFullscreen();
                                } else {
                                    videoRef.current.requestFullscreen();
                                }
                            }
                        }}
                        className='lg:hidden absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-black/70 text-white p-2 rounded backdrop-blur-sm touch-manipulation'
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                    </button>
                </div>

                {/* Mobile collapsible sidebar */}
                <aside className={`w-full lg:w-72 border-t lg:border-t-0 lg:border-l bg-white dark:bg-gray-900 
                    ${showMobileSidebar ? 'block' : 'hidden lg:block'} 
                    lg:relative absolute bottom-0 left-0 right-0 z-10 max-h-[50vh] lg:max-h-none overflow-y-auto
                    transition-all duration-300 ease-in-out`}>

                    {/* Mobile sidebar header */}
                    <div className='lg:hidden flex items-center justify-between p-4 border-b bg-gray-50 dark:bg-gray-800'>
                        <h3 className='font-medium text-gray-900 dark:text-white'>{t('timeline.tools')}</h3>
                        <button
                            onClick={() => setShowMobileSidebar(false)}
                            className='p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 touch-manipulation'
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className='p-4 space-y-4'>
                        <button
                            onClick={() => { setShowAuto(!showAuto); setShowText(false); setShowTranslate(false) }}
                            className='w-full h-10 lg:h-9 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-muted transition-colors text-sm font-medium touch-manipulation'
                        >
                            {t('timeline.autoSubtitle')}
                        </button>
                        {showAuto && <AutoSubtitlePanel />}

                        <button
                            onClick={() => { setShowText(!showText); setShowAuto(false); setShowTranslate(false) }}
                            className='w-full h-10 lg:h-9 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-muted transition-colors text-sm font-medium touch-manipulation'
                        >
                            {t('timeline.addText')}
                        </button>
                        {showText && <AddTextPanel currentTime={time} />}

                        <button
                            onClick={() => { setShowTranslate(!showTranslate); setShowAuto(false); setShowText(false) }}
                            className='w-full h-10 lg:h-9 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-muted transition-colors text-sm font-medium touch-manipulation'
                        >
                            {t('timeline.translateDub')}
                        </button>
                        {showTranslate && <TranslateDubPanel />}
                    </div>
                </aside>
            </main>

            {/* Mobile tools toggle button */}
            <button
                onClick={() => setShowMobileSidebar(!showMobileSidebar)}
                className='lg:hidden fixed bottom-4 right-4 bg-primary text-primary-foreground rounded-full p-3 shadow-lg z-20 touch-manipulation'
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
            </button>

            {/* Timeline component with mobile optimization */}
            <div className='border-t bg-white dark:bg-gray-900'>
                <Timeline
                    duration={duration}
                    audioSrc={src}
                    currentTime={time}
                    onTimeUpdate={handleTimelineTimeUpdate}
                    onSeek={handleSeek}
                />
            </div>
        </div>
    )
}
