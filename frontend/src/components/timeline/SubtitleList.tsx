'use client'

import { useSubtitleStore, Subtitle } from '@/store/subtitles'
import { useLanguage } from '@/contexts/LanguageContext'
import { nanoid } from 'nanoid'
import { useState } from 'react'

export default function SubtitleList() {
    const { subtitles, setSubtitles } = useSubtitleStore((s) => s)
    const { t } = useLanguage()
    const [selectedSubtitle, setSelectedSubtitle] = useState<string | null>(null)

    function update(id: string, patch: Partial<Subtitle>) {
        setSubtitles(subtitles.map((s) => (s.id === id ? { ...s, ...patch } : s)))
    }

    function handleAdd() {
        const lastEnd = subtitles.at(-1)?.end ?? 0
        const newSub: Subtitle = {
            id: nanoid(),
            start: lastEnd,
            end: lastEnd + 2,
            text: 'New subtitle',
            fontSize: 24,
            align: 'center',
            color: '#ffffff'
        }
        setSubtitles([...subtitles, newSub])
        setSelectedSubtitle(newSub.id)
    }

    function handleDelete(id: string) {
        setSubtitles(subtitles.filter(s => s.id !== id))
        if (selectedSubtitle === id) {
            setSelectedSubtitle(null)
        }
    }

    function handleDuplicate(subtitle: Subtitle) {
        const newSub: Subtitle = {
            ...subtitle,
            id: nanoid(),
            start: subtitle.end,
            end: subtitle.end + (subtitle.end - subtitle.start),
            text: subtitle.text + ' (copy)'
        }
        setSubtitles([...subtitles, newSub])
    }

    const selectedSub = selectedSubtitle ? subtitles.find(s => s.id === selectedSubtitle) : null

    return (
        <div className='border-t bg-background/50 dark:bg-gray-800/50 transition-colors'>
            {/* Character count and controls */}
            {selectedSub && (
                <div className='p-3 border-b bg-muted/30 dark:bg-gray-700/30'>
                    <div className='flex items-center justify-between mb-2'>
                        <span className='text-sm font-medium text-gray-900 dark:text-white'>{t('subtitleEditor.subtitleEditor')}</span>
                        <button
                            onClick={() => setSelectedSubtitle(null)}
                            className='text-xs text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-white'
                        >
                            ✕
                        </button>
                    </div>
                    <div className='space-y-3'>
                        <div>
                            <div className='flex justify-between text-xs mb-1'>
                                <span className='text-gray-700 dark:text-gray-300'>{t('subtitleEditor.charactersPerSubtitle')}</span>
                                <span className='text-gray-700 dark:text-gray-300'>{selectedSub.text.length}/80</span>
                            </div>
                            <div className='relative'>
                                <input
                                    type='range'
                                    min='10'
                                    max='80'
                                    value={selectedSub.text.length}
                                    readOnly
                                    className='w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-default'
                                />
                                <div
                                    className='absolute top-0 h-2 bg-cyan-500 dark:bg-cyan-400 rounded-lg pointer-events-none'
                                    style={{ width: `${(selectedSub.text.length / 80) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className='grid grid-cols-2 gap-2'>
                            <div>
                                <label className='block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300'>{t('subtitleEditor.fontSize')}</label>
                                <input
                                    type='range'
                                    min='12'
                                    max='48'
                                    value={selectedSub.fontSize}
                                    onChange={(e) => update(selectedSub.id, { fontSize: parseInt(e.target.value) })}
                                    className='w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer'
                                    style={{
                                        background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${((selectedSub.fontSize - 12) / (48 - 12)) * 100}%, #e5e7eb ${((selectedSub.fontSize - 12) / (48 - 12)) * 100}%, #e5e7eb 100%)`
                                    }}
                                />
                                <div className='text-xs text-center mt-1 text-gray-700 dark:text-gray-300'>{selectedSub.fontSize}px</div>
                            </div>
                            <div>
                                <label className='block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300'>{t('subtitleEditor.color')}</label>
                                <input
                                    type='color'
                                    value={selectedSub.color}
                                    onChange={(e) => update(selectedSub.id, { color: e.target.value })}
                                    className='w-full h-8 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 cursor-pointer'
                                />
                            </div>
                        </div>

                        <div>
                            <label className='block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300'>{t('subtitleEditor.textAlignment')}</label>
                            <div className='flex gap-1'>
                                {[
                                    { value: 'left', label: '◄', title: t('subtitleEditor.left') },
                                    { value: 'center', label: '●', title: t('subtitleEditor.center') },
                                    { value: 'right', label: '►', title: t('subtitleEditor.right') }
                                ].map(({ value, label, title }) => (
                                    <button
                                        key={value}
                                        onClick={() => update(selectedSub.id, { align: value as any })}
                                        className={`flex-1 h-8 rounded text-xs font-medium transition-colors ${selectedSub.align === value
                                                ? 'bg-cyan-500 dark:bg-cyan-600 text-white'
                                                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                                            }`}
                                        title={title}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Subtitle List */}
            <div className='p-4 space-y-3 max-h-64 overflow-auto'>
                {subtitles.map((s) => (
                    <div
                        key={s.id}
                        className={`space-y-2 p-2 rounded-md border transition-colors cursor-pointer ${selectedSubtitle === s.id
                            ? 'border-cyan-500 dark:border-cyan-400 bg-cyan-50 dark:bg-cyan-900/20'
                            : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                            }`}
                        onClick={() => setSelectedSubtitle(selectedSubtitle === s.id ? null : s.id)}
                    >
                        <div className='flex items-center gap-2'>
                            <input
                                type='number'
                                value={s.start.toFixed(1)}
                                step='0.1'
                                onChange={(e) => update(s.id, { start: parseFloat(e.target.value) || 0 })}
                                className='w-16 h-7 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-1 text-xs focus:ring-1 focus:ring-cyan-500'
                                onClick={(e) => e.stopPropagation()}
                            />
                            <span className='text-xs text-gray-500 dark:text-gray-400'>→</span>
                            <input
                                type='number'
                                value={s.end.toFixed(1)}
                                step='0.1'
                                onChange={(e) => update(s.id, { end: parseFloat(e.target.value) || 0 })}
                                className='w-16 h-7 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-1 text-xs focus:ring-1 focus:ring-cyan-500'
                                onClick={(e) => e.stopPropagation()}
                            />
                            <div className='flex-1' />
                            <div className='flex gap-1'>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleDuplicate(s)
                                    }}
                                    className='w-6 h-6 rounded text-xs hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors'
                                    title={t('subtitleEditor.duplicate')}
                                >
                                    ⧉
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleDelete(s.id)
                                    }}
                                    className='w-6 h-6 rounded text-xs hover:bg-gray-200 dark:hover:bg-gray-600 text-red-500 dark:text-red-400 transition-colors'
                                    title={t('subtitleEditor.delete')}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                        <textarea
                            value={s.text}
                            onChange={(e) => update(s.id, { text: e.target.value })}
                            className='w-full h-16 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-2 py-1 text-xs resize-none focus:ring-1 focus:ring-cyan-500'
                            placeholder={t('subtitleEditor.enterText')}
                            onClick={(e) => e.stopPropagation()}
                        />
                        <div className='flex items-center justify-between text-xs text-gray-500 dark:text-gray-400'>
                            <span>{s.text.length} {t('subtitleEditor.characters')}</span>
                            <span style={{ color: s.color }}>■</span>
                        </div>
                    </div>
                ))}

                <button
                    onClick={handleAdd}
                    className='w-full h-10 rounded-md border-2 border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30 hover:border-gray-400 dark:hover:border-gray-500 transition-colors flex items-center justify-center gap-2'
                >
                    <span className='text-lg'>+</span>
                    {t('subtitleEditor.addSubtitle')}
                </button>
            </div>
        </div>
    )
}
