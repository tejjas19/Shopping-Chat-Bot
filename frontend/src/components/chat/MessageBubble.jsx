const URL_REGEX = /(https?:\/\/[^\s]+)/gi;

const renderContentWithLinks = (content = '') => {
  const parts = content.split(URL_REGEX);

  return parts.map((part, index) => {
    if (/^https?:\/\//i.test(part)) {
      return (
        <a
          key={`link-${index}`}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-cyan-700 hover:text-cyan-800 break-all dark:text-cyan-300 dark:hover:text-cyan-200"
        >
          {part}
        </a>
      );
    }

    return <span key={`text-${index}`}>{part}</span>;
  });
};

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  const hasProducts = !isUser && Boolean(message.products?.length);

  return (
    <div className={`flex mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-2xl ${isUser ? '' : 'w-full'}`}>
        {!isUser && (
          <p className="text-xs uppercase tracking-widest text-slate-500 mb-2 pl-1">Assistant</p>
        )}
        <div
          className={`message ${isUser ? 'user' : 'bot'} px-4 py-3 rounded-xl ${
            isUser
              ? 'bg-slate-200 text-slate-900 ml-12 dark:bg-slate-700 dark:text-white'
              : 'bg-transparent text-slate-800 dark:text-slate-100'
          }`}
        >
          <p className="text-sm leading-6 whitespace-pre-wrap">{renderContentWithLinks(message.content)}</p>
        </div>
        
        {hasProducts && (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {message.products.map((product) => {
                const amazonLink = product.purchaseLinks?.amazon || `https://www.amazon.in/s?k=${encodeURIComponent(product.name || 'shopping')}`;
                const flipkartLink = product.purchaseLinks?.flipkart || `https://www.flipkart.com/search?q=${encodeURIComponent(product.name || 'shopping')}`;

                return (
                  <article key={product.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition dark:border-white/10 dark:bg-slate-900/40 dark:hover:bg-slate-900/60">
                    <img src={product.imageUrl} alt={product.name} className="h-32 w-full object-cover" />
                    <div className="space-y-2 p-3">
                      <div>
                        <h4 className="text-sm font-medium text-slate-900 dark:text-white line-clamp-2">{product.name}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{product.description}</p>
                      </div>
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="font-semibold text-cyan-700 dark:text-cyan-300">{product.price}</span>
                        {product.rating && (
                          <span className="text-slate-500 dark:text-slate-400">★ {product.rating}</span>
                        )}
                      </div>
                      <div className="flex gap-2 pt-2">
                        <a
                          href={amazonLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 text-center rounded-md bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium py-1.5 transition"
                        >
                          Amazon
                        </a>
                        <a
                          href={flipkartLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 text-center rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1.5 transition"
                        >
                          Flipkart
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
