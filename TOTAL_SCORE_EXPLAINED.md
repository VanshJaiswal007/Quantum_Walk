# 📊 Total Score Determination

## The Simple Answer

**Total Score = Sum of Individual Item Scores**

Each item gets a score (0-1 range), and the basket's total score is just all those scores added together.

```
Basket Total Score = Item₁ Score + Item₂ Score + Item₃ Score + ...
```

---

## Individual Item Score Formula

Each item is scored using this weighted formula:

```
Item Score = (Price Component × 0.30) +
             (Rating Component × 0.25) +
             (Discount Component × 0.20) +
             (Priority Component × 0.15) +
             (Base Relevance × 0.10)
```

### Breaking Down Each Component

#### 1. **Price Component (30% weight)** 💰

```
Price Score = 1 - (item_price / max_price)
```

**Logic:** Cheaper items score higher.

**Example with Max Price = $200:**
- Item priced at $50 → Price score = 1 - (50/200) = 1 - 0.25 = **0.75**
- Item priced at $100 → Price score = 1 - (100/200) = 1 - 0.50 = **0.50**
- Item priced at $200 → Price score = 1 - (200/200) = 1 - 1.0 = **0.00**

Then multiply by weight: **Price Contribution = Score × 0.30**

---

#### 2. **Rating Component (25% weight)** ⭐

```
Rating Score = item_rating / 5
```

**Logic:** Higher ratings score higher.

**Example:**
- 5-star item → Rating score = 5/5 = **1.0**
- 4-star item → Rating score = 4/5 = **0.80**
- 3-star item → Rating score = 3/5 = **0.60**

Then multiply by weight: **Rating Contribution = Score × 0.25**

---

#### 3. **Discount Component (20% weight)** 🏷️

```
Discount Score = discount_percentage
```

**Logic:** Higher discounts score higher.

**Example:**
- 30% discount → Discount score = **0.30**
- 15% discount → Discount score = **0.15**
- No discount → Discount score = **0.00**

Then multiply by weight: **Discount Contribution = Score × 0.20**

---

#### 4. **Priority Component (15% weight)** 🎯

```
Priority Score = priority_value (0-1)
```

**Logic:** User's priority preference.

**Example:**
- User marked "High Priority" → Priority score = **1.0**
- User marked "Medium Priority" → Priority score = **0.5**
- User marked "Low Priority" → Priority score = **0.0**

Then multiply by weight: **Priority Contribution = Score × 0.15**

---

#### 5. **Base Relevance (10% weight)** 📌

```
Base Relevance = 0.10 (fixed constant)
```

**Logic:** Every item gets 10% base relevance just for being relevant.

**Contribution = 0.10**

---

## Complete Example

### Sample Item Data

```
Item: Wireless Headphones
├─ Price: $79.99
├─ Rating: 4.5 stars
├─ Discount: 20%
├─ Priority: 0.8 (high)
└─ Max Price in Cart: $200
```

### Step-by-Step Calculation

#### Step 1: Price Component
```
Price score = 1 - (79.99 / 200) = 1 - 0.40 = 0.60
Price contribution = 0.60 × 0.30 = 0.18
```

#### Step 2: Rating Component
```
Rating score = 4.5 / 5 = 0.90
Rating contribution = 0.90 × 0.25 = 0.225
```

#### Step 3: Discount Component
```
Discount score = 0.20
Discount contribution = 0.20 × 0.20 = 0.04
```

#### Step 4: Priority Component
```
Priority score = 0.8
Priority contribution = 0.8 × 0.15 = 0.12
```

#### Step 5: Base Relevance
```
Base relevance = 0.10
```

#### Step 6: Total Item Score
```
Total = 0.18 + 0.225 + 0.04 + 0.12 + 0.10
Total = 0.665
```

**This item scores: 0.665 out of 1.0 (66.5%)**

---

## Full Basket Example

### Scenario
Your cart has 4 items, max price is $200:

```
Item 1: Headphones ($79.99, 4.5⭐, 20% off, priority 0.8)
  → Score: 0.665 ✓

Item 2: USB Cable ($19.99, 4.8⭐, 10% off, priority 0.3)
  Score breakdown:
  ├─ Price: (1 - 19.99/200) × 0.30 = 0.95 × 0.30 = 0.285
  ├─ Rating: (4.8/5) × 0.25 = 0.96 × 0.25 = 0.240
  ├─ Discount: 0.10 × 0.20 = 0.020
  ├─ Priority: 0.3 × 0.15 = 0.045
  └─ Base: 0.10
  → Score: 0.690

Item 3: Phone Case ($24.99, 4.2⭐, 15% off, priority 0.6)
  Score breakdown:
  ├─ Price: (1 - 24.99/200) × 0.30 = 0.875 × 0.30 = 0.262
  ├─ Rating: (4.2/5) × 0.25 = 0.84 × 0.25 = 0.210
  ├─ Discount: 0.15 × 0.20 = 0.030
  ├─ Priority: 0.6 × 0.15 = 0.090
  └─ Base: 0.10
  → Score: 0.692

Item 4: Screen Protector ($12.99, 4.6⭐, 25% off, priority 0.9)
  Score breakdown:
  ├─ Price: (1 - 12.99/200) × 0.30 = 0.935 × 0.30 = 0.280
  ├─ Rating: (4.6/5) × 0.25 = 0.92 × 0.25 = 0.230
  ├─ Discount: 0.25 × 0.20 = 0.050
  ├─ Priority: 0.9 × 0.15 = 0.135
  └─ Base: 0.10
  → Score: 0.795
```

### Basket Total Score

```
Total Score = 0.665 + 0.690 + 0.692 + 0.795 = 2.842
```

Your basket's total score is **2.842** (out of theoretical max of 4.0 for 4 items).

---

## Why These Weights?

| Component | Weight | Reasoning |
|-----------|--------|-----------|
| Price (cheaper) | 30% | Major factor - affordability matters most |
| Rating | 25% | Quality/reviews matter significantly |
| Discount | 20% | Saves money - important |
| Priority | 15% | Your preferences matter |
| Base Relevance | 10% | Everything is somewhat relevant |
| **Total** | **100%** | Always sums to 1.0 |

---

## Score Range

```
Minimum score per item: 0.10 (base only, if all other components are zero)
Maximum score per item: 1.0 (perfect on all metrics)

For a 4-item basket:
  Minimum total: 0.40
  Maximum total: 4.0
```

---

## Real UI Example

When you see this in the app:

```
✨ Basket 1
├─ Items: Headphones, Cable, Case, Protector
├─ Total Cost: $137.96
├─ Value Score: 2.84  ← This is the sum we calculated!
└─ Efficiency: 0.0206 ← This is 2.84 / 137.96
```

The **2.84** is literally the sum of all four item scores.

---

## How This Affects Basket Selection

The solvers try to **maximize total score within your budget**.

```
Budget: $500

Possible Baskets:
  A: 3 items, Cost $200, Score 1.85  → Efficiency: 0.0093
  B: 8 items, Cost $490, Score 2.84  → Efficiency: 0.0058 ✅ Highest score!
  C: 5 items, Cost $250, Score 2.50  → Efficiency: 0.0100 (best efficiency)
```

The algorithm picks **B** because it has the highest total score (2.84), even though **C** has better efficiency.

---

## Key Insights

1. **Total Score = Sum of Items**
   - More items = potentially higher score
   - But each item must have decent individual score

2. **Each Item Scored Independently**
   - An item's score doesn't depend on what else is in the basket
   - Only depends on item attributes and max price

3. **Weights Show Priorities**
   - Price (30%) + Rating (25%) = 55% of the score
   - Quality and affordability matter most
   - Your priorities only count for 15%

4. **Budget Constraint**
   - Total score could be 4.0 for a 4-item basket
   - But you might only afford items that score 2.5 total
   - The solvers find the best within budget

5. **Efficiency vs Score**
   - High score basket might have low efficiency (spend lots)
   - Low cost basket might have lower score
   - Compare both metrics to choose!

---

## Code Reference

From `server/solvers/quantumSolver.ts`:

```typescript
export function computeItemScore(item: CartItem, maxPrice: number): number {
  const normalizedPrice = Math.min(item.price / maxPrice, 1);
  const ratingScore = item.rating / 5;
  const discountScore = item.discount;
  const priorityScore = item.priority;
  
  const score =
    (1 - normalizedPrice) * 0.3 +  // Price: 30%
    ratingScore * 0.25 +            // Rating: 25%
    discountScore * 0.2 +           // Discount: 20%
    priorityScore * 0.15 +          // Priority: 15%
    0.1;                            // Base: 10%
  
  return score;
}
```

This function runs for every item, and the **total score is simply the sum of all item scores in the basket**.

---

**Remember:** Higher total score = better overall recommendations for your budget! 🎯
