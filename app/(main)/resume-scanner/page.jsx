import ResumeScannerCamera from "./_components/resume-camera";
import ResumeScanner from "./_components/resume-scanner";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ResumeScannerPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold gradient-title mb-4">
          Resume Scanner
        </h1>
        <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
          Upload your resume or use your camera to get AI-powered feedback on improvements tailored for your job application.
        </p>
      </div>
      <Tabs defaultValue="upload" className="w-full max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 mb-4 gap-2">
          <TabsTrigger value="upload" className="text-sm">Upload PDF</TabsTrigger>
          <TabsTrigger value="camera" className="text-sm">Use Camera</TabsTrigger>
        </TabsList>
        <TabsContent value="upload" className="p-4 bg-neutral-600 rounded-lg shadow-sm">
          <ResumeScanner />
        </TabsContent>
        <TabsContent value="camera" className="p-4 bg-white rounded-lg shadow-sm">
          <ResumeScannerCamera />
        </TabsContent>
      </Tabs>
    </div>
  );
}