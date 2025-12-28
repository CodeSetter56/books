"use client";

import { Page } from "react-pdf";

interface PdfCardProps {
  pageNumber: number;
  onClick: (page: number) => void;
}

export const PdfCard = ({ pageNumber, onClick }: PdfCardProps) => (
  <div
    className="cursor-pointer group flex flex-col items-center"
    onClick={() => onClick(pageNumber)}
  >
    <div className="w-fit bg-white rounded shadow-sm border border-transparent transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 overflow-hidden">
      <Page
        pageNumber={pageNumber}
        width={250}
        renderTextLayer={false}
        renderAnnotationLayer={false}
      />
    </div>
    <p className="text-center text-sm font-bold mt-2 text-foreground/70">
      Page {pageNumber}
    </p>
  </div>
);
