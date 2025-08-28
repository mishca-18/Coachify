"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateCoverLetter } from "@/actions/cover-letter";
import useFetch from "@/hooks/use-fetch";
import { coverLetterSchema } from "@/app/lib/schema";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CoverLetterGenerator() {
  const router = useRouter();
  const [formError, setFormError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(coverLetterSchema),
    defaultValues: {
      companyName: "",
      jobTitle: "",
      jobDescription: "",
    },
  });

  const { loading: generating, fn: generateLetterFn, data: generatedLetter, error } =
    useFetch(generateCoverLetter);

  const jobDescription = watch("jobDescription");

  useEffect(() => {
    if (generatedLetter) {
      console.log("CoverLetterGenerator: Success, generated letter ID:", generatedLetter.id);
      toast.success("Cover letter generated successfully!");
      router.push(`/ai-cover-letter/${generatedLetter.id}`);
      reset();
      setFormError(null);
      setIsLoading(false);
    }
    if (error) {
      console.error("CoverLetterGenerator: Error:", error.message, error.stack);
      let errorMessage = "Failed to generate cover letter";
      if (error.message.includes("Unauthorized")) {
        errorMessage = "Please log in to generate a cover letter";
      } else if (error.message.includes("Gemini API")) {
        errorMessage = "AI service error. Please try again later.";
      } else if (error.message.includes("prisma")) {
        errorMessage = "Database error: " + error.message;
      } else {
        errorMessage = `Generation failed: ${error.message}`;
      }
      toast.error(errorMessage);
      setFormError(errorMessage);
      setIsLoading(false);
    }
  }, [generatedLetter, error, router, reset]);

  const onSubmit = async (data) => {
    console.log("CoverLetterGenerator: Submitting form with data:", data);
    setFormError(null);
    setIsLoading(true);
    try {
      await generateLetterFn(data);
    } catch (err) {
      console.error("CoverLetterGenerator: Submission error:", err.message, err.stack);
      setFormError(err.message || "Failed to generate cover letter");
      toast.error(err.message || "Failed to generate cover letter");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>
            Provide information about the position you're applying for
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="text-sm text-gray-500 p-2 bg-gray-50 rounded" aria-live="polite">
              Generating cover letter, please wait...
            </div>
          )}
          {formError && (
            <div className="text-sm text-red-500 p-2 bg-red-50 rounded" aria-live="polite">
              {formError}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="Enter company name (e.g., Meta)"
                  {...register("companyName")}
                />
                {errors.companyName && (
                  <p className="text-sm text-red-500" aria-live="polite">
                    {errors.companyName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  placeholder="Enter job title (e.g., Fullstack Engineer)"
                  {...register("jobTitle")}
                />
                {errors.jobTitle && (
                  <p className="text-sm text-red-500" aria-live="polite">
                    {errors.jobTitle.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobDescription">Job Description</Label>
              <Textarea
                id="jobDescription"
                placeholder="Paste the job description here (at least 10 characters)"
                className="h-32"
                {...register("jobDescription")}
              />
              {errors.jobDescription && (
                <p className="text-sm text-red-500" aria-live="polite">
                  {errors.jobDescription.message}
                </p>
              )}
              {jobDescription && jobDescription.length < 10 && (
                <p className="text-sm text-yellow-500" aria-live="polite">
                  Job description is too short (minimum 10 characters).
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={generating || isSubmitting || isLoading}
                aria-label="Generate cover letter"
              >
                {generating || isSubmitting || isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Cover Letter"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


