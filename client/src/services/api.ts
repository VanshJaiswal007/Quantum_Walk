import type { CartItem, SubsetResult } from '../context/AppContext';

// Detect API base URL based on environment
const getAPIBase = () => {
  // In development: frontend is on 5173, backend is on 3000
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Check if we're on the frontend port (5173, 5174, etc.)
    const port = window.location.port;
    if (port === '5173' || port === '5174' || port === '5175' || port === '5176') {
      const apiUrl = 'http://localhost:3000/api';
      console.log('🔌 Development mode: Using backend API at', apiUrl);
      return apiUrl;
    }
  }
  // In production (Vercel): use relative path
  const apiUrl = '/api';
  console.log('🌐 Production mode: Using relative API path', apiUrl);
  return apiUrl;
};

const API_BASE = getAPIBase();
console.log('✅ API_BASE set to:', API_BASE);
export async function loadDummyItems(): Promise<CartItem[]> {
  const response = await fetch(`${API_BASE}/dummy-items`);
  const data = await response.json();
  if (!data.success) throw new Error(data.error || 'Failed to load dummy items');
  return data.items;
}

export async function parseItems(input: string): Promise<{
  items: CartItem[];
  errors: string[];
}> {
  const response = await fetch(`${API_BASE}/parse-items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input }),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.error || 'Failed to parse items');
  return { items: data.items, errors: data.errors || [] };
}

export async function validateItems(items: CartItem[]): Promise<string[]> {
  const response = await fetch(`${API_BASE}/validate-items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.error || 'Validation failed');
  return data.errors || [];
}

export async function getRecommendations(items: CartItem[], topN: number = 5): Promise<CartItem[]> {
  const response = await fetch(`${API_BASE}/recommendations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items, topN }),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.error || 'Failed to get recommendations');
  return data.recommendations;
}

export async function solveClassical(items: CartItem[], budget: number): Promise<SubsetResult> {
  const response = await fetch(`${API_BASE}/solve-classical`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items, budget }),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.error || 'Classical solver failed');
  return data.result;
}

export async function solveQuantum(
  items: CartItem[],
  budget: number,
  iterations: number = 1000
): Promise<SubsetResult> {
  const response = await fetch(`${API_BASE}/solve-quantum`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items, budget, iterations }),
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.error || 'Quantum solver failed');
  return data.result;
}

export async function solveComparison(
  items: CartItem[],
  budget: number,
  limit: number = 6
): Promise<SubsetResult[]> {
  const url = `${API_BASE}/solve-comparison`;
  console.log('📤 Calling comparison solver at:', url);
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items, budget, limit }),
  });
  if (!response.ok) {
    console.error('❌ API error:', response.status, response.statusText);
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  if (!data.success) throw new Error(data.error || 'Comparison solve failed');
  console.log('✅ Received', data.topSubsets?.length || 0, 'baskets');
  return data.topSubsets;
}
