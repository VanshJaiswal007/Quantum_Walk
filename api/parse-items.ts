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

function parseCartItems(input: string): { items: CartItem[]; errors: string[] } {
  const lines = input.split('\n').filter((line) => line.trim());
  const items: CartItem[] = [];
  const errors: string[] = [];

  lines.forEach((line, index) => {
    const parts = line.split(',').map((p) => p.trim());

    if (parts.length < 2) {
      errors.push(`Line ${index + 1}: Invalid format. Expected: name, price`);
      return;
    }

    const name = parts[0];
    const price = parseFloat(parts[1]);

    if (!name || !name.trim()) {
      errors.push(`Line ${index + 1}: Item name is required`);
      return;
    }

    if (isNaN(price) || price <= 0) {
      errors.push(`Line ${index + 1}: Valid price is required (must be > 0)`);
      return;
    }

    items.push({
      id: `item_${Date.now()}_${index}`,
      name: name.trim(),
      price,
      category: parts[2]?.trim() || 'Uncategorized',
      rating: parseFloat(parts[3]) || 4.0,
      discount: parseFloat(parts[4]) || 0,
      priority: parseFloat(parts[5]) || 0.5,
      quantity: parseInt(parts[6]) || 1,
    });
  });

  return { items, errors };
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
    const { input } = req.body;

    if (!input || typeof input !== 'string') {
      return res.status(400).json({ success: false, error: 'Input string required' });
    }

    const { items, errors } = parseCartItems(input);

    if (errors.length > 0 && items.length === 0) {
      return res.status(400).json({ success: false, errors });
    }

    res.status(200).json({ success: true, items, errors });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
}
