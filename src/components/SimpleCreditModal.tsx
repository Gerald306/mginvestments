import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Crown, CreditCard, Check, Star, Phone, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

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
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentStep, setPaymentStep] = useState<'select' | 'payment' | 'processing' | 'success'>('select');
  const [paymentReference, setPaymentReference] = useState<string | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);

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
    if (!selectedOption || !phoneNumber) return;

    setIsProcessing(true);
    setPaymentStep('processing');

    try {
      // Calculate total amount
      const amount = parseFloat(selectedOption.price.replace(',', ''));
      const totalCredits = selectedOption.credits + selectedOption.bonus;

      console.log('🔄 Initiating MTN MoMo payment...', {
        amount,
        phoneNumber,
        credits: totalCredits
      });

      // Send payment request to MTN MoMo API
      const response = await axios.post('/api/mtn/request-payment', {
        amount: amount,
        currency: 'UGX',
        phoneNumber: phoneNumber,
        reference: `CREDITS_${Date.now()}`,
        description: `Purchase of ${totalCredits} teacher credits`,
        payerMessage: `MG Investments - ${totalCredits} teacher credits`,
        payeeNote: `Teacher credits purchase for ${user?.email}`
      });

      if (response.data.success) {
        setPaymentReference(response.data.referenceId);
        
        toast({
          title: "Payment Request Sent! 📱",
          description: `Check your phone (${phoneNumber}) for MTN MoMo prompt. Enter your PIN to complete the purchase.`,
        });

        // Start monitoring payment status
        monitorPaymentStatus(response.data.referenceId, totalCredits);
      } else {
        throw new Error(response.data.error || 'Payment request failed');
      }

    } catch (error: any) {
      console.error('❌ Payment error:', error);
      setPaymentStep('select');
      
      toast({
        title: "Payment Failed",
        description: error.response?.data?.error || error.message || "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const monitorPaymentStatus = async (referenceId: string, totalCredits: number) => {
    setCheckingStatus(true);
    let attempts = 0;
    const maxAttempts = 30; // Check for 3 minutes (6 seconds * 30)

    const checkStatus = async () => {
      try {
        attempts++;
        console.log(`📊 Checking payment status... Attempt ${attempts}/${maxAttempts}`);

        const statusResponse = await axios.get(`/api/mtn/payment-status/${referenceId}`);
        
        if (statusResponse.data.success) {
          const { status } = statusResponse.data;
          
          if (status === 'completed') {
            setPaymentStep('success');
            setCheckingStatus(false);
            
            toast({
              title: "Payment Successful! 🎉",
              description: `You've successfully purchased ${totalCredits} teacher credits. You can now contact teachers directly!`,
            });

            // Complete the purchase
            setTimeout(() => {
              onPurchaseComplete?.(totalCredits);
              handleClose();
            }, 2000);
            
            return; // Stop checking
          } else if (status === 'failed') {
            setPaymentStep('select');
            setCheckingStatus(false);
            
            toast({
              title: "Payment Failed",
              description: "The payment was declined. Please try again with a different payment method.",
              variant: "destructive",
            });
            
            return; // Stop checking
          }
        }

        // Continue checking if still pending
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 6000); // Check every 6 seconds
        } else {
          // Timeout
          setPaymentStep('select');
          setCheckingStatus(false);
          
          toast({
            title: "Payment Timeout",
            description: "Payment verification timed out. If you completed the payment, please contact support.",
            variant: "destructive",
          });
        }

      } catch (error) {
        console.error('Status check error:', error);
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 6000);
        } else {
          setPaymentStep('select');
          setCheckingStatus(false);
        }
      }
    };

    // Start checking after a short delay
    setTimeout(checkStatus, 3000);
  };

  const handleClose = () => {
    setSelectedOption(null);
    setPhoneNumber('');
    setPaymentStep('select');
    setPaymentReference(null);
    setIsProcessing(false);
    setCheckingStatus(false);
    onClose();
  };

  const proceedToPayment = () => {
    if (!selectedOption) return;
    setPaymentStep('payment');
  };

  const goBack = () => {
    setPaymentStep('select');
  };

  const renderStepContent = () => {
    switch (paymentStep) {
      case 'select':
        return (
          <div className="space-y-6">
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
              >
                Cancel
              </Button>
              <Button
                onClick={proceedToPayment}
                disabled={!selectedOption}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {selectedOption ? (
                  <>
                    Continue to Payment
                  </>
                ) : (
                  "Select a Package"
                )}
              </Button>
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-6">
            {/* Selected Package Summary */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Purchase Summary
                    </h4>
                    <p className="text-gray-700">
                      <span className="font-medium">{selectedOption!.credits + selectedOption!.bonus} teacher credits</span>
                      {selectedOption!.bonus > 0 && (
                        <span className="text-green-600 ml-2">
                          (includes {selectedOption!.bonus} bonus!)
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      UGX {selectedOption!.price}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* MTN MoMo Payment Form */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Phone className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">MTN MoMo Payment</h4>
                    <p className="text-gray-600 text-sm">Enter your MTN MoMo number to complete payment</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium">
                      MTN MoMo Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="256XXXXXXXXX"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter your 12-digit MTN number (e.g., 256701234567)
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-medium text-blue-900 mb-2">How it works:</h5>
                    <ol className="text-sm text-blue-800 space-y-1">
                      <li>1. Enter your MTN MoMo number above</li>
                      <li>2. Click "Pay with MTN MoMo" button</li>
                      <li>3. You'll receive a prompt on your phone</li>
                      <li>4. Enter your MTN MoMo PIN to complete payment</li>
                      <li>5. Credits will be added to your account instantly</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <Button
                variant="outline"
                onClick={goBack}
                className="flex-1"
                disabled={isProcessing}
              >
                Back
              </Button>
              <Button
                onClick={handlePurchase}
                disabled={!phoneNumber || phoneNumber.length < 12 || isProcessing}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Phone className="h-4 w-4 mr-2" />
                    Pay with MTN MoMo
                  </>
                )}
              </Button>
            </div>
          </div>
        );

      case 'processing':
        return (
          <div className="space-y-6 text-center py-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Payment Processing...
                </h3>
                <p className="text-gray-600 mb-2">
                  Check your phone ({phoneNumber}) for MTN MoMo prompt
                </p>
                <p className="text-sm text-gray-500">
                  Enter your PIN to complete the purchase
                </p>
              </div>
            </div>

            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-yellow-600" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-yellow-800">
                      Waiting for your confirmation...
                    </p>
                    <p className="text-xs text-yellow-700">
                      This usually takes 30-60 seconds
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {checkingStatus && (
              <div className="text-sm text-gray-500">
                Checking payment status...
              </div>
            )}
          </div>
        );

      case 'success':
        return (
          <div className="space-y-6 text-center py-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Payment Successful! 🎉
                </h3>
                <p className="text-gray-600 mb-2">
                  You've successfully purchased {selectedOption!.credits + selectedOption!.bonus} teacher credits
                </p>
                <p className="text-sm text-gray-500">
                  You can now contact teachers directly!
                </p>
              </div>
            </div>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-center space-x-3">
                  <Crown className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      Credits Added Successfully
                    </p>
                    <p className="text-xs text-green-700">
                      Your credits never expire and are ready to use
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-gray-900">
            {paymentStep === 'select' && 'Purchase Teacher Credits'}
            {paymentStep === 'payment' && 'Complete Payment'}
            {paymentStep === 'processing' && 'Processing Payment'}
            {paymentStep === 'success' && 'Payment Complete'}
          </DialogTitle>
          <p className="text-center text-gray-600 mt-2">
            {paymentStep === 'select' && 'Choose a credit package to start contacting teachers'}
            {paymentStep === 'payment' && 'Pay securely with MTN MoMo'}
            {paymentStep === 'processing' && 'Please wait while we process your payment'}
            {paymentStep === 'success' && 'Thank you for your purchase'}
          </p>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {renderStepContent()}

          {/* Payment Security Notice */}
          {paymentStep !== 'success' && (
            <div className="text-center text-xs text-gray-500 border-t pt-4">
              <p>🔒 Secure payment processing • 30-day money-back guarantee • Credits never expire</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SimpleCreditModal;
