import React from 'react';
import type { CartItem } from '../context/AppContext';

export const CartDisplay: React.FC<{ cart: CartItem[] }> = ({ cart }) => {
  if (!cart.length) {
    return (
      <div className="card-lg text-center py-12">
        <p className="text-slate-600 text-lg">📭 No items in cart yet</p>
        <p className="text-slate-500 text-sm mt-2">Load sample data or enter items manually to get started.</p>
      </div>
    );
  }

  return (
    <section className="card-lg">
      <h2 className="text-2xl font-bold mb-6">📦 Your Cart ({cart.length} items)</h2>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {cart.map((item) => (
          <div
            key={item.id}
            className="card p-4 flex items-center justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex-1">
              <h4 className="font-bold text-slate-900">{item.name}</h4>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                  {item.category}
                </span>
                <span className="text-xs text-slate-600">⭐ {item.rating}</span>
                {item.discount > 0 && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">
                    -{(item.discount * 100).toFixed(0)}%
                  </span>
                )}
              </div>
            </div>
            <div className="text-right min-w-fit ml-4">
              <p className="font-bold text-lg text-slate-900">${item.price.toFixed(2)}</p>
              <p className="text-xs text-slate-600">Priority: {(item.priority * 100).toFixed(0)}%</p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg">
        <div>
          <span className="text-xs text-slate-600">Total Items</span>
          <p className="font-bold text-slate-900">{cart.length}</p>
        </div>
        <div>
          <span className="text-xs text-slate-600">Total Value</span>
          <p className="font-bold text-slate-900">${cart.reduce((s, i) => s + i.price, 0).toFixed(2)}</p>
        </div>
        <div>
          <span className="text-xs text-slate-600">Avg Rating</span>
          <p className="font-bold text-slate-900">
            {(cart.reduce((s, i) => s + i.rating, 0) / cart.length).toFixed(1)} ⭐
          </p>
        </div>
        <div>
          <span className="text-xs text-slate-600">Avg Priority</span>
          <p className="font-bold text-slate-900">
            {((cart.reduce((s, i) => s + i.priority, 0) / cart.length) * 100).toFixed(0)}%
          </p>
        </div>
      </div>
    </section>
  );
};
