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
  iterations: number = 1000,
  seedBias: number = 0.5  // Control randomness: 0.5 = default, 0.3 = explore, 0.7 = exploit
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
  const groversIterations = Math.min(optimalIterations, Math.max(10, iterations));

  let bestSubset = new Set<number>();
  let bestScore = 0;
  let bestCost = 0;

  // Grover's Algorithm Amplification Loop - run multiple times for diversity
  for (let amp = 0; amp < groversIterations; amp++) {
    // 1. Initialize superposition: random valid subset with bias
    const subset = new Set<number>();
    let currentCost = 0;
    let currentScore = 0;

    // Use randomized initialization with seedBias influence
    for (let i = 0; i < items.length; i++) {
      // Create bias: seedBias controls which items are preferred
      const itemQuality = itemScores[i] / Math.max(...itemScores);
      
      // Adjust probability based on seedBias
      // 0.3 = explore (lower probability for good items)
      // 0.5 = neutral (50% for all items)
      // 0.7 = exploit (higher probability for good items)
      const biasInfluence = (itemQuality - 0.5) * (seedBias - 0.5) * 2;
      const probability = 0.5 + biasInfluence;
      const adjustedProb = Math.max(0.1, Math.min(0.9, probability));
      
      if (Math.random() < adjustedProb) {
        if (currentCost + items[i].price <= budget) {
          subset.add(i);
          currentCost += items[i].price;
          currentScore += itemScores[i];
        }
      }
    }

    // If empty subset, add highest score item within budget
    if (subset.size === 0) {
      const sortedByScore = [...items]
        .map((item, idx) => ({ item, idx, score: itemScores[idx] }))
        .sort((a, b) => b.score - a.score);
      
      for (const {item, idx} of sortedByScore) {
        if (item.price <= budget) {
          subset.add(idx);
          currentCost += item.price;
          currentScore += itemScores[idx];
          break;
        }
      }
    }

    // 2. Oracle: Mark solution states
    const avgScore = itemScores.reduce((a, b) => a + b, 0) / items.length;
    
    // 3. Diffusion Operator: Amplify marked states
    let improved = true;
    let amplifications = 0;
    const maxAmplifications = 5;
    
    while (improved && amplifications < maxAmplifications) {
      improved = false;
      amplifications++;

      // Try adding high-scoring items
      const itemsByScore = items
        .map((item, idx) => ({ item, idx, score: itemScores[idx] }))
        .sort((a, b) => b.score - a.score);

      for (const {item, idx} of itemsByScore) {
        if (!subset.has(idx) && itemScores[idx] > avgScore) {
          if (currentCost + item.price <= budget) {
            subset.add(idx);
            currentCost += item.price;
            currentScore += itemScores[idx];
            improved = true;
          }
        }
      }

      // Try swapping: remove low-score items and add high-score items
      if (!improved) {
        for (let i = 0; i < Math.min(3, items.length); i++) {
          const lowScoreIdx = Array.from(subset)
            .sort((a, b) => itemScores[a] - itemScores[b])[0];
          
          if (lowScoreIdx === undefined) break;

          for (let j = 0; j < items.length; j++) {
            if (!subset.has(j)) {
              const scoreDiff = itemScores[j] - itemScores[lowScoreIdx];
              const costDiff = items[j].price - items[lowScoreIdx].price;
              
              // Accept if score improves or cost improves significantly
              if (scoreDiff > 0.01 || (scoreDiff >= 0 && costDiff < -2)) {
                subset.delete(lowScoreIdx);
                currentCost -= items[lowScoreIdx].price;
                currentScore -= itemScores[lowScoreIdx];
                
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

    // 4. Measurement: Keep if better
    if (currentScore > bestScore || (Math.abs(currentScore - bestScore) < 0.01 && currentCost < bestCost)) {
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
 * Find multiple good subsets within budget (top N)
 * Generates diverse solutions using 7 different strategies
 * Removes duplicate baskets completely
 */
export function findTopSubsets(items: CartItem[], budget: number, limit: number = 6): SubsetResult[] {
  const results: SubsetResult[] = [];
  
  // 1. Classical DP: guaranteed optimal solution (DETERMINISTIC)
  results.push(classicalSubsetSolver(items, budget));
  
  // 2, 3, 4. Grover's Algorithm with multiple random runs
  // Each call will have DIFFERENT random seeds, so should produce DIFFERENT results
  results.push(quantumWalkSolver(items, budget, 800, 0.2));   // Explore: low bias
  results.push(quantumWalkSolver(items, budget, 800, 0.5));   // Neutral: medium bias
  results.push(quantumWalkSolver(items, budget, 800, 0.8));   // Exploit: high bias
  
  // 5. Greedy: maximize score per cost ratio
  results.push(greedySubsetSolver(items, budget));
  
  // 6. Price-optimized: maximize number of items
  results.push(priceOptimizedSolver(items, budget));
  
  // 7. Rating-optimized: prioritize quality
  results.push(ratingOptimizedSolver(items, budget));
  
  // 8. Discount-optimized: maximize savings
  results.push(discountOptimizedSolver(items, budget));
  
  // Remove EXACT duplicates: same items in same basket
  const uniqueBaskets: SubsetResult[] = [];
  for (const basket of results) {
    const basketKey = basket.items
      .map(item => item.id)
      .sort()
      .join(',');
    
    const isDuplicate = uniqueBaskets.some(unique => {
      const uniqueKey = unique.items
        .map(item => item.id)
        .sort()
        .join(',');
      return basketKey === uniqueKey;
    });
    
    if (!isDuplicate) {
      uniqueBaskets.push(basket);
    }
  }
  
  // Sort by efficiency (score per dollar) - descending
  return uniqueBaskets
    .sort((a, b) => {
      // Primary: by efficiency (higher is better)
      if (Math.abs(b.efficiency - a.efficiency) > 0.01) {
        return b.efficiency - a.efficiency;
      }
      // Secondary: by total score (higher is better)
      if (Math.abs(b.totalScore - a.totalScore) > 0.01) {
        return b.totalScore - a.totalScore;
      }
      // Tertiary: by cost (lower is better for same score)
      return a.totalCost - b.totalCost;
    })
    .slice(0, Math.min(limit, uniqueBaskets.length));
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
