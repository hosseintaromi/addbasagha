'use client'

import { useRef, useState, useCallback, useEffect } from "react";
import Waveform, { WaveformRef } from "./Waveform";
import SubtitleList from "./SubtitleList";
import SubtitleTrack from './SubtitleTrack'

type Props = {
    duration: number;
    audioSrc: string;
    currentTime: number;
    onTimeUpdate?: (time: number) => void;
    onSeek?: (time: number) => void;
};

type Track = {
    id: string;
    name: string;
    type: 'video' | 'audio' | 'subtitle' | 'text';
    enabled: boolean;
    locked: boolean;
    height: number;
};

export default function Timeline({ duration, audioSrc, currentTime, onTimeUpdate, onSeek }: Props) {
    const waveformRef = useRef<WaveformRef>(null);
    const timelineRef = useRef<HTMLDivElement>(null);
    const [localDuration, setLocalDuration] = useState(duration);
    const [tracks, setTracks] = useState<Track[]>([
        { id: 'video-1', name: 'Video', type: 'video', enabled: true, locked: false, height: 60 },
        { id: 'audio-1', name: 'Audio', type: 'audio', enabled: true, locked: false, height: 60 },
        { id: 'subtitle-1', name: 'Subtitles', type: 'subtitle', enabled: true, locked: false, height: 40 },
    ]);
    const [zoom, setZoom] = useState(1);
    const [showTrackControls, setShowTrackControls] = useState(true);

    // Touch/Pan state
    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, time: 0 });
    const [lastPinchDistance, setLastPinchDistance] = useState(0);

    const handleTimeUpdate = useCallback((time: number) => {
        if (onTimeUpdate) {
            onTimeUpdate(time);
        }
    }, [onTimeUpdate]);

    const handleSeek = useCallback((time: number) => {
        if (onSeek) {
            onSeek(time);
        }
    }, [onSeek]);

    const handleDurationChange = useCallback((newDuration: number) => {
        setLocalDuration(newDuration);
    }, []);

    const toggleTrackEnabled = (trackId: string) => {
        setTracks(tracks.map(track =>
            track.id === trackId ? { ...track, enabled: !track.enabled } : track
        ));
    };

    const toggleTrackLocked = (trackId: string) => {
        setTracks(tracks.map(track =>
            track.id === trackId ? { ...track, locked: !track.locked } : track
        ));
    };

    const addTrack = (type: Track['type']) => {
        const newTrack: Track = {
            id: `${type}-${Date.now()}`,
            name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${tracks.filter(t => t.type === type).length + 1}`,
            type,
            enabled: true,
            locked: false,
            height: type === 'subtitle' || type === 'text' ? 40 : 60
        };
        setTracks([...tracks, newTrack]);
    };

    // Touch and mouse event handlers
    const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsPanning(true);
        setPanStart({ x: e.clientX, time: currentTime });

        if (timelineRef.current) {
            const rect = timelineRef.current.getBoundingClientRect();
            const percentage = (e.clientX - rect.left) / rect.width;
            const newTime = percentage * localDuration;
            if (onSeek) {
                onSeek(Math.max(0, Math.min(localDuration, newTime)));
            }
        }
    }, [currentTime, localDuration, onSeek]);

    const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (!isPanning || !timelineRef.current) return;

        e.preventDefault();
        const rect = timelineRef.current.getBoundingClientRect();
        const percentage = (e.clientX - rect.left) / rect.width;
        const newTime = percentage * localDuration;

        if (onSeek) {
            onSeek(Math.max(0, Math.min(localDuration, newTime)));
        }
    }, [isPanning, localDuration, onSeek]);

    const handlePointerUp = useCallback(() => {
        setIsPanning(false);
    }, []);

    // Touch zoom (pinch) handler
    const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
        if (e.touches.length === 2) {
            const distance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            setLastPinchDistance(distance);
        }
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const distance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );

            if (lastPinchDistance > 0) {
                const delta = distance - lastPinchDistance;
                const zoomChange = delta * 0.01;
                setZoom(prev => Math.max(0.25, Math.min(4, prev + zoomChange)));
            }
            setLastPinchDistance(distance);
        }
    }, [lastPinchDistance]);

    const handleTouchEnd = useCallback(() => {
        setLastPinchDistance(0);
    }, []);

    const playheadPosition = (currentTime / localDuration) * 100;

    return (
        <section className='border-t bg-white dark:bg-gray-900'>
            {/* Timeline Header */}
            <div className="flex items-center justify-between p-2 sm:p-3 border-b bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-2 sm:gap-3">
                    <button
                        onClick={() => setShowTrackControls(!showTrackControls)}
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 p-1 sm:p-0 touch-manipulation"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Timeline</span>
                </div>

                <div className="flex items-center gap-1 sm:gap-2">
                    {/* Mobile-optimized Zoom Controls */}
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setZoom(Math.max(0.25, zoom - 0.25))}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center text-sm font-medium touch-manipulation text-gray-700 dark:text-gray-300"
                        >
                            −
                        </button>
                        <span className="text-xs text-gray-600 dark:text-gray-400 w-8 sm:w-12 text-center">{Math.round(zoom * 100)}%</span>
                        <button
                            onClick={() => setZoom(Math.min(4, zoom + 0.25))}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center text-sm font-medium touch-manipulation text-gray-700 dark:text-gray-300"
                        >
                            +
                        </button>
                    </div>

                    {/* Add Track Dropdown */}
                    <div className="relative group">
                        <button className="text-xs bg-blue-600 dark:bg-blue-700 text-white px-2 py-1.5 sm:py-1 rounded hover:bg-blue-700 dark:hover:bg-blue-600 touch-manipulation">
                            <span className="hidden sm:inline">+ Track</span>
                            <span className="sm:hidden">+</span>
                        </button>
                        <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                            <div className="py-1 w-28 sm:w-32">
                                <button
                                    onClick={() => addTrack('video')}
                                    className="w-full px-3 py-2 text-left text-xs sm:text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 touch-manipulation"
                                >
                                    Video
                                </button>
                                <button
                                    onClick={() => addTrack('audio')}
                                    className="w-full px-3 py-2 text-left text-xs sm:text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 touch-manipulation"
                                >
                                    Audio
                                </button>
                                <button
                                    onClick={() => addTrack('subtitle')}
                                    className="w-full px-3 py-2 text-left text-xs sm:text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 touch-manipulation"
                                >
                                    Subtitle
                                </button>
                                <button
                                    onClick={() => addTrack('text')}
                                    className="w-full px-3 py-2 text-left text-xs sm:text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 touch-manipulation"
                                >
                                    Text
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile-optimized Timeline Content */}
            <div className="flex">
                {/* Track Controls Sidebar - Mobile responsive */}
                {showTrackControls && (
                    <div className="w-32 sm:w-40 lg:w-48 border-r bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        {tracks.map((track) => (
                            <div
                                key={track.id}
                                className="flex items-center justify-between p-2 sm:p-3 border-b border-gray-200 dark:border-gray-700"
                                style={{ height: `${track.height + 16}px` }}
                            >
                                <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
                                    <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded border-2 flex-shrink-0 ${track.type === 'video' ? 'bg-purple-500 border-purple-500' :
                                        track.type === 'audio' ? 'bg-green-500 border-green-500' :
                                            track.type === 'subtitle' ? 'bg-blue-500 border-blue-500' :
                                                'bg-orange-500 border-orange-500'
                                        }`} />
                                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{track.name}</span>
                                </div>

                                <div className="flex items-center gap-1 flex-shrink-0">
                                    <button
                                        onClick={() => toggleTrackEnabled(track.id)}
                                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded text-xs touch-manipulation ${track.enabled ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                                            }`}
                                        title={track.enabled ? 'Enabled' : 'Disabled'}
                                    >
                                        👁
                                    </button>
                                    <button
                                        onClick={() => toggleTrackLocked(track.id)}
                                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded text-xs touch-manipulation ${track.locked ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                                            }`}
                                        title={track.locked ? 'Locked' : 'Unlocked'}
                                    >
                                        {track.locked ? '🔒' : '🔓'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Timeline Tracks */}
                <div className="flex-1 relative">
                    {/* Mobile-optimized Time Ruler */}
                    <div className="h-6 sm:h-8 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 relative overflow-hidden">
                        <div className="flex justify-between px-1 sm:px-2 py-1 text-xs text-gray-600 dark:text-gray-400">
                            {Array.from({ length: Math.ceil(localDuration) + 1 }, (_, i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <div className="text-xs">{i}s</div>
                                    <div className="w-px h-1 sm:h-2 bg-gray-400 dark:bg-gray-500"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile-optimized Tracks Container with Touch Support */}
                    <div
                        ref={timelineRef}
                        className="relative select-none touch-pan-x"
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        style={{
                            cursor: isPanning ? 'grabbing' : 'grab',
                            transform: `scaleX(${zoom})`,
                            transformOrigin: 'left'
                        }}
                    >
                        {/* Enhanced Mobile Playhead */}
                        <div
                            className="absolute top-0 bottom-0 w-0.5 sm:w-1 bg-red-500 z-30 pointer-events-none"
                            style={{ left: `${playheadPosition}%` }}
                        >
                            <div className="absolute -top-1 -left-1 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                        </div>

                        {tracks.map((track, index) => (
                            <div
                                key={track.id}
                                className={`relative border-b border-gray-200 dark:border-gray-600 ${track.enabled ? '' : 'opacity-50'} cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors`}
                                style={{ height: `${track.height + 16}px` }}
                            >
                                {track.type === 'video' && (
                                    <div className="h-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                                        <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-800/50 px-2 py-1 rounded text-xs">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                            <span className="hidden sm:inline">Video Clip</span>
                                            <span className="sm:hidden">Video</span>
                                        </div>
                                    </div>
                                )}

                                {track.type === 'audio' && (
                                    <div className="h-full bg-green-50 dark:bg-green-900/20 p-1 sm:p-2">
                                        <Waveform
                                            ref={index === 1 ? waveformRef : undefined}
                                            url={audioSrc}
                                            currentTime={currentTime}
                                            onTimeUpdate={handleTimeUpdate}
                                            onDurationChange={handleDurationChange}
                                        />
                                    </div>
                                )}

                                {track.type === 'subtitle' && (
                                    <div className="h-full bg-blue-50 dark:bg-blue-900/20">
                                        <SubtitleTrack
                                            duration={localDuration}
                                            currentTime={currentTime}
                                            onSeek={handleSeek}
                                        />
                                    </div>
                                )}

                                {track.type === 'text' && (
                                    <div className="h-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                                        <div className="text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-800/50 px-2 py-1 rounded text-xs">
                                            <span className="hidden sm:inline">Text Overlays</span>
                                            <span className="sm:hidden">Text</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile-optimized Subtitle List Panel */}
            <details className="border-t border-gray-200 dark:border-gray-600">
                <summary className="p-3 bg-gray-50 dark:bg-gray-800 cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 touch-manipulation">
                    Subtitle Editor
                </summary>
                <div className="border-t border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900">
                    <SubtitleList />
                </div>
            </details>
        </section>
    );
}
