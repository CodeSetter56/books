"use client";

import dynamic from "next/dynamic";

// This dynamic import disables Server Side Rendering (SSR) for the PdfTable
// This prevents the "DOMMatrix is not defined" error
const PdfTable = dynamic(
  () => import("./PdfTable").then((mod) => mod.PdfTable),
  {
    ssr: false,
    loading: () => (
      <div className="p-10 text-center text-gray-500">
        Initializing PDF Viewer...
      </div>
    ),
  }
);

export default function PdfViewerWrapper({ fileUrl }: { fileUrl: string }) {
  return <PdfTable fileUrl={fileUrl} />;
}
