import { IncomingMessage, ServerResponse } from 'http';
import {
  classicalSubsetSolver,
  quantumWalkSolver,
  getRecommendations,
  findTopSubsets,
} from '../server/solvers/quantumSolver';
import {
  getDummyItems,
  parseCartItems,
  validateItems,
} from '../server/utils/dataUtils';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  try {
    let body = '';
    
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      const params = JSON.parse(body || '{}');
      const { action } = params;

      try {
        switch (action) {
          case 'health':
            res.statusCode = 200;
            return res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));

          case 'dummy-items': {
            const items = getDummyItems();
            res.statusCode = 200;
            return res.end(JSON.stringify({ success: true, items }));
          }

          case 'parse-items': {
            const { input } = params;
            if (!input || typeof input !== 'string') {
              res.statusCode = 400;
              return res.end(JSON.stringify({ success: false, error: 'Input string required' }));
            }
            const { items: parsedItems, errors } = parseCartItems(input);
            if (errors.length > 0 && parsedItems.length === 0) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ success: false, errors }));
            }
            res.statusCode = 200;
            return res.end(JSON.stringify({ success: true, items: parsedItems, errors }));
          }

          case 'validate-items': {
            const { items: itemsToValidate } = params;
            if (!Array.isArray(itemsToValidate)) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ success: false, error: 'Items array required' }));
            }
            const errors = validateItems(itemsToValidate);
            res.statusCode = 200;
            return res.end(JSON.stringify({
              success: errors.length === 0,
              errors,
              itemCount: itemsToValidate.length,
            }));
          }

          case 'recommendations': {
            const { items: itemsForRecs, topN = 5 } = params;
            if (!Array.isArray(itemsForRecs) || itemsForRecs.length === 0) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ success: false, error: 'Items array required' }));
            }
            const recommendations = getRecommendations(itemsForRecs, topN);
            res.statusCode = 200;
            return res.end(JSON.stringify({ success: true, recommendations }));
          }

          case 'solve-classical': {
            const { items: classicalItems, budget } = params;
            if (!Array.isArray(classicalItems) || classicalItems.length === 0) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ success: false, error: 'Items array required' }));
            }
            if (typeof budget !== 'number' || budget <= 0) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ success: false, error: 'Valid budget required' }));
            }
            const result = classicalSubsetSolver(classicalItems, budget);
            res.statusCode = 200;
            return res.end(JSON.stringify({ success: true, result, solverType: 'classical' }));
          }

          case 'solve-quantum': {
            const { items: quantumItems, budget, iterations = 1000 } = params;
            if (!Array.isArray(quantumItems) || quantumItems.length === 0) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ success: false, error: 'Items array required' }));
            }
            if (typeof budget !== 'number' || budget <= 0) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ success: false, error: 'Valid budget required' }));
            }
            const result = quantumWalkSolver(quantumItems, budget, iterations);
            res.statusCode = 200;
            return res.end(JSON.stringify({ success: true, result, solverType: 'quantum' }));
          }

          case 'solve-comparison': {
            const { items: comparisonItems, budget, limit = 6 } = params;
            if (!Array.isArray(comparisonItems) || comparisonItems.length === 0) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ success: false, error: 'Items array required' }));
            }
            if (typeof budget !== 'number' || budget <= 0) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ success: false, error: 'Valid budget required' }));
            }
            const topSubsets = findTopSubsets(comparisonItems, budget, Math.min(limit, 10));
            res.statusCode = 200;
            return res.end(JSON.stringify({
              success: true,
              topSubsets,
              basketCount: topSubsets.length,
              algorithms: [
                'Classical DP',
                'Grover Algorithm (2 runs)',
                'Greedy',
                'Price-Optimized',
                'Rating-Optimized',
                'Discount-Optimized',
              ],
            }));
          }

          default:
            res.statusCode = 400;
            return res.end(JSON.stringify({ success: false, error: 'Unknown action' }));
        }
      } catch (error) {
        console.error('Handler error:', error);
        res.statusCode = 500;
        return res.end(JSON.stringify({
          success: false,
          error: error instanceof Error ? error.message : 'Internal server error',
        }));
      }
    });
  } catch (error) {
    console.error('API Error:', error);
    res.statusCode = 500;
    res.end(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    }));
  }
}

