'use client'

import { useRef, useEffect, useState, useCallback } from 'react';
import * as fabric from 'fabric';
import { useTextStore } from '@/store/text';
import { useLanguage } from '@/contexts/LanguageContext';

type Props = {
    currentTime: number;
    videoWidth: number;
    videoHeight: number;
    onTextUpdate?: (id: string, properties: any) => void;
};

export default function CanvasTextOverlay({ currentTime, videoWidth, videoHeight, onTextUpdate }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvas = useRef<fabric.Canvas | null>(null);
    const { texts, updateText } = useTextStore();
    const { isRTL } = useLanguage();
    const [selectedText, setSelectedText] = useState<string | null>(null);

    // Initialize Fabric.js canvas
    useEffect(() => {
        if (!canvasRef.current) return;

        fabricCanvas.current = new fabric.Canvas(canvasRef.current, {
            width: videoWidth,
            height: videoHeight,
            backgroundColor: 'transparent',
            selection: true,
            preserveObjectStacking: true,
        });

        // Canvas event handlers
        fabricCanvas.current.on('object:modified', handleObjectModified);
        fabricCanvas.current.on('selection:created', handleSelectionCreated);
        fabricCanvas.current.on('selection:cleared', () => setSelectedText(null));
        fabricCanvas.current.on('object:moving', handleObjectMoving);
        fabricCanvas.current.on('object:scaling', handleObjectScaling);

        return () => {
            fabricCanvas.current?.dispose();
        };
    }, [videoWidth, videoHeight]);

    // Handle object modifications
    const handleObjectModified = useCallback((e: fabric.IEvent) => {
        const target = e.target as fabric.IText;
        if (!target || !target.data?.textId) return;

        const textId = target.data.textId;
        const properties = {
            left: target.left,
            top: target.top,
            scaleX: target.scaleX,
            scaleY: target.scaleY,
            angle: target.angle,
            text: target.text,
        };

        updateText(textId, properties);
        if (onTextUpdate) {
            onTextUpdate(textId, properties);
        }
    }, [updateText, onTextUpdate]);

    const handleSelectionCreated = useCallback((e: fabric.IEvent) => {
        const target = e.target as fabric.IText;
        if (target?.data?.textId) {
            setSelectedText(target.data.textId);
        }
    }, []);

    const handleObjectMoving = useCallback((e: fabric.IEvent) => {
        const target = e.target as fabric.Object;
        if (!target) return;

        // Snap to grid (optional)
        const gridSize = 10;
        target.set({
            left: Math.round((target.left || 0) / gridSize) * gridSize,
            top: Math.round((target.top || 0) / gridSize) * gridSize,
        });
    }, []);

    const handleObjectScaling = useCallback((e: fabric.IEvent) => {
        const target = e.target as fabric.IText;
        if (!target) return;

        // Maintain aspect ratio for text scaling
        const scaleX = target.scaleX || 1;
        const scaleY = target.scaleY || 1;
        const scale = Math.max(scaleX, scaleY);

        target.set({
            scaleX: scale,
            scaleY: scale,
        });
    }, []);

    // Update canvas when texts change
    useEffect(() => {
        if (!fabricCanvas.current) return;

        // Clear existing text objects
        const objects = fabricCanvas.current.getObjects();
        objects.forEach(obj => {
            if (obj.data?.isText) {
                fabricCanvas.current?.remove(obj);
            }
        });

        // Add active text overlays
        texts.forEach(textOverlay => {
            const isActive = currentTime >= textOverlay.startTime &&
                currentTime <= textOverlay.endTime;

            if (!isActive) return;

            const textObject = new fabric.IText(textOverlay.text, {
                left: textOverlay.left || videoWidth / 2,
                top: textOverlay.top || videoHeight / 2,
                fontSize: textOverlay.fontSize || 48,
                fill: textOverlay.color || '#ffffff',
                fontFamily: textOverlay.fontFamily || 'Arial',
                fontWeight: textOverlay.fontWeight || 'normal',
                textAlign: isRTL ? 'right' : textOverlay.align || 'center',
                originX: 'center',
                originY: 'center',
                scaleX: textOverlay.scaleX || 1,
                scaleY: textOverlay.scaleY || 1,
                angle: textOverlay.angle || 0,
                shadow: textOverlay.shadow ? new fabric.Shadow({
                    color: 'rgba(0,0,0,0.3)',
                    blur: 4,
                    offsetX: 2,
                    offsetY: 2,
                }) : undefined,
                stroke: textOverlay.stroke || undefined,
                strokeWidth: textOverlay.strokeWidth || 0,
                data: {
                    textId: textOverlay.id,
                    isText: true,
                },
            });

            // Add animation effects
            if (textOverlay.animation === 'fade-in') {
                textObject.set({ opacity: 0 });
                textObject.animate('opacity', 1, {
                    duration: 500,
                    easing: fabric.util.ease.easeInOutQuad,
                });
            } else if (textOverlay.animation === 'slide-up') {
                const originalTop = textObject.top || 0;
                textObject.set({ top: originalTop + 50, opacity: 0 });
                textObject.animate('top', originalTop, {
                    duration: 500,
                    easing: fabric.util.ease.easeOutBack,
                });
                textObject.animate('opacity', 1, {
                    duration: 500,
                });
            } else if (textOverlay.animation === 'scale-in') {
                textObject.set({ scaleX: 0, scaleY: 0 });
                textObject.animate('scaleX', textOverlay.scaleX || 1, {
                    duration: 400,
                    easing: fabric.util.ease.easeOutBack,
                });
                textObject.animate('scaleY', textOverlay.scaleY || 1, {
                    duration: 400,
                    easing: fabric.util.ease.easeOutBack,
                });
            }

            fabricCanvas.current?.add(textObject);
        });

        fabricCanvas.current.renderAll();
    }, [texts, currentTime, videoWidth, videoHeight, isRTL]);

    // Resize canvas when video dimensions change
    useEffect(() => {
        if (fabricCanvas.current) {
            fabricCanvas.current.setDimensions({
                width: videoWidth,
                height: videoHeight,
            });
            fabricCanvas.current.renderAll();
        }
    }, [videoWidth, videoHeight]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!selectedText || !fabricCanvas.current) return;

            const activeObject = fabricCanvas.current.getActiveObject() as fabric.IText;
            if (!activeObject) return;

            // Delete text
            if (e.key === 'Delete' || e.key === 'Backspace') {
                fabricCanvas.current.remove(activeObject);
                const textId = activeObject.data?.textId;
                if (textId) {
                    // Remove from store
                    const { texts, setTexts } = useTextStore.getState();
                    setTexts(texts.filter(t => t.id !== textId));
                }
            }

            // Duplicate text (Ctrl+D)
            if (e.ctrlKey && e.key === 'd') {
                e.preventDefault();
                activeObject.clone((cloned: fabric.IText) => {
                    cloned.set({
                        left: (cloned.left || 0) + 20,
                        top: (cloned.top || 0) + 20,
                        data: {
                            ...cloned.data,
                            textId: `text-${Date.now()}`,
                        },
                    });
                    fabricCanvas.current?.add(cloned);
                    fabricCanvas.current?.setActiveObject(cloned);
                });
            }

            // Move with arrow keys
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                const step = e.shiftKey ? 10 : 1;
                const left = activeObject.left || 0;
                const top = activeObject.top || 0;

                switch (e.key) {
                    case 'ArrowUp':
                        activeObject.set({ top: top - step });
                        break;
                    case 'ArrowDown':
                        activeObject.set({ top: top + step });
                        break;
                    case 'ArrowLeft':
                        activeObject.set({ left: left - step });
                        break;
                    case 'ArrowRight':
                        activeObject.set({ left: left + step });
                        break;
                }
                fabricCanvas.current.renderAll();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedText]);

    return (
        <div className="absolute inset-0 pointer-events-none">
            <canvas
                ref={canvasRef}
                className="w-full h-full pointer-events-auto"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 10,
                }}
            />

            {/* Canvas Controls Overlay */}
            {selectedText && (
                <div className="absolute top-4 right-4 bg-black/80 text-white p-2 rounded-lg text-xs pointer-events-auto z-20">
                    <div className="space-y-1">
                        <div>Use arrow keys to move</div>
                        <div>Shift + arrows for faster move</div>
                        <div>Ctrl+D to duplicate</div>
                        <div>Delete to remove</div>
                    </div>
                </div>
            )}
        </div>
    );
}