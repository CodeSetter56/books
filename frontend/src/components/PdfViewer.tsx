"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useRouter, useSearchParams } from "next/navigation";

// IMPORTANT: Missing CSS imports that prevent repeated text
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

// Reliable CDN for the worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfViewer({ fileUrl }: { fileUrl: string }) {
  const [numPages, setNumPages] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPage = searchParams.get("page");

  const openPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const closePage = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full">
      <Document
        file={fileUrl}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        loading={
          <div className="text-primary text-center py-10">
            Loading Document...
          </div>
        }
        className="flex flex-col items-center"
      >
        {/* Thumbnail Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
          {Array.from({ length: numPages }, (_, i) => (
            <div
              key={i}
              onClick={() => openPage(i + 1)}
              className="cursor-pointer group relative bg-secondary p-2 rounded-lg border border-border hover:border-primary transition-all shadow-sm"
            >
              <Page
                pageNumber={i + 1}
                width={200}
                renderTextLayer={false} // Keep false for speed on thumbnails
                renderAnnotationLayer={false}
              />
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <span className="bg-primary text-white px-3 py-1 rounded-full text-xs">
                  View Page {i + 1}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Full View Modal */}
        {selectedPage && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col items-center">
            <div className="w-full p-4 flex justify-between items-center border-b border-white/10 bg-black">
              <span className="text-white font-medium">
                Page {selectedPage} of {numPages}
              </span>
              <button
                onClick={closePage}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full transition-colors"
              >
                Close Viewer
              </button>
            </div>

            <div className="flex-1 w-full overflow-auto p-4 flex justify-center items-start">
              <div className="bg-white shadow-2xl mt-4 relative">
                <Page
                  pageNumber={Number(selectedPage)}
                  height={
                    typeof window !== "undefined"
                      ? window.innerHeight * 0.8
                      : 800
                  }
                  renderTextLayer={true} // Enabled now that CSS is imported
                  renderAnnotationLayer={false}
                />
              </div>
            </div>
          </div>
        )}
      </Document>
    </div>
  );
}
