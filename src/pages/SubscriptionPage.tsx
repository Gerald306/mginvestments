
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, CreditCard, Phone, ArrowLeft, Crown, Lock, Briefcase, Users, MessageSquare, TrendingUp, Filter, Bell, Zap, Sparkles } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-gradient-to-r from-teal-400/20 to-blue-400/20 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <div className="relative bg-white/90 backdrop-blur-lg border-b border-purple-200/50 shadow-lg">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-700 via-blue-600 to-teal-600 bg-clip-text text-transparent flex items-center">
                {(isFromTeacherPortal || isFromHireTeachers) && <Crown className="h-8 w-8 mr-3 text-amber-500 drop-shadow-lg" />}
                {isFromTeacherPortal ? 'Unlock Premium Job Access' :
                 isFromHireTeachers ? 'Unlock Teacher Contact' :
                 'Premium Subscription'}
                <Sparkles className="h-6 w-6 ml-2 text-purple-500" />
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                {isFromTeacherPortal
                  ? 'Get full access to all teaching positions and apply directly to schools'
                  : isFromHireTeachers
                  ? 'Subscribe to contact teachers directly and access their full profiles'
                  : 'Unlock full access to teacher profiles and advanced features'
                }
              </p>
            </div>
            <Link to={isFromTeacherPortal ? "/teacher-portal" : isFromHireTeachers ? "/hire-teachers" : "/"}>
              <Button variant="outline" size="lg" className="border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {isFromTeacherPortal ? 'Back to Portal' :
                 isFromHireTeachers ? 'Back to Teachers' :
                 'Back to Home'}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="relative p-6">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className={`mb-6 px-6 py-2 text-lg font-semibold ${(isFromTeacherPortal || isFromHireTeachers) ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-200' : 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 border-purple-200'} hover:scale-105 transition-transform duration-200 shadow-lg`}>
            {(isFromTeacherPortal || isFromHireTeachers) ? (
              <>
                <Lock className="h-5 w-5 mr-2" />
                Premium Access Required
              </>
            ) : (
              <>
                <Zap className="h-5 w-5 mr-2" />
                Premium Access Required
              </>
            )}
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {isFromTeacherPortal ? (
              <>
                Unlock Your Teaching
                <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 bg-clip-text text-transparent block">
                  Career Potential
                </span>
              </>
            ) : isFromHireTeachers ? (
              <>
                Contact Teachers
                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent block">
                  Directly
                </span>
              </>
            ) : (
              <>
                Get Full Access to
                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent block">
                  Teacher Profiles
                </span>
              </>
            )}
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
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
        <div className="grid lg:grid-cols-3 gap-8 mb-16 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden ${
              plan.popular 
                ? 'ring-4 ring-purple-400/50 scale-105 bg-gradient-to-br from-white via-purple-50 to-pink-50' 
                : 'bg-white/80 backdrop-blur-sm hover:scale-102'
            }`}>
              {plan.popular && (
                <>
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 text-white px-6 py-2 text-sm font-bold shadow-lg">
                      <Star className="h-4 w-4 mr-2 fill-current" />
                      Most Popular
                    </Badge>
                  </div>
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500"></div>
                </>
              )}
              <CardHeader className="text-center pb-6 pt-8">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent">
                    UGX {plan.price}
                  </span>
                  <span className="text-gray-600 text-lg">/{plan.period}</span>
                </div>
                <CardDescription className="mt-4 text-base text-gray-600">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 px-6 pb-8">
                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <CheckCircle className="h-6 w-6 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Credit Options for Per-Teacher Plan */}
                {plan.perTeacher && plan.creditOptions && (
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-900 text-lg">Choose Credit Package:</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {plan.creditOptions.map((option, idx) => (
                        <div key={idx} className="border-2 border-gray-200 rounded-xl p-4 text-center hover:border-purple-400 hover:bg-purple-50 cursor-pointer transition-all duration-200 hover:scale-105">
                          <div className="font-bold text-xl text-gray-900 mb-1">
                            {option.credits}
                            {option.bonus > 0 && <span className="text-emerald-600 text-lg">+{option.bonus}</span>}
                          </div>
                          <div className="text-sm text-gray-600 mb-2">credits</div>
                          <div className="text-base font-bold text-purple-600">UGX {option.price}</div>
                          {option.bonus > 0 && (
                            <Badge className="mt-2 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-emerald-200">
                              🎁 {option.bonus} Bonus!
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  className={`w-full py-4 text-lg font-semibold transition-all duration-300 ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 hover:from-purple-700 hover:via-blue-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105' 
                      : 'border-2 border-purple-200 hover:bg-purple-50 hover:border-purple-300'
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => handlePlanSelect(plan)}
                  disabled={plan.disabled}
                >
                  {plan.perTeacher ? (
                    <>
                      <CreditCard className="h-5 w-5 mr-3" />
                      {plan.buttonText}
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-3" />
                      {plan.buttonText}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="max-w-6xl mx-auto">
          <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent mb-4">
                Choose Payment Method
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Pay securely using your preferred mobile money service
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-8 mb-10">
                {paymentMethods.map((method, index) => (
                  <Card key={index} className="border-2 border-gray-200 hover:border-purple-400 hover:shadow-xl transition-all duration-300 cursor-pointer group hover:scale-105">
                    <CardContent className="p-8 text-center">
                      <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-200">{method.logo}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{method.name}</h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">{method.description}</p>
                      <p className="text-sm text-gray-500 mb-6">{method.instructions}</p>
                      <Button className="w-full py-3 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 hover:from-purple-700 hover:via-blue-700 hover:to-teal-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                        Pay with {method.name}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-8">
                <h3 className="font-bold text-purple-900 mb-4 text-xl flex items-center">
                  <Zap className="h-6 w-6 mr-2" />
                  Payment Instructions:
                </h3>
                <ol className="list-decimal list-inside space-y-3 text-purple-800 leading-relaxed">
                  <li><strong>Select your preferred payment method above</strong></li>
                  <li><strong>Mobile Money:</strong> Follow the prompts on your phone and enter your PIN</li>
                  <li><strong>Stanbic Bank:</strong> Use mobile banking app or visit any branch</li>
                  <li><strong>Enter the payment amount</strong> as shown in your selected plan</li>
                  <li><strong>Your account will be upgraded immediately</strong> upon successful payment</li>
                  <li><strong>Contact support</strong> if you experience any payment issues</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="mt-16 max-w-6xl mx-auto">
          <Card className={`bg-gradient-to-br shadow-2xl border-0 ${
            isFromTeacherPortal 
              ? 'from-amber-50 via-orange-50 to-pink-50' 
              : 'from-purple-50 via-blue-50 to-teal-50'
          }`}>
            <CardContent className="p-10">
              <div className="text-center mb-10">
                <h3 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
                  <Crown className="h-8 w-8 mr-3 text-amber-500" />
                  {isFromTeacherPortal ? 'What You Get with Premium Teacher Access' : 'What You Get with Premium Access'}
                </h3>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {isFromTeacherPortal
                    ? 'Everything you need to advance your teaching career'
                    : 'Everything you need to find and hire the perfect teachers'
                  }
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {isFromTeacherPortal ? (
                  <>
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4 p-4 bg-white/80 rounded-xl shadow-sm">
                        <Briefcase className="h-8 w-8 text-amber-600" />
                        <span className="text-gray-700 text-lg">Access to all job postings with full details</span>
                      </div>
                      <div className="flex items-center space-x-4 p-4 bg-white/80 rounded-xl shadow-sm">
                        <Users className="h-8 w-8 text-amber-600" />
                        <span className="text-gray-700 text-lg">Direct contact with schools and administrators</span>
                      </div>
                      <div className="flex items-center space-x-4 p-4 bg-white/80 rounded-xl shadow-sm">
                        <MessageSquare className="h-8 w-8 text-amber-600" />
                        <span className="text-gray-700 text-lg">Direct messaging and communication tools</span>
                      </div>
                      <div className="flex items-center space-x-4 p-4 bg-white/80 rounded-xl shadow-sm">
                        <TrendingUp className="h-8 w-8 text-amber-600" />
                        <span className="text-gray-700 text-lg">Priority application status and visibility</span>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4 p-4 bg-white/80 rounded-xl shadow-sm">
                        <Filter className="h-8 w-8 text-amber-600" />
                        <span className="text-gray-700 text-lg">Advanced job filtering and search options</span>
                      </div>
                      <div className="flex items-center space-x-4 p-4 bg-white/80 rounded-xl shadow-sm">
                        <Bell className="h-8 w-8 text-amber-600" />
                        <span className="text-gray-700 text-lg">Email notifications for matching opportunities</span>
                      </div>
                      <div className="flex items-center space-x-4 p-4 bg-white/80 rounded-xl shadow-sm">
                        <CheckCircle className="h-8 w-8 text-emerald-600" />
                        <span className="text-gray-700 text-lg">Application tracking and status updates</span>
                      </div>
                      <div className="flex items-center space-x-4 p-4 bg-white/80 rounded-xl shadow-sm">
                        <CheckCircle className="h-8 w-8 text-emerald-600" />
                        <span className="text-gray-700 text-lg">Career development resources and support</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4 p-4 bg-white/80 rounded-xl shadow-sm">
                        <Phone className="h-8 w-8 text-purple-600" />
                        <span className="text-gray-700 text-lg">Direct contact information for all teachers</span>
                      </div>
                      <div className="flex items-center space-x-4 p-4 bg-white/80 rounded-xl shadow-sm">
                        <CheckCircle className="h-8 w-8 text-emerald-600" />
                        <span className="text-gray-700 text-lg">Detailed teaching experience and qualifications</span>
                      </div>
                      <div className="flex items-center space-x-4 p-4 bg-white/80 rounded-xl shadow-sm">
                        <CheckCircle className="h-8 w-8 text-emerald-600" />
                        <span className="text-gray-700 text-lg">Location information for logistics planning</span>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4 p-4 bg-white/80 rounded-xl shadow-sm">
                        <CheckCircle className="h-8 w-8 text-emerald-600" />
                        <span className="text-gray-700 text-lg">Priority support and faster response times</span>
                      </div>
                      <div className="flex items-center space-x-4 p-4 bg-white/80 rounded-xl shadow-sm">
                        <CheckCircle className="h-8 w-8 text-emerald-600" />
                        <span className="text-gray-700 text-lg">Advanced search and filtering options</span>
                      </div>
                      <div className="flex items-center space-x-4 p-4 bg-white/80 rounded-xl shadow-sm">
                        <CheckCircle className="h-8 w-8 text-emerald-600" />
                        <span className="text-gray-700 text-lg">Unlimited job postings and applications</span>
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
