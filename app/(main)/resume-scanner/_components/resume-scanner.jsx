"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MDEditor from "@uiw/react-md-editor";
import { Loader2 } from "lucide-react";
import { scanResume } from "@/actions/resume-scanner";

export default function ResumeScanner() {
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback("");

    const file = e.target.resume.files[0];
    if (!file) {
      toast.error("Please upload a PDF resume.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const result = await scanResume(formData);
      setFeedback(result.feedback);
      toast.success("Resume analyzed successfully!");
    } catch (error) {
      console.error("ResumeScanner: Error:", error.message);
      toast.error(error.message || "Failed to analyze resume");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-row gap-6 max-w-4xl mx-auto sm:flex-col p-4 md:p-6">
      <form onSubmit={handleUpload} className="flex flex-row items-center gap-4 flex-1">
        <div className="space-y-2 flex-1">
          <label htmlFor="resume" className="block text-sm font-medium text-gray-700">
            Upload Resume (PDF only)
          </label>
          <Input
            id="resume"
            name="resume"
            type="file"
            accept="application/pdf"
            className="w-full cursor-pointer"
            aria-label="Upload resume PDF"
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          aria-label="Analyze resume"
          className="self-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze Resume"
          )}
        </Button>
      </form>

      {feedback && (
        <div data-color-mode="light" className="flex-1">
          <h2 className="text-lg font-semibold mb-4">Feedback</h2>
          <MDEditor value={feedback} preview="preview" hideToolbar={true} height={400} className="w-full" />
        </div>
      )}
    </div>
  );
}