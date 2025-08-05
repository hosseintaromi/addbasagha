import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const text = url.searchParams.get("text") || "Hello world";
  const language = url.searchParams.get("lang") || "en";
  const voice = url.searchParams.get("voice") || "default";

  // Generate a simple mock audio response
  // In a real implementation, this would return actual audio data

  const mockAudioData = generateMockAudioBuffer(text, language);

  return new NextResponse(mockAudioData, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Length": mockAudioData.length.toString(),
      "Cache-Control": "public, max-age=3600",
      "Content-Disposition": `attachment; filename="tts-${language}-${Date.now()}.mp3"`,
    },
  });
}

function generateMockAudioBuffer(text: string, language: string): Buffer {
  // This is a mock implementation that generates a minimal MP3-like buffer
  // In a real implementation, you would:
  // 1. Use a TTS service like ElevenLabs, Azure Speech, or Google TTS
  // 2. Return the actual audio data

  const duration = Math.max(1, text.length * 0.08); // Rough duration estimate
  const sampleRate = 44100;
  const samples = Math.floor(duration * sampleRate);

  // Create a simple sine wave audio buffer (for demonstration)
  const buffer = Buffer.alloc(samples * 2); // 16-bit audio

  for (let i = 0; i < samples; i++) {
    const frequency = language === "fa" ? 200 : 440; // Different frequency for Persian
    const amplitude = 0.3;
    const sample =
      Math.sin((2 * Math.PI * frequency * i) / sampleRate) * amplitude;
    const intSample = Math.floor(sample * 32767);

    buffer.writeInt16LE(intSample, i * 2);
  }

  // Add minimal MP3 header (this is a very simplified mock)
  const mp3Header = Buffer.from([
    0xff,
    0xfb,
    0x90,
    0x00, // MP3 sync word and header
    0x00,
    0x00,
    0x00,
    0x00, // Additional header bytes
  ]);

  return Buffer.concat([mp3Header, buffer]);
}

// Alternative endpoint for audio metadata
export async function POST(req: NextRequest) {
  try {
    const { text, language, voice, settings } = await req.json();

    const estimatedDuration = text.length * 0.08;
    const estimatedSize = estimatedDuration * 16000; // Rough file size estimate

    return NextResponse.json({
      url: `/api/mock-audio?text=${encodeURIComponent(
        text
      )}&lang=${language}&voice=${voice}`,
      duration: estimatedDuration,
      size: estimatedSize,
      format: "mp3",
      metadata: {
        text,
        language,
        voice,
        settings,
        generated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Mock audio generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate audio metadata" },
      { status: 500 }
    );
  }
}
