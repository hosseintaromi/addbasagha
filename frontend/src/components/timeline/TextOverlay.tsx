'use client'

import { useTextStore } from '@/store/text'
import { useState } from 'react'

type Props = {
    currentTime: number
}

export default function TextOverlay({ currentTime }: Props) {
    const { texts, updateText, removeText } = useTextStore((s) => s)
    const [selectedText, setSelectedText] = useState<string | null>(null)

    const visibleTexts = texts.filter(text => {
        // For now, show all texts. In the future, we can add time-based visibility
        return true
    })

    const handleDragStart = (e: React.DragEvent, textId: string) => {
        e.dataTransfer.setData('text/plain', textId)
    }

    const handleDrag = (e: React.DragEvent, textId: string) => {
        const rect = e.currentTarget.parentElement?.getBoundingClientRect()
        if (!rect) return

        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100

        updateText(textId, { x, y })
    }

    const handleTextClick = (textId: string) => {
        setSelectedText(selectedText === textId ? null : textId)
    }

    const handleDelete = (textId: string) => {
        removeText(textId)
        setSelectedText(null)
    }

    return (
        <div className="absolute inset-0 pointer-events-none">
            {visibleTexts.map((text) => (
                <div
                    key={text.id}
                    className={`absolute pointer-events-auto cursor-move select-none group ${selectedText === text.id ? 'ring-2 ring-cyan-500' : ''
                        }`}
                    style={{
                        left: `${text.x}%`,
                        top: `${text.y}%`,
                        fontSize: `${text.fontSize}px`,
                        color: text.color || '#ffffff',
                        fontFamily: text.fontFamily || 'Arial',
                        fontWeight: text.fontWeight || 'normal',
                        opacity: text.opacity || 1,
                        transform: `rotate(${text.rotation || 0}deg)`,
                        textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8), 1px -1px 2px rgba(0,0,0,0.8), -1px 1px 2px rgba(0,0,0,0.8)'
                    }}
                    draggable
                    onDragStart={(e) => handleDragStart(e, text.id)}
                    onDrag={(e) => handleDrag(e, text.id)}
                    onClick={() => handleTextClick(text.id)}
                >
                    <div className="relative">
                        {text.content}
                        {selectedText === text.id && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleDelete(text.id)
                                }}
                                className="absolute -top-6 -right-6 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 transition-colors"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}