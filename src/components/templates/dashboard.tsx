"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useTransactions } from "@/context/transaction-context";

import { TransactionSummary } from "@/components/organisms/dashboard/transaction-summary";
import { RecentTransactions } from "@/components/organisms/dashboard/recent-transactions";
import { ExpensesByCategory } from "@/components/organisms/dashboard/expenses-by-category";
import { MonthlyOverview } from "@/components/organisms/dashboard/monthly-overview";
import { QuickAddTransaction } from "@/components/organisms/dashboard/quick-add-transaction";
import { Header } from "@/components/organisms/navigation/header";
import { WelcomeDialog } from "@/components/organisms/onboarding/welcome-dialog";

export function Dashboard() {
  const { data: session } = useSession();
  const { refreshTransactions } = useTransactions();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const quickAddRef = useRef<HTMLDivElement>(null);

  const handleTransactionAdded = async () => {
    setIsRefreshing(true);
    
    try {
      // Forçar uma atualização do contexto de transações
      refreshTransactions();
      
      // Indicar a conclusão da atualização após um pequeno atraso
      setTimeout(() => {
        setIsRefreshing(false);
        setShowAddTransaction(false);
      }, 1000);
    } catch (error) {
      console.error("Erro ao atualizar transações:", error);
      setIsRefreshing(false);
    }
  };

  const scrollToAddTransaction = () => {
    setShowAddTransaction(true);
    
    // Dar tempo para o componente renderizar e então realizar o scroll
    setTimeout(() => {
      if (quickAddRef.current) {
        quickAddRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const user = session?.user || null;

  return (
    <div className="min-h-screen bg-background">
      {session?.user?.id && (
        <WelcomeDialog 
          userId={session.user.id} 
          userName={session.user.name}
          onAddTransaction={scrollToAddTransaction} 
        />
      )}
      
      <Header user={user} />
      
      <main className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Financial Dashboard</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <TransactionSummary 
            isLoading={isRefreshing} 
            onAddTransaction={scrollToAddTransaction}
          />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
          <div className="col-span-2">
            <MonthlyOverview 
              isLoading={isRefreshing} 
              onAddTransaction={scrollToAddTransaction}
            />
          </div>
          <div ref={quickAddRef}>
            <QuickAddTransaction 
              onTransactionAdded={handleTransactionAdded}
              initiallyOpen={showAddTransaction}
            />
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <div>
            <ExpensesByCategory 
              isLoading={isRefreshing} 
              onAddTransaction={scrollToAddTransaction}
            />
          </div>
          <div>
            <RecentTransactions 
              isLoading={isRefreshing} 
              onAddTransaction={scrollToAddTransaction}
            />
          </div>
        </div>
      </main>
    </div>
  );
} 