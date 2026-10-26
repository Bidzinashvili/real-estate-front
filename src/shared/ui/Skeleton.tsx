import { cn } from "@/shared/lib/utils";

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-muted/80", className)}
      aria-hidden
    />
  );
}

export function ListingCardSkeleton() {
  return (
    <div className="surface-card overflow-hidden">
      <Skeleton className="aspect-[3/2] w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-6 w-[42%]" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ListingGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-5 xl:grid-cols-3 xl:gap-6">
      {Array.from({ length: count }, (_, index) => (
        <ListingCardSkeleton key={`listing-skeleton-${index}`} />
      ))}
    </div>
  );
}
