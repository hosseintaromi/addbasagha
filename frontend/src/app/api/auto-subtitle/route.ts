import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;
    const language = (formData.get("language") as string) || "auto";
    const model = (formData.get("model") as string) || "whisper-1";
    const temperature = parseFloat(
      (formData.get("temperature") as string) || "0.3"
    );

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    // TODO: Integrate with actual transcription service (OpenAI Whisper, AssemblyAI, etc.)
    // For now, return enhanced mock data
    const mockSegments = generateMockTranscription(audioFile.name, language);

    return NextResponse.json({
      segments: mockSegments,
      metadata: {
        model,
        language,
        temperature,
        duration: 15, // mock duration
        fileSize: audioFile.size,
      },
    });
  } catch (error) {
    console.error("Auto-subtitle error:", error);
    return NextResponse.json(
      { error: "Failed to process audio file" },
      { status: 500 }
    );
  }
}

function generateMockTranscription(filename: string, language: string) {
  const segments = [
    {
      id: "1",
      text:
        language === "fa" ? "به عباس‌آقا خوش آمدید" : "Welcome to Abbasagha",
      startTime: 0,
      endTime: 3,
      confidence: 0.95,
    },
    {
      id: "2",
      text:
        language === "fa"
          ? "پلتفرم ویرایش ویدیوی حرفه‌ای"
          : "Professional video editing platform",
      startTime: 3,
      endTime: 6,
      confidence: 0.92,
    },
    {
      id: "3",
      text:
        language === "fa"
          ? "با امکانات زیرنویس خودکار"
          : "With automatic subtitle features",
      startTime: 6,
      endTime: 9,
      confidence: 0.88,
    },
    {
      id: "4",
      text:
        language === "fa"
          ? "و ترجمه هوشمند متن‌ها"
          : "And intelligent text translation",
      startTime: 9,
      endTime: 12,
      confidence: 0.9,
    },
    {
      id: "5",
      text: language === "fa" ? "همین حالا شروع کنید!" : "Get started now!",
      startTime: 12,
      endTime: 15,
      confidence: 0.93,
    },
  ];

  return segments;
}
