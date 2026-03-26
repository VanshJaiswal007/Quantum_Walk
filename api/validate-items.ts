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

function validateItems(items: CartItem[]): string[] {
  const errors: string[] = [];

  if (!Array.isArray(items)) {
    return ['Items must be an array'];
  }

  items.forEach((item, index) => {
    if (!item.name || typeof item.name !== 'string') {
      errors.push(`Item ${index + 1}: Name is required and must be a string`);
    }

    if (typeof item.price !== 'number' || item.price <= 0) {
      errors.push(`Item ${index + 1}: Price must be a positive number`);
    }

    if (item.quantity && (typeof item.quantity !== 'number' || item.quantity < 1)) {
      errors.push(`Item ${index + 1}: Quantity must be a positive number`);
    }
  });

  return errors;
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
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, error: 'Items array required' });
    }

    const errors = validateItems(items);

    res.status(200).json({
      success: errors.length === 0,
      errors,
      itemCount: items.length,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
}
