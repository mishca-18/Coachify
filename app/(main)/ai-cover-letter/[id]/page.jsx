import Link from "next/link";
import { ArrowLeft, AlertCircle, AlertCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCoverLetter } from "@/actions/cover-letter";
import CoverLetterPreview from "../_components/cover-letter-preview";
import { Suspense } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


export default async function EditCoverLetterPage({ params }) {
  const { id } = await params;
  let coverLetter;
  let error = null;

  try {
    coverLetter = await getCoverLetter(id);
    if (!coverLetter) {
      throw new Error("Cover letter not found");
    }
  } catch (err) {
    console.error("EditCoverLetterPage: Error fetching cover letter:", err.message);
    error = err.message || "Failed to load cover letter";
  }

  if (error) {
    return (
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-2">
          <Link href="/ai-cover-letter">
            <Button variant="link" className="gap-2 pl-0" aria-label="Back to cover letters">
              <ArrowLeft className="h-4 w-4" />
              Back to Cover Letters
            </Button>
          </Link>
          <Alert variant="destructive">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-2">
        <Link href="/ai-cover-letter">
          <Button variant="link" className="gap-2 pl-0" aria-label="Back to cover letters">
            <ArrowLeft className="h-4 w-4" />
            Back to Cover Letters
          </Button>
        </Link>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold gradient-title mb-6">
          {coverLetter.jobTitle} at {coverLetter.companyName}
        </h1>
      </div>

      <Suspense fallback={<div className="text-center py-4">Loading preview...</div>}>
        <CoverLetterPreview content={coverLetter.content} />
      </Suspense>
    </div>
  );
}


