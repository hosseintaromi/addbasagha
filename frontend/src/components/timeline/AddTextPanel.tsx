'use client'

import { useTextStore } from "@/store/text";
import { nanoid } from "nanoid";
import { useState } from "react";
import { useLanguage } from '@/contexts/LanguageContext';

type Props = {
    currentTime?: number;
};

const styleTemplates = [
    {
        id: "headline",
        name: "Headline",
        preview: "BIG TITLE",
        style: { fontSize: 48, fontWeight: "bold", color: "#ffffff", fontFamily: "Arial" }
    },
    {
        id: "subtitle",
        name: "Subtitle",
        preview: "Secondary text",
        style: { fontSize: 24, fontWeight: "semibold", color: "#e5e5e5", fontFamily: "Arial" }
    },
    {
        id: "caption",
        name: "Caption",
        preview: "Small description",
        style: { fontSize: 16, fontWeight: "normal", color: "#cccccc", fontFamily: "Arial" }
    },
    {
        id: "quote",
        name: "Quote",
        preview: '"Inspirational quote"',
        style: { fontSize: 32, fontWeight: "medium", color: "#ffd700", fontFamily: "Times" }
    },
    {
        id: "callout",
        name: "Call Out",
        preview: "ATTENTION!",
        style: { fontSize: 36, fontWeight: "bold", color: "#ff4444", fontFamily: "Arial" }
    }
];

const animations = [
    { id: "none", name: "None", preview: "Static" },
    { id: "fade-in", name: "Fade In", preview: "→ Text" },
    { id: "slide-up", name: "Slide Up", preview: "↑ Text" },
    { id: "scale-in", name: "Scale In", preview: "○Text" },
    { id: "bounce-in", name: "Bounce In", preview: "⤴Text" }
];

const fonts = [
    "Arial", "Helvetica", "Times", "Georgia", "Verdana",
    "Impact", "Comic Sans MS", "Trebuchet MS", "Palatino"
];

const brandColors = [
    "#ffffff", "#000000", "#ff0000", "#00ff00", "#0000ff",
    "#ffff00", "#ff00ff", "#00ffff", "#ffa500", "#800080"
];

export default function AddTextPanel({ currentTime = 0 }: Props) {
    const addText = useTextStore((s) => s.addText);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [selectedAnimation, setSelectedAnimation] = useState("none");
    const [selectedFont, setSelectedFont] = useState("Arial");
    const [customColor, setCustomColor] = useState("#ffffff");
    const [showBrandKit, setShowBrandKit] = useState(false);

    function handleAddText(template?: typeof styleTemplates[0]) {
        const style = template ? template.style : {
            fontSize: 48,
            fontWeight: "normal",
            color: customColor,
            fontFamily: selectedFont
        };

        const newText = {
            id: nanoid(),
            text: template ? template.preview : "New Text",
            startTime: currentTime,
            endTime: currentTime + 3, // Default 3 seconds duration
            left: 427, // Center of 854px width
            top: 240, // Center of 480px height
            fontSize: style.fontSize,
            color: style.color,
            fontFamily: style.fontFamily,
            fontWeight: style.fontWeight,
            align: 'center' as const,
            animation: selectedAnimation as any,
            scaleX: 1,
            scaleY: 1,
            angle: 0,
            opacity: 1,
            shadow: false,
            selectable: true,
            moveable: true,
            resizable: true,
        };

        addText(newText);
    }

    return (
        <div className="space-y-4">
            {/* Style Templates */}
            <div className="space-y-2">
                <label className="block text-sm font-medium">Style Templates</label>
                <div className="space-y-1">
                    {styleTemplates.map((template) => (
                        <button
                            key={template.id}
                            onClick={() => {
                                setSelectedTemplate(template.id);
                                handleAddText(template);
                            }}
                            className={`w-full p-3 rounded-md border text-left transition-colors ${selectedTemplate === template.id
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:bg-muted/50'
                                }`}
                        >
                            <div className="font-medium text-sm">{template.name}</div>
                            <div
                                className="text-xs mt-1 font-mono"
                                style={{
                                    color: template.style.color,
                                    fontSize: "12px",
                                    fontWeight: template.style.fontWeight
                                }}
                            >
                                {template.preview}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Font Selection */}
            <div className="space-y-2">
                <label className="block text-sm font-medium">Font Family</label>
                <select
                    value={selectedFont}
                    onChange={(e) => setSelectedFont(e.target.value)}
                    className="w-full h-9 rounded-md border bg-background px-2 text-sm"
                >
                    {fonts.map((font) => (
                        <option key={font} value={font} style={{ fontFamily: font }}>
                            {font}
                        </option>
                    ))}
                </select>
            </div>

            {/* Animation Options */}
            <div className="space-y-2">
                <label className="block text-sm font-medium">Animation</label>
                <div className="grid grid-cols-2 gap-1">
                    {animations.map((anim) => (
                        <button
                            key={anim.id}
                            onClick={() => setSelectedAnimation(anim.id)}
                            className={`p-2 rounded text-xs transition-colors ${selectedAnimation === anim.id
                                ? 'bg-primary text-background'
                                : 'bg-muted hover:bg-muted/70'
                                }`}
                        >
                            <div className="font-medium">{anim.name}</div>
                            <div className="text-xs opacity-70">{anim.preview}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Brand Kit Area */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium">Brand Kit</label>
                    <button
                        onClick={() => setShowBrandKit(!showBrandKit)}
                        className="text-xs text-primary hover:underline"
                    >
                        {showBrandKit ? 'Hide' : 'Show'}
                    </button>
                </div>

                {showBrandKit && (
                    <div className="space-y-3 p-3 border rounded-md bg-muted/20">
                        <div>
                            <div className="text-xs font-medium mb-2">Brand Colors</div>
                            <div className="grid grid-cols-5 gap-1">
                                {brandColors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setCustomColor(color)}
                                        className={`w-8 h-8 rounded border-2 transition-all ${customColor === color ? 'border-primary scale-110' : 'border-border'
                                            }`}
                                        style={{ backgroundColor: color }}
                                        title={color}
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="text-xs font-medium mb-2">Custom Color</div>
                            <input
                                type="color"
                                value={customColor}
                                onChange={(e) => setCustomColor(e.target.value)}
                                className="w-full h-8 rounded border bg-background cursor-pointer"
                            />
                        </div>

                        <button
                            onClick={() => {
                                // Save to brand kit logic would go here
                                alert("Style saved to brand kit!");
                            }}
                            className="w-full h-8 rounded border text-xs hover:bg-muted/50 transition-colors"
                        >
                            + Save Current Style to Brand Kit
                        </button>
                    </div>
                )}
            </div>

            {/* Add Text Button */}
            <button
                onClick={() => handleAddText()}
                className="w-full h-10 rounded-md bg-primary text-background text-sm font-medium hover:opacity-80 transition-opacity flex items-center justify-center gap-2"
            >
                <span className="text-lg">+</span>
                Add Text Overlay
            </button>

            <div className="text-xs text-center text-muted-foreground">
                Drag text on video to reposition • Style with controls above
            </div>
        </div>
    );
}
