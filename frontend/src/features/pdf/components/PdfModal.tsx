"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  const { getParam, replaceParams } = useUrlState();
  const [isZoomed, setIsZoomed] = useState(false);
  const isSideBySide = getParam("view") === "double";

  const pagesToRender = useMemo(() => {
    const pages = [selectedPage];
    if (isSideBySide && selectedPage < numPages) {
      pages.push(selectedPage + 1);
    }
    return pages;
  }, [selectedPage, isSideBySide, numPages]);

  const headerRef = useRef<HTMLDivElement | null>(null);
  const [availableHeight, setAvailableHeight] = useState<number | null>(null);
  const [viewportWidth, setViewportWidth] = useState<number>(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const calc = () => {
      const headerH = headerRef.current?.offsetHeight || 64;
      setAvailableHeight(window.innerHeight - headerH - 32);
      setViewportWidth(window.innerWidth);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => {
      window.removeEventListener("resize", calc);
      document.body.style.overflow = "unset";
    };
  }, []);

  const preloadPages = useMemo(() => {
    const toPreload = [];
    if (selectedPage > 1) toPreload.push(selectedPage - 1);
    if (selectedPage < numPages) toPreload.push(selectedPage + 1);
    if (isSideBySide && selectedPage < numPages - 1)
      toPreload.push(selectedPage + 2);
    return toPreload;
  }, [selectedPage, numPages, isSideBySide]);

  // Responsive scaling logic
  const getPageProps = (isPreload = false) => {
    const isMobile = viewportWidth < 768;

    // On mobile, force width to fit screen minus padding
    if (isMobile && !isZoomed) {
      return { width: viewportWidth - 40 };
    }

    // On desktop or when zoomed, use height-based scaling
    return {
      height: isZoomed
        ? 1200
        : availableHeight
        ? Math.max(200, availableHeight)
        : 800,
    };
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-md overflow-hidden">
      <div
        ref={headerRef}
        className="h-16 bg-secondary flex items-center justify-between px-6 border-b border-border z-10 shrink-0"
      >
        <button
          onClick={() =>
            replaceParams({ view: isSideBySide ? "single" : "double" })
          }
          className="hidden lg:block px-4 py-1 border border-primary text-primary rounded hover:bg-primary/10 transition-colors"
        >
          {isSideBySide ? "Single View" : "Side-by-Side"}
        </button>

        <div className="flex-1 max-w-xs">
          <Pagination totalPages={numPages} replaceOnChange />
        </div>

        <button
          onClick={onClose}
          className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="grow overflow-auto p-4 md:p-10 flex flex-col items-center">
        <div
          className={`flex flex-wrap md:flex-nowrap gap-4 md:gap-8 h-fit mx-auto transition-all duration-300 justify-center ${
            isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
          }`}
          onClick={() => setIsZoomed((v) => !v)}
        >
          {pagesToRender.map((pageNum) => (
            <div key={pageNum} className="shadow-2xl max-w-full">
              <Page
                pageNumber={pageNum}
                {...getPageProps()}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </div>
          ))}
        </div>

        <div className="hidden">
          {preloadPages.map((pageNum) => (
            <Page
              key={`preload-${pageNum}`}
              pageNumber={pageNum}
              {...getPageProps(true)}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
