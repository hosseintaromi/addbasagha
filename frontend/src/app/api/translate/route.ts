import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text, sourceLanguage, targetLanguage } = await req.json();

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: "Text and target language are required" },
        { status: 400 }
      );
    }

    // TODO: Integrate with actual translation service (Google Translate, DeepL, etc.)
    // For now, use the translate-dub API with translate action
    const translationResponse = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/translate-dub`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          language: targetLanguage,
          action: "translate",
        }),
      }
    );

    if (!translationResponse.ok) {
      throw new Error("Translation service failed");
    }

    const result = await translationResponse.json();

    return NextResponse.json({
      originalText: text,
      translatedText: result.translatedText,
      sourceLanguage: sourceLanguage || "auto",
      targetLanguage,
      confidence: result.confidence || 0.9,
      service: "abbasagha-translate",
    });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
