import express, { Request, Response } from 'express';
import cors from 'cors';
import {
  classicalSubsetSolver,
  quantumWalkSolver,
  getRecommendations,
  findTopSubsets,
} from './solvers/quantumSolver';
import {
  getDummyItems,
  parseCartItems,
  validateItems,
} from './utils/dataUtils';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get dummy items
app.get('/dummy-items', (req: Request, res: Response) => {
  try {
    const items = getDummyItems();
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to load dummy items' });
  }
});

// Parse cart items from manual input
app.post('/parse-items', (req: Request, res: Response) => {
  try {
    const { input } = req.body;

    if (!input || typeof input !== 'string') {
      return res.status(400).json({ success: false, error: 'Input string required' });
    }

    const { items, errors } = parseCartItems(input);

    if (errors.length > 0 && items.length === 0) {
      return res.status(400).json({ success: false, errors });
    }

    res.json({ success: true, items, errors });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to parse items' });
  }
});

// Validate items
app.post('/validate-items', (req: Request, res: Response) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, error: 'Items array required' });
    }

    const errors = validateItems(items);
    res.json({
      success: errors.length === 0,
      errors,
      itemCount: items.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Validation failed' });
  }
});

// Get recommendations
app.post('/recommendations', (req: Request, res: Response) => {
  try {
    const { items, topN } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Items array required' });
    }

    const recommendations = getRecommendations(items, topN || 5);
    res.json({ success: true, recommendations });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate recommendations' });
  }
});

// Solve with classical method
app.post('/solve/classical', (req: Request, res: Response) => {
  try {
    const { items, budget } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Items array required' });
    }

    if (typeof budget !== 'number' || budget <= 0) {
      return res.status(400).json({ success: false, error: 'Valid budget required' });
    }

    const result = classicalSubsetSolver(items, budget);
    res.json({ success: true, result, solverType: 'classical' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Classical solver failed' });
  }
});

// Solve with quantum-walk inspired method
app.post('/solve/quantum', (req: Request, res: Response) => {
  try {
    const { items, budget, iterations } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Items array required' });
    }

    if (typeof budget !== 'number' || budget <= 0) {
      return res.status(400).json({ success: false, error: 'Valid budget required' });
    }

    const result = quantumWalkSolver(items, budget, iterations || 1000);
    res.json({ success: true, result, solverType: 'quantum-walk' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Quantum solver failed' });
  }
});

// Solve and find top subsets (comparison mode)
app.post('/solve/comparison', (req: Request, res: Response) => {
  try {
    const { items, budget, limit } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Items array required' });
    }

    if (typeof budget !== 'number' || budget <= 0) {
      return res.status(400).json({ success: false, error: 'Valid budget required' });
    }

    // Default to 6 baskets, allow up to 10
    const basketLimit = Math.min(limit || 6, 10);
    const topSubsets = findTopSubsets(items, budget, basketLimit);
    
    res.json({ 
      success: true, 
      topSubsets,
      basketCount: topSubsets.length,
      algorithms: ['Classical DP', 'Grover Algorithm (2 runs)', 'Greedy', 'Price-Optimized', 'Rating-Optimized', 'Discount-Optimized']
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Comparison solve failed' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Quantum Budget Optimizer Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
