"use client";

import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Configure worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const PdfTable = ({ fileUrl }: { fileUrl: string }) => {
  const [numPages, setNumPages] = useState<number>();
  const [selectedPage, setSelectedPage] = useState<number | null>(null);

  // New state to track zoom toggle
  const [isZoomed, setIsZoomed] = useState(false);

  // Store window dimensions to calculate "Fit to Screen"
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Update window size on mount/resize
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Set initial size
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const closeModal = () => {
    setSelectedPage(null);
    setIsZoomed(false); // Reset zoom when closing
  };

  const toggleZoom = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent closing the modal
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="w-full">
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<div className="text-center p-10">Loading PDF...</div>}
        error={
          <div className="text-red-500 text-center p-10">
            Failed to load PDF.
          </div>
        }
        className="flex justify-center"
      >
        {/* 1. GRID VIEW (Unchanged) */}
        {numPages && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            {Array.from(new Array(numPages), (el, index) => (
              <div
                key={`page_${index + 1}`}
                className="flex flex-col items-center bg-gray-50 border rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:ring-2 hover:ring-blue-400"
                onClick={() => setSelectedPage(index + 1)}
              >
                <Page
                  pageNumber={index + 1}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  width={250}
                  className="mb-2 pointer-events-none"
                />
                <span className="text-sm text-gray-500 font-medium select-none">
                  Page {index + 1}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* 2. FULLSCREEN MODAL */}
        {selectedPage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200"
            onClick={closeModal}
          >
            {/* Container for the Page:
               - If zoomed: allow scrolling (overflow-auto) and align top
               - If fit: center everything (items-center) and hide overflow
            */}
            <div
              className={`relative bg-white shadow-2xl transition-all duration-300 ease-in-out
                ${
                  isZoomed
                    ? "w-full h-full overflow-auto p-4 flex justify-center items-start"
                    : "rounded-lg overflow-hidden flex items-center justify-center"
                }
              `}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-20 text-white bg-black/50 hover:bg-black/70 rounded-full w-10 h-10 flex items-center justify-center font-bold backdrop-blur-sm"
              >
                ✕
              </button>

              <div
                className={`transition-all duration-300 ${
                  isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
                }`}
                onClick={toggleZoom}
              >
                <Page
                  pageNumber={selectedPage}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  // LOGIC:
                  // If NOT zoomed: Height = Window Height - 100px (padding)
                  // If Zoomed: Width = Window Width - 50px (fills width, forces scroll)
                  height={!isZoomed ? windowSize.height - 80 : undefined}
                  width={isZoomed ? windowSize.width - 40 : undefined}
                />
              </div>

              {/* Floating Page Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/70 text-white text-sm rounded-full backdrop-blur-sm pointer-events-none">
                Page {selectedPage} {isZoomed ? "(Zoomed)" : "(Fit)"}
              </div>
            </div>
          </div>
        )}
      </Document>
    </div>
  );
};
