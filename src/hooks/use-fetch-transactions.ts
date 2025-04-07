"use client";

import { Transaction } from "@/types";
import { useTransactions } from "@/context/transaction-context";

interface UseFetchTransactionsOptions {
  startDate?: Date;
  endDate?: Date;
  type?: string;
  categoryId?: string;
  limit?: number;
}

export function useFetchTransactions(options: UseFetchTransactionsOptions = {}) {
  const { transactions, isLoading } = useTransactions();
  
  // Filtragem local para simular filtros de API
  const filteredData = filterTransactions(transactions, options);

  return {
    data: filteredData,
    isLoading,
    isError: null,
    mutate: () => {}, // Não precisamos disso mais, o contexto já gerencia
  };
}

// Função auxiliar para filtrar transações localmente
function filterTransactions(transactions: Transaction[], options: UseFetchTransactionsOptions) {
  let filtered = [...transactions];
  
  if (options.startDate) {
    filtered = filtered.filter(t => new Date(t.date) >= options.startDate!);
  }
  
  if (options.endDate) {
    filtered = filtered.filter(t => new Date(t.date) <= options.endDate!);
  }
  
  if (options.type) {
    filtered = filtered.filter(t => t.type === options.type);
  }
  
  if (options.categoryId) {
    filtered = filtered.filter(t => t.categoryId === options.categoryId);
  }
  
  // Ordenar por data (mais recente primeiro)
  filtered = filtered.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  if (options.limit) {
    filtered = filtered.slice(0, options.limit);
  }
  
  return filtered;
} 