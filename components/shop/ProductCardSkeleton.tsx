export function ProductCardSkeleton() {
  return (
    <div className="bg-ivory rounded-lg overflow-hidden border border-brand animate-pulse">
      <div className="h-60 bg-cream" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-20 bg-cream rounded" />
        <div className="h-5 w-full bg-cream rounded" />
        <div className="h-3 w-28 bg-cream rounded" />
        <div className="h-7 w-24 bg-cream rounded mt-4" />
      </div>
      <div className="px-5 pb-5">
        <div className="h-10 bg-cream rounded-md" />
      </div>
    </div>
  )
}
