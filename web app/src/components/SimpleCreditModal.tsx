import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Crown, CreditCard, Check, Star } from 'lucide-react';

interface CreditOption {
  credits: number;
  price: string;
  bonus: number;
  popular?: boolean;
  savings?: string;
}

interface SimpleCreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchaseComplete?: (credits: number) => void;
}

const SimpleCreditModal: React.FC<SimpleCreditModalProps> = ({
  isOpen,
  onClose,
  onPurchaseComplete
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedOption, setSelectedOption] = useState<CreditOption | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const creditOptions: CreditOption[] = [
    { 
      credits: 1, 
      price: "25,000", 
      bonus: 0 
    },
    { 
      credits: 5, 
      price: "120,000", 
      bonus: 1,
      savings: "Save UGX 5,000"
    },
    { 
      credits: 10, 
      price: "225,000", 
      bonus: 3,
      popular: true,
      savings: "Save UGX 25,000"
    },
    { 
      credits: 20, 
      price: "400,000", 
      bonus: 8,
      savings: "Save UGX 100,000"
    }
  ];

  const handlePurchase = async () => {
    if (!selectedOption || !user) return;

    setIsProcessing(true);
    try {
      // Calculate total credits (purchased + bonus)
      const totalCredits = selectedOption.credits + selectedOption.bonus;

      // Simulate successful purchase for now
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Credits Purchased Successfully!",
        description: `You now have ${totalCredits} new teacher credits. Start browsing and contacting teachers!`,
      });

      onPurchaseComplete?.(totalCredits);
      onClose();
    } catch (error) {
      console.error('Purchase error:', error);
      toast({
        title: "Purchase Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-gray-900">
            Purchase Teacher Credits
          </DialogTitle>
          <p className="text-center text-gray-600 mt-2">
            Choose a credit package to start contacting teachers
          </p>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Credit Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {creditOptions.map((option, index) => (
              <Card 
                key={index} 
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedOption === option 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:border-blue-300'
                } ${option.popular ? 'border-blue-400 shadow-md' : ''}`}
                onClick={() => setSelectedOption(option)}
              >
                {option.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardContent className="p-4 text-center relative">
                  <div className="mb-3">
                    <div className="text-2xl font-bold text-gray-900">
                      {option.credits}
                      {option.bonus > 0 && (
                        <span className="text-green-600 text-lg">+{option.bonus}</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {option.credits + option.bonus} total credits
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-lg font-semibold text-blue-600">
                      UGX {option.price}
                    </div>
                    {option.savings && (
                      <div className="text-xs text-green-600 font-medium">
                        {option.savings}
                      </div>
                    )}
                  </div>

                  {option.bonus > 0 && (
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      {option.bonus} Bonus Credits!
                    </Badge>
                  )}

                  {selectedOption === option && (
                    <div className="absolute top-2 right-2">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Selected Option Details */}
          {selectedOption && (
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Selected Package
                    </h4>
                    <div className="space-y-1">
                      <p className="text-gray-700">
                        <span className="font-medium">{selectedOption.credits + selectedOption.bonus} teacher credits</span>
                        {selectedOption.bonus > 0 && (
                          <span className="text-green-600 ml-2">
                            (includes {selectedOption.bonus} bonus credits!)
                          </span>
                        )}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Each credit allows you to contact one teacher and view their full profile
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      UGX {selectedOption.price}
                    </div>
                    <div className="text-sm text-gray-600">
                      UGX {Math.round(parseFloat(selectedOption.price.replace(',', '')) / (selectedOption.credits + selectedOption.bonus)).toLocaleString()} per credit
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Features List */}
          <Card className="bg-gray-50">
            <CardContent className="p-6">
              <h4 className="font-semibold text-gray-900 mb-4">What you get with teacher credits:</h4>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  "Full teacher profile access",
                  "Contact information (phone & email)",
                  "Teacher location details",
                  "Complete experience history",
                  "Direct messaging capability",
                  "Credits never expire",
                  "Instant access after purchase",
                  "24/7 customer support"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePurchase}
              disabled={!selectedOption || isProcessing}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isProcessing ? (
                "Processing..."
              ) : selectedOption ? (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Purchase {selectedOption.credits + selectedOption.bonus} Credits
                </>
              ) : (
                "Select a Package"
              )}
            </Button>
          </div>

          {/* Payment Security Notice */}
          <div className="text-center text-xs text-gray-500 border-t pt-4">
            <p>🔒 Secure payment processing • 30-day money-back guarantee • Credits never expire</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SimpleCreditModal;
