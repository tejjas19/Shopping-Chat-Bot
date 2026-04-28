import axios from 'axios';

const SHOPPING_INTENT_PATTERN = /(best|buy|buying|shopping|shoppong|shoping|price|prices|cost|under|budget|affordable|cheap|compare|comparison|deal|deals|discount|recommend|recommended|suggest|suggestion|looking for|find me|show me|want to buy|need to buy|want a|need a|i want|i want to|i need|please show|please suggest|which one|what should i buy|mobile|phone|smartphone|laptop|watch|headphone|earbuds|tv|tablet|camera|shoes|footwear|heels|sandals|sneakers|boots|slippers|loafers|grocery|groceries|grocery item|grocery items|daily needs|toiletries|blinkit|zepto|milk|rice|atta|pulses|oil|bread|fruits|vegetables|chips|snack|snacks|biscuit|biscuits|cookies|chocolate|choco|soap|shampoo|conditioner|toothpaste|detergent|dishwash|cleaner|maggi|noodles|dress|shirt|jeans|bag|bottle|water bottle|steel bottle|bed|chair|table|desk|wardrobe|almirah|curtain|pillow|blanket|bedsheet|fridge|ac|air conditioner|washing machine|microwave|car|cars|bike|scooter|furniture|sofa|mattress|product|products|amazon|flipkart|gift)\b/i;

const createSearchUrl = (baseUrl, query, sourceName) => {
  const safeQuery = encodeURIComponent(query || 'shopping');
  if (sourceName === 'amazon') {
    return `${baseUrl}/s?k=${safeQuery}`;
  }

  if (sourceName === 'flipkart') {
    return `${baseUrl}/search?q=${safeQuery}`;
  }

  if (sourceName === 'blinkit' || sourceName === 'zepto') {
    return `${baseUrl}/search?q=${safeQuery}`;
  }

  if (sourceName === 'myntra') {
    return `${baseUrl}/${safeQuery}`;
  }

  if (sourceName === 'nykaafashion') {
    return `${baseUrl}/catalogsearch/result/?q=${safeQuery}`;
  }

  if (sourceName === 'nykaa') {
    return `${baseUrl}/search/result/?q=${safeQuery}`;
  }

  if (sourceName === 'purplle') {
    return `${baseUrl}/search?q=${safeQuery}`;
  }

  if (sourceName === 'ola') {
    return `https://www.google.com/search?q=${encodeURIComponent(`${query || 'cars'} site:olaelectric.com`)}`;
  }

  if (sourceName === 'westside') {
    return `https://www.google.com/search?q=${encodeURIComponent(`${query || 'fashion'} site:westside.com`)}`;
  }

  return `${baseUrl}/search?q=${safeQuery}`;
};

const detectCategory = (query = '', title = '') => {
  const hay = `${query} ${title}`.toLowerCase();

  if (/(grocery|groceries|milk|rice|atta|pulses|oil|bread|fruits|vegetables|snack|detergent|toothpaste|soap)/i.test(hay)) {
    return 'grocery';
  }

  if (/(cosmetic|cosmetics|beauty|makeup|lipstick|foundation|serum|moisturizer|face wash|sunscreen|skincare)/i.test(hay)) {
    return 'cosmetics';
  }

  if (/(dress|shirt|jeans|kurti|saree|clothes|clothing|fashion|jacket|hoodie|tshirt|heels|sandals|sneakers|shoes)/i.test(hay)) {
    return 'fashion';
  }

  if (/(car|cars|bike|scooter|vehicle|auto)/i.test(hay)) {
    return 'auto';
  }

  return 'general';
};

const marketplacesByCategory = {
  auto: ['amazon', 'flipkart', 'ola'],
  grocery: ['blinkit', 'zepto', 'amazon', 'flipkart'],
  fashion: ['westside', 'myntra', 'nykaafashion', 'amazon', 'flipkart'],
  cosmetics: ['nykaa', 'purplle', 'amazon', 'flipkart'],
  general: ['amazon', 'flipkart']
};

const marketplaceBaseUrls = {
  amazon: 'https://www.amazon.in',
  flipkart: 'https://www.flipkart.com',
  blinkit: 'https://blinkit.com',
  zepto: 'https://www.zepto.com',
  ola: 'https://www.olaelectric.com',
  westside: 'https://www.westside.com',
  myntra: 'https://www.myntra.com',
  nykaafashion: 'https://www.nykaafashion.com',
  nykaa: 'https://www.nykaa.com',
  purplle: 'https://www.purplle.com'
};

const inferMarketplaceFromLink = (link = '') => {
  const lower = link.toLowerCase();
  if (lower.includes('amazon')) return 'amazon';
  if (lower.includes('flipkart')) return 'flipkart';
  if (lower.includes('blinkit')) return 'blinkit';
  if (lower.includes('zepto')) return 'zepto';
  if (lower.includes('ola')) return 'ola';
  if (lower.includes('westside')) return 'westside';
  if (lower.includes('myntra')) return 'myntra';
  if (lower.includes('nykaafashion')) return 'nykaafashion';
  if (lower.includes('nykaa')) return 'nykaa';
  if (lower.includes('purplle')) return 'purplle';
  return null;
};

const buildMarketplaceLinks = (item, query) => {
  const sourceLink = item.link || item.product_link || item.url || '';
  const searchText = item.title || item.name || query;
  const category = detectCategory(query, searchText);
  const selectedMarketplaces = marketplacesByCategory[category] || marketplacesByCategory.general;
  const sourceMarketplace = inferMarketplaceFromLink(sourceLink);

  return selectedMarketplaces.reduce((acc, market) => {
    if (sourceMarketplace === market && sourceLink) {
      acc[market] = sourceLink;
      return acc;
    }

    const baseUrl = marketplaceBaseUrls[market];
    if (!baseUrl) return acc;

    acc[market] = createSearchUrl(baseUrl, searchText, market);
    return acc;
  }, {});
};

const normalizeProduct = (item, index, query) => ({
  id: item.position?.toString() || `${Date.now()}-${index}`,
  name: item.title || item.name || query,
  price: item.price || item.extracted_price || 'Price not available',
  rating: item.rating ? String(item.rating) : item.ratings ? String(item.ratings) : 'N/A',
  description: item.snippet || item.description || item.about || 'Product details unavailable.',
  imageUrl: item.thumbnail || item.image || item.product_photo || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
  buyUrl: item.link || item.product_link || item.url || createSearchUrl('https://www.amazon.in', query, 'amazon'),
  purchaseLinks: buildMarketplaceLinks(item, query),
  source: item.source || 'SerpAPI'
});

export const enrichProductLinks = (product = {}, queryHint = '') => {
  const baseName = product.name || product.title || queryHint || 'shopping';
  const generatedLinks = buildMarketplaceLinks(
    {
      title: baseName,
      name: baseName,
      link: product.buyUrl || ''
    },
    queryHint || baseName
  );

  return {
    ...product,
    purchaseLinks: {
      ...generatedLinks,
      ...(product.purchaseLinks || {})
    }
  };
};

export const ensureMarketplaceCoverage = (products = [], queryHint = '') => {
  if (!Array.isArray(products)) return [];
  return products.map((product) => enrichProductLinks(product, queryHint));
};

const fallbackImageByCategory = (query = '') => {
  const category = detectCategory(query);

  if (category === 'auto') {
    return 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80';
  }
  if (category === 'grocery') {
    return 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80';
  }
  if (category === 'fashion') {
    return 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80';
  }
  if (category === 'cosmetics') {
    return 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80';
  }
  return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80';
};

const mockProducts = (query) => [
  {
    id: `${query}-1`,
    name: `${query} Pro`,
    price: '₹19,999',
    rating: '4.5',
    description: 'Best-value option for everyday use with strong battery life and fast charging.',
    imageUrl: fallbackImageByCategory(query),
    buyUrl: 'https://www.amazon.in',
    purchaseLinks: buildMarketplaceLinks({ title: `${query} Pro` }, query),
    source: 'Mock'
  },
  {
    id: `${query}-2`,
    name: `${query} Max`,
    price: '₹17,499',
    rating: '4.3',
    description: 'Balanced performance with a bright display and reliable camera system.',
    imageUrl: fallbackImageByCategory(query),
    buyUrl: 'https://www.flipkart.com',
    purchaseLinks: buildMarketplaceLinks({ title: `${query} Max` }, query),
    source: 'Mock'
  }
];

export const searchProducts = async (query) => {
  if (!query) return [];

  if (!process.env.SERPAPI_API_KEY) {
    return mockProducts(query);
  }

  try {
    const response = await axios.get('https://serpapi.com/search.json', {
      params: {
        engine: 'google_shopping',
        q: query,
        api_key: process.env.SERPAPI_API_KEY,
        hl: 'en',
        gl: 'in'
      }
    });

    const results = response.data?.shopping_results || response.data?.organic_results || [];
    if (!results.length) {
      return mockProducts(query);
    }

    return ensureMarketplaceCoverage(
      results.slice(0, 8).map((item, index) => normalizeProduct(item, index, query)),
      query
    );
  } catch (error) {
    console.error('Product search failed:', error.message);
    return ensureMarketplaceCoverage(mockProducts(query), query);
  }
};

export const isShoppingQuery = (query) => {
  return SHOPPING_INTENT_PATTERN.test((query || '').toLowerCase());
};
