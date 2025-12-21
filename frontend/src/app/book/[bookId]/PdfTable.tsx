// codesetter56/books/books-ce91c92da01eb2e7b923e09be8526d9ec58b11e6/frontend/src/app/book/[bookId]/PdfTable.tsx

"use client";

import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import PageSkeleton from "@/components/Skeletons/PageSkeleton";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const PdfTable = ({ fileUrl }: { fileUrl: string }) => {
  const [numPages, setNumPages] = useState<number>();
  const [selectedPage, setSelectedPage] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function handleResize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedPage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedPage]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const closeModal = () => {
    setSelectedPage(null);
    setIsZoomed(false);
  };

  const toggleZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="w-full">
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<PageSkeleton />}
        error={
          <div className="text-red-500 text-center p-10">
            Failed to load PDF.
          </div>
        }
        className="flex justify-center"
      >
        {numPages && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            {Array.from(new Array(numPages), (el, index) => (
              <div
                key={`page_${index + 1}`}
                className="flex flex-col items-center bg-text-muted dark:bg-secondary border border-border rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-primary"
                onClick={() => setSelectedPage(index + 1)}
              >
                <Page
                  pageNumber={index + 1}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  width={250}
                  className="mb-2 pointer-events-none"
                />
                <span className="text-sm text-text-muted font-medium select-none">
                  Page {index + 1}
                </span>
              </div>
            ))}
          </div>
        )}

        {selectedPage && (
          <div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
            onClick={closeModal}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="fixed top-6 right-6 z-[60] text-white bg-black/50 hover:bg-red-500 rounded-full w-12 h-12 flex items-center justify-center font-bold backdrop-blur-sm transition-colors"
            >
              ✕
            </button>

            <div
              className={`relative bg-black shadow-2xl transition-all duration-300 flex flex-col items-center
                ${
                  isZoomed
                    ? "w-full h-full overflow-auto p-8"
                    : "rounded-lg overflow-hidden p-2"
                }
              `}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`${isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"}`}
                onClick={toggleZoom}
              >
                <Page
                  pageNumber={selectedPage}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  height={!isZoomed ? windowSize.height - 180 : undefined}
                  width={isZoomed ? undefined : undefined}
                  className="shadow-lg"
                />
              </div>

              {/* Page Indicator moved below the PDF */}
              <div className="mt-4 px-6 py-2 bg-primary text-white text-sm font-bold rounded-full select-none shadow-md">
                Page {selectedPage} of {numPages}{" "}
              </div>
            </div>
          </div>
        )}
      </Document>
    </div>
  );
};
