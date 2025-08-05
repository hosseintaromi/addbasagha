// API service functions for video editing features

export interface TranscriptionResult {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  confidence: number;
}

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface DubbingResult {
  audioUrl: string;
  duration: number;
  text: string;
  language: string;
}

// Auto-transcription API
export async function transcribeAudio(
  audioFile: File | string,
  options: {
    language?: string;
    model?: "whisper-1" | "whisper-large" | "base";
    temperature?: number;
  } = {}
): Promise<TranscriptionResult[]> {
  try {
    const formData = new FormData();

    if (typeof audioFile === "string") {
      // If URL provided, fetch and convert to file
      const response = await fetch(audioFile);
      const blob = await response.blob();
      formData.append("audio", blob, "audio.mp3");
    } else {
      formData.append("audio", audioFile);
    }

    formData.append("language", options.language || "auto");
    formData.append("model", options.model || "whisper-1");
    formData.append("temperature", (options.temperature || 0.3).toString());

    const response = await fetch("/api/auto-subtitle", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Transcription failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.segments || [];
  } catch (error) {
    console.error("Transcription error:", error);
    // Return mock data for development
    return generateMockTranscription();
  }
}

// Translation API
export async function translateText(
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<TranslationResult> {
  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        sourceLanguage,
        targetLanguage,
      }),
    });

    if (!response.ok) {
      throw new Error(`Translation failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Translation error:", error);
    // Return mock translation for development
    return {
      originalText: text,
      translatedText: getMockTranslation(text, targetLanguage),
      sourceLanguage,
      targetLanguage,
    };
  }
}

// Dubbing/TTS API
export async function generateDubbing(
  text: string,
  options: {
    language?: string;
    voice?: string;
    speed?: number;
    pitch?: number;
  } = {}
): Promise<DubbingResult> {
  try {
    const response = await fetch("/api/translate-dub", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        language: options.language || "en",
        voice: options.voice || "default",
        speed: options.speed || 1.0,
        pitch: options.pitch || 1.0,
      }),
    });

    if (!response.ok) {
      throw new Error(`Dubbing failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Dubbing error:", error);
    // Return mock dubbing result for development
    return {
      audioUrl: "/api/mock-audio.mp3",
      duration: text.length * 0.1, // Rough estimate
      text,
      language: options.language || "en",
    };
  }
}

// Batch translation for multiple subtitles
export async function translateSubtitles(
  subtitles: TranscriptionResult[],
  sourceLanguage: string,
  targetLanguage: string
): Promise<TranscriptionResult[]> {
  const translatedSubtitles = [];

  for (const subtitle of subtitles) {
    try {
      const translation = await translateText(
        subtitle.text,
        sourceLanguage,
        targetLanguage
      );

      translatedSubtitles.push({
        ...subtitle,
        text: translation.translatedText,
      });

      // Add small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Failed to translate subtitle: ${subtitle.text}`, error);
      // Keep original text if translation fails
      translatedSubtitles.push(subtitle);
    }
  }

  return translatedSubtitles;
}

// Generate dubbing for multiple subtitles
export async function generateSubtitleDubbing(
  subtitles: TranscriptionResult[],
  options: {
    language?: string;
    voice?: string;
    speed?: number;
    pitch?: number;
  } = {}
): Promise<{ subtitle: TranscriptionResult; dubbing: DubbingResult }[]> {
  const dubbingResults = [];

  for (const subtitle of subtitles) {
    try {
      const dubbing = await generateDubbing(subtitle.text, options);

      dubbingResults.push({
        subtitle,
        dubbing,
      });

      // Add delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`Failed to generate dubbing for: ${subtitle.text}`, error);
    }
  }

  return dubbingResults;
}

// Mock data generators for development
function generateMockTranscription(): TranscriptionResult[] {
  return [
    {
      id: "1",
      text: "Welcome to our video editing platform",
      startTime: 0,
      endTime: 3,
      confidence: 0.95,
    },
    {
      id: "2",
      text: "You can easily add subtitles and text overlays",
      startTime: 3,
      endTime: 7,
      confidence: 0.92,
    },
    {
      id: "3",
      text: "Translation and dubbing features are also available",
      startTime: 7,
      endTime: 11,
      confidence: 0.88,
    },
  ];
}

function getMockTranslation(text: string, targetLanguage: string): string {
  const translations: Record<string, Record<string, string>> = {
    fa: {
      "Welcome to our video editing platform":
        "به پلتفرم ویرایش ویدیوی ما خوش آمدید",
      "You can easily add subtitles and text overlays":
        "می‌توانید به راحتی زیرنویس و متن اضافه کنید",
      "Translation and dubbing features are also available":
        "امکانات ترجمه و دوبلاژ نیز در دسترس است",
      "Hello world": "سلام دنیا",
      "How are you?": "چطوری؟",
      "Thank you": "متشکرم",
    },
    ar: {
      "Welcome to our video editing platform":
        "مرحباً بمنصة تحرير الفيديو الخاصة بنا",
      "You can easily add subtitles and text overlays":
        "يمكنك بسهولة إضافة ترجمات ونصوص",
      "Translation and dubbing features are also available":
        "ميزات الترجمة والدبلجة متاحة أيضاً",
    },
    fr: {
      "Welcome to our video editing platform":
        "Bienvenue sur notre plateforme d'édition vidéo",
      "You can easily add subtitles and text overlays":
        "Vous pouvez facilement ajouter des sous-titres et du texte",
      "Translation and dubbing features are also available":
        "Les fonctionnalités de traduction et de doublage sont également disponibles",
    },
  };

  return translations[targetLanguage]?.[text] || `[${targetLanguage}] ${text}`;
}

// Language detection helper
export async function detectLanguage(text: string): Promise<string> {
  try {
    const response = await fetch("/api/detect-language", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error("Language detection failed");
    }

    const result = await response.json();
    return result.language || "en";
  } catch (error) {
    console.error("Language detection error:", error);
    // Simple heuristic for Persian text
    if (/[\u0600-\u06FF]/.test(text)) {
      return "fa";
    }
    return "en";
  }
}

// Supported languages
export const SUPPORTED_LANGUAGES = {
  en: "English",
  fa: "فارسی",
  ar: "العربية",
  fr: "Français",
  es: "Español",
  de: "Deutsch",
  it: "Italiano",
  pt: "Português",
  ru: "Русский",
  zh: "中文",
  ja: "日本語",
  ko: "한국어",
};

// Voice options for dubbing
export const VOICE_OPTIONS = {
  en: [
    { id: "en-US-male", name: "English (US) - Male" },
    { id: "en-US-female", name: "English (US) - Female" },
    { id: "en-GB-male", name: "English (UK) - Male" },
    { id: "en-GB-female", name: "English (UK) - Female" },
  ],
  fa: [
    { id: "fa-IR-male", name: "فارسی - مرد" },
    { id: "fa-IR-female", name: "فارسی - زن" },
  ],
  ar: [
    { id: "ar-SA-male", name: "العربية - ذكر" },
    { id: "ar-SA-female", name: "العربية - أنثى" },
  ],
};
