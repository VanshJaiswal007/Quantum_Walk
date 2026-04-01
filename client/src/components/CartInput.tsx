import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { loadAmazonProducts, parseItems } from '../services/api';

export const CartInput: React.FC = () => {
  const { setCart, setLoading, setError } = useApp();
  const [tab, setTab] = useState<'amazon' | 'manual'>('amazon');
  const [manualInput, setManualInput] = useState('');
  const [parseErrors, setParseErrors] = useState<string[]>([]);

  const handleLoadAmazon = async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await loadAmazonProducts();
      setCart(items);
      setParseErrors([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load Amazon products');
    } finally {
      setLoading(false);
    }
  };

  const handleParse = async () => {
    try {
      setLoading(true);
      setError(null);
      const { items, errors } = await parseItems(manualInput);
      
      if (items.length > 0) {
        setCart(items);
        setParseErrors(errors);
      } else {
        setParseErrors(errors || ['Failed to parse items']);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse items');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card-lg">
      <h2 className="text-2xl font-bold mb-6">Step 1: Load Your Cart</h2>

      <div className="flex gap-4 mb-6 border-b border-slate-200">
        <button
          onClick={() => setTab('amazon')}
          className={`py-3 px-6 font-semibold border-b-2 transition-colors ${
            tab === 'amazon'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          � Load Amazon Data
        </button>
        <button
          onClick={() => setTab('manual')}
          className={`py-3 px-6 font-semibold border-b-2 transition-colors ${
            tab === 'manual'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          ✏️ Enter Manually
        </button>
      </div>

      {tab === 'amazon' && (
        <div className="space-y-4">
          <p className="text-slate-600">
            Load real Amazon products trained with ML relevance scores:
          </p>
          <button onClick={handleLoadAmazon} className="btn-primary w-full">
            🛒 Load 15 Amazon Products
          </button>
          <p className="text-xs text-slate-500">
            Real Kaggle data with ML-calculated relevance based on ratings and review count
          </p>
        </div>
      )}

      {tab === 'manual' && (
        <div className="space-y-4">
          <p className="text-slate-600 text-sm">
            Enter items manually. Relevance will be predicted using the Amazon-trained model:
          </p>
          <code className="block bg-slate-100 p-3 rounded text-xs font-mono">
            Item Name | Price | Category | Rating | Discount | Review Count
            <br />
            Example: Headphones | 2000 | Electronics | 4.5 | 20 | 5000
          </code>
          
          <textarea
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="Wireless Headphones | 2000 | Electronics | 4.5 | 20 | 5000&#10;USB Cable | 500 | Accessories | 4.2 | 10 | 2000"
            className="input-field h-32 font-mono text-sm"
          />
          
          <button onClick={handleParse} className="btn-primary" disabled={!manualInput.trim()}>
            Parse & Predict
          </button>

          {parseErrors.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="font-semibold text-amber-900 mb-2">⚠️ Warnings:</p>
              <ul className="space-y-1 text-sm text-amber-800">
                {parseErrors.map((err, i) => (
                  <li key={i}>• {err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
