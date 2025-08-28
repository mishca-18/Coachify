"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { format, isValid } from "date-fns";

export default function PerformanceChart({ assessments }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    console.log("Received assessments:", assessments); // Debug input data
    if (assessments && Array.isArray(assessments) && assessments.length > 0) {
      const formattedData = assessments
        .map((assessment, index) => {
          try {
            // Validate quizScore
            const score = Number(assessment.quizScore);
            if (isNaN(score) || score < 0 || score > 100) {
              console.warn(`Invalid quizScore for assessment ${index}:`, assessment.quizScore);
              return null;
            }

            // Validate and format date
            const dateObj = new Date(assessment.createdAt);
            const formattedDate = isValid(dateObj)
              ? format(dateObj, "MMM dd")
              : `Quiz ${index + 1}`;

            return {
              date: formattedDate,
              score: score,
            };
          } catch (error) {
            console.error(`Error processing assessment ${index}:`, assessment, error);
            return null;
          }
        })
        .filter((item) => item !== null); // Remove invalid entries

      console.log("Formatted chartData:", formattedData); // Debug output data
      setChartData(formattedData);
    } else {
      console.warn("No valid assessments provided:", assessments);
      setChartData([]);
    }
  }, [assessments]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="gradient-title text-3xl md:text-4xl">
          Performance Trend
        </CardTitle>
        <CardDescription>Your quiz scores over time</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No valid quiz data available. Take a quiz to see your performance trend!
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  interval={chartData.length > 10 ? "preserveStartEnd" : 0}
                  label={{
                    value: "Date",
                    position: "insideBottom",
                    offset: -5,
                    fontSize: 14,
                  }}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${value}%`}
                  label={{
                    value: "Score (%)",
                    angle: -90,
                    position: "insideLeft",
                    offset: 10,
                    fontSize: 14,
                  }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload?.length) {
                      return (
                        <div className="bg-background border rounded-lg p-2 shadow-md">
                          <p className="text-sm font-medium">
                            Score: {payload[0].value}%
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {payload[0].payload.date}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="white"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}