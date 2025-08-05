'use client'

import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import WaveSurfer from "wavesurfer.js";

type Props = {
    url: string;
    currentTime?: number;
    onTimeUpdate?: (time: number) => void;
    onDurationChange?: (duration: number) => void;
};

export interface WaveformRef {
    seekTo: (time: number) => void;
    play: () => void;
    pause: () => void;
    getCurrentTime: () => number;
    getDuration: () => number;
}

const Waveform = forwardRef<WaveformRef, Props>(({ url, currentTime = 0, onTimeUpdate, onDurationChange }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const wavesurferRef = useRef<WaveSurfer | null>(null);

    useImperativeHandle(ref, () => ({
        seekTo: (time: number) => {
            if (wavesurferRef.current) {
                wavesurferRef.current.seekTo(time / wavesurferRef.current.getDuration());
            }
        },
        play: () => wavesurferRef.current?.play(),
        pause: () => wavesurferRef.current?.pause(),
        getCurrentTime: () => wavesurferRef.current?.getCurrentTime() || 0,
        getDuration: () => wavesurferRef.current?.getDuration() || 0,
    }), []);

    useEffect(() => {
        if (!containerRef.current) return;

        const ws = WaveSurfer.create({
            container: containerRef.current,
            waveColor: "#888",
            progressColor: "#17c964",
            cursorColor: "#ffffff",
            barWidth: 2,
            height: 60,
            normalize: true,
            backend: 'WebAudio',
            interact: true,
        });

        wavesurferRef.current = ws;

        ws.load(url);

        ws.on('ready', () => {
            if (onDurationChange) {
                onDurationChange(ws.getDuration());
            }
        });

        ws.on('timeupdate', (time) => {
            if (onTimeUpdate) {
                onTimeUpdate(time);
            }
        });

        ws.on('seek', (progress) => {
            const time = progress * ws.getDuration();
            if (onTimeUpdate) {
                onTimeUpdate(time);
            }
        });

        return () => {
            ws.destroy();
            wavesurferRef.current = null;
        };
    }, [url, onTimeUpdate, onDurationChange]);

    useEffect(() => {
        if (wavesurferRef.current && typeof currentTime === 'number') {
            const duration = wavesurferRef.current.getDuration();
            if (duration > 0) {
                const progress = currentTime / duration;
                wavesurferRef.current.seekTo(progress);
            }
        }
    }, [currentTime]);

    return <div ref={containerRef} className="w-full h-20 bg-muted/30 rounded-md" />;
});

Waveform.displayName = 'Waveform';

export default Waveform;
