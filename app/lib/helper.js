// app/lib/helper.js
export function entriesToMarkdown(entries, type) {
  if (!entries?.length) return "";

  return (
    `## ${type}\n\n` +
    entries
      .map((entry) => {
        const dateRange = entry.current
          ? `${entry.startDate} - Present`
          : `${entry.startDate} - ${entry.endDate}`;
        // Format description as XYZ: "Accomplished [X] as measured by [Y], by doing [Z]."
        const formattedDescription = entry.description
          ? `- Accomplished ${entry.description}`
          : "- No accomplishments provided.";
        return `### ${entry.title || "Untitled"} @ ${entry.organization || "N/A"}\n${dateRange}\n\n${formattedDescription}`;
      })
      .join("\n\n")
  );
}