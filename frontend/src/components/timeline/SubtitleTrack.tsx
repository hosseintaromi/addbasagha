'use client'

import { useEffect, useRef, useState } from 'react'
import { Subtitle, useSubtitleStore } from '@/store/subtitles'

type Props = {
    duration: number;
    currentTime?: number;
    onSeek?: (time: number) => void;
};

export default function SubtitleTrack({ duration, currentTime = 0, onSeek }: Props) {
    const { subtitles, setSubtitles } = useSubtitleStore((s) => s)
    const containerRef = useRef<HTMLDivElement>(null)
    const [scale, setScale] = useState(100) // px per second
    const [dragInfo, setDragInfo] = useState<{ id: string; startX: number; origStart: number; origEnd: number } | null>(null)

    useEffect(() => {
        if (containerRef.current && duration) {
            const width = containerRef.current.clientWidth
            setScale(width / duration)
        }
    }, [duration])

    function onMouseDown(e: React.MouseEvent, sub: Subtitle) {
        e.stopPropagation()
        setDragInfo({ id: sub.id, startX: e.clientX, origStart: sub.start, origEnd: sub.end })
    }

    function onMouseMove(e: MouseEvent) {
        if (!dragInfo) return
        const deltaPx = e.clientX - dragInfo.startX
        const deltaSec = deltaPx / scale
        setSubtitles(
            subtitles.map((s) =>
                s.id === dragInfo.id ? { ...s, start: dragInfo.origStart + deltaSec, end: dragInfo.origEnd + deltaSec } : s
            )
        )
    }

    function onMouseUp() {
        setDragInfo(null)
    }

    function handleTrackClick(e: React.MouseEvent) {
        if (dragInfo || !containerRef.current || !onSeek) return
        const rect = containerRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const time = x / scale
        onSeek(Math.max(0, Math.min(time, duration)))
    }

    useEffect(() => {
        window.addEventListener('mousemove', onMouseMove)
        window.addEventListener('mouseup', onMouseUp)
        return () => {
            window.removeEventListener('mousemove', onMouseMove)
            window.removeEventListener('mouseup', onMouseUp)
        }
    })

    const playheadPosition = (currentTime / duration) * (containerRef.current?.clientWidth || 0)

    return (
        <div
            ref={containerRef}
            className='relative h-10 bg-muted overflow-hidden cursor-pointer'
            onClick={handleTrackClick}
        >
            {/* Playhead */}
            <div
                className='absolute top-0 bottom-0 w-0.5 bg-red-500 z-20 pointer-events-none'
                style={{ left: playheadPosition }}
            />

            {/* Time markers */}
            <div className='absolute inset-0 flex justify-between text-xs text-muted-foreground pointer-events-none'>
                {Array.from({ length: Math.ceil(duration) + 1 }, (_, i) => (
                    <div key={i} className='relative'>
                        <div className='absolute top-0 w-px h-2 bg-muted-foreground/30' />
                        <div className='absolute top-2 text-xs' style={{ transform: 'translateX(-50%)' }}>
                            {i}s
                        </div>
                    </div>
                ))}
            </div>

            {/* Subtitle blocks */}
            {subtitles.map((s) => {
                const left = s.start * scale
                const width = Math.max((s.end - s.start) * scale, 4)
                return (
                    <div
                        key={s.id}
                        onMouseDown={(e) => onMouseDown(e, s)}
                        style={{ left, width }}
                        className='absolute top-1 h-8 bg-primary/70 text-background text-xs flex items-center justify-center cursor-grab active:cursor-grabbing rounded z-10 border border-primary/20'
                    >
                        <span className='truncate px-1'>{s.text}</span>
                    </div>
                )
            })}
        </div>
    )
}
