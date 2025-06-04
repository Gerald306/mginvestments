
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, Smartphone, CreditCard, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const SubscriptionPage = () => {
  const plans = [
    {
      name: "Basic Access",
      price: "50,000",
      period: "month",
      description: "Perfect for small schools and occasional hiring",
      features: [
        "View up to 20 teacher profiles per month",
        "Basic teacher information",
        "Email support",
        "Job posting (1 active at a time)"
      ],
      popular: false,
      buttonText: "Choose Basic"
    },
    {
      name: "Premium Access",
      price: "150,000",
      period: "month", 
      description: "Best for active schools with regular hiring needs",
      features: [
        "Unlimited teacher profile access",
        "Full contact details and experience",
        "Phone numbers and locations",
        "Priority support",
        "Unlimited job postings",
        "Advanced filtering and search",
        "Email notifications for new matches",
        "Direct messaging with teachers"
      ],
      popular: true,
      buttonText: "Choose Premium"
    },
    {
      name: "Enterprise",
      price: "300,000",
      period: "month",
      description: "For large educational institutions",
      features: [
        "Everything in Premium",
        "Multiple user accounts",
        "Custom branding",
        "API access",
        "Dedicated account manager",
        "Custom integrations",
        "Advanced analytics and reporting",
        "Bulk teacher import/export"
      ],
      popular: false,
      buttonText: "Contact Sales"
    }
  ];

  const paymentMethods = [
    {
      name: "MTN Mobile Money",
      logo: "📱",
      description: "Pay securely with MTN MoMo",
      instructions: "Dial *165# and follow the prompts"
    },
    {
      name: "Airtel Money",
      logo: "📲", 
      description: "Quick payment with Airtel Money",
      instructions: "Dial *185# to complete payment"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Premium Subscription</h1>
              <p className="text-gray-600">Unlock full access to teacher profiles and advanced features</p>
            </div>
            <Link to="/">
              <Button variant="outline" size="sm">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
            🔓 Premium Access Required
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get Full Access to
            <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent"> Teacher Profiles</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Access complete teacher information including contact details, location, detailed experience, 
            and direct communication capabilities to make informed hiring decisions.
          </p>
        </div>

        {/* Pricing Plans */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative border-0 shadow-lg ${plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-blue-600 to-teal-600 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-bold text-gray-900">{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900">UGX {plan.price}</span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700' : ''}`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">Choose Payment Method</CardTitle>
              <CardDescription>
                Pay securely using your preferred mobile money service
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {paymentMethods.map((method, index) => (
                  <Card key={index} className="border-2 border-gray-200 hover:border-blue-400 transition-colors cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-4">{method.logo}</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{method.name}</h3>
                      <p className="text-gray-600 mb-3">{method.description}</p>
                      <p className="text-sm text-gray-500">{method.instructions}</p>
                      <Button className="mt-4 w-full bg-gradient-to-r from-blue-600 to-teal-600">
                        Pay with {method.name}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-2">Payment Instructions:</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                  <li>Select your preferred payment method above</li>
                  <li>Follow the mobile money prompts on your phone</li>
                  <li>Enter the payment amount as shown in your selected plan</li>
                  <li>Complete the transaction using your mobile money PIN</li>
                  <li>Your account will be upgraded immediately upon successful payment</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-blue-50 to-teal-50 border-blue-200">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">What You Get with Premium Access</h3>
                <p className="text-gray-600">Everything you need to find and hire the perfect teachers</p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">Direct contact information for all teachers</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Detailed teaching experience and qualifications</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Location information for logistics planning</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Priority support and faster response times</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Advanced search and filtering options</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Unlimited job postings and applications</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
