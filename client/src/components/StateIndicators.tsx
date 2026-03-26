import React from 'react';
import { useApp } from '../context/AppContext';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 relative">
          <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-600 animate-spin"></div>
        </div>
        <p className="font-semibold text-slate-900">Optimizing your basket...</p>
        <p className="text-sm text-slate-600 mt-1">This may take a moment</p>
      </div>
    </div>
  );
};

export const ErrorAlert: React.FC<{ message: string; onDismiss: () => void }> = ({
  message,
  onDismiss,
}) => {
  return (
    <div className="fixed top-24 left-1/2 transform -translate-x-1/2 max-w-md z-50 animate-in">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg flex items-center justify-between">
        <div>
          <p className="font-semibold text-red-900">❌ Error</p>
          <p className="text-sm text-red-800 mt-1">{message}</p>
        </div>
        <button
          onClick={onDismiss}
          className="ml-4 text-red-600 hover:text-red-900 font-bold"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export const StateIndicators: React.FC = () => {
  const { loading, error, setError, cart, budget } = useApp();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} onDismiss={() => setError(null)} />;

  if (!cart.length || !budget) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-900">
          📝 <strong>Get Started:</strong> Load your cart and set a budget to begin optimizing.
        </p>
      </div>
    );
  }

  return null;
};
