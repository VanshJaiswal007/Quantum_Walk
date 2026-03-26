import React from 'react';
import type { CartItem } from '../context/AppContext';
import { useApp } from '../context/AppContext';

export const RecommendationPanel: React.FC = () => {
  const { recommendations } = useApp();

  if (!recommendations.length) {
    return null;
  }

  return (
    <section className="card-lg">
      <h2 className="text-2xl font-bold mb-6">⭐ Top Recommendations</h2>
      <p className="text-slate-600 mb-6">
        These items are ranked by value score: price, rating, discount, and your priority.
      </p>

      <div className="grid gap-4">
        {recommendations.map((item, idx) => (
          <div key={item.id} className="card p-4 flex items-start gap-4 border-l-4 border-l-blue-500">
            <div className="text-3xl font-bold text-slate-300 min-w-fit">#{idx + 1}</div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-slate-900">{item.name}</h3>
              <div className="flex flex-wrap gap-2 mt-2 mb-3">
                <span className="badge-primary">{item.category}</span>
                {item.discount > 0 && (
                  <span className="badge-success">{(item.discount * 100).toFixed(0)}% OFF</span>
                )}
              </div>
              <div className="grid grid-cols-4 gap-3 text-sm">
                <div>
                  <span className="text-slate-600">Price</span>
                  <p className="font-bold text-slate-900">${item.price.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-slate-600">Rating</span>
                  <p className="font-bold text-slate-900">{item.rating} ⭐</p>
                </div>
                <div>
                  <span className="text-slate-600">Priority</span>
                  <p className="font-bold text-slate-900">{(item.priority * 100).toFixed(0)}%</p>
                </div>
                <div>
                  <span className="text-slate-600">Value</span>
                  <p className="font-bold text-green-600">{((item.rating / item.price) * 10).toFixed(1)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <p className="text-sm text-indigo-900">
          💡 <strong>Tip:</strong> High-priority items with good ratings and discounts appear first. 
          Use these as starting points when building your optimal basket.
        </p>
      </div>
    </section>
  );
};
