import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Transaction } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, locale = "pt-BR", currency = "BRL"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
}

export function formatCurrencyWithOptions(
  amount: number, 
  options: Intl.NumberFormatOptions = {}, 
  locale = "pt-BR", 
  currency = "BRL"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    ...options,
  }).format(amount);
}

export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  },
  locale = "pt-BR"
): string {
  const dateObj = typeof date === "string" || typeof date === "number" 
    ? new Date(date) 
    : date;
  
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

type MonthlyTotal = {
  month: string;
  income: number;
  expense: number;
  balance: number;
};

export function calculateMonthlyTotals(
  transactions: Transaction[],
  monthCount = 6
): MonthlyTotal[] {
  console.log("calculateMonthlyTotals - Received transactions:", transactions.length);
  
  // Início e fim do período
  const now = new Date();
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Último dia do mês atual
  const startDate = new Date(now.getFullYear(), now.getMonth() - (monthCount - 1), 1); // Primeiro dia do mês inicial
  
  console.log("calculateMonthlyTotals - Period:", startDate, "to", endDate);

  // Criar estrutura para armazenar os dados mensais
  const monthlyData: Record<string, MonthlyTotal> = {};

  // Inicializar os meses no período
  for (let i = 0; i < monthCount; i++) {
    const monthDate = new Date(startDate.getFullYear(), startDate.getMonth() + i);
    const monthKey = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, "0")}`;
    const monthName = formatDate(monthDate, { month: "short" });
    
    monthlyData[monthKey] = {
      month: monthName,
      income: 0,
      expense: 0,
      balance: 0,
    };
  }

  // Debug: listar os meses criados
  console.log("calculateMonthlyTotals - Months created:", Object.keys(monthlyData));

  // Preencher com dados das transações
  for (const transaction of transactions) {
    const transactionDate = new Date(transaction.date);
    
    // Verificar se a transação está dentro do período
    if (transactionDate < startDate || transactionDate > endDate) {
      console.log("calculateMonthlyTotals - Transaction outside period:", transaction.description, transactionDate);
      continue;
    }
    
    const monthKey = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, "0")}`;
    
    // Ignorar transações fora do período especificado
    if (!monthlyData[monthKey]) {
      console.log("calculateMonthlyTotals - Month not found for transaction:", monthKey, transaction.description);
      continue;
    }

    console.log("calculateMonthlyTotals - Processing transaction:", transaction.description, transaction.type, transaction.amount);
    
    // Somar de acordo com o tipo de transação
    if (transaction.type === "INCOME") {
      monthlyData[monthKey].income += transaction.amount;
    } else if (transaction.type === "EXPENSE") {
      monthlyData[monthKey].expense += transaction.amount;
    }
    
    // Recalcular o saldo
    monthlyData[monthKey].balance = monthlyData[monthKey].income - monthlyData[monthKey].expense;
  }

  // Converter para array ordenado por mês
  const result = Object.entries(monthlyData)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([_, data]) => data);
  
  console.log("calculateMonthlyTotals - Final result:", result);
  
  return result;
}
