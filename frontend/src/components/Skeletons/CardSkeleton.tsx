// This represents a single ghost card with a horizontal (flex) layout
const SkeletonItem = () => (
  <div className="flex gap-3 animate-pulse w-full p-2 border border-transparent">
    {/* Book Cover Placeholder: Reduced width to ensure 4 fit comfortably in a row */}
    <div className="w-16 h-24 md:w-20 md:h-28 bg-text-muted rounded-lg shrink-0"></div>

    {/* Details Section */}
    <div className="flex-1 space-y-2 py-1 overflow-hidden">
      {/* Title Placeholder */}
      <div className="h-4 bg-text-muted rounded-md w-full"></div>

      {/* Author/Description Placeholder */}
      <div className="space-y-1.5">
        <div className="h-2.5 bg-text-muted rounded w-5/6"></div>
        <div className="h-2.5 bg-text-muted rounded w-1/2"></div>
      </div>

      {/* Button Placeholder: Slightly smaller to fit horizontal layout */}
      <div className="h-8 bg-text-muted rounded-xl w-full mt-2"></div>
    </div>
  </div>
);

// This represents the full table layout
export default function CardSkeleton() {
  return (
    <div className="w-full mt-12 mx-auto p-4 md:p-6 border border-border rounded-2xl">
      {/* Grid configuration set to 4 columns on large screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonItem key={i} />
        ))}
      </div>
    </div>
  );
}
