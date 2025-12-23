"use client";

import dynamic from "next/dynamic";
import PageSkeleton from "@/components/Skeletons/PageSkeleton";

const PdfTable = dynamic(
  () => import("../../../features/pdf/PdfTable").then((mod) => mod.PdfTable),
  {
    ssr: false,
    // Replace the text div with the Skeleton component
    loading: () => <PageSkeleton />,
  }
);

export default function PdfViewerWrapper({ fileUrl }: { fileUrl: string }) {
  return <PdfTable fileUrl={fileUrl} />;
}
