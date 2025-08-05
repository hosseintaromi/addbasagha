'use client'

import { useState } from "react";
import { useSubtitleStore } from "@/store/subtitles";
import { useLanguage } from '@/contexts/LanguageContext';
import { transcribeAudio, SUPPORTED_LANGUAGES } from '@/lib/api';

const modelInfo = {
    basic: {
        cost: "$0.01/min",
        accuracy: "~80%",
        speed: "Fast",
        description: "Basic transcription with good speed"
    },
    standard: {
        cost: "$0.03/min",
        accuracy: "~90%",
        speed: "Medium",
        description: "Balanced accuracy and speed"
    },
    premium: {
        cost: "$0.08/min",
        accuracy: "~95%",
        speed: "Slower",
        description: "High accuracy transcription"
    }
};

export default function AutoSubtitlePanel() {
    const setSubtitles = useSubtitleStore((s) => s.setSubtitles);
    const [model, setModel] = useState<keyof typeof modelInfo>("basic");
    const [srcLang, setSrcLang] = useState("en");
    const [dstLang, setDstLang] = useState("en");
    const [loading, setLoading] = useState(false);
    const [quota, setQuota] = useState({ used: 147, total: 500 }); // mock quota data

    async function handleSubmit() {
        setLoading(true);
        try {
            const res = await fetch("/api/auto-subtitle", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ model, srcLang, dstLang }),
            });
            const data = await res.json();
            if (data.subtitles) {
                setSubtitles(data.subtitles);
                setQuota(prev => ({ ...prev, used: prev.used + 5 })); // mock quota update
            }
        } finally {
            setLoading(false);
        }
    }

    const selectedModel = modelInfo[model];
    const quotaPercentage = (quota.used / quota.total) * 100;

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="block text-sm font-medium">Original language</label>
                <select
                    value={srcLang}
                    onChange={(e) => setSrcLang(e.target.value)}
                    className="w-full h-9 rounded-md border bg-background px-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                    <option value="en">English</option>
                    <option value="fa">Farsi (Persian)</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="ar">Arabic</option>
                </select>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium">Translation target</label>
                <select
                    value={dstLang}
                    onChange={(e) => setDstLang(e.target.value)}
                    className="w-full h-9 rounded-md border bg-background px-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                    <option value="en">English</option>
                    <option value="fa">Farsi (Persian)</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="ar">Arabic</option>
                </select>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium">Transcription Model</label>
                <div className="space-y-2">
                    {Object.entries(modelInfo).map(([key, info]) => (
                        <div key={key} className="relative">
                            <input
                                type="radio"
                                id={key}
                                name="model"
                                value={key}
                                checked={model === key}
                                onChange={(e) => setModel(e.target.value as keyof typeof modelInfo)}
                                className="sr-only"
                            />
                            <label
                                htmlFor={key}
                                className={`block w-full p-3 rounded-md border cursor-pointer transition-colors ${model === key
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:bg-muted/50'
                                    }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-medium text-sm capitalize">{key}</div>
                                        <div className="text-xs text-muted-foreground">{info.description}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-medium">{info.cost}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {info.accuracy} • {info.speed}
                                        </div>
                                    </div>
                                </div>
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quota Display */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Remaining transcription quota</span>
                    <span className="text-sm text-muted-foreground">{quota.used}/{quota.total} minutes</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${quotaPercentage}%` }}
                    />
                </div>
                {quotaPercentage > 80 && (
                    <div className="text-xs text-amber-600 dark:text-amber-400">
                        Running low on quota. Consider upgrading for unlimited access.
                    </div>
                )}
            </div>

            {/* Upgrade Button */}
            {quotaPercentage > 50 && (
                <button className="w-full h-8 rounded-md border border-primary text-primary text-sm font-medium hover:bg-primary/5 transition-colors">
                    ⬆ Upgrade for quota purchase
                </button>
            )}

            <button
                disabled={loading || quotaPercentage >= 100}
                onClick={handleSubmit}
                className="w-full h-9 rounded-md bg-primary text-background text-sm font-medium hover:opacity-80 disabled:opacity-50 transition-opacity"
            >
                {loading ? "Processing..." : "Auto Subtitle"}
            </button>

            <div className="text-xs text-center text-muted-foreground">
                Estimated cost: {selectedModel.cost} • Accuracy: {selectedModel.accuracy}
            </div>
        </div>
    );
}
