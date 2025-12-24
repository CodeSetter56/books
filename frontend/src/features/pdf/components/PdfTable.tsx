// src/features/pdf/components/PdfTable.tsx
"use client";

import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import PageSkeleton from "@/components/Skeletons/PageSkeleton";
import { PdfModal } from "./PdfModal";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const PdfTable = ({ fileUrl }: { fileUrl: string }) => {
  const [numPages, setNumPages] = useState<number>();
  const [selectedPage, setSelectedPage] = useState<number | null>(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function handleResize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedPage ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [selectedPage]);

  return (
    <div className="w-full">
      <Document
        file={fileUrl}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        loading={<PageSkeleton />}
        error={<div className="text-red-500 text-center p-10 font-bold">Failed to load PDF document.</div>}
        className="flex flex-col items-center"
      >
        {numPages && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            {Array.from(new Array(numPages), (_, index) => (
              <div
                key={`page_${index + 1}`}
                className="flex flex-col items-center bg-secondary border border-border rounded-lg p-2 shadow-sm hover:border-primary cursor-pointer group transition-all"
                onClick={() => setSelectedPage(index + 1)}
              >
                <div className="w-full overflow-hidden rounded shadow-inner bg-white">
                  <Page
                    pageNumber={index + 1}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    width={windowSize.width < 640 ? windowSize.width - 60 : 250}
                    className="mb-2 pointer-events-none group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="text-sm text-text-muted font-bold py-2 group-hover:text-primary transition-colors">
                  Page {index + 1}
                </span>
              </div>
            ))}
          </div>
        )}

        {selectedPage && (
          <PdfModal
            selectedPage={selectedPage}
            numPages={numPages || 0}
            onClose={() => setSelectedPage(null)}
            windowSize={windowSize}
          />
        )}
      </Document>
    </div>
  );
};