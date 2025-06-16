
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, CreditCard, Phone, ArrowLeft, Crown, Lock } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SimpleCreditModal from "@/components/SimpleCreditModal";

const SubscriptionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showCreditModal, setShowCreditModal] = useState(false);

  const isFromTeacherPortal = location.pathname.includes('teacher') || location.state?.from === 'teacher-portal';
  const isFromHireTeachers = location.state?.from === 'hire-teachers';
  const isFromSchoolPortal = location.state?.from === 'school-portal';
  const teacherId = location.state?.teacherId;
  const preferredPlan = location.state?.plan; // 'credits', 'monthly', etc.

  // Teacher-specific plans
  const teacherPlans = [
    {
      name: "Free Access",
      price: "0",
      period: "forever",
      description: "Basic access to get started",
      features: [
        "View job titles and school names",
        "Submit general applications",
        "Basic profile creation",
        "Email support"
      ],
      popular: false,
      buttonText: "Current Plan",
      disabled: true
    },
    {
      name: "Premium Teacher",
      price: "150,000",
      period: "month",
      description: "Full access to all teaching opportunities",
      features: [
        "View all job postings with full details",
        "Apply directly to specific positions",
        "Access school contact information",
        "Priority application status",
        "Advanced job filtering and search",
        "Email notifications for new jobs",
        "Application tracking dashboard",
        "Direct messaging with schools",
        "Salary negotiation tools",
        "Interview scheduling assistance"
      ],
      popular: true,
      buttonText: "Upgrade to Premium"
    },
    {
      name: "Professional Teacher",
      price: "250,000",
      period: "month",
      description: "For experienced teachers seeking premium positions",
      features: [
        "Everything in Premium Teacher",
        "Access to exclusive high-paying positions",
        "Personal career consultant",
        "Resume optimization service",
        "Interview coaching sessions",
        "Salary benchmarking reports",
        "Professional development resources",
        "Networking events access"
      ],
      popular: false,
      buttonText: "Go Professional"
    }
  ];

  // School-specific plans (per-teacher pricing)
  const schoolPlans = [
    {
      name: "Pay Per Teacher",
      price: "25,000",
      period: "per teacher contact",
      description: "Perfect for schools with occasional hiring needs",
      features: [
        "Pay only for teachers you contact",
        "Full teacher profile access",
        "Contact details and experience",
        "Direct messaging capability",
        "No monthly commitment",
        "Credits never expire"
      ],
      popular: false,
      buttonText: "Buy Teacher Credits",
      perTeacher: true,
      creditOptions: [
        { credits: 1, price: "25,000", bonus: 0 },
        { credits: 5, price: "120,000", bonus: 1 },
        { credits: 10, price: "225,000", bonus: 3 },
        { credits: 20, price: "400,000", bonus: 8 }
      ]
    },
    {
      name: "Monthly Unlimited",
      price: "150,000",
      period: "month",
      description: "Best for active schools with regular hiring needs",
      features: [
        "Unlimited teacher contacts per month",
        "Full contact details and experience",
        "Direct messaging with teachers",
        "Priority support",
        "Advanced search filters",
        "Teacher recommendation engine",
        "Monthly hiring reports"
      ],
      popular: true,
      buttonText: "Choose Monthly Plan"
    },
    {
      name: "Enterprise",
      price: "300,000",
      period: "month",
      description: "For large educational institutions",
      features: [
        "Everything in Monthly Unlimited",
        "Multiple user accounts",
        "Custom branding",
        "Dedicated account manager",
        "API access",
        "Custom integrations",
        "Bulk teacher import/export"
      ],
      popular: false,
      buttonText: "Contact Sales"
    }
  ];

  const plans = isFromTeacherPortal ? teacherPlans : schoolPlans;

  // Handle credit purchase completion
  const handleCreditPurchaseComplete = (credits: number) => {
    alert(`Success! You purchased ${credits} teacher credits.`);

    // Redirect back to school portal after successful purchase
    setTimeout(() => {
      navigate('/school-portal', {
        state: {
          tab: 'teachers',
          message: `${credits} credits added to your account!`
        }
      });
    }, 2000);
  };

  // Handle plan selection
  const handlePlanSelect = (plan: any) => {
    if (plan.perTeacher) {
      setShowCreditModal(true);
    } else {
      // Handle other subscription types (monthly, enterprise)
      alert(`You selected the ${plan.name} plan. Payment integration coming soon!`);
    }
  };

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
    },
    {
      name: "Stanbic Bank",
      logo: "🏦",
      description: "Bank transfer or mobile banking",
      instructions: "Use Stanbic mobile app or visit any branch"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                {(isFromTeacherPortal || isFromHireTeachers) && <Crown className="h-6 w-6 mr-2 text-amber-500" />}
                {isFromTeacherPortal ? 'Unlock Premium Job Access' :
                 isFromHireTeachers ? 'Unlock Teacher Contact' :
                 'Premium Subscription'}
              </h1>
              <p className="text-gray-600">
                {isFromTeacherPortal
                  ? 'Get full access to all teaching positions and apply directly to schools'
                  : isFromHireTeachers
                  ? 'Subscribe to contact teachers directly and access their full profiles'
                  : 'Unlock full access to teacher profiles and advanced features'
                }
              </p>
            </div>
            <Link to={isFromTeacherPortal ? "/teacher-portal" : isFromHireTeachers ? "/hire-teachers" : "/"}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {isFromTeacherPortal ? 'Back to Portal' :
                 isFromHireTeachers ? 'Back to Teachers' :
                 'Back to Home'}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className={`mb-4 ${(isFromTeacherPortal || isFromHireTeachers) ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'} hover:bg-current`}>
            {(isFromTeacherPortal || isFromHireTeachers) ? (
              <>
                <Lock className="h-4 w-4 mr-1" />
                Premium Access Required
              </>
            ) : (
              '🔓 Premium Access Required'
            )}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {isFromTeacherPortal ? (
              <>
                Unlock Your Teaching
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent"> Career Potential</span>
              </>
            ) : isFromHireTeachers ? (
              <>
                Contact Teachers
                <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent"> Directly</span>
              </>
            ) : (
              <>
                Get Full Access to
                <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent"> Teacher Profiles</span>
              </>
            )}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {isFromTeacherPortal ? (
              'Access all teaching opportunities, apply directly to schools, and take control of your career with our premium features designed specifically for educators.'
            ) : isFromHireTeachers ? (
              'Upgrade to premium access to contact teachers directly, view their complete profiles, and streamline your hiring process with advanced communication tools.'
            ) : (
              'Access complete teacher information including contact details, location, detailed experience, and direct communication capabilities to make informed hiring decisions.'
            )}
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

                {/* Credit Options for Per-Teacher Plan */}
                {plan.perTeacher && plan.creditOptions && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Choose Credit Package:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {plan.creditOptions.map((option, idx) => (
                        <div key={idx} className="border rounded-lg p-3 text-center hover:border-blue-400 cursor-pointer transition-colors">
                          <div className="font-bold text-lg text-gray-900">
                            {option.credits}{option.bonus > 0 && <span className="text-green-600">+{option.bonus}</span>}
                          </div>
                          <div className="text-sm text-gray-600">credits</div>
                          <div className="text-sm font-medium text-blue-600">UGX {option.price}</div>
                          {option.bonus > 0 && (
                            <Badge className="mt-1 bg-green-100 text-green-800">
                              {option.bonus} Bonus!
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  className={`w-full ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700' : ''}`}
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => handlePlanSelect(plan)}
                  disabled={plan.disabled}
                >
                  {plan.perTeacher ? (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      {plan.buttonText}
                    </>
                  ) : (
                    plan.buttonText
                  )}
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
              <div className="grid md:grid-cols-3 gap-6 mb-8">
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
                  <li><strong>Mobile Money:</strong> Follow the prompts on your phone and enter your PIN</li>
                  <li><strong>Stanbic Bank:</strong> Use mobile banking app or visit any branch</li>
                  <li>Enter the payment amount as shown in your selected plan</li>
                  <li>Your account will be upgraded immediately upon successful payment</li>
                  <li>Contact support if you experience any payment issues</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <Card className={`bg-gradient-to-r ${isFromTeacherPortal ? 'from-amber-50 to-orange-50 border-amber-200' : 'from-blue-50 to-teal-50 border-blue-200'}`}>
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {isFromTeacherPortal ? 'What You Get with Premium Teacher Access' : 'What You Get with Premium Access'}
                </h3>
                <p className="text-gray-600">
                  {isFromTeacherPortal
                    ? 'Everything you need to advance your teaching career'
                    : 'Everything you need to find and hire the perfect teachers'
                  }
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {isFromTeacherPortal ? (
                  <>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Briefcase className="h-5 w-5 text-amber-600" />
                        <span className="text-gray-700">Access to all job postings with full details</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Users className="h-5 w-5 text-amber-600" />
                        <span className="text-gray-700">Direct contact with schools and administrators</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MessageSquare className="h-5 w-5 text-amber-600" />
                        <span className="text-gray-700">Direct messaging and communication tools</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <TrendingUp className="h-5 w-5 text-amber-600" />
                        <span className="text-gray-700">Priority application status and visibility</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Filter className="h-5 w-5 text-amber-600" />
                        <span className="text-gray-700">Advanced job filtering and search options</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Bell className="h-5 w-5 text-amber-600" />
                        <span className="text-gray-700">Email notifications for matching opportunities</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-gray-700">Application tracking and status updates</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-gray-700">Career development resources and support</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Credit Purchase Modal */}
      <SimpleCreditModal
        isOpen={showCreditModal}
        onClose={() => setShowCreditModal(false)}
        onPurchaseComplete={handleCreditPurchaseComplete}
      />
    </div>
  );
};

export default SubscriptionPage;
