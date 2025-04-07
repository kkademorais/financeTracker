"use client";

import { useState, useEffect } from "react";
import { ArrowRight, PlusCircle, PieChart, BarChart, Clock } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/atoms/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WelcomeDialogProps {
  userId: string;
  userName: string | null | undefined;
  onAddTransaction: () => void;
}

export function WelcomeDialog({ userId, userName, onAddTransaction }: WelcomeDialogProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Verificar se é a primeira visita do usuário
    const hasSeenOnboarding = localStorage.getItem(`onboarding-seen-${userId}`);
    
    if (!hasSeenOnboarding) {
      setOpen(true);
    }
  }, [userId]);

  const handleClose = () => {
    // Marcar que o usuário já viu o onboarding
    localStorage.setItem(`onboarding-seen-${userId}`, "true");
    setOpen(false);
  };

  const handleAddTransaction = () => {
    handleClose();
    onAddTransaction();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Bem-vindo{userName ? `, ${userName}` : ''}!</DialogTitle>
          <DialogDescription className="text-lg pt-2">
            Seu assistente financeiro pessoal
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="welcome" className="py-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="welcome">Início</TabsTrigger>
            <TabsTrigger value="features">Recursos</TabsTrigger>
            <TabsTrigger value="tips">Dicas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="welcome" className="space-y-4">
            <p>
              Este é o seu primeiro acesso ao Finance Tracker. Estamos aqui para ajudar você a 
              tomar o controle de suas finanças pessoais de maneira simples e eficiente.
            </p>
            <div className="bg-primary/10 p-4 rounded-lg border">
              <h3 className="font-medium mb-2 flex items-center">
                <PlusCircle className="h-5 w-5 mr-2 text-primary" />
                Comece agora
              </h3>
              <p className="text-sm">
                Adicione sua primeira transação para começar a acompanhar seus gastos e receitas.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="features" className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <PieChart className="h-5 w-5 text-blue-500" />
                  <h3 className="font-medium">Análise de gastos</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Visualize seus gastos por categoria para identificar onde seu dinheiro está indo.
                </p>
              </div>
              
              <div className="border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart className="h-5 w-5 text-green-500" />
                  <h3 className="font-medium">Tendências mensais</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Acompanhe sua evolução financeira ao longo do tempo com gráficos detalhados.
                </p>
              </div>
              
              <div className="border rounded-lg p-3 col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-purple-500" />
                  <h3 className="font-medium">Registro rápido</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Adicione transações em segundos com nossa interface intuitiva e categorização automática.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="tips" className="space-y-3">
            <div className="bg-muted/50 p-4 rounded-lg border">
              <h3 className="font-medium mb-1">Registre regularmente</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Para um controle financeiro eficaz, registre suas transações diariamente ou semanalmente.
              </p>
              <h3 className="font-medium mb-1">Categorize corretamente</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Use categorias específicas para ter uma visão mais clara de seus gastos.
              </p>
              <h3 className="font-medium mb-1">Análise mensal</h3>
              <p className="text-xs text-muted-foreground">
                Reserve um tempo todo mês para revisar seus relatórios e ajustar seu orçamento.
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleClose} className="sm:w-full">
            Explorar primeiro
          </Button>
          <Button onClick={handleAddTransaction} className="sm:w-full gap-2">
            Adicionar transação
            <ArrowRight className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 