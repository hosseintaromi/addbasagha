'use client'

import { useSubtitleStore } from '@/store/subtitles'
import { useEffect, useState } from 'react'

type Props = { currentTime: number }

export default function SubtitleOverlay({ currentTime }: Props) {
    const subtitles = useSubtitleStore((s) => s.subtitles)
    const [active, setActive] = useState<string>('')

    useEffect(() => {
        const s = subtitles.find((sub) => currentTime >= sub.start && currentTime < sub.end)
        setActive(s?.id ?? '')
    }, [currentTime, subtitles])

    if (!active) return null
    const sub = subtitles.find((s) => s.id === active)
    if (!sub) return null

    return (
        <div className='absolute inset-0 flex items-end justify-center pb-16 pointer-events-none z-10'>
            <div
                style={{
                    fontSize: `${sub.fontSize}px`,
                    color: sub.color,
                    textAlign: sub.align
                }}
                className='px-4 py-2 bg-black/70 rounded-md font-bold text-white shadow-lg backdrop-blur-sm max-w-4xl mx-4'
            >
                <div
                    style={{
                        textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8), 1px -1px 2px rgba(0,0,0,0.8), -1px 1px 2px rgba(0,0,0,0.8)'
                    }}
                    className='leading-tight'
                >
                    {sub.text}
                </div>
            </div>
        </div>
    )
}
