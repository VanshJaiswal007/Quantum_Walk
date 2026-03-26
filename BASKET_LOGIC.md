# 🧺 Basket Optimization Logic Explained

## Overview

When you click **"Find Best Basket"**, the system runs **THREE different algorithms** and returns the **best 2-3 baskets** by comparing their results.

---

## The Three Algorithms

### 1️⃣ **Classical DP Solver** (Dynamic Programming)

**How it works:**
```
1. Build a table: cost → best_score
2. For each item, update what scores are possible at each cost
3. Find the highest score achievable within budget
4. Traceback to get the selected items
```

**Example with budget $100:**
```
Cost $0:   Best score = 0 (empty basket)
Cost $20:  Best score = 1.5 (1 item)
Cost $40:  Best score = 3.2 (2 items)
Cost $60:  Best score = 4.8 (3 items)
Cost $80:  Best score = 5.9 (4 items)
Cost $100: Best score = 6.2 (4 items) ✅ WINNER
```

**Characteristics:**
- ✅ **Guaranteed optimal** - Provably the best solution
- ✅ **Deterministic** - Same result every time
- ⏱️ Fast: ~20-50ms
- 💾 Memory: O(budget)

**Best for:** Smaller budgets, guaranteed correctness

---

### 2️⃣ **Quantum-Walk Solver** (Monte Carlo Simulation)

**How it works:**
```
For 500-1000 iterations:
  1. Initialize: Randomly include items based on their scores (amplitudes)
  2. Explore: Perform random swaps trying to improve
  3. Optimize: Local greedy improvements
  4. Collapse: Keep if better than best found so far
  
Return the best solution found
```

**Step-by-step example (simplified):**
```
Iteration 1: Random init → [Item1, Item3, Item5] → Score 4.5
Iteration 2: Random init → [Item2, Item4, Item6] → Score 4.8
Iteration 3: Swap Item6→Item7 → [Item2, Item4, Item7] → Score 5.2
...
Iteration 500: Final best found → Score 5.8
```

**Characteristics:**
- ⚡ **Fast** - 100-200ms for 1000 iterations
- 🎲 **Probabilistic** - Different results possible (but similar quality)
- 🔍 **Exploration** - Good at finding novel combinations
- 📊 **Approximate** - Usually within 95%+ of optimal

**Best for:** Larger carts, speed-focused scenarios

---

### 3️⃣ **Greedy Solver** (Utility Per Dollar)

**How it works:**
```
1. Calculate value_score / price for each item
2. Sort items by this ratio (highest first)
3. Keep adding items while under budget
```

**Example:**
```
Item A: Score 3.0, Price $50 → Ratio = 0.06
Item B: Score 2.5, Price $20 → Ratio = 0.125 ✅ Better ratio
Item C: Score 4.0, Price $100 → Ratio = 0.04

Sorted by ratio: B → A → C

With $100 budget:
  Add B ($20): Total cost $20, score 2.5
  Add A ($50): Total cost $70, score 5.5
  Can't add C ($100 would exceed budget)
  Final: [B, A] with score 5.5
```

**Characteristics:**
- ⚡ **Very fast** - ~10-20ms
- 🎯 **Intuitive** - "Best bang for buck" approach
- 🚫 **Not optimal** - Can miss better combinations
- 📈 **Good heuristic** - Works well in practice

**Best for:** Quick recommendations, simple cases

---

## Comparison & Deduplication

After running all three:

```
Classical DP Result:
  Items: [A, B, C, D]
  Cost: $95
  Score: 6.2

Quantum Result:
  Items: [A, B, C, D]
  Cost: $95
  Score: 6.2

Greedy Result:
  Items: [B, A]
  Cost: $70
  Score: 5.5

↓ Remove duplicates (first two are identical) ↓

Final Results (sorted by score):
  1. [A, B, C, D] - Score 6.2 ✅ BEST
  2. [B, A] - Score 5.5
```

---

## What You See in the UI

### **Basket 1: "✨ Best Option"**

This is the highest-scoring basket from all three algorithms.

```
Basket 1
├─ Items: 4 items shown
├─ Total Cost: $95
├─ Value Score: 6.2
├─ Efficiency: 0.065 (score per dollar)
└─ Budget Remaining: $5
```

### **Basket 2: Alternative Option** (if different)

If the other algorithms produce different results, you see them too.

```
Basket 2
├─ Items: 2 items shown
├─ Total Cost: $70
├─ Value Score: 5.5
├─ Efficiency: 0.079 (better ratio but fewer items)
└─ Budget Remaining: $30
```

---

## Key Metrics Explained

### **Total Cost**
Sum of all item prices. Should not exceed your budget.

### **Value Score**
Sum of individual item scores. Higher = better recommendations.

```
Score formula per item:
  (1 - price/maxPrice) × 0.30 +  // Cheaper items score higher
  (rating/5) × 0.25 +             // Better rated items score higher
  discount × 0.20 +               // Higher discounts score higher
  priority × 0.15 +               // Your priorities matter
  0.10                            // Base relevance
```

### **Efficiency**
Score divided by cost. Shows how much "value" per dollar spent.

```
Basket A: Score 6.2 / Cost $95 = 0.065 ⭐
Basket B: Score 5.5 / Cost $70 = 0.079 ⭐⭐ Better ratio!
```

Higher efficiency = more value per dollar (but might be fewer items overall).

### **Budget Remaining**
How much of your budget is unused.

---

## Why Multiple Baskets?

### Different Use Cases

**Need maximum quality?**
→ Choose **Basket 1** (highest total score)

**Want best value per dollar?**
→ Look at **Efficiency** metric and choose accordingly

**Want to spend less?**
→ Choose basket with lower cost

**Want more items?**
→ Choose basket with higher item count

---

## Example Walkthrough

### Scenario
- Budget: $500
- Items: 12 tech items
- Running: Comparison mode (all 3 solvers)

### Classical DP Runs
```
DP Table builds up:
  $0 → Score 0
  $20 → Score 1.5 (USB cable)
  $45 → Score 3.2 (cable + case)
  $80 → Score 4.9 (+ mouse pad)
  $160 → Score 7.2 (+ keyboard)
  $240 → Score 8.5 (+ webcam)
  $330 → Score 9.3 (+ power bank)
  $410 → Score 9.8 (+ headphones)
  $500 → Score 10.1 (+ monitor stand) ✅

Result: 8 items, $500 spent, score 10.1
```

### Quantum Walk Runs
```
Iteration 1:   Random init → 5 items → Score 7.2
Iteration 50:  Best so far → 7 items → Score 9.0
Iteration 250: Swap item → 8 items → Score 9.9
Iteration 500: Final best → 8 items → Score 10.0

Result: 8 items, ~$480 spent, score 10.0
```

### Greedy Runs
```
Items sorted by efficiency:
  1. Item A: ratio 0.085
  2. Item B: ratio 0.082
  3. Item C: ratio 0.078
  ...
  
Adding sequentially:
  A ($80) → Score 2.1
  B ($60) → Score 3.8
  C ($75) → Score 5.2
  D ($50) → Score 6.1
  E ($99) → Score 7.5
  F ($35) → Score 8.1
  Stop: Adding next would exceed $500

Result: 6 items, $399 spent, score 8.1
```

### Final Display
```
Basket 1: 8 items, $500, Score 10.1 ✅ BEST
Basket 2: 6 items, $399, Score 8.1 (saves $101)
```

---

## Which Algorithm Wins?

| Scenario | Winner | Why |
|----------|--------|-----|
| Small budget < $200 | Classical DP | Speed + accuracy matters |
| Medium budget $200-1000 | Quantum Walk | Good balance |
| Large budget > $1000 | Quantum Walk | DP memory could be tight |
| Need guaranteed optimal | Classical DP | Mathematically proven |
| Need speed | Greedy | Instant results |
| Need variety | All three | See different approaches |

---

## Performance Notes

### Typical Times
```
Classical DP:      15-50ms
Quantum Walk:      100-200ms (with 500 iterations)
Greedy:            5-10ms
Deduplication:     1-2ms
Total:             ~120-260ms
```

### Memory Usage
```
Classical DP:      O(budget) → ~4KB for $1000 budget
Quantum Walk:      O(items) → ~1KB for 50 items
Greedy:            O(items) → ~1KB for 50 items
```

---

## Summary

The two (or three) baskets shown represent:

1. **Basket 1**: Best score from any algorithm
2. **Basket 2**: Alternative option (if algorithms disagree)

You can compare them by:
- **Total Score** - Which gives most value overall
- **Efficiency** - Which gives best value per dollar
- **Item Count** - Which gives more items
- **Budget Remaining** - Which saves more money

The recommendation: **Start with Basket 1** (highest score) but review Basket 2 for alternatives!

---

**Questions?** Check the "How It Works" panel in the app for more details.
