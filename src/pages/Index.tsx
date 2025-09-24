import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import BudgetTracker from "@/components/BudgetTracker";
import TripPlanning from "@/components/TripPlanning";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <TripPlanning />
      <BudgetTracker />
    </div>
  );
};

export default Index;