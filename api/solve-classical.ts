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

interface SubsetResult {
  items: CartItem[];
  totalCost: number;
  totalScore: number;
  itemCount: number;
  efficiency: number;
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

function classicalSubsetSolver(items: CartItem[], budget: number): SubsetResult {
  if (!items.length || budget <= 0) {
    return { items: [], totalCost: 0, totalScore: 0, itemCount: 0, efficiency: 0 };
  }

  const maxPrice = Math.max(...items.map(i => i.price));
  const dp: Map<number, { score: number; itemIds: Set<string> }> = new Map();
  dp.set(0, { score: 0, itemIds: new Set() });

  for (const item of items) {
    const itemScore = computeItemScore(item, maxPrice);
    const newEntries: Array<[number, { score: number; itemIds: Set<string> }]> = [];

    for (const [cost, { score, itemIds }] of dp.entries()) {
      const newCost = cost + item.price;
      if (newCost <= budget) {
        const newScore = score + itemScore;

        if (!dp.has(newCost) || dp.get(newCost)!.score < newScore) {
          newEntries.push([
            newCost,
            {
              score: newScore,
              itemIds: new Set([...itemIds, item.id]),
            },
          ]);
        }
      }
    }

    for (const [cost, value] of newEntries) {
      dp.set(cost, value);
    }
  }

  let bestCost = 0;
  let bestScore = 0;
  let bestItemIds = new Set<string>();

  for (const [cost, { score, itemIds }] of dp.entries()) {
    if (score > bestScore) {
      bestScore = score;
      bestCost = cost;
      bestItemIds = itemIds;
    }
  }

  const selectedItems = items.filter(item => bestItemIds.has(item.id));

  return {
    items: selectedItems,
    totalCost: bestCost,
    totalScore: bestScore,
    itemCount: selectedItems.length,
    efficiency: bestCost > 0 ? bestScore / bestCost : 0,
  };
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
    const { items, budget } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Items array required' });
    }

    if (typeof budget !== 'number' || budget <= 0) {
      return res.status(400).json({ success: false, error: 'Valid budget required' });
    }

    const result = classicalSubsetSolver(items, budget);
    res.status(200).json({ success: true, result, solverType: 'classical' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
}
