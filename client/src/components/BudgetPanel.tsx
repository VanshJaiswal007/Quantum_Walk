import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { solveClassical, solveQuantum, solveComparison, getRecommendations } from '../services/api';

export const BudgetPanel: React.FC = () => {
  const { cart, budget, setBudget, setSubsetResults, setRecommendations, selectedSolver, setSelectedSolver, setLoading, setError } = useApp();
  const [localBudget, setLocalBudget] = useState(budget.toString());

  const handleSolve = async () => {
    if (!cart.length) {
      setError('Please load a cart first');
      return;
    }

    if (!budget || budget <= 0) {
      setError('Please enter a valid budget');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get recommendations
      const recs = await getRecommendations(cart, 5);
      setRecommendations(recs);

      // Solve based on selected solver
      let results = [];
      if (selectedSolver === 'classical') {
        const result = await solveClassical(cart, budget);
        results = [result];
      } else if (selectedSolver === 'quantum') {
        const result = await solveQuantum(cart, budget);
        results = [result];
      } else {
        results = await solveComparison(cart, budget);
      }

      setSubsetResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Solve failed');
    } finally {
      setLoading(false);
    }
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalBudget(e.target.value);
    const num = parseFloat(e.target.value);
    if (!isNaN(num) && num > 0) {
      setBudget(num);
    }
  };

  return (
    <section className="card-lg">
      <h2 className="text-2xl font-bold mb-6">Step 2: Set Your Budget & Solve</h2>

      <div className="space-y-6">
        {/* Budget Input */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            💰 Budget (USD)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-xl">$</span>
            <input
              type="number"
              value={localBudget}
              onChange={handleBudgetChange}
              placeholder="500"
              className="input-field pl-8 text-lg"
              min="0"
              step="0.01"
            />
          </div>
          {budget > 0 && (
            <p className="text-xs text-slate-600 mt-2">
              Budget: <span className="font-bold text-blue-600">${budget.toFixed(2)}</span>
            </p>
          )}
        </div>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-blue-900 mb-2">📊 Cart Summary</p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-slate-600">Items:</span>
                <p className="font-bold text-blue-600">{cart.length}</p>
              </div>
              <div>
                <span className="text-slate-600">Total Price:</span>
                <p className="font-bold text-blue-600">${cart.reduce((s, i) => s + i.price, 0).toFixed(2)}</p>
              </div>
              <div>
                <span className="text-slate-600">Avg Rating:</span>
                <p className="font-bold text-blue-600">{(cart.reduce((s, i) => s + i.rating, 0) / cart.length).toFixed(1)} ⭐</p>
              </div>
            </div>
          </div>
        )}

        {/* Solver Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-3">
            🚀 Optimization Method
          </label>
          <div className="space-y-2">
            {(['comparison', 'quantum', 'classical'] as const).map((solver) => (
              <label key={solver} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="solver"
                  value={solver}
                  checked={selectedSolver === solver}
                  onChange={(e) => setSelectedSolver(e.target.value as any)}
                  className="w-4 h-4"
                />
                <span className="font-semibold text-slate-900">
                  {solver === 'comparison' && '⚖️ Compare All Methods'}
                  {solver === 'quantum' && '🔬 Grover\'s Algorithm'}
                  {solver === 'classical' && '📊 Classical DP (Deterministic)'}
                </span>
              </label>
            ))}
          </div>
          <p className="text-xs text-slate-600 mt-3">
            {selectedSolver === 'comparison' && 'Shows best results from all methods combined.'}
            {selectedSolver === 'quantum' && 'Uses Grover\'s Algorithm with amplitude amplification for faster exploration.'}
            {selectedSolver === 'classical' && 'Uses dynamic programming for exact optimal solution.'}
          </p>
        </div>

        {/* Solve Button */}
        <button
          onClick={handleSolve}
          disabled={!cart.length || !budget}
          className="btn-primary w-full py-4 text-lg"
        >
          🔍 Find Best Basket
        </button>
      </div>
    </section>
  );
};
