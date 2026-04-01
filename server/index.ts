import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
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

// Create API router
const apiRouter = express.Router();

// Health check
apiRouter.get('/health', (req: Request, res: Response) => {
  const cwd = process.cwd();
  const possiblePaths = [
    path.join(cwd, 'dataset', 'amazon_top_15.json'),
    path.join(cwd, 'Quantum', 'dataset', 'amazon_top_15.json'),
    'D:\\Projects\\Quantum\\dataset\\amazon_top_15.json',
    path.join(__dirname, '..', 'dataset', 'amazon_top_15.json')
  ];
  
  console.log('[health] Current working directory:', cwd);
  console.log('[health] Checking paths:');
  possiblePaths.forEach((p, i) => {
    console.log(`  ${i+1}. ${p} - Exists: ${fs.existsSync(p)}`);
  });
  
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    cwd,
    testPaths: possiblePaths.map(p => ({ path: p, exists: fs.existsSync(p) }))
  });
});

// Get dummy items
apiRouter.get('/dummy-items', (req: Request, res: Response) => {
  try {
    const items = getDummyItems();
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to load dummy items' });
  }
});

// Get Amazon products with ML relevance scores
apiRouter.get('/amazon-products', (req: Request, res: Response) => {
  try {
    // Try multiple possible paths
    const possiblePaths = [
      path.join(process.cwd(), 'dataset', 'amazon_top_15.json'),
      'D:\\Projects\\Quantum\\dataset\\amazon_top_15.json'
    ];
    
    let jsonPath = null;
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        jsonPath = p;
        break;
      }
    }
    
    if (!jsonPath) {
      return res.status(404).json({ 
        success: false, 
        error: `Amazon products file not found. Run: node ml/train.cjs`,
        searchedPaths: possiblePaths
      });
    }
    
    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    let products;
    
    try {
      products = JSON.parse(rawData);
    } catch (parseErr) {
      return res.status(500).json({ 
        success: false, 
        error: `Invalid JSON in amazon_top_15.json` 
      });
    }
    
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(500).json({ 
        success: false, 
        error: `amazon_top_15.json is empty` 
      });
    }
    
    // Convert to CartItem format with safe defaults
    const items = products.map((p: any) => ({
      id: p.id || `item_${Math.random()}`,
      name: p.product_name || 'Unknown',
      price: parseFloat(p.price) || 0,
      category: p.category || 'General',
      rating: parseFloat(p.rating) || 4.0,
      quantity: 1,
      discount: (parseFloat(p.discount_percentage) || 0) / 100,
      priority: parseFloat(p.relevance_score) || 0.5,
      reviews: parseInt(p.rating_count) || 0
    }));
    
    res.json({ 
      success: true, 
      items,
      metadata: {
        source: 'Amazon Kaggle Dataset',
        total: items.length,
        trained: true
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Predict relevance for manual items
apiRouter.post('/predict-relevance', (req: Request, res: Response) => {
  try {
    const { price, rating, discount_percentage, rating_count } = req.body;
    
    if (typeof price !== 'number' || typeof rating !== 'number' || 
        typeof rating_count !== 'number') {
      return res.status(400).json({ 
        success: false, 
        error: 'Price, rating, and rating_count are required' 
      });
    }
    
    // Calculate relevance: (rating/5 * 0.6) + (log(rating_count)/10 * 0.4)
    const ratingScore = (rating / 5.0) * 0.6;
    const popularityScore = (Math.log1p(rating_count) / 10) * 0.4;
    const relevance = Math.min(1, Math.max(0, ratingScore + popularityScore));
    
    res.json({
      success: true,
      relevance_score: relevance,
      breakdown: {
        rating_component: ratingScore,
        popularity_component: popularityScore
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to predict relevance' });
  }
});

// Parse cart items from manual input
apiRouter.post('/parse-items', (req: Request, res: Response) => {
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
apiRouter.post('/validate-items', (req: Request, res: Response) => {
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
apiRouter.post('/recommendations', (req: Request, res: Response) => {
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
apiRouter.post('/solve/classical', (req: Request, res: Response) => {
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
apiRouter.post('/solve/quantum', (req: Request, res: Response) => {
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
apiRouter.post('/solve/comparison', (req: Request, res: Response) => {
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

// Add hyphenated endpoint aliases for frontend compatibility
apiRouter.post('/solve-classical', (req: Request, res: Response) => {
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

apiRouter.post('/solve-quantum', (req: Request, res: Response) => {
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

apiRouter.post('/solve-comparison', (req: Request, res: Response) => {
  try {
    const { items, budget, limit } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Items array required' });
    }
    if (typeof budget !== 'number' || budget <= 0) {
      return res.status(400).json({ success: false, error: 'Valid budget required' });
    }
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

// Mount API router with /api prefix
app.use('/api', apiRouter);

// For backward compatibility, also handle requests without /api prefix
app.use('/', apiRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Quantum Budget Optimizer Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 API: http://localhost:${PORT}/api`);
});
