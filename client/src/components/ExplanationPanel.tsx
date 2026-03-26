import React from 'react';

export const ExplanationPanel: React.FC = () => {
  return (
    <section className="card-lg">
      <h2 className="text-2xl font-bold mb-6">🎓 How It Works</h2>

      <div className="space-y-6">
        {/* Recommendation Scoring */}
        <div className="border-l-4 border-l-blue-500 pl-4 py-2">
          <h3 className="font-bold text-lg text-slate-900 mb-2">⭐ Recommendation Scoring</h3>
          <p className="text-slate-700 mb-3">
            Each item receives a score based on multiple factors:
          </p>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>
              <strong>Price (30%):</strong> Lower-priced items get higher scores for value
            </li>
            <li>
              <strong>Rating (25%):</strong> Customer ratings (0-5 stars) heavily influence quality
            </li>
            <li>
              <strong>Discount (20%):</strong> Greater discounts boost the score immediately
            </li>
            <li>
              <strong>Priority (15%):</strong> Your manually-set importance level
            </li>
            <li>
              <strong>Relevance (10%):</strong> Base relevance and category importance
            </li>
          </ul>
        </div>

        {/* Subset Optimization */}
        <div className="border-l-4 border-l-indigo-500 pl-4 py-2">
          <h3 className="font-bold text-lg text-slate-900 mb-2">🚀 Subset Optimization</h3>
          <p className="text-slate-700 mb-3">
            We solve the subset sum problem using two complementary methods:
          </p>
          
          <div className="space-y-3">
            <div className="bg-indigo-50 p-3 rounded">
              <p className="font-semibold text-indigo-900 mb-1">
                🔬 Grover's Algorithm (Quantum Amplitude Amplification)
              </p>
              <p className="text-sm text-indigo-800">
                Uses Grover's Algorithm to search through item combinations with amplitude amplification.
                Oracle marks high-value solutions, diffusion operator amplifies their probability.
                Achieves √N speedup compared to classical search. Faster for larger problems with 
                proven convergence in optimal √N iterations.
              </p>
            </div>

            <div className="bg-blue-50 p-3 rounded">
              <p className="font-semibold text-blue-900 mb-1">
                📊 Classical DP (Exact)
              </p>
              <p className="text-sm text-blue-800">
                Uses traditional dynamic programming to find the mathematically optimal solution.
                Slower for very large problems but guaranteed to find the best basket within budget.
              </p>
            </div>
          </div>
        </div>

        {/* Comparison Mode */}
        <div className="border-l-4 border-l-green-500 pl-4 py-2">
          <h3 className="font-bold text-lg text-slate-900 mb-2">⚖️ Comparison Mode</h3>
          <p className="text-slate-700">
            Automatically runs both solvers and a greedy heuristic, showing you the best results
            from each. This lets you see how different approaches compare and validates the
            quality of the solutions.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-slate-100 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-slate-900">💰</p>
            <p className="font-semibold text-slate-900 mt-2">Total Cost</p>
            <p className="text-xs text-slate-600">How much you spend</p>
          </div>
          <div className="bg-slate-100 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-slate-900">📊</p>
            <p className="font-semibold text-slate-900 mt-2">Value Score</p>
            <p className="text-xs text-slate-600">Overall satisfaction</p>
          </div>
          <div className="bg-slate-100 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-slate-900">⚡</p>
            <p className="font-semibold text-slate-900 mt-2">Efficiency</p>
            <p className="text-xs text-slate-600">Score per dollar</p>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-900">
          <strong>💡 Pro Tip:</strong> The quantum-walk solver is suitable for most shopping scenarios.
          Use Classical DP for guaranteed optimal results on smaller carts, or Comparison to see both approaches.
        </p>
      </div>
    </section>
  );
};
