import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, DollarSign, TrendingUp, TrendingDown, ArrowRightLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const BudgetTracker = () => {
  const [budget, setBudget] = useState(5000);
  const [spent, setSpent] = useState(1250);
  const [fromCurrency, setFromCurrency] = useState("INR");
  const [toCurrency, setToCurrency] = useState("USD");
  const [amount, setAmount] = useState("");
  const [exchangeRates, setExchangeRates] = useState<any>({});
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const remaining = budget - spent;
  const spentPercentage = (spent / budget) * 100;

  // Fetch exchange rates from Supabase
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const { data, error } = await supabase
          .from('currency_rates')
          .select('*');
        
        if (error) throw error;
        
        // Convert array to nested object format
        const rates: any = {};
        data?.forEach((rate) => {
          if (!rates[rate.from_currency]) {
            rates[rate.from_currency] = {};
          }
          rates[rate.from_currency][rate.to_currency] = rate.rate;
        });
        
        setExchangeRates(rates);
      } catch (error: any) {
        console.error('Error fetching exchange rates:', error);
      }
    };

    fetchExchangeRates();
  }, []);

  const convertCurrency = () => {
    if (!amount || fromCurrency === toCurrency) return amount;
    const rate = exchangeRates[fromCurrency]?.[toCurrency] || 1;
    return (parseFloat(amount) * rate).toFixed(2);
  };

  const handleAddExpense = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    // Simulate adding expense
    const newExpense = Math.floor(Math.random() * 500) + 100;
    setSpent(prev => prev + newExpense);
    
    toast({
      title: "Expense Added",
      description: `Added ₹${newExpense} to your expenses`,
    });
  };

  const handleSaveToBudget = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (!amount) {
      toast({
        title: "Error",
        description: "Please enter an amount to convert",
        variant: "destructive",
      });
      return;
    }
    
    // Add converted amount to budget
    const convertedAmount = parseFloat(convertCurrency() || "0");
    setBudget(prev => prev + convertedAmount);
    setAmount("");
    
    toast({
      title: "Added to Budget",
      description: `${amount} ${fromCurrency} (${convertedAmount} ${toCurrency}) added to budget`,
    });
  };

  return (
    <section id="budget" className="py-16 bg-gradient-sky">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Smart Budget Management
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track expenses and convert currencies in real-time to stay within budget
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Budget Tracker */}
          <Card className="shadow-card-hover">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-primary" />
                <span>Trip Budget Overview</span>
              </CardTitle>
              <CardDescription>
                Monitor your travel expenses and remaining budget
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Budget Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Spent: ${spent.toLocaleString()}</span>
                  <span>Budget: ${budget.toLocaleString()}</span>
                </div>
                <Progress value={spentPercentage} className="h-3" />
                <div className="flex justify-between items-center">
                  <span className={`text-sm font-medium ${remaining > 0 ? 'text-accent' : 'text-destructive'}`}>
                    {remaining > 0 ? (
                      <span className="flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        ${remaining.toLocaleString()} remaining
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <TrendingDown className="w-4 h-4 mr-1" />
                        ${Math.abs(remaining).toLocaleString()} over budget
                      </span>
                    )}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {spentPercentage.toFixed(1)}% used
                  </span>
                </div>
              </div>

              {/* Expense Categories */}
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Expense Breakdown</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">Flights</div>
                    <div className="font-semibold text-foreground">₹25,000</div>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">Hotels</div>
                    <div className="font-semibold text-foreground">₹15,000</div>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">Food</div>
                    <div className="font-semibold text-foreground">₹8,000</div>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">Activities</div>
                    <div className="font-semibold text-foreground">₹5,000</div>
                  </div>
                </div>
              </div>

              <Button variant="travel" className="w-full" onClick={handleAddExpense}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Expense
              </Button>
            </CardContent>
          </Card>

          {/* Currency Converter */}
          <Card className="shadow-card-hover">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ArrowRightLeft className="w-5 h-5 text-secondary" />
                <span>Currency Converter</span>
              </CardTitle>
              <CardDescription>
                Convert currencies for international travel planning
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Currency Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">From</label>
                  <Select value={fromCurrency} onValueChange={setFromCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">To</label>
                  <Select value={toCurrency} onValueChange={setToCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Amount</label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-lg"
                />
              </div>

              {/* Conversion Result */}
              {amount && (
                <div className="bg-gradient-sunset/10 p-4 rounded-lg border border-secondary/20">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {convertCurrency()} {toCurrency}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {amount} {fromCurrency} equals
                    </div>
                  </div>
                </div>
              )}

              {/* Exchange Rate Info */}
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground text-center">
                  Live exchange rates updated every minute
                </div>
              </div>

              <Button variant="sunset" className="w-full" onClick={handleSaveToBudget}>
                Save to Budget
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BudgetTracker;