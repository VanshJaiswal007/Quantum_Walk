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

function greedySubsetSolver(items: CartItem[], budget: number): SubsetResult {
  if (!items.length || budget <= 0) {
    return { items: [], totalCost: 0, totalScore: 0, itemCount: 0, efficiency: 0 };
  }

  const maxPrice = Math.max(...items.map(i => i.price));
  const itemsWithScores = items
    .map((item, idx) => ({
      ...item,
      idx,
      score: computeItemScore(item, maxPrice),
    }))
    .sort((a, b) => b.score - a.score);

  const selected: CartItem[] = [];
  let totalCost = 0;
  let totalScore = 0;

  for (const item of itemsWithScores) {
    if (totalCost + item.price <= budget) {
      selected.push(item);
      totalCost += item.price;
      totalScore += item.score;
    }
  }

  return {
    items: selected,
    totalCost,
    totalScore,
    itemCount: selected.length,
    efficiency: totalCost > 0 ? totalScore / totalCost : 0,
  };
}

function findTopSubsets(items: CartItem[], budget: number, limit: number = 6): SubsetResult[] {
  const results: SubsetResult[] = [];

  // Classical DP solver
  results.push(classicalSubsetSolver(items, budget));

  // Quantum solver (2 runs for diversity)
  results.push(quantumWalkSolver(items, budget, 500));
  results.push(quantumWalkSolver(items, budget, 500));

  // Greedy solver
  results.push(greedySubsetSolver(items, budget));

  // Sort by efficiency and take top results
  return results
    .sort((a, b) => b.efficiency - a.efficiency)
    .slice(0, Math.min(limit, results.length));
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
    const { items, budget, limit = 6 } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Items array required' });
    }

    if (typeof budget !== 'number' || budget <= 0) {
      return res.status(400).json({ success: false, error: 'Valid budget required' });
    }

    const topSubsets = findTopSubsets(items, budget, Math.min(limit, 10));
    res.status(200).json({
      success: true,
      topSubsets,
      basketCount: topSubsets.length,
      algorithms: [
        'Classical DP',
        'Grover Algorithm (Run 1)',
        'Grover Algorithm (Run 2)',
        'Greedy',
      ],
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
}
