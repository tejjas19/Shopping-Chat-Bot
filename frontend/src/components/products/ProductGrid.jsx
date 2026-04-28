import ProductCard from './ProductCard.jsx';

export default function ProductGrid({ products, selectedIds, onToggleSelect }) {
  if (!products?.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
        Ask for a product comparison like “best phone under 20000” and results will appear here.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          selected={selectedIds.includes(product.id)}
          onToggleSelect={onToggleSelect}
        />
      ))}
    </div>
  );
}
