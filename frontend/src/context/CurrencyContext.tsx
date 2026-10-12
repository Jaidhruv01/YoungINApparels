import React, { createContext, useContext } from 'react';

export type CurrencyCode = 'INR';

interface CurrencyContextType {
  currency: CurrencyCode;
  currencySymbol: string;
  formatPrice: (amountInINR: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currency: CurrencyCode = 'INR';
  const currencySymbol = '₹';

  const formatPrice = (amountInINR: number): string => {
    if (amountInINR === undefined || amountInINR === null || isNaN(amountInINR)) {
      return '₹0';
    }
    // Format using standard Indian numbering system (e.g. ₹24,999 or ₹1,50,000)
    const formatted = Math.round(amountInINR).toLocaleString('en-IN');
    return `₹${formatted}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, currencySymbol, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
