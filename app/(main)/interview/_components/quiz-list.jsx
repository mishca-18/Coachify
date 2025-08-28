"use client";

import { useState } from "react";
import { format, isValid } from "date-fns";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import QuizResult from "./quiz-result";

export default function QuizList({ assessments }) {
  const router = useRouter();
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  // Parse and format date safely
  const formatDate = (date, index) => {
    try {
      const dateObj = date ? new Date(date) : new Date(); // Fallback to current date
      if (!isValid(dateObj)) {
        console.warn(`Invalid date for assessment ${index}:`, date);
        return format(new Date(), "MMMM dd, yyyy HH:mm"); // Use current date
      }
      const formatted = format(dateObj, "MMMM dd, yyyy HH:mm");
      console.log(`Formatted date for assessment ${index}:`, formatted);
      return formatted;
    } catch (error) {
      console.error(`Error formatting date for assessment ${index}:`, error);
      return format(new Date(), "MMMM dd, yyyy HH:mm"); // Use current date
    }
  };

  // Debug assessments
  console.log("Received assessments:", assessments);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="gradient-title text-3xl md:text-4xl">
              Recent Quizzes
            </CardTitle>
            <CardDescription>
              Review your past quiz performance
            </CardDescription>
          </div>
          <Button onClick={() => router.push("/interview/mock")}>
            Start New Quiz
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {(!assessments || !Array.isArray(assessments) || assessments.length === 0) ? (
          <div className="text-center text-muted-foreground py-4">
            No quizzes taken yet. Start a new quiz to track your performance!
          </div>
        ) : (
          <div className="space-y-4">
            {assessments.map((assessment, i) => (
              <Card
                key={assessment.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedQuiz(assessment)}
              >
                <CardHeader>
                  <CardTitle className="gradient-title text-2xl">
                    Quiz {i + 1}
                  </CardTitle>
                  <CardDescription className="flex justify-between w-full text-foreground">
                    <div>Score: {Number(assessment.quizScore).toFixed(1)}%</div>
                    <div>{formatDate(assessment.createdAt, i)}</div>
                  </CardDescription>
                </CardHeader>
                {assessment.improvementTip && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {assessment.improvementTip}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={!!selectedQuiz} onOpenChange={() => setSelectedQuiz(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <QuizResult
            result={selectedQuiz}
            hideStartNew
            onStartNew={() => router.push("/interview/mock")}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}

