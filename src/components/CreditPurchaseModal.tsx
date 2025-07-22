import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { teacherCreditService } from '@/services/teacherCreditService';
import { paymentService, PaymentMethod } from '@/services/paymentService';
import { Crown, CreditCard, Check, Star, Phone, ArrowLeft, Loader2, X } from 'lucide-react';

interface CreditOption {
  credits: number;
  price: string;
  bonus: number;
  popular?: boolean;
  savings?: string;
}

interface CreditPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchaseComplete?: (credits: number) => void;
}

const CreditPurchaseModal: React.FC<CreditPurchaseModalProps> = ({
  isOpen,
  onClose,
  onPurchaseComplete
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedOption, setSelectedOption] = useState<CreditOption | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<'select' | 'payment' | 'processing'>('select');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethods] = useState<PaymentMethod[]>(paymentService.getPaymentMethods());

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

  const handleContinueToPayment = () => {
    if (!selectedOption) return;
    setCurrentStep('payment');
  };

  const handleBackToSelection = () => {
    setCurrentStep('select');
    setSelectedPaymentMethod(null);
    setPhoneNumber('');
  };

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
  };

  const handleProcessPayment = async () => {
    if (!selectedOption || !selectedPaymentMethod || !user) return;

    // Validate phone number for mobile money
    if ((selectedPaymentMethod.id === 'mtn_momo' || selectedPaymentMethod.id === 'airtel_money') && !phoneNumber.trim()) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your phone number for mobile money payment.",
        variant: "destructive",
      });
      return;
    }

    setCurrentStep('processing');
    setIsProcessing(true);

    try {
      const totalCredits = selectedOption.credits + selectedOption.bonus;
      const amountPaid = parseFloat(selectedOption.price.replace(',', ''));
      const paymentReference = paymentService.generatePaymentReference('CREDIT');

      let paymentResult;

      // Process payment based on selected method - using your exact request to pay format
      if (selectedPaymentMethod.id === 'mtn_momo') {
        console.log('🚀 Initiating MTN MoMo Request to Pay...');

        paymentResult = await paymentService.requestMTNPayment({
          amount: amountPaid,
          currency: 'UGX', // Uganda Shillings for local payments
          phoneNumber: phoneNumber,
          reference: paymentReference,
          description: `MG Investments - ${totalCredits} Teacher Credits`,
          payerMessage: `Payment for ${totalCredits} teacher credits`,
          payeeNote: `Credit purchase for user ${user.email}`
        });

        console.log('📱 MTN MoMo Request Result:', paymentResult);
      } else if (selectedPaymentMethod.id === 'airtel_money') {
        paymentResult = await paymentService.requestAirtelPayment({
          amount: amountPaid,
          currency: 'UGX',
          phoneNumber: phoneNumber,
          reference: paymentReference,
          description: `MG Investments - ${totalCredits} Teacher Credits`,
          payerMessage: `Payment for ${totalCredits} teacher credits`,
          payeeNote: `Credit purchase for user ${user.email}`
        });
      } else if (selectedPaymentMethod.id === 'stanbic_bank') {
        paymentResult = await paymentService.requestStanbicPayment({
          amount: amountPaid,
          currency: 'UGX',
          phoneNumber: '',
          reference: paymentReference,
          description: `MG Investments - ${totalCredits} Teacher Credits`
        });
      }

      if (paymentResult?.success) {
        // Show payment request sent message
        toast({
          title: "Payment Request Sent!",
          description: paymentResult.message || "Please check your phone and approve the payment.",
        });

        // For demo purposes, we'll simulate payment completion after a delay
        // In production, you would poll for payment status or use webhooks
        setTimeout(async () => {
          try {
            // Simulate payment completion check
            const statusResult = await paymentService.checkPaymentStatus(
              paymentResult.transactionId!,
              selectedPaymentMethod.id
            );

            if (statusResult.success && statusResult.status === 'completed') {
              // Record the credit purchase
              const creditResult = await teacherCreditService.purchaseCredits(
                user.id,
                totalCredits,
                amountPaid,
                paymentResult.transactionId!
              );

              if (creditResult.success) {
                toast({
                  title: "Payment Successful!",
                  description: `${totalCredits} teacher credits have been added to your account.`,
                });

                onPurchaseComplete?.(totalCredits);
                onClose();
                resetModal();
              } else {
                throw new Error(creditResult.error || 'Failed to add credits');
              }
            } else {
              throw new Error(statusResult.error || 'Payment was not completed');
            }
          } catch (error) {
            console.error('Payment completion error:', error);
            toast({
              title: "Payment Failed",
              description: error instanceof Error ? error.message : "Payment was not completed. Please try again.",
              variant: "destructive",
            });
            setCurrentStep('payment');
          } finally {
            setIsProcessing(false);
          }
        }, 5000); // 5 second delay for demo

      } else {
        throw new Error(paymentResult?.error || 'Payment request failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Please try again or contact support.",
        variant: "destructive",
      });
      setCurrentStep('payment');
      setIsProcessing(false);
    }
  };

  const resetModal = () => {
    setCurrentStep('select');
    setSelectedOption(null);
    setSelectedPaymentMethod(null);
    setPhoneNumber('');
    setIsProcessing(false);
  };

  const handleClose = () => {
    if (!isProcessing) {
      resetModal();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            {currentStep !== 'select' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToSelection}
                disabled={isProcessing}
                className="p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div className="flex-1 text-center">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {currentStep === 'select' && 'Purchase Teacher Credits'}
                {currentStep === 'payment' && 'Choose Payment Method'}
                {currentStep === 'processing' && 'Processing Payment'}
              </DialogTitle>
              <p className="text-gray-600 mt-2">
                {currentStep === 'select' && 'Choose a credit package to start contacting teachers'}
                {currentStep === 'payment' && 'Select your preferred payment method'}
                {currentStep === 'processing' && 'Please wait while we process your payment'}
              </p>
            </div>
            {!isProcessing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="p-2"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Step 1: Credit Selection */}
          {currentStep === 'select' && (
            <>
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
                  onClick={handleClose}
                  className="flex-1"
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleContinueToPayment}
                  disabled={!selectedOption || isProcessing}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {selectedOption ? (
                    <>
                      Continue to Payment
                      <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
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
            </>
          )}

          {/* Step 2: Payment Method Selection */}
          {currentStep === 'payment' && selectedOption && (
            <>
              {/* Selected Package Summary */}
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {selectedOption.credits + selectedOption.bonus} Teacher Credits
                      </h4>
                      <p className="text-sm text-gray-600">
                        {selectedOption.bonus > 0 && `Includes ${selectedOption.bonus} bonus credits!`}
                      </p>
                    </div>
                    <div className="text-xl font-bold text-blue-600">
                      UGX {selectedOption.price}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Choose Payment Method:</h4>
                <div className="grid gap-4">
                  {paymentMethods.map((method) => (
                    <Card
                      key={method.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedPaymentMethod?.id === method.id
                          ? 'ring-2 ring-blue-500 bg-blue-50'
                          : 'hover:border-blue-300'
                      } ${!method.enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => method.enabled && handlePaymentMethodSelect(method)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl">{method.logo}</div>
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-900">{method.name}</h5>
                            <p className="text-sm text-gray-600">{method.description}</p>
                            <p className="text-xs text-gray-500 mt-1">{method.instructions}</p>
                          </div>
                          {selectedPaymentMethod?.id === method.id && (
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Phone Number Input for Mobile Money */}
              {selectedPaymentMethod && (selectedPaymentMethod.id === 'mtn_momo' || selectedPaymentMethod.id === 'airtel_money') && (
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                    {selectedPaymentMethod.name} Phone Number
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="e.g., 0771234567 or 256771234567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">
                    Enter your {selectedPaymentMethod.name} number to receive the payment request
                  </p>
                </div>
              )}

              {/* Payment Action Button */}
              <Button
                onClick={handleProcessPayment}
                disabled={!selectedPaymentMethod || isProcessing ||
                  ((selectedPaymentMethod?.id === 'mtn_momo' || selectedPaymentMethod?.id === 'airtel_money') && !phoneNumber.trim())}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing Payment...
                  </>
                ) : selectedPaymentMethod ? (
                  <>
                    <Phone className="h-4 w-4 mr-2" />
                    Pay UGX {selectedOption.price} with {selectedPaymentMethod.name}
                  </>
                ) : (
                  "Select Payment Method"
                )}
              </Button>
            </>
          )}

          {/* Step 3: Processing */}
          {currentStep === 'processing' && (
            <div className="text-center py-8">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600 mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Processing Your Payment</h4>
              <p className="text-gray-600 mb-4">
                {selectedPaymentMethod?.id === 'mtn_momo' && 'Please check your phone and approve the MTN MoMo payment request.'}
                {selectedPaymentMethod?.id === 'airtel_money' && 'Please check your phone and approve the Airtel Money payment request.'}
                {selectedPaymentMethod?.id === 'stanbic_bank' && 'Please complete the payment using your Stanbic Bank app or visit a branch.'}
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                <p>💡 <strong>Tip:</strong> Keep this window open while completing the payment on your phone.</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreditPurchaseModal;
