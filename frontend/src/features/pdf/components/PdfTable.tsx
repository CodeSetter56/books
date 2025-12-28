"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useUrlState } from "@/hooks/useUrlState";
import PageSkeleton from "@/components/Skeletons/PageSkeleton";
import { PdfModal } from "./PdfModal";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const PdfTable = ({ fileUrl }: { fileUrl: string }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const { getParam, updateParams } = useUrlState();
  const selectedPage = getParam("page") ? Number(getParam("page")) : null;

  return (
    <div className="w-full">
      <Document
        file={fileUrl}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        loading={<PageSkeleton />}
        className="flex flex-col items-center"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full justify-items-center">
          {Array.from(new Array(numPages), (_, i) => (
            <div
              key={i}
              className="cursor-pointer group flex flex-col items-center"
              onClick={() => updateParams({ page: String(i + 1) })}
            >
              {/* Removed orange border and added subtle lift/shadow transition */}
              <div className="w-fit bg-white rounded shadow-sm border border-transparent transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 overflow-hidden">
                <Page
                  pageNumber={i + 1}
                  width={250}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </div>
              <p className="text-center text-sm font-bold mt-2">Page {i + 1}</p>
            </div>
          ))}
        </div>

        {selectedPage && (
          <PdfModal
            selectedPage={selectedPage}
            numPages={numPages}
            onClose={() => updateParams({ page: null })}
          />
        )}
      </Document>
    </div>
  );
};
