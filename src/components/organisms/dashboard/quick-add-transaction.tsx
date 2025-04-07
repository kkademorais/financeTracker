"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowDown, ArrowUp, CalendarIcon, Loader2, CheckCircle2 } from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/atoms/ui/card";
import { Button } from "@/components/atoms/ui/button";
import { Input } from "@/components/atoms/ui/input";
import { Label } from "@/components/atoms/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/atoms/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/atoms/ui/popover";
import { Calendar } from "@/components/atoms/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/ui/select";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useTransactions } from "@/context/transaction-context";
import { useToast } from "@/components/atoms/ui/use-toast";
import { Category } from "@/types";

const transactionSchema = z.object({
  amount: z.coerce.number().positive({ message: "Amount must be positive" }),
  description: z.string().min(2, { message: "Description must be at least 2 characters" }),
  type: z.enum(["INCOME", "EXPENSE"], { required_error: "Type is required" }),
  date: z.date({ required_error: "Date is required" }),
  categoryId: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

export interface QuickAddTransactionProps {
  onTransactionAdded?: () => void;
  initiallyOpen?: boolean;
}

// Dados de categorias mockados (em um app real, viriam da API)
const mockCategories = [
  { id: "food", name: "Food", color: "#4CAF50" },
  { id: "transport", name: "Transportation", color: "#2196F3" },
  { id: "entertainment", name: "Entertainment", color: "#E91E63" },
  { id: "utilities", name: "Utilities", color: "#673AB7" },
  { id: "home", name: "Housing", color: "#FF5722" },
  { id: "personal", name: "Personal", color: "#9C27B0" },
  { id: "health", name: "Health", color: "#00BCD4" },
  { id: "other", name: "Other", color: "#607D8B" },
];

export function QuickAddTransaction({ onTransactionAdded, initiallyOpen = false }: QuickAddTransactionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(initiallyOpen);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { addTransaction, transactions } = useTransactions();
  const { toast } = useToast();
  
  // Log para debug das transações existentes
  useEffect(() => {
    console.log("QuickAddTransaction - Current transactions:", transactions.length);
  }, [transactions]);

  useEffect(() => {
    if (initiallyOpen) {
      setIsExpanded(true);
    }
  }, [initiallyOpen]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: undefined,
      description: "",
      type: "EXPENSE",
      date: new Date(),
      categoryId: "",
    },
  });

  const transactionType = watch("type");
  const selectedDate = watch("date");

  const onSubmit = async (data: TransactionFormValues) => {
    console.log("QuickAddTransaction - Form submitted with data:", data);
    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      // Preparar dados da transação com tipagem correta
      const transactionData: any = { ...data };
      
      // Garantir que a data seja um objeto Date
      if (typeof transactionData.date === 'string') {
        transactionData.date = new Date(transactionData.date);
      }
      
      if (data.type === "EXPENSE" && data.categoryId) {
        const selectedCategory = mockCategories.find(c => c.id === data.categoryId);
        if (selectedCategory) {
          // Criar objeto de categoria compatível com o tipo Category
          const category: Category = {
            id: selectedCategory.id,
            name: selectedCategory.name,
            color: selectedCategory.color,
            icon: selectedCategory.id, // Usamos o id como ícone por enquanto
            userId: "user", // Um id temporário
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          
          // Adicionar a categoria ao objeto de transação
          transactionData.category = category;
          transactionData.categoryId = category.id;
        }
      }

      console.log("QuickAddTransaction - Adding transaction:", transactionData);
      
      // Adicionar a transação através do contexto
      await addTransaction(transactionData);

      console.log("QuickAddTransaction - Transaction added successfully");
      
      // Indicar sucesso
      setSubmitSuccess(true);
      
      // Notificar componente pai
      if (onTransactionAdded) {
        console.log("QuickAddTransaction - Notifying parent component");
        onTransactionAdded();
      }

      // Limpar formulário após 2 segundos
      setTimeout(() => {
        reset({
          amount: undefined,
          description: "",
          type: "EXPENSE",
          date: new Date(),
          categoryId: "",
        });
        setSubmitSuccess(false);
      }, 2000);
      
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a transação",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card>
      <CardHeader className="cursor-pointer" onClick={toggleExpanded}>
        <CardTitle className="flex justify-between items-center">
          Add Transaction
          <Button variant="ghost" size="sm" onClick={(e) => {
            e.stopPropagation();
            toggleExpanded();
          }}>
            {isExpanded ? "Minimize" : "Expand"}
          </Button>
        </CardTitle>
        {!isExpanded && <CardDescription>Click to add a new transaction</CardDescription>}
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <RadioGroup
                defaultValue="EXPENSE"
                className="flex"
                onValueChange={(value) => setValue("type", value as "INCOME" | "EXPENSE")}
                value={transactionType}
              >
                <div className="flex items-center space-x-2 mr-4">
                  <RadioGroupItem value="EXPENSE" id="expense" className="sr-only" />
                  <Label
                    htmlFor="expense"
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm border cursor-pointer",
                      transactionType === "EXPENSE"
                        ? "bg-red-100 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300"
                        : "hover:bg-muted"
                    )}
                  >
                    <ArrowDown className="mr-2 h-4 w-4" /> Expense
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="INCOME" id="income" className="sr-only" />
                  <Label
                    htmlFor="income"
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm border cursor-pointer",
                      transactionType === "INCOME"
                        ? "bg-green-100 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-300"
                        : "hover:bg-muted"
                    )}
                  >
                    <ArrowUp className="mr-2 h-4 w-4" /> Income
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                <Input
                  id="amount"
                  placeholder="0.00"
                  className="pl-7"
                  {...register("amount")}
                />
              </div>
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="What was this for?"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            {transactionType === "EXPENSE" && (
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  onValueChange={(value) => setValue("categoryId", value)}
                  defaultValue=""
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id} className="flex items-center">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: category.color }}
                          />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setValue("date", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting || submitSuccess}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : submitSuccess ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Added Successfully!
                </>
              ) : (
                "Add Transaction"
              )}
            </Button>
          </form>
        </CardContent>
      )}
    </Card>
  );
} 