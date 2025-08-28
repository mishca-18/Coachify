"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import MDEditor from "@uiw/react-md-editor";
import { Loader2 } from "lucide-react";
import Tesseract from "tesseract.js";

export default function ResumeScannerCamera() {
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      toast.error("Failed to access camera: " + error.message);
    }
  };

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsLoading(true);
    setFeedback("");

    const context = canvasRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    const imageData = canvasRef.current.toDataURL("image/png");

    try {
      const { data: { text } } = await Tesseract.recognize(imageData, "eng");
      const response = await fetch("/api/resume-camera", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: text }),
      });

      if (!response.ok) throw new Error("Failed to analyze resume");

      const { feedback } = await response.json();
      setFeedback(feedback);
      toast.success("Resume analyzed successfully!");
    } catch (error) {
      console.error("ResumeScannerCamera: Error:", error.message);
      toast.error(error.message || "Failed to analyze resume");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="block text-sm md:text-base font-medium text-gray-700">
          Scan Resume with Camera
        </label>
        <div className="flex justify-center bg-neutral-900 border rounded-2xl">
          <video ref={videoRef} autoPlay className="w-full max-w-md md:max-w-lg lg:max-w-xl rounded-lg shadow-sm" />
        </div>
        <canvas ref={canvasRef} width="640" height="480" className="hidden" />
        <div className="flex justify-center space-x-4">
          <Button onClick={startCamera} disabled={isLoading} aria-label="Start camera">
            Start Camera
          </Button>
          <Button onClick={captureImage} disabled={isLoading} aria-label="Capture and analyze">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Capture and Analyze"
            )}
          </Button>
        </div>
      </div>

      {feedback && (
        <div data-color-mode="light" className="mt-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Feedback</h2>
          <MDEditor value={feedback} preview="preview" hideToolbar={true} height={400} className="w-full" />
        </div>
      )}
    </div>
  );
}