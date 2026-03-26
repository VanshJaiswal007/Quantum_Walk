import { VercelRequest, VercelResponse } from '@vercel/node';

// Dummy dataset - same as in server
const DUMMY_ITEMS = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 79.99,
    category: 'Electronics',
    rating: 4.5,
    discount: 0.15,
    priority: 0.8,
    quantity: 1,
  },
  {
    id: '2',
    name: 'USB-C Cable (3-pack)',
    price: 19.99,
    category: 'Accessories',
    rating: 4.2,
    discount: 0.1,
    priority: 0.6,
    quantity: 1,
  },
  {
    id: '3',
    name: 'Phone Case',
    price: 24.99,
    category: 'Accessories',
    rating: 4.7,
    discount: 0.2,
    priority: 0.7,
    quantity: 1,
  },
  {
    id: '4',
    name: 'Screen Protector (5-pack)',
    price: 12.99,
    category: 'Accessories',
    rating: 4.3,
    discount: 0.25,
    priority: 0.5,
    quantity: 1,
  },
  {
    id: '5',
    name: 'Portable Power Bank',
    price: 49.99,
    category: 'Electronics',
    rating: 4.6,
    discount: 0.18,
    priority: 0.75,
    quantity: 1,
  },
  {
    id: '6',
    name: 'Laptop Stand',
    price: 39.99,
    category: 'Accessories',
    rating: 4.4,
    discount: 0.12,
    priority: 0.65,
    quantity: 1,
  },
];

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
    if (req.method === 'GET') {
      res.status(200).json({ success: true, items: DUMMY_ITEMS });
    } else {
      res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
}
