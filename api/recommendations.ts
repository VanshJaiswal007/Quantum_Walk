import { VercelRequest, VercelResponse } from '@vercel/node';

interface CartItem {
  id: string;
  name: string;
  price: number;
  category: string;
  rating: number;
  discount: number;
  priority: number;
  quantity: number;
}

function computeItemScore(item: CartItem, maxPrice: number): number {
  const normalizedPrice = Math.min(item.price / maxPrice, 1);
  const ratingScore = item.rating / 5;
  const discountScore = item.discount;
  const priorityScore = item.priority;

  return (
    (1 - normalizedPrice) * 0.3 +
    ratingScore * 0.25 +
    discountScore * 0.2 +
    priorityScore * 0.15 +
    0.1
  );
}

function getRecommendations(items: CartItem[], topN: number = 5): CartItem[] {
  if (!items.length) return [];

  const maxPrice = Math.max(...items.map(i => i.price));
  const itemsWithScores = items.map(item => ({
    ...item,
    score: computeItemScore(item, maxPrice),
  }));

  return itemsWithScores
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { items, topN = 5 } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Items array required' });
    }

    const recommendations = getRecommendations(items, topN);
    res.status(200).json({ success: true, recommendations });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
}
