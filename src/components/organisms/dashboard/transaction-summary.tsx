"use client";

import { useMemo } from "react";
import { ArrowDown, ArrowUp, DollarSign, PiggyBank, PlusCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/ui/card";
import { Button } from "@/components/atoms/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useFetchTransactions } from "@/hooks/use-fetch-transactions";

interface TransactionSummaryProps {
  isLoading?: boolean;
  onAddTransaction?: () => void;
}

export function TransactionSummary({ isLoading = false, onAddTransaction }: TransactionSummaryProps) {
  const { data: transactions, isLoading: isLoadingTransactions } = useFetchTransactions();

  const summary = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return {
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        savings: 0,
        hasTransactions: false
      };
    }

    const income = transactions
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expense;
    const savings = income > 0 ? Math.round((balance / income) * 100) : 0;

    return {
      totalIncome: income,
      totalExpense: expense,
      balance,
      savings,
      hasTransactions: true
    };
  }, [transactions]);

  const isDataLoading = isLoading || isLoadingTransactions;
  const noTransactions = !isDataLoading && !summary.hasTransactions;

  const handleAddTransactionClick = () => {
    if (onAddTransaction) {
      onAddTransaction();
    }
  };

  const EmptyMessage = () => (
    <div className="flex flex-col items-center justify-center space-y-2 py-2">
      <p className="text-sm text-muted-foreground">Sem transações</p>
      {onAddTransaction && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs flex items-center gap-1"
          onClick={handleAddTransactionClick}
        >
          <PlusCircle className="h-3 w-3" />
          Adicionar
        </Button>
      )}
    </div>
  );

  return (
    <>
      <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-800 dark:text-green-300">
            Total Income
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-green-800 dark:text-green-300">
              {isDataLoading ? (
                <div className="h-8 w-24 animate-pulse rounded bg-green-200 dark:bg-green-700/20"></div>
              ) : noTransactions ? (
                <EmptyMessage />
              ) : (
                formatCurrency(summary.totalIncome)
              )}
            </div>
            <div className="rounded-full bg-green-100 p-2 text-green-600 dark:bg-green-800/30 dark:text-green-400">
              <ArrowUp className="h-4 w-4" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-red-800 dark:text-red-300">
            Total Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-red-800 dark:text-red-300">
              {isDataLoading ? (
                <div className="h-8 w-24 animate-pulse rounded bg-red-200 dark:bg-red-700/20"></div>
              ) : noTransactions ? (
                <EmptyMessage />
              ) : (
                formatCurrency(summary.totalExpense)
              )}
            </div>
            <div className="rounded-full bg-red-100 p-2 text-red-600 dark:bg-red-800/30 dark:text-red-400">
              <ArrowDown className="h-4 w-4" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-300">
            Current Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-300">
              {isDataLoading ? (
                <div className="h-8 w-24 animate-pulse rounded bg-blue-200 dark:bg-blue-700/20"></div>
              ) : noTransactions ? (
                <EmptyMessage />
              ) : (
                formatCurrency(summary.balance)
              )}
            </div>
            <div className="rounded-full bg-blue-100 p-2 text-blue-600 dark:bg-blue-800/30 dark:text-blue-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-300">
            Savings Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-purple-800 dark:text-purple-300">
              {isDataLoading ? (
                <div className="h-8 w-24 animate-pulse rounded bg-purple-200 dark:bg-purple-700/20"></div>
              ) : noTransactions ? (
                <EmptyMessage />
              ) : (
                `${summary.savings}%`
              )}
            </div>
            <div className="rounded-full bg-purple-100 p-2 text-purple-600 dark:bg-purple-800/30 dark:text-purple-400">
              <PiggyBank className="h-4 w-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
} 