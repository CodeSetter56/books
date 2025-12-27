"use client";

import { useEffect } from "react";
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

  // Remove outer scrollbar when modal is active
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-md overflow-hidden">
      {/* Modal Header: Added z-10 and shrink-0 to prevent overlap and compression */}
      <div className="h-16 bg-secondary flex items-center justify-between px-6 border-b border-border z-10 shrink-0">
        <button
          onClick={() =>
            updateParams({ view: isSideBySide ? "single" : "double" })
          }
          className="hidden lg:block px-4 py-1 border border-primary text-primary rounded hover:bg-primary/10 transition-colors"
        >
          {isSideBySide ? "Single View" : "Side-by-Side"}
        </button>

        <div className="flex-1 max-w-xs">
          <Pagination totalPages={numPages} />
        </div>

        <button
          onClick={onClose}
          className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Main Content Area: Added justify-center and conditional items-start */}
      <div
        className={`grow overflow-auto p-10 flex justify-center ${
          isZoomed ? "items-start" : "items-center"
        }`}
      >
        <div 
          className="flex gap-8 cursor-zoom-in mx-auto h-fit"
          onClick={() => updateParams({ zoom: isZoomed ? "false" : "true" })}
        >
          <div className="shadow-2xl">
            <Page
              pageNumber={selectedPage}
              height={isZoomed ? 1200 : 800}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </div>
          {isSideBySide && selectedPage < numPages && (
            <div className="shadow-2xl">
              <Page
                pageNumber={selectedPage + 1}
                height={isZoomed ? 1200 : 800}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};