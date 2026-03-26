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

function quantumWalkSolver(items: CartItem[], budget: number, iterations: number = 1000): SubsetResult {
  if (!items.length || budget <= 0) {
    return { items: [], totalCost: 0, totalScore: 0, itemCount: 0, efficiency: 0 };
  }

  const maxPrice = Math.max(...items.map(i => i.price));
  const itemScores = items.map(item => computeItemScore(item, maxPrice));

  const n = items.length;
  const optimalIterations = Math.round((Math.PI / 4) * Math.sqrt(Math.pow(2, n)));
  const groversIterations = Math.min(optimalIterations, iterations);

  let bestSubset = new Set<number>();
  let bestScore = 0;
  let bestCost = 0;

  for (let amp = 0; amp < groversIterations; amp++) {
    const subset = new Set<number>();
    let currentCost = 0;
    let currentScore = 0;

    for (let i = 0; i < items.length; i++) {
      if (Math.random() < 0.5) {
        if (currentCost + items[i].price <= budget) {
          subset.add(i);
          currentCost += items[i].price;
          currentScore += itemScores[i];
        }
      }
    }

    const avgScore = itemScores.reduce((a, b) => a + b, 0) / items.length;

    let improved = true;
    let amplifications = 0;

    while (improved && amplifications < 3) {
      improved = false;
      amplifications++;

      for (let i = 0; i < items.length; i++) {
        if (!subset.has(i) && itemScores[i] > avgScore) {
          if (currentCost + items[i].price <= budget) {
            subset.add(i);
            currentCost += items[i].price;
            currentScore += itemScores[i];
            improved = true;
          }
        }
      }

      if (!improved) {
        for (let i = 0; i < items.length; i++) {
          if (subset.has(i)) {
            for (let j = 0; j < items.length; j++) {
              if (!subset.has(j)) {
                const scoreDiff = itemScores[j] - itemScores[i];
                const costDiff = items[j].price - items[i].price;

                if ((scoreDiff > 0.001 && currentCost + costDiff <= budget) ||
                    (scoreDiff >= 0 && costDiff < 0)) {
                  subset.delete(i);
                  currentCost -= items[i].price;
                  currentScore -= itemScores[i];

                  subset.add(j);
                  currentCost += items[j].price;
                  currentScore += itemScores[j];

                  improved = true;
                  break;
                }
              }
            }
            if (improved) break;
          }
        }
      }
    }

    if (currentScore > bestScore || (currentScore === bestScore && currentCost < bestCost)) {
      bestScore = currentScore;
      bestCost = currentCost;
      bestSubset = new Set(subset);
    }
  }

  const selectedItems = items.filter((_, idx) => bestSubset.has(idx));

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
    const { items, budget, iterations = 1000 } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Items array required' });
    }

    if (typeof budget !== 'number' || budget <= 0) {
      return res.status(400).json({ success: false, error: 'Valid budget required' });
    }

    const result = quantumWalkSolver(items, budget, iterations);
    res.status(200).json({ success: true, result, solverType: 'quantum' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
}
