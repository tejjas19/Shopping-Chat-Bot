export default function ProductCard({ product, selected, onToggleSelect }) {
  const amazonLink = product.purchaseLinks?.amazon || `https://www.amazon.in/s?k=${encodeURIComponent(product.name || 'shopping')}`;
  const flipkartLink = product.purchaseLinks?.flipkart || `https://www.flipkart.com/search?q=${encodeURIComponent(product.name || 'shopping')}`;

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-glow transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
      <img src={product.imageUrl} alt={product.name} className="h-44 w-full object-cover" />
      <div className="space-y-3 p-4">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">{product.name}</h3>
            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-1 text-xs text-cyan-700 dark:text-cyan-200">{product.rating}</span>
          </div>
          <p className="mt-1 text-lg font-bold text-cyan-700 dark:text-cyan-300">{product.price}</p>
        </div>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{product.description}</p>
        <div className="flex items-center justify-between gap-2 pt-2">
          <button
            type="button"
            onClick={() => onToggleSelect(product)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              selected ? 'bg-emerald-500 text-white' : 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10'
            }`}
          >
            {selected ? 'Selected' : 'Compare'}
          </button>
          <div className="flex items-center gap-2">
            {product.purchaseLinks?.flipkart && (
              <a
                href={product.purchaseLinks.flipkart}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              >
                Flipkart
              </a>
            )}
            {product.purchaseLinks?.amazon && (
              <a
                href={product.purchaseLinks.amazon}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-950 transition hover:opacity-90"
              >
                Amazon
              </a>
            )}
            {product.purchaseLinks?.blinkit && (
              <a
                href={product.purchaseLinks.blinkit}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-green-600 bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 transition hover:opacity-90"
              >
                Blinkit
              </a>
            )}
            {product.purchaseLinks?.zepto && (
              <a
                href={product.purchaseLinks.zepto}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-orange-600 bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700 transition hover:opacity-90"
              >
                Zepto
              </a>
            )}
          </div>
        </div>
        <div>
          <a
            href={product.buyUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
          >
            View source listing
          </a>
        </div>
      </div>
    </div>
  );
}
