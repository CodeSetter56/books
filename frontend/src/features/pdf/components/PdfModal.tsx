"use client";

import { useState } from "react";
import { Page } from "react-pdf";

interface PdfModalProps {
  selectedPage: number;
  numPages: number;
  onClose: () => void;
  windowSize: { width: number; height: number };
}

export const PdfModal = ({
  selectedPage: initialPage,
  numPages,
  onClose,
  windowSize,
}: PdfModalProps) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isSideBySide, setIsSideBySide] = useState(false);

  // Calculate dynamic height
  const baseHeight = windowSize.height - 120;
  const zoomedHeight = windowSize.height * 1.8;
  const currentRenderHeight = isZoomed ? zoomedHeight : baseHeight;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md overflow-hidden">
      <div className="w-full h-16 bg-secondary border-b border-border flex items-center justify-between px-6 z-[60] shadow-2xl">
        <div className="flex items-center gap-4">
          <button
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-4 py-1.5 bg-primary text-white rounded-lg disabled:opacity-30 hover:brightness-110 transition-all"
          >
            Prev
          </button>
          <span className="text-primary font-bold min-w-[140px] text-center">
            Page {currentPage}{" "}
            {isSideBySide && currentPage < numPages
              ? `& ${currentPage + 1}`
              : ""}{" "}
            of {numPages}
          </span>
          <button
            disabled={
              currentPage >= numPages ||
              (isSideBySide && currentPage + 1 >= numPages)
            }
            onClick={() =>
              setCurrentPage((prev) => (isSideBySide ? prev + 2 : prev + 1))
            }
            className="px-4 py-1.5 bg-primary text-white rounded-lg disabled:opacity-30 hover:brightness-110 transition-all"
          >
            Next
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSideBySide(!isSideBySide)}
            className="hidden lg:block px-4 py-1.5 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all font-semibold"
          >
            {isSideBySide ? "Single View" : "Side-by-Side"}
          </button>

          <button
            onClick={onClose}
            className="text-white bg-red-600 rounded-full w-10 h-10 flex items-center justify-center font-bold hover:bg-red-500 transition-colors ml-2"
          >
            ✕
          </button>
        </div>
      </div>

      {/* 2. PDF View Area - Fixed Cutoff Bug */}
      <div
        className={`grow w-full overflow-auto p-4 md:p-10 flex ${
          isZoomed ? "items-start justify-start" : "items-center justify-center"
        }`}
      >
        <div
          className={`flex gap-4 md:gap-8 transition-all duration-300 cursor-pointer min-w-max mx-auto h-fit`}
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <div className="shadow-2xl border border-white/10 bg-white leading-[0]">
            <Page
              pageNumber={currentPage}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              height={currentRenderHeight}
            />
          </div>

          {isSideBySide && currentPage < numPages && (
            <div className="shadow-2xl border border-white/10 bg-white leading-[0] hidden lg:block">
              <Page
                pageNumber={currentPage + 1}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                height={currentRenderHeight}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
