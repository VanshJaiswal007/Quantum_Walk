import React from 'react';
import type { SubsetResult } from '../context/AppContext';

interface SubsetResultsProps {
  results: SubsetResult[];
  budget: number;
  selectedIndex?: number;
  onSelect?: (index: number) => void;
}

export const SubsetResults: React.FC<SubsetResultsProps> = ({
  results,
  budget,
  selectedIndex = 0,
  onSelect,
}) => {
  if (!results.length) {
    return null;
  }

  const bestResult = results[0];

  return (
    <section className="card-lg">
      <h2 className="text-2xl font-bold mb-6">🛒 Optimization Results</h2>

      {/* Main Results Grid */}
      <div className="grid gap-6 mb-8">
        {results.map((result, idx) => (
          <div
            key={idx}
            onClick={() => onSelect?.(idx)}
            className={`card p-6 cursor-pointer transition-all border-2 ${
              selectedIndex === idx
                ? 'border-blue-600 bg-blue-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Basket {idx + 1}
                </h3>
                {idx === 0 && (
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 font-semibold rounded-full text-xs">
                    ✨ Best Option
                  </span>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="bg-slate-50 rounded-lg p-3">
                <span className="text-xs text-slate-600 block">Items</span>
                <p className="text-2xl font-bold text-slate-900">{result.itemCount}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <span className="text-xs text-slate-600 block">Total Cost</span>
                <p className="text-2xl font-bold text-slate-900">${result.totalCost.toFixed(2)}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <span className="text-xs text-slate-600 block">Value Score</span>
                <p className="text-2xl font-bold text-blue-600">{result.totalScore.toFixed(2)}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <span className="text-xs text-slate-600 block">Efficiency</span>
                <p className="text-2xl font-bold text-green-600">{result.efficiency.toFixed(2)}</p>
              </div>
            </div>

            {/* Budget Comparison */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">Budget Remaining</span>
                <span className="text-sm font-bold text-slate-900">
                  ${(budget - result.totalCost).toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min((result.totalCost / budget) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Items List */}
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-2">Items in Basket:</p>
              <div className="space-y-1">
                {result.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm bg-white/50 rounded px-2 py-1">
                    <span className="text-slate-900 font-medium">{item.name}</span>
                    <span className="text-slate-600">${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Box */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
        <h3 className="font-bold text-lg text-green-900 mb-3">✅ Best Basket Summary</h3>
        <div className="grid grid-cols-3 gap-6 text-sm">
          <div>
            <p className="text-green-700 font-semibold">Total Spent</p>
            <p className="text-2xl font-bold text-green-900">${bestResult.totalCost.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-green-700 font-semibold">Items Included</p>
            <p className="text-2xl font-bold text-green-900">{bestResult.itemCount}</p>
          </div>
          <div>
            <p className="text-green-700 font-semibold">Unused Budget</p>
            <p className="text-2xl font-bold text-green-900">${(budget - bestResult.totalCost).toFixed(2)}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
