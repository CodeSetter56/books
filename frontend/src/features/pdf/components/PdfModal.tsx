"use client";

import { Page } from "react-pdf";
import { useUrlState } from "@/hooks/useUrlState";
import Pagination from "@/components/Pagination";

export const PdfModal = ({
  selectedPage,
  numPages,
  onClose,
}: {
  selectedPage: number;
  numPages: number;
  onClose: () => void;
}) => {
  const { getParam, updateParams } = useUrlState();

  // Persist view state in URL
  const isZoomed = getParam("zoom") === "true";
  const isSideBySide = getParam("view") === "double";

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md overflow-hidden">
      <div className="h-16 bg-secondary flex items-center justify-between px-6 border-b border-border">
        <button
          onClick={() =>
            updateParams({ view: isSideBySide ? "single" : "double" })
          }
          className="hidden lg:block px-4 py-1 border border-primary text-primary rounded"
        >
          {isSideBySide ? "Single View" : "Side-by-Side"}
        </button>

        <div className="flex-1 max-w-xs">
          <Pagination totalPages={numPages} />
        </div>

        <button
          onClick={onClose}
          className="bg-red-600 text-white rounded-full w-8 h-8"
        >
          ✕
        </button>
      </div>

      <div
        className={`grow overflow-auto p-10 flex ${
          isZoomed ? "items-start" : "items-center justify-center"
        }`}
        onClick={() => updateParams({ zoom: isZoomed ? "false" : "true" })}
      >
        <div className="flex gap-8 cursor-zoom-in">
          <Page
            pageNumber={selectedPage}
            height={isZoomed ? 1200 : 800}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
          {isSideBySide && selectedPage < numPages && (
            <Page
              pageNumber={selectedPage + 1}
              height={isZoomed ? 1200 : 800}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          )}
        </div>
      </div>
    </div>
  );
};
