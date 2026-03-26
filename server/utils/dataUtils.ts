import type { CartItem } from '../solvers/quantumSolver';

// Dummy dataset with various product categories
const DUMMY_ITEMS: CartItem[] = [
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
    discount: 0.1,
    priority: 0.8,
    quantity: 1,
  },
  {
    id: '6',
    name: 'Laptop Stand',
    price: 34.99,
    category: 'Office',
    rating: 4.4,
    discount: 0.15,
    priority: 0.7,
    quantity: 1,
  },
  {
    id: '7',
    name: 'Keyboard (Mechanical)',
    price: 89.99,
    category: 'Electronics',
    rating: 4.8,
    discount: 0.2,
    priority: 0.9,
    quantity: 1,
  },
  {
    id: '8',
    name: 'Mouse Pad',
    price: 15.99,
    category: 'Office',
    rating: 4.1,
    discount: 0.1,
    priority: 0.4,
    quantity: 1,
  },
  {
    id: '9',
    name: 'Webcam HD',
    price: 59.99,
    category: 'Electronics',
    rating: 4.5,
    discount: 0.15,
    priority: 0.7,
    quantity: 1,
  },
  {
    id: '10',
    name: 'Desk Lamp (LED)',
    price: 44.99,
    category: 'Office',
    rating: 4.6,
    discount: 0.12,
    priority: 0.6,
    quantity: 1,
  },
  {
    id: '11',
    name: 'Monitor Stand',
    price: 39.99,
    category: 'Office',
    rating: 4.3,
    discount: 0.1,
    priority: 0.5,
    quantity: 1,
  },
  {
    id: '12',
    name: 'Wireless Mouse',
    price: 29.99,
    category: 'Electronics',
    rating: 4.4,
    discount: 0.2,
    priority: 0.7,
    quantity: 1,
  },
];

export function getDummyItems(): CartItem[] {
  return JSON.parse(JSON.stringify(DUMMY_ITEMS));
}

/**
 * Parse cart items from a string in format:
 * name | price | category | rating | discount | priority
 * One item per line
 */
export function parseCartItems(input: string): {
  items: CartItem[];
  errors: string[];
} {
  const lines = input.trim().split('\n').filter(line => line.trim());
  const items: CartItem[] = [];
  const errors: string[] = [];

  lines.forEach((line, idx) => {
    const parts = line.split('|').map(p => p.trim());
    
    if (parts.length < 2) {
      errors.push(`Line ${idx + 1}: Expected at least name and price`);
      return;
    }

    const name = parts[0];
    const price = parseFloat(parts[1]);
    const category = parts[2] || 'General';
    const rating = parseFloat(parts[3]) || 4.0;
    const discount = parseFloat(parts[4]) || 0;
    const priority = parseFloat(parts[5]) || 0.5;

    if (!name) {
      errors.push(`Line ${idx + 1}: Item name is required`);
      return;
    }

    if (isNaN(price) || price <= 0) {
      errors.push(`Line ${idx + 1}: Price must be a positive number`);
      return;
    }

    if (rating < 0 || rating > 5) {
      errors.push(`Line ${idx + 1}: Rating must be between 0 and 5`);
      return;
    }

    if (discount < 0 || discount > 1) {
      errors.push(`Line ${idx + 1}: Discount must be between 0 and 1`);
      return;
    }

    if (priority < 0 || priority > 1) {
      errors.push(`Line ${idx + 1}: Priority must be between 0 and 1`);
      return;
    }

    items.push({
      id: `custom_${Date.now()}_${idx}`,
      name,
      price,
      category,
      rating: Math.min(Math.max(rating, 0), 5),
      discount: Math.min(Math.max(discount, 0), 1),
      priority: Math.min(Math.max(priority, 0), 1),
      quantity: 1,
    });
  });

  return { items, errors };
}

/**
 * Validate cart items
 */
export function validateItems(items: CartItem[]): string[] {
  const errors: string[] = [];

  if (!items || items.length === 0) {
    errors.push('Cart is empty');
    return errors;
  }

  items.forEach((item, idx) => {
    if (!item.name || !item.name.trim()) {
      errors.push(`Item ${idx + 1}: Name is required`);
    }
    if (!item.price || item.price <= 0) {
      errors.push(`Item ${idx + 1}: Price must be positive`);
    }
    if (item.rating < 0 || item.rating > 5) {
      errors.push(`Item ${idx + 1}: Rating must be 0-5`);
    }
  });

  return errors;
}
