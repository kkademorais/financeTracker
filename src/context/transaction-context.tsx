"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Transaction, TransactionType } from "@/types";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/atoms/ui/use-toast";

// Inicialmente sem transações
const INITIAL_TRANSACTIONS: Transaction[] = [];

type TransactionContextType = {
  transactions: Transaction[];
  isLoading: boolean;
  addTransaction: (transaction: Omit<Transaction, "id" | "userId" | "createdAt" | "updatedAt">) => Promise<void>;
  refreshTransactions: () => void;
};

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Função para gerar ID único
  const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  // Função para atualizar a lista de transações
  const refreshTransactions = async () => {
    setIsLoading(true);
    
    try {
      // Em um app real, buscaria da API
      // Aqui vamos manter apenas as transações que adicionamos
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setIsLoading(false);
    }
  };

  // Carregar transações iniciais
  useEffect(() => {
    if (session?.user) {
      refreshTransactions();
    }
  }, [session]);

  // Função para adicionar uma nova transação
  const addTransaction = async (newTransaction: Omit<Transaction, "id" | "userId" | "createdAt" | "updatedAt">) => {
    if (!session?.user?.id) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para adicionar transações",
        variant: "destructive",
      });
      return;
    }

    try {
      // Criando a nova transação com campos adicionais
      const transaction: Transaction = {
        ...newTransaction,
        id: generateId(),
        userId: session.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Em um app real, isso enviaria para a API
      // const response = await fetch("/api/transactions", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(transaction),
      // });
      
      // Simulando sucesso
      setTransactions((prev) => [transaction, ...prev]);
      
      toast({
        title: "Sucesso",
        description: "Transação adicionada com sucesso!",
        variant: "default",
      });
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a transação",
        variant: "destructive",
      });
    }
  };

  return (
    <TransactionContext.Provider 
      value={{ 
        transactions, 
        isLoading, 
        addTransaction,
        refreshTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error("useTransactions must be used within a TransactionProvider");
  }
  return context;
} 