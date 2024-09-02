import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../lib/axios";

export interface Transaction extends CreateTransactionInput {
  id: number;
  createdAt: string;
}

interface TransactionsContextType {
  transactions: Transaction[];
  fetchTransactions: (query?: string) => Promise<void>;
  createTransaction: (data: CreateTransactionInput) => Promise<void>;
}

interface TransactionsProviderProps {
  children: ReactNode;
}

interface CreateTransactionInput {
  description: string;
  type: 'income' | 'outcome';
  price: number;
  category: string;
}

export const TransactionsContext = createContext({} as TransactionsContextType);

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions(query?: string) {
    const response = await api.get('transactions', {
      params: {
        _sort: 'createdAt',
        _order: 'desc',
        q: query
      }
    });

    setTransactions(response.data);
  }

  async function createTransaction(data: CreateTransactionInput) {
    const { description, category, price, type } = data;

    const response = await api.post('transactions', {
      description,
      category,
      price,
      type,
      createdAt: new Date(),
    });

    setTransactions(state => [response.data, ...state])
  }

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        fetchTransactions,
        createTransaction
      }}
    >
      { children }
    </TransactionsContext.Provider>
  )
}
