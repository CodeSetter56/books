"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Page } from "react-pdf";
import { useUrlState } from "@/hooks/useUrlState";
import { ModalHeader } from "./ModalHeader";

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

  const getPageProps = () => {
    if (viewportWidth < 768 && !isZoomed) return { width: viewportWidth - 40 };
    return {
      height: isZoomed
        ? 1200
        : availableHeight
        ? Math.max(200, availableHeight)
        : 800,
    };
  };

  const pagesToRender = useMemo(() => {
    const pages = [selectedPage];
    if (isSideBySide && selectedPage < numPages) pages.push(selectedPage + 1);
    return pages;
  }, [selectedPage, isSideBySide, numPages]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-md overflow-hidden">
      <div ref={headerRef}>
        <ModalHeader
          numPages={numPages}
          isSideBySide={isSideBySide}
          onToggleView={() =>
            replaceParams({ view: isSideBySide ? "single" : "double" })
          }
          onClose={onClose}
        />
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
      </div>
    </div>
  );
};
