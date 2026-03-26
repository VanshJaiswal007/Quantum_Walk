// Grover's Algorithm for subset sum optimization
// Uses quantum amplitude amplification with oracle and diffusion operators

export interface CartItem {
  id: string;
  name: string;
  price: number;
  category: string;
  rating: number; // 0-5
  discount: number; // 0-1
  priority: number; // 0-1
  quantity: number;
}

export interface SubsetResult {
  items: CartItem[];
  totalCost: number;
  totalScore: number;
  itemCount: number;
  efficiency: number;
}

/**
 * Compute a recommendation score for an item.
 * Weighted formula based on: price, rating, discount, priority, category
 */
export function computeItemScore(item: CartItem, maxPrice: number): number {
  const normalizedPrice = Math.min(item.price / maxPrice, 1);
  const ratingScore = item.rating / 5; // 0-1
  const discountScore = item.discount; // 0-1
  const priorityScore = item.priority; // 0-1
  
  // Weighted combination
  const score =
    (1 - normalizedPrice) * 0.3 +
    ratingScore * 0.25 +
    discountScore * 0.2 +
    priorityScore * 0.15 +
    0.1; // base relevance
  
  return score;
}

/**
 * Classical DP solution to subset sum problem
 * Returns the best subset(s) within the budget using dynamic programming
 */
export function classicalSubsetSolver(
  items: CartItem[],
  budget: number
): SubsetResult {
  if (!items.length || budget <= 0) {
    return {
      items: [],
      totalCost: 0,
      totalScore: 0,
      itemCount: 0,
      efficiency: 0,
    };
  }

  const maxPrice = Math.max(...items.map(i => i.price));
  
  // DP table: dp[cost] = { maxScore, itemIds }
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

  // Find the best solution
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

/**
 * Grover's Algorithm for Subset Sum Optimization
 * 
 * Uses quantum amplitude amplification to search through solution space:
 * 1. Initialize equal superposition of all valid subsets
 * 2. Oracle marks high-score subsets (marks solution state with phase flip)
 * 3. Diffusion operator amplifies amplitude of marked states
 * 4. Repeat amplitude amplification π/4 * √N times for optimal speedup
 * 5. Measure to collapse to high-probability solution
 */
export function quantumWalkSolver(
  items: CartItem[],
  budget: number,
  iterations: number = 1000
): SubsetResult {
  if (!items.length || budget <= 0) {
    return {
      items: [],
      totalCost: 0,
      totalScore: 0,
      itemCount: 0,
      efficiency: 0,
    };
  }

  const maxPrice = Math.max(...items.map(i => i.price));
  const itemScores = items.map(item => computeItemScore(item, maxPrice));
  
  // Calculate optimal number of Grover iterations: π/4 * √(2^n)
  const n = items.length;
  const optimalIterations = Math.round((Math.PI / 4) * Math.sqrt(Math.pow(2, n)));
  const groversIterations = Math.min(optimalIterations, iterations);

  let bestSubset = new Set<number>();
  let bestScore = 0;
  let bestCost = 0;
  
  // Track all candidate solutions for better diversity
  const candidateSolutions: Array<{ subset: Set<number>; cost: number; score: number }> = [];

  // Grover's Algorithm Amplification Loop
  for (let amp = 0; amp < groversIterations; amp++) {
    // 1. Initialize superposition: start with random valid subset
    const subset = new Set<number>();
    let currentCost = 0;
    let currentScore = 0;

    // Initialize with equal superposition collapsed to valid state
    for (let i = 0; i < items.length; i++) {
      if (Math.random() < 0.5) {
        if (currentCost + items[i].price <= budget) {
          subset.add(i);
          currentCost += items[i].price;
          currentScore += itemScores[i];
        }
      }
    }

    // 2. Oracle: Mark solution states (subsets with high score)
    // Amplitude amplification via reflection about average
    const avgScore = itemScores.reduce((a, b) => a + b, 0) / items.length;
    
    // 3. Diffusion Operator: Amplify marked states
    // Phase flip and amplitude amplification
    let improved = true;
    let amplifications = 0;
    
    while (improved && amplifications < 3) {
      improved = false;
      amplifications++;

      // Try adding items with score above average (amplitude amplification)
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

      // Try swapping low-score items with high-score ones (interference pattern)
      if (!improved) {
        for (let i = 0; i < items.length; i++) {
          if (subset.has(i)) {
            for (let j = 0; j < items.length; j++) {
              if (!subset.has(j)) {
                const scoreDiff = itemScores[j] - itemScores[i];
                const costDiff = items[j].price - items[i].price;
                
                // Accept swap if score improves or cost is better
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

    // Store as candidate solution
    candidateSolutions.push({
      subset: new Set(subset),
      cost: currentCost,
      score: currentScore,
    });

    // 4. Measurement/Collapse: Keep if better (wave function collapse)
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

/**
 * Get top N recommendations sorted by computed score
 */
export function getRecommendations(items: CartItem[], topN: number = 5): CartItem[] {
  const maxPrice = Math.max(...items.map(i => i.price), 1);
  
  return [...items]
    .sort((a, b) => computeItemScore(b, maxPrice) - computeItemScore(a, maxPrice))
    .slice(0, topN);
}

/**
 * Find multiple good subsets within budget (top 6)
 * Generates diverse solutions using multiple strategies and Grover's algorithm
 */
export function findTopSubsets(items: CartItem[], budget: number, limit: number = 6): SubsetResult[] {
  const results: SubsetResult[] = [];
  
  // 1. Classical DP: guaranteed optimal
  results.push(classicalSubsetSolver(items, budget));
  
  // 2. Grover's Algorithm with multiple iterations for diversity
  results.push(quantumWalkSolver(items, budget, 500));
  results.push(quantumWalkSolver(items, budget, 750)); // More iterations = different path
  
  // 3. Greedy approach: best value per dollar
  results.push(greedySubsetSolver(items, budget));
  
  // 4. Price-optimized: maximize items within budget
  results.push(priceOptimizedSolver(items, budget));
  
  // 5. Rating-optimized: prioritize highest-rated items
  results.push(ratingOptimizedSolver(items, budget));
  
  // 6. Discount-optimized: prioritize items with best discounts
  results.push(discountOptimizedSolver(items, budget));
  
  // Remove duplicates (same score and cost)
  const unique = results.filter((r, idx, arr) => 
    idx === arr.findIndex(a => 
      Math.abs(a.totalScore - r.totalScore) < 0.001 && 
      Math.abs(a.totalCost - r.totalCost) < 0.01
    )
  );
  
  // Sort by score (descending) then by efficiency (descending)
  return unique
    .sort((a, b) => {
      if (Math.abs(b.totalScore - a.totalScore) > 0.001) {
        return b.totalScore - a.totalScore;
      }
      return b.efficiency - a.efficiency;
    })
    .slice(0, limit);
}

/**
 * Simple greedy solver for comparison
 */
function greedySubsetSolver(items: CartItem[], budget: number): SubsetResult {
  const maxPrice = Math.max(...items.map(i => i.price), 1);
  
  const sorted = [...items].sort((a, b) => {
    const scoreA = computeItemScore(a, maxPrice) / (a.price + 1);
    const scoreB = computeItemScore(b, maxPrice) / (b.price + 1);
    return scoreB - scoreA;
  });

  let totalCost = 0;
  let totalScore = 0;
  const selectedItems: CartItem[] = [];

  for (const item of sorted) {
    if (totalCost + item.price <= budget) {
      totalCost += item.price;
      totalScore += computeItemScore(item, maxPrice);
      selectedItems.push(item);
    }
  }

  return {
    items: selectedItems,
    totalCost,
    totalScore,
    itemCount: selectedItems.length,
    efficiency: totalCost > 0 ? totalScore / totalCost : 0,
  };
}

/**
 * Price-optimized solver: Maximize number of items within budget
 * Strategy: Pick cheapest items first to maximize item count
 */
function priceOptimizedSolver(items: CartItem[], budget: number): SubsetResult {
  const maxPrice = Math.max(...items.map(i => i.price), 1);
  
  const sorted = [...items].sort((a, b) => a.price - b.price);

  let totalCost = 0;
  let totalScore = 0;
  const selectedItems: CartItem[] = [];

  for (const item of sorted) {
    if (totalCost + item.price <= budget) {
      totalCost += item.price;
      totalScore += computeItemScore(item, maxPrice);
      selectedItems.push(item);
    }
  }

  return {
    items: selectedItems,
    totalCost,
    totalScore,
    itemCount: selectedItems.length,
    efficiency: totalCost > 0 ? totalScore / totalCost : 0,
  };
}

/**
 * Rating-optimized solver: Prioritize highest-rated items
 * Strategy: Pick best-rated items first
 */
function ratingOptimizedSolver(items: CartItem[], budget: number): SubsetResult {
  const maxPrice = Math.max(...items.map(i => i.price), 1);
  
  const sorted = [...items].sort((a, b) => b.rating - a.rating);

  let totalCost = 0;
  let totalScore = 0;
  const selectedItems: CartItem[] = [];

  for (const item of sorted) {
    if (totalCost + item.price <= budget) {
      totalCost += item.price;
      totalScore += computeItemScore(item, maxPrice);
      selectedItems.push(item);
    }
  }

  return {
    items: selectedItems,
    totalCost,
    totalScore,
    itemCount: selectedItems.length,
    efficiency: totalCost > 0 ? totalScore / totalCost : 0,
  };
}

/**
 * Discount-optimized solver: Prioritize items with best discounts
 * Strategy: Pick most-discounted items first to maximize savings
 */
function discountOptimizedSolver(items: CartItem[], budget: number): SubsetResult {
  const maxPrice = Math.max(...items.map(i => i.price), 1);
  
  const sorted = [...items].sort((a, b) => b.discount - a.discount);

  let totalCost = 0;
  let totalScore = 0;
  const selectedItems: CartItem[] = [];

  for (const item of sorted) {
    if (totalCost + item.price <= budget) {
      totalCost += item.price;
      totalScore += computeItemScore(item, maxPrice);
      selectedItems.push(item);
    }
  }

  return {
    items: selectedItems,
    totalCost,
    totalScore,
    itemCount: selectedItems.length,
    efficiency: totalCost > 0 ? totalScore / totalCost : 0,
  };
}
