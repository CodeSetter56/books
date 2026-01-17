"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useRouter, useSearchParams } from "next/navigation";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-64 bg-secondary border border-border rounded-lg animate-pulse"
              />
            ))}
          </div>
        }
        className="flex flex-col items-center"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 w-full">
          {Array.from({ length: numPages }, (_, i) => (
            <div
              key={i}
              onClick={() => openPage(i + 1)}
              className="cursor-pointer group bg-secondary p-3 rounded-2xl transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 border border-border flex flex-col items-center"
            >
              {/* PDF Wrapper: Relative so the page number can be absolute positioned over it */}
              <div className="relative w-full flex justify-center overflow-hidden rounded-lg">
                <Page
                  pageNumber={i + 1}
                  width={220}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="max-w-full shadow-sm"
                />

                {/* Page Number Badge over the PDF */}
                <div className="absolute bottom-2 right-2 z-10 bg-primary text-white w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shadow-lg">
                  {i + 1}
                </div>
              </div>
            </div>
          ))}
        </div>

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
                  renderTextLayer={true}
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
