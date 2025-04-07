"use client";

import { useMemo, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Scale,
  Tick,
} from "chart.js";
import { PlusCircle } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/ui/card";
import { Button } from "@/components/atoms/ui/button";
import { useFetchTransactions } from "@/hooks/use-fetch-transactions";
import { calculateMonthlyTotals, formatCurrency, formatCurrencyWithOptions } from "@/lib/utils";
import { useTransactions } from "@/context/transaction-context";

// Registrar os componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MonthlyOverviewProps {
  isLoading?: boolean;
  months?: number;
  onAddTransaction?: () => void;
}

export function MonthlyOverview({ 
  isLoading = false, 
  months = 6,
  onAddTransaction 
}: MonthlyOverviewProps) {
  const { data: transactions, isLoading: isLoadingTransactions } = useFetchTransactions();
  const { transactions: allTransactions } = useTransactions();
  
  // Para debugging - verificar se as transações estão chegando
  useEffect(() => {
    if (transactions && transactions.length > 0) {
      console.log("MonthlyOverview - Transactions:", transactions.length);
    } else if (allTransactions && allTransactions.length > 0) {
      console.log("MonthlyOverview - Context transactions:", allTransactions.length);
    } else {
      console.log("MonthlyOverview - No transactions available");
    }
  }, [transactions, allTransactions]);

  // Garantir que temos pelo menos 1 mês para exibir mesmo sem transações
  const ensureMonthlyData = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      // Criar dados vazios para os últimos meses
      const emptyMonths = [];
      const now = new Date();
      
      for (let i = 0; i < months; i++) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i);
        const monthName = monthDate.toLocaleString('pt-BR', { month: 'short' });
        
        emptyMonths.push({
          month: monthName,
          income: 0,
          expense: 0,
          balance: 0
        });
      }
      
      return emptyMonths.reverse();
    }

    return calculateMonthlyTotals(transactions, months);
  }, [transactions, months]);

  const chartData = useMemo(() => {
    // Mesmo sem dados, criar um gráfico vazio mas com eixos
    const labels = ensureMonthlyData.map(d => d.month);
    
    return {
      labels,
      datasets: [
        {
          label: "Income",
          data: ensureMonthlyData.map((d) => d.income),
          backgroundColor: "rgba(34, 197, 94, 0.6)",
          borderColor: "rgb(34, 197, 94)",
          borderWidth: 1,
        },
        {
          label: "Expenses",
          data: ensureMonthlyData.map((d) => d.expense),
          backgroundColor: "rgba(239, 68, 68, 0.6)",
          borderColor: "rgb(239, 68, 68)",
          borderWidth: 1,
        },
        {
          label: "Balance",
          data: ensureMonthlyData.map((d) => d.balance),
          backgroundColor: "rgba(59, 130, 246, 0.6)",
          borderColor: "rgb(59, 130, 246)",
          borderWidth: 1,
        },
      ],
    };
  }, [ensureMonthlyData]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.dataset.label}: ${formatCurrency(context.raw)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(this: Scale, tickValue: number | string, index: number, ticks: Tick[]) {
            const value = typeof tickValue === 'number' ? tickValue : parseFloat(tickValue);
            if (isNaN(value)) return tickValue;
            
            return formatCurrencyWithOptions(value, {
              notation: "compact",
              compactDisplay: "short",
            });
          },
        },
      },
    },
  };

  const isDataLoading = isLoading || isLoadingTransactions;
  const hasTransactions = transactions && transactions.length > 0;
  
  const handleAddTransactionClick = () => {
    if (onAddTransaction) {
      onAddTransaction();
    }
  };

  const NoDataMessage = () => (
    <div className="flex flex-col items-center justify-center h-[300px] space-y-4">
      <p className="text-muted-foreground text-center">
        Sem dados disponíveis para o período selecionado.
        <br />
        <span className="text-sm">Adicione transações para visualizar o histórico mensal.</span>
      </p>
      {onAddTransaction && (
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={handleAddTransactionClick}
        >
          <PlusCircle className="h-4 w-4" />
          Adicionar sua primeira transação
        </Button>
      )}
    </div>
  );

  // Mostrar mensagem de debug
  const DebugInfo = () => (
    <div className="text-xs text-muted-foreground mt-2 text-center">
      {hasTransactions ? (
        <p>Mostrando dados para {transactions.length} transação(ões)</p>
      ) : (
        <p>Ainda não há transações registradas</p>
      )}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Overview</CardTitle>
        <CardDescription>Your income and expenses for the last {months} months</CardDescription>
      </CardHeader>
      <CardContent>
        {isDataLoading ? (
          <div className="h-[300px] animate-pulse flex items-center justify-center">
            <div className="w-full h-48 bg-muted rounded"></div>
          </div>
        ) : !hasTransactions ? (
          <NoDataMessage />
        ) : (
          <div className="h-[300px]">
            <Bar data={chartData} options={chartOptions} />
          </div>
        )}
        <DebugInfo />
      </CardContent>
    </Card>
  );
} 