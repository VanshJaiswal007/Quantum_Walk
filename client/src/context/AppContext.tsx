import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  category: string;
  rating: number;
  discount: number;
  priority: number;
  quantity: number;
}

export interface SubsetResult {
  items: CartItem[];
  totalCost: number;
  totalScore: number;
  itemCount: number;
  efficiency: number;
}

interface AppContextType {
  cart: CartItem[];
  setCart: (items: CartItem[]) => void;
  budget: number;
  setBudget: (budget: number) => void;
  recommendations: CartItem[];
  setRecommendations: (items: CartItem[]) => void;
  subsetResults: SubsetResult[];
  setSubsetResults: (results: SubsetResult[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  selectedSolver: 'classical' | 'quantum' | 'comparison';
  setSelectedSolver: (solver: 'classical' | 'quantum' | 'comparison') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [budget, setBudget] = useState<number>(0);
  const [recommendations, setRecommendations] = useState<CartItem[]>([]);
  const [subsetResults, setSubsetResults] = useState<SubsetResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSolver, setSelectedSolver] = useState<'classical' | 'quantum' | 'comparison'>('comparison');

  return (
    <AppContext.Provider
      value={{
        cart,
        setCart,
        budget,
        setBudget,
        recommendations,
        setRecommendations,
        subsetResults,
        setSubsetResults,
        loading,
        setLoading,
        error,
        setError,
        selectedSolver,
        setSelectedSolver,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
