'use client'

import { useState } from 'react'

const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fa', name: 'Persian (Farsi)', flag: '🇮🇷' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' }
]

const voices = {
    en: [
        { id: 'en-sarah', name: 'Sarah', gender: 'Female', accent: 'American' },
        { id: 'en-mike', name: 'Mike', gender: 'Male', accent: 'American' },
        { id: 'en-emma', name: 'Emma', gender: 'Female', accent: 'British' },
        { id: 'en-james', name: 'James', gender: 'Male', accent: 'British' }
    ],
    fa: [
        { id: 'fa-maryam', name: 'Maryam', gender: 'Female', accent: 'Tehran' },
        { id: 'fa-ahmad', name: 'Ahmad', gender: 'Male', accent: 'Tehran' },
        { id: 'fa-zahra', name: 'Zahra', gender: 'Female', accent: 'Isfahan' }
    ],
    es: [
        { id: 'es-sofia', name: 'Sofia', gender: 'Female', accent: 'Spanish' },
        { id: 'es-carlos', name: 'Carlos', gender: 'Male', accent: 'Mexican' }
    ]
}

export default function TranslateDubPanel() {
    const [srcLang, setSrcLang] = useState('en')
    const [dstLang, setDstLang] = useState('fa')
    const [selectedVoice, setSelectedVoice] = useState('fa-maryam')
    const [mode, setMode] = useState<'translate' | 'dub' | 'both'>('both')
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [step, setStep] = useState<'setup' | 'translating' | 'dubbing' | 'complete'>('setup')
    const [translatedText, setTranslatedText] = useState('')
    const [detectingLanguage, setDetectingLanguage] = useState(false)

    const availableVoices = voices[dstLang as keyof typeof voices] || voices.en

    async function detectLanguage() {
        setDetectingLanguage(true)
        // Simulate language detection
        setTimeout(() => {
            setSrcLang('en') // Mock detected language
            setDetectingLanguage(false)
        }, 1500)
    }

    async function handleProcess() {
        setLoading(true)
        setProgress(0)

        if (mode === 'translate' || mode === 'both') {
            setStep('translating')
            // Simulate translation progress
            for (let i = 0; i <= 100; i += 10) {
                setProgress(i)
                await new Promise(resolve => setTimeout(resolve, 100))
            }
            setTranslatedText('سلام، این یک متن تست برای ترجمه است. این ویدیو نشان‌دهنده قابلیت‌های ترجمه خودکار پلتفرم عباس‌آقا است.')
        }

        if (mode === 'dub' || mode === 'both') {
            setStep('dubbing')
            setProgress(0)
            // Simulate dubbing progress
            for (let i = 0; i <= 100; i += 8) {
                setProgress(i)
                await new Promise(resolve => setTimeout(resolve, 150))
            }
        }

        setStep('complete')
        setLoading(false)
    }

    function playVoiceSample(voiceId: string) {
        // In a real app, this would play a voice sample
        console.log(`Playing sample for voice: ${voiceId}`)
    }

    function resetProcess() {
        setStep('setup')
        setProgress(0)
        setTranslatedText('')
    }

    if (step === 'translating' || step === 'dubbing') {
        return (
            <div className="space-y-4">
                <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {step === 'translating' ? 'Translating Subtitles' : 'Generating Audio'}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                        {step === 'translating'
                            ? `Translating from ${languages.find(l => l.code === srcLang)?.name} to ${languages.find(l => l.code === dstLang)?.name}`
                            : `Generating ${availableVoices.find(v => v.id === selectedVoice)?.name} voice`
                        }
                    </p>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>
        )
    }

    if (step === 'complete') {
        return (
            <div className="space-y-4">
                <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {mode === 'both' ? 'Translation & Dubbing Complete!' :
                            mode === 'translate' ? 'Translation Complete!' : 'Dubbing Complete!'}
                    </h3>
                </div>

                {translatedText && (
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Translated Text Preview:</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">{translatedText}</p>
                    </div>
                )}

                <div className="flex gap-2">
                    <button
                        onClick={resetProcess}
                        className="flex-1 h-9 rounded-md border text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                        New Translation
                    </button>
                    <button className="flex-1 h-9 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors">
                        Apply Changes
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Mode Selection */}
            <div className="space-y-2">
                <label className="block text-sm font-medium">Mode</label>
                <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-lg">
                    {[
                        { value: 'translate', label: 'Translate' },
                        { value: 'dub', label: 'Dub' },
                        { value: 'both', label: 'Both' }
                    ].map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => setMode(value as any)}
                            className={`py-1.5 text-xs font-medium rounded-md transition-colors ${mode === value
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Source Language */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium">From Language</label>
                    <button
                        onClick={detectLanguage}
                        disabled={detectingLanguage}
                        className="text-xs text-blue-600 hover:underline disabled:opacity-50"
                    >
                        {detectingLanguage ? 'Detecting...' : 'Auto-detect'}
                    </button>
                </div>
                <select
                    value={srcLang}
                    onChange={(e) => setSrcLang(e.target.value)}
                    className="w-full h-9 rounded-md border bg-background px-2 text-sm focus:ring-2 focus:ring-blue-500"
                >
                    {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                            {lang.flag} {lang.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Target Language */}
            <div className="space-y-2">
                <label className="block text-sm font-medium">To Language</label>
                <select
                    value={dstLang}
                    onChange={(e) => setDstLang(e.target.value)}
                    className="w-full h-9 rounded-md border bg-background px-2 text-sm focus:ring-2 focus:ring-blue-500"
                >
                    {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                            {lang.flag} {lang.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Voice Selection (only if dubbing) */}
            {(mode === 'dub' || mode === 'both') && (
                <div className="space-y-2">
                    <label className="block text-sm font-medium">Voice Selection</label>
                    <div className="space-y-2">
                        {availableVoices.map((voice) => (
                            <div key={voice.id} className="flex items-center justify-between p-2 border rounded-md hover:bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="voice"
                                        value={voice.id}
                                        checked={selectedVoice === voice.id}
                                        onChange={(e) => setSelectedVoice(e.target.value)}
                                        className="text-blue-600"
                                    />
                                    <div>
                                        <div className="text-sm font-medium">{voice.name}</div>
                                        <div className="text-xs text-gray-500">{voice.gender} • {voice.accent}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => playVoiceSample(voice.id)}
                                    className="text-xs text-blue-600 hover:underline"
                                >
                                    🔊 Sample
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Options */}
            <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                    <span>Preserve original timing</span>
                    <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span>Adjust speaking speed</span>
                    <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span>Keep original audio as background</span>
                    <input type="checkbox" className="rounded text-blue-600" />
                </div>
            </div>

            {/* Process Button */}
            <button
                disabled={loading}
                onClick={handleProcess}
                className="w-full h-10 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                    </>
                ) : (
                    <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                        </svg>
                        {mode === 'both' ? 'Translate & Dub' :
                            mode === 'translate' ? 'Translate Subtitles' : 'Generate Dubbing'}
                    </>
                )}
            </button>

            <div className="text-xs text-center text-gray-500">
                Processing time: ~2-5 minutes depending on video length
            </div>
        </div>
    )
}
