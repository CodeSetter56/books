"use client";

import dynamic from "next/dynamic";
import PageSkeleton from "@/components/Skeletons/PageSkeleton";

// Fix the path to point to the local component
const PdfTable = dynamic(
  () => import("./PdfTable").then((mod) => mod.PdfTable),
  {
    ssr: false,
    loading: () => <PageSkeleton />,
  }
);

export default function PdfViewerWrapper({ fileUrl }: { fileUrl: string }) {
  return <PdfTable fileUrl={fileUrl} />;
}
