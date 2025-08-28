"use client";

import MDEditor from "@uiw/react-md-editor";

const CoverLetterPreview = ({ content }) => {
  return (
    <div className="py-4">
      {content ? (
        <MDEditor
          value={content}
          preview="preview"
          height="100%"
          className="min-h-[400px] max-h-[80vh]"
          aria-label="Cover letter preview"
        />
      ) : (
        <div className="text-muted-foreground text-center py-4">
          No cover letter content available
        </div>
      )}
    </div>
  );
};

export default CoverLetterPreview;


