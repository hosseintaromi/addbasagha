import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Simple language detection logic
    let detectedLanguage = "en";
    let confidence = 0.7;

    // Persian/Farsi detection
    if (/[\u0600-\u06FF]/.test(text)) {
      detectedLanguage = "fa";
      confidence = 0.95;
    }
    // Arabic detection
    else if (/[\u0621-\u064A]/.test(text)) {
      detectedLanguage = "ar";
      confidence = 0.9;
    }
    // Chinese detection
    else if (/[\u4e00-\u9fff]/.test(text)) {
      detectedLanguage = "zh";
      confidence = 0.95;
    }
    // Japanese detection
    else if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) {
      detectedLanguage = "ja";
      confidence = 0.9;
    }
    // Korean detection
    else if (/[\uac00-\ud7af]/.test(text)) {
      detectedLanguage = "ko";
      confidence = 0.9;
    }
    // Spanish detection (basic)
    else if (
      /\b(el|la|los|las|es|está|son|con|por|para|en|de|que|y|o|pero|no|sí)\b/i.test(
        text
      )
    ) {
      detectedLanguage = "es";
      confidence = 0.75;
    }
    // French detection (basic)
    else if (
      /\b(le|la|les|est|sont|avec|pour|dans|de|que|et|ou|mais|non|oui)\b/i.test(
        text
      )
    ) {
      detectedLanguage = "fr";
      confidence = 0.75;
    }
    // German detection (basic)
    else if (
      /\b(der|die|das|ist|sind|mit|für|in|von|dass|und|oder|aber|nicht|ja)\b/i.test(
        text
      )
    ) {
      detectedLanguage = "de";
      confidence = 0.75;
    }
    // Italian detection (basic)
    else if (
      /\b(il|la|i|le|è|sono|con|per|in|di|che|e|o|ma|no|sì)\b/i.test(text)
    ) {
      detectedLanguage = "it";
      confidence = 0.75;
    }
    // Portuguese detection (basic)
    else if (
      /\b(o|a|os|as|é|são|com|para|em|de|que|e|ou|mas|não|sim)\b/i.test(text)
    ) {
      detectedLanguage = "pt";
      confidence = 0.75;
    }
    // Russian detection (basic)
    else if (/[\u0400-\u04FF]/.test(text)) {
      detectedLanguage = "ru";
      confidence = 0.9;
    }

    // TODO: Integrate with actual language detection service for better accuracy

    return NextResponse.json({
      language: detectedLanguage,
      confidence,
      text: text.substring(0, 100), // Return first 100 chars for reference
      detectedBy: "abbasagha-lang-detect",
    });
  } catch (error) {
    console.error("Language detection error:", error);
    return NextResponse.json(
      { error: "Language detection failed" },
      { status: 500 }
    );
  }
}
