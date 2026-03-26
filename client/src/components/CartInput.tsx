import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { loadDummyItems, parseItems } from '../services/api';

export const CartInput: React.FC = () => {
  const { setCart, setLoading, setError } = useApp();
  const [tab, setTab] = useState<'dummy' | 'manual'>('dummy');
  const [manualInput, setManualInput] = useState('');
  const [parseErrors, setParseErrors] = useState<string[]>([]);

  const handleLoadDummy = async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await loadDummyItems();
      setCart(items);
      setParseErrors([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dummy items');
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
          onClick={() => setTab('dummy')}
          className={`py-3 px-6 font-semibold border-b-2 transition-colors ${
            tab === 'dummy'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          📦 Load Sample Data
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

      {tab === 'dummy' && (
        <div className="space-y-4">
          <p className="text-slate-600">
            Click below to load a sample dataset of 12 popular tech items. Perfect for testing!
          </p>
          <button onClick={handleLoadDummy} className="btn-primary">
            Load 12 Sample Items
          </button>
          <p className="text-xs text-slate-500">
            Includes electronics, accessories, and office supplies with realistic prices and ratings.
          </p>
        </div>
      )}

      {tab === 'manual' && (
        <div className="space-y-4">
          <p className="text-slate-600 text-sm">
            Enter items in this format (one per line):
          </p>
          <code className="block bg-slate-100 p-3 rounded text-xs font-mono">
            Item Name | Price | Category | Rating | Discount | Priority
            <br />
            Example: Headphones | 79.99 | Electronics | 4.5 | 0.15 | 0.8
          </code>
          
          <textarea
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="Wireless Headphones | 79.99 | Electronics | 4.5 | 0.15 | 0.8&#10;USB Cable | 19.99 | Accessories | 4.2 | 0.1 | 0.6"
            className="input-field h-32 font-mono text-sm"
          />
          
          <button onClick={handleParse} className="btn-primary" disabled={!manualInput.trim()}>
            Parse Items
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
