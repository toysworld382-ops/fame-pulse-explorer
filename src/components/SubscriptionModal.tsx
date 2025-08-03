import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Star, Smartphone } from "lucide-react";

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SubscriptionModal = ({ open, onOpenChange }: SubscriptionModalProps) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | 'lifetime'>('monthly');

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: '₹30',
      originalPrice: '₹30',
      period: '/month',
      description: 'Perfect for trying out',
      features: ['Ad-free experience', 'HD quality streaming', 'Download offline', 'All premium content'],
      badge: null,
      savings: null
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: '₹288',
      originalPrice: '₹360',
      period: '/year',
      description: 'Best value for money',
      features: ['Everything in Monthly', '20% savings', 'Priority support', 'Early access to features'],
      badge: 'Most Popular',
      savings: '20% OFF'
    },
    {
      id: 'lifetime',
      name: 'Lifetime',
      price: '₹1,950',
      originalPrice: '₹3,000',
      period: 'one-time',
      description: 'Never pay again',
      features: ['Everything in Yearly', '35% savings', 'Lifetime updates', 'VIP support'],
      badge: 'Best Deal',
      savings: '35% OFF'
    }
  ];

  const handlePayment = () => {
    // Payment integration would go here
    alert('Payment integration coming soon! UPI support included.');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-background via-card to-background border border-border/50">
        <DialogHeader className="text-center pb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-primary to-primary-glow p-3 rounded-full">
              <Crown className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Upgrade to FAME Premium
          </DialogTitle>
          <p className="text-muted-foreground text-lg">
            Enjoy unlimited entertainment with no ads, HD quality, and exclusive content
          </p>
          <div className="inline-flex items-center bg-primary/20 text-primary px-4 py-2 rounded-full border border-primary/30 mt-4">
            <Star className="w-4 h-4 mr-2" fill="currentColor" />
            <span className="font-medium">5 Days Free Trial</span>
          </div>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                selectedPlan === plan.id
                  ? 'border-primary bg-primary/5 shadow-[var(--shadow-glow)]'
                  : 'border-border hover:border-primary/50 bg-card'
              }`}
              onClick={() => setSelectedPlan(plan.id as any)}
            >
              {plan.badge && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
                  {plan.badge}
                </Badge>
              )}
              
              {plan.savings && (
                <div className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-bold">
                  {plan.savings}
                </div>
              )}

              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-3xl font-bold text-primary">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                {plan.originalPrice !== plan.price && (
                  <span className="text-sm text-muted-foreground line-through">{plan.originalPrice}</span>
                )}
                <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-6">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Smartphone className="w-4 h-4" />
              <span>UPI, Cards, Net Banking supported</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 sm:flex-none"
            >
              Maybe Later
            </Button>
            <Button
              variant="hero"
              onClick={handlePayment}
              className="flex-1 sm:flex-none min-w-[200px]"
            >
              Start Free Trial
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground text-center mt-4">
            Your free trial starts immediately. You'll be charged after 5 days unless you cancel.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};