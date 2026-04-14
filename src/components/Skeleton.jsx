export function ProductSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton h-52 w-full" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-3 w-20 rounded" />
        <div className="skeleton h-5 w-full rounded" />
        <div className="skeleton h-4 w-24 rounded" />
        <div className="flex justify-between items-center">
          <div className="skeleton h-7 w-16 rounded" />
          <div className="skeleton h-9 w-20 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <div className="skeleton h-[500px] w-full rounded-3xl" />
  )
}
