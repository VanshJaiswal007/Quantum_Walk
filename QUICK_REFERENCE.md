# 🎯 Quick Reference: Grover's Algorithm & 6 Baskets

## The 6 Solvers Explained Simply

### 1. **Classical DP** 🏆
- **Strategy**: Mathematically optimal
- **How**: Builds cost→score table, finds best solution
- **Best for**: Guaranteed best result
- **Time**: ~20ms
- **Result**: Highest score possible

### 2. **Grover 500 Iterations** ⚡
- **Strategy**: Quantum amplitude amplification (fast)
- **How**: Oracle marks good subsets, diffusion amplifies
- **Best for**: Quick exploration
- **Time**: ~15ms
- **Result**: Usually 95%+ optimal, different approach than classical

### 3. **Grover 750 Iterations** ⚡⚡
- **Strategy**: Quantum amplitude amplification (deep)
- **How**: Longer amplification process, more refined
- **Best for**: Better quality quantum result
- **Time**: ~18ms
- **Result**: Often finds different path than 500-iter version

### 4. **Greedy** 💎
- **Strategy**: Best value per dollar
- **How**: Sort by score/cost ratio, add items in order
- **Best for**: Maximizing bang for buck
- **Time**: ~5ms
- **Result**: Fast heuristic, good practical solution

### 5. **Price-Optimized** 📦
- **Strategy**: Maximum items within budget
- **How**: Sort by price (lowest first), add items
- **Best for**: "I want as many items as possible"
- **Time**: ~3ms
- **Result**: Most items, but lower individual quality

### 6. **Rating-Optimized** ⭐
- **Strategy**: Highest-rated items only
- **How**: Sort by rating (highest first), add items
- **Best for**: "I only want top-quality items"
- **Time**: ~3ms
- **Result**: Best quality items (but fewer of them)

### 7. **Discount-Optimized** 🏷️
- **Strategy**: Best deals and discounts
- **How**: Sort by discount (highest first), add items
- **Best for**: "Maximize savings"
- **Time**: ~3ms
- **Result**: Items with best discounts (may not be optimal value)

---

## How to Choose Your Basket

### You want the best recommendation?
→ **Choose Basket 1** (Always Classical DP or Grover's best)

### You want maximum items?
→ **Look for Price-Optimized basket** (6 items vs 4 items, for example)

### You want best quality?
→ **Look for Rating-Optimized basket** (All 5-star items)

### You want best deals?
→ **Look for Discount-Optimized basket** (Highest discounts)

### You want best value per dollar?
→ **Look for Greedy basket** (Efficiency metric is highest)

### You want to compare quantum vs classical?
→ **Compare Basket 1 (Classical) vs Basket 2-3 (Grover's)**

---

## Example Scenario

**Budget**: $500

```
Basket 1: [Keyboard, Monitor, Stand]
├─ Cost: $495
├─ Score: 4.95 ← HIGHEST SCORE ✨
├─ Items: 3
└─ Efficiency: 0.01
   Why chosen: Classical DP (optimal)

Basket 2: [Keyboard, Monitor, Cable, Mouse Pad]
├─ Cost: $480
├─ Score: 4.88
├─ Items: 4
└─ Efficiency: 0.0102
   Why chosen: Grover's 750 iterations

Basket 3: [Keyboard, Monitor, Case, Stand]
├─ Cost: $490
├─ Score: 4.86
├─ Items: 4
└─ Efficiency: 0.0099
   Why chosen: Grover's 500 iterations

Basket 4: [Keyboard, Mouse, Case, Cable, Charger]
├─ Cost: $475
├─ Score: 4.40
├─ Items: 5
└─ Efficiency: 0.0093 ← BEST EFFICIENCY
   Why chosen: Greedy (value/dollar)

Basket 5: [Monitor, Keyboard, Headphones, Cable]
├─ Cost: $490
├─ Score: 4.82
├─ Items: 4
├─ Efficiency: 0.0098
└─ Avg Rating: 4.8 ← HIGHEST QUALITY
   Why chosen: Rating-optimized (best reviews)

Basket 6: [Keyboard, Mouse, Case, Charger, Cable, Pad]
├─ Cost: $450
├─ Score: 3.95
├─ Items: 6 ← MOST ITEMS
├─ Efficiency: 0.0088
└─ Avg Price: $75
   Why chosen: Price-optimized (cheapest)
```

## Decision Matrix

| Goal | Choose | Why |
|------|--------|-----|
| Best overall | Basket 1 | Highest score |
| Quantum algorithms | Basket 2-3 | Grover's results |
| Save money | Basket 6 | Most items |
| Best quality | Basket 5 | Highest ratings |
| Best deals | See Discount basket | Best discounts |
| Best value ratio | Basket 4 | Efficiency |

---

## Grover's Algorithm in 30 Seconds

```
1. START: All solutions equally probable

2. ORACLE: "Mark the good solutions"
   (Those with high score)

3. DIFFUSION: "Amplify those marked solutions"
   (Increase their probability)

4. REPEAT: Steps 2-3 for √N iterations

5. MEASURE: Pick solution (highly probable now!)

Result: Found a great solution via quantum magic ✨
```

---

## Why 6 Baskets?

### Coverage
- ✅ **1 Classical DP** (guaranteed optimal)
- ✅ **2 Grover's runs** (quantum exploration, different paths)
- ✅ **3 Optimized solvers** (price, rating, discount)

### Diversity
- Different algorithms → Different solutions
- See all major optimization strategies
- Compare trade-offs (quality vs quantity)

### Completeness
- Every major approach represented
- Both quantum and classical methods
- Every important user preference covered

---

## Performance Summary

```
Running all 6+ solvers takes ~70ms total

Individual solver times:
├─ Classical DP:           20ms
├─ Grover (500 iters):     15ms
├─ Grover (750 iters):     18ms
├─ Greedy:                  5ms
├─ Price-Optimized:         3ms
├─ Rating-Optimized:        3ms
└─ Discount-Optimized:      3ms
    (+ deduplication & sorting)

Total for comparison: ~70ms (hardly noticeable!)
```

---

## Key Metrics Explained

### **Total Cost**
Sum of item prices. Should not exceed budget.

### **Value Score**
Sum of individual item scores (higher = better recommendations).

### **Efficiency**
Score ÷ Cost = Value per dollar spent.
- High efficiency = good value per dollar
- Low efficiency = spending more per unit score

### **Items**
How many items in the basket.
- More items = more things to buy
- Fewer items = more expensive items but high quality

---

## Grover's vs Classical DP

### Classical DP
- ✅ Always optimal
- ✅ Mathematically proven
- ❌ Slower for very large problems
- 🎯 Use when: Need guaranteed best

### Grover's Algorithm
- ✅ Quantum-inspired
- ✅ Faster (quadratic speedup)
- ❌ Can be ~5% below optimal
- 🎯 Use when: Speed and practicality matter

### In Practice
**Both are in the top baskets!** Classical gives you proven optimal, Grover's shows alternative quantum approach.

---

## Real-World Use Cases

### "I need everything under $100"
→ Use **Price-Optimized** basket
→ Gets maximum items that fit

### "I only buy premium products"
→ Use **Rating-Optimized** basket
→ All 4.5+ star items

### "I'm looking for deals"
→ Use **Discount-Optimized** basket
→ Best discounts available

### "I want the mathematically best basket"
→ Use **Basket 1** (Classical DP)
→ Proven optimal solution

### "I want to see quantum computing in action"
→ Compare **Basket 1 vs Basket 2-3**
→ See Grover's Algorithm results vs classical

---

## Remember

```
6 Different Baskets = 6 Different Perspectives

├─ Classical: "Here's the mathematically best"
├─ Grover 1: "Quantum says try this"
├─ Grover 2: "Quantum's refined version"
├─ Greedy: "Best bang for your buck"
├─ Price: "Maximum items for budget"
└─ Quality: "Only the best quality"

Pick the one that matches YOUR priorities!
```

---

**Need more details?**
- 📖 `GROVERS_ALGORITHM.md` - Deep dive into quantum algorithm
- 📖 `BASKET_LOGIC.md` - How baskets are generated
- 📖 `TOTAL_SCORE_EXPLAINED.md` - How scoring works
- 📖 `README.md` - Full project documentation
