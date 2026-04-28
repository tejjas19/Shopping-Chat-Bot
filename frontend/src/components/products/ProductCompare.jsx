export default function ProductCompare({ products }) {
  if (!products.length) return null;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-glow dark:border-white/10 dark:bg-white/5">
      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-200">Comparison</h3>
      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-1">
        {products.map((product) => (
          <div key={product.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-slate-950/70">
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium text-slate-900 dark:text-white">{product.name}</p>
              <span className="text-xs text-slate-500 dark:text-slate-400">{product.source}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
              <span>{product.price}</span>
              <span>Rating {product.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
