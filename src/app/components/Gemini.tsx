"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { marked } from "marked";
import { getFile } from "@/lib/utils";
import { useRecoilValue } from "recoil";

// Groq API configuration (free tier: 30 RPM, 14,400 RPD)
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY || "";

// Try multiple free models in order of preference
const MODELS_TO_TRY = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "mixtral-8x7b-32768",
];

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000; // Groq has generous limits, shorter retry

const SYSTEM_PROMPT = `You are a medical X-ray analysis assistant. Given a predicted class from an X-ray image classification model, provide a structured response in the following format:

Output: disease name
Severity: Severity based on predicted class
Explanation: Explanation of the disease in user-friendly language
Tips (optional):
[Tip 1] (Bullet point for maintaining healthy joints)
[Tip 2] (Bullet point for maintaining healthy joints)

Example 1 (Normal):
Input: Your X-ray shows no signs of osteoarthritis.
Output: Knee Osteoarthritis
Severity: Normal
Explanation: Knee osteoarthritis (OA) is a common condition, but your X-ray shows no significant signs of it. This means your knees are generally healthy.
Tips (optional): Maintain a healthy weight to avoid extra stress on your knees.
Exercise regularly with low-impact activities like walking or swimming to strengthen muscles and improve flexibility

Example 2 (Moderate):
Input: Your X-ray shows moderate signs of osteoarthritis.
Output: Knee Osteoarthritis
Severity: Moderate
Explanation: Your X-ray suggests moderate osteoarthritis (OA) in your knee. This means there's some wear and tear on the cartilage cushioning your joints.
Tips (optional):
Consult a doctor for a personalized evaluation and treatment plan.
Consider low-impact exercises like walking or swimming to maintain joint health.

Example 3 (Severe):
Input: Your X-ray shows severe signs of osteoarthritis.
Output: Knee Osteoarthritis
Severity: Severe
Explanation: Your X-ray indicates severe osteoarthritis (OA) in your knee. This means there's significant wear and tear on the cartilage, leading to bone-on-bone contact.
Tips (optional):
Seek medical attention for proper diagnosis and treatment options.
Consider assistive devices like a cane or walker to support mobility.

If predictedClass is Scoliosis and Scol_Normal do not include severity.`;

// Map numeric class IDs to descriptive labels for the AI
const CLASS_LABELS: Record<string | number, string> = {
  // Osteoarthritis classes (InceptionV3 model)
  0: "Your X-ray shows no signs of osteoarthritis. Classification: Normal",
  1: "Your X-ray shows doubtful signs of osteoarthritis. Classification: Doubtful",
  2: "Your X-ray shows mild signs of osteoarthritis. Classification: Mild",
  3: "Your X-ray shows moderate signs of osteoarthritis. Classification: Moderate",
  4: "Your X-ray shows severe signs of osteoarthritis. Classification: Severe",
  // Scoliosis classes
  "Scoliosis": "Your X-ray shows signs of Scoliosis",
  "Scol_Normal": "Your X-ray shows no signs of Scoliosis. Classification: Normal",
};

const Gemini = ({ predictedClass }) => {
  console.log("predictedClass:", predictedClass);

  const [aiResponse, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * AI Call to fetch text insights via Groq API
   */
  async function aiRun() {
    setLoading(true);
    setResponse("");
    setError("");

    // Convert numeric class ID to descriptive text
    const classLabel = CLASS_LABELS[predictedClass] ||
      CLASS_LABELS[Number(predictedClass)] ||
      String(predictedClass);
    console.log("Sending to AI:", classLabel);

    // Try each model, with retries for rate limiting
    for (const modelName of MODELS_TO_TRY) {
      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
          console.log(`Trying model: ${modelName} (attempt ${attempt + 1}/${MAX_RETRIES})`);

          const response = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
              model: modelName,
              messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: `Input: ${classLabel}` },
              ],
              temperature: 0,
              max_tokens: 2048,
            }),
          });

          if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(
              errData.error?.message || `HTTP ${response.status}`
            );
          }

          const data = await response.json();
          const text = data.choices[0]?.message?.content || "";

          const parsedText = await marked(text);
          console.log(parsedText);

          setResponse(parsedText);
          setLoading(false);
          return; // Success — exit the function
        } catch (err: any) {
          console.error(
            `Model ${modelName} attempt ${attempt + 1} failed:`,
            err.message
          );

          // If rate limited (429), wait and retry
          if (
            err.message?.includes("429") ||
            err.message?.toLowerCase()?.includes("rate")
          ) {
            if (attempt < MAX_RETRIES - 1) {
              setError(
                `Rate limited. Retrying in ${RETRY_DELAY_MS / 1000}s... (attempt ${attempt + 2}/${MAX_RETRIES})`
              );
              await new Promise((resolve) =>
                setTimeout(resolve, RETRY_DELAY_MS)
              );
              continue;
            }
          }

          // For non-429 errors or final retry, try next model
          break;
        }
      }
    }

    // All models and retries exhausted
    setLoading(false);
    setError(
      "⚠️ AI API quota exceeded for all models. Please wait a few minutes and refresh the page, or check your API key at https://console.groq.com"
    );
  }

  useEffect(() => {
    if (predictedClass !== undefined && predictedClass !== null && predictedClass !== "") {
      aiRun();
    }
  }, [predictedClass]);

  const file = useRecoilValue(getFile);

  return (
    <div className="h-full">
      {(predictedClass === undefined || predictedClass === null || predictedClass === "") && !loading && !aiResponse && (
        <p className="p-14 text-center">Waiting for prediction result...</p>
      )}
      {loading && <p className="p-14 text-center">{error || "Loading ..."}</p>}
      {!loading && error && (
        <div className="m-14 p-6 rounded-xl border-2 border-red-300 bg-red-50 text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => aiRun()}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      )}
      {aiResponse && (
        <>
          <div className="m-14 flex h-5/6 flex-row rounded-xl border-solid border-4">
            <div className="border w-1/2 p-5 flex justify-center items-center rounded-l-lg bg-gray-200 relative">
              <Image
                src={URL.createObjectURL(file)}
                // fill
                objectFit="contain"
                alt="User Image"
                width={413}
                height={463}
                placeholder="empty" // "empty" | "blur" | "data:image/..."
                className="overflow-hidden max-h-96 object-cover inset-0 rounded-xl border-solid border-2 border-slate-200"
              />
            </div>
            <div
              className="flex flex-col justify-center h-full w-1/2 rounded-r-lg p-5 bg-gray-200"
              dangerouslySetInnerHTML={{ __html: aiResponse }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Gemini;
