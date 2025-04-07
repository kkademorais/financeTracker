"use client";

import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { PlusCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms/ui/card";
import { useFetchTransactions } from "@/hooks/use-fetch-transactions";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/atoms/ui/button";

interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
}

const ChartTooltip = ({ active, payload }: ChartTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Category
            </span>
            <span className="font-bold">{data.name}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Amount
            </span>
            <span className="font-bold">{formatCurrency(data.value)}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

interface ExpensesByCategoryProps {
  isLoading?: boolean;
  onAddTransaction?: () => void;
}

export function ExpensesByCategory({ 
  isLoading = false,
  onAddTransaction
}: ExpensesByCategoryProps) {
  const { data: transactions, isLoading: isLoadingTransactions } = useFetchTransactions();

  const data = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return { chartData: [], hasData: false, total: 0 };
    }

    const expenses = transactions.filter((t) => t.type === "EXPENSE");

    if (expenses.length === 0) {
      return { chartData: [], hasData: false, total: 0 };
    }

    const categories = expenses.reduce((acc, transaction) => {
      const category = transaction.category?.name || "Uncategorized";
      if (!acc[category]) {
        acc[category] = {
          name: category,
          value: 0,
          color: transaction.category?.color || "#CBD5E1",
        };
      }
      acc[category].value += transaction.amount;
      return acc;
    }, {} as Record<string, { name: string; value: number; color: string }>);

    const chartData = Object.values(categories).sort((a, b) => b.value - a.value);
    const total = chartData.reduce((sum, cat) => sum + cat.value, 0);

    return { chartData, hasData: true, total };
  }, [transactions]);

  const isDataLoading = isLoading || isLoadingTransactions;
  const hasData = data.hasData;

  const handleAddTransactionClick = () => {
    if (onAddTransaction) {
      onAddTransaction();
    }
  };

  const NoDataMessage = () => (
    <div className="flex flex-col items-center justify-center h-[212px] space-y-2">
      <p className="text-sm text-muted-foreground">Sem despesas por categoria</p>
      {onAddTransaction && (
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs flex items-center gap-1"
          onClick={handleAddTransactionClick}
        >
          <PlusCircle className="h-3 w-3" />
          Adicionar despesa
        </Button>
      )}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
        <CardDescription>
          Your expense distribution across categories
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2">
        {isDataLoading ? (
          <div className="flex items-center justify-center h-[212px]">
            <div className="h-[200px] w-[200px] animate-pulse rounded-full bg-muted"></div>
          </div>
        ) : !hasData ? (
          <NoDataMessage />
        ) : (
          <div>
            <div className="relative">
              <ResponsiveContainer width="100%" height={212}>
                <PieChart>
                  <Pie
                    data={data.chartData}
                    cx="50%"
                    cy="50%"
                    paddingAngle={2}
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {data.chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke={entry.color}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold">
                  {formatCurrency(data.total)}
                </span>
                <span className="text-xs text-muted-foreground">Total</span>
              </div>
            </div>
            <div className="mt-4 space-y-1">
              {data.chartData.slice(0, 5).map((entry, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 mr-2 rounded-sm" 
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="truncate max-w-[120px]">{entry.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{formatCurrency(entry.value)}</span>
                    <span className="text-muted-foreground">
                      {Math.round((entry.value / data.total) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
              {data.chartData.length > 5 && (
                <div className="text-xs text-muted-foreground text-center mt-1">
                  +{data.chartData.length - 5} more categories
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 