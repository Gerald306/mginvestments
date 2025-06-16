import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { 
  Menu, 
  X, 
  Home, 
  GraduationCap, 
  School, 
  Settings, 
  User,
  BookOpen,
  Users,
  FileText,
  Plus,
  LogOut
} from 'lucide-react';

interface MobileNavigationProps {
  userType?: 'teacher' | 'school' | 'admin' | 'guest';
  onSignOut?: () => void;
  userName?: string;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ 
  userType = 'guest', 
  onSignOut,
  userName 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setIsOpen(false);

  const getNavigationItems = () => {
    const baseItems = [
      { to: '/', icon: Home, label: 'Home', show: true },
    ];

    switch (userType) {
      case 'teacher':
        return [
          ...baseItems,
          { to: '/teacher-portal', icon: User, label: 'My Profile', show: true },
          { to: '/teacher-portal?tab=jobs', icon: FileText, label: 'Available Jobs', show: true },
          { to: '/teacher-portal?tab=applications', icon: BookOpen, label: 'My Applications', show: true },
          { to: '/subscription', icon: GraduationCap, label: 'Premium', show: true },
        ];
      
      case 'school':
        return [
          ...baseItems,
          { to: '/school-portal', icon: School, label: 'School Portal', show: true },
          { to: '/school-portal?tab=teachers', icon: Users, label: 'Browse Teachers', show: true },
          { to: '/school-portal?tab=jobs', icon: FileText, label: 'My Job Posts', show: true },
          { to: '/school-portal?tab=post-job', icon: Plus, label: 'Post New Job', show: true },
        ];
      
      case 'admin':
        return [
          ...baseItems,
          { to: '/admin-dashboard', icon: Settings, label: 'Admin Dashboard', show: true },
          { to: '/teacher-portal', icon: GraduationCap, label: 'Teacher Portal', show: true },
          { to: '/school-portal', icon: School, label: 'School Portal', show: true },
        ];
      
      default:
        return [
          ...baseItems,
          { to: '/hire-teachers', icon: Users, label: 'Hire Teachers', show: true },
          { to: '/teacher-portal', icon: GraduationCap, label: 'Teacher Portal', show: true },
          { to: '/school-portal', icon: School, label: 'School Portal', show: true },
        ];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="p-2">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        
        <SheetContent side="left" className="w-80 p-0">
          <div className="flex flex-col h-full">
            {/* Header */}
            <SheetHeader className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <SheetTitle className="text-white text-lg font-bold">
                    MG Investments
                  </SheetTitle>
                  <p className="text-blue-100 text-sm">Education Services</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={closeMenu}
                  className="text-white hover:bg-white/20 p-1"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              {userName && (
                <div className="mt-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                  <p className="text-sm text-blue-100">Welcome back,</p>
                  <p className="font-semibold text-white truncate">{userName}</p>
                </div>
              )}
            </SheetHeader>

            {/* Navigation Items */}
            <div className="flex-1 p-4 space-y-2">
              {navigationItems.map((item) => {
                if (!item.show) return null;
                
                const isActive = location.pathname === item.to || 
                  (item.to.includes('?') && location.pathname === item.to.split('?')[0]);
                
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={closeMenu}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-gray-200 space-y-2">
              {userType !== 'guest' && onSignOut && (
                <Button
                  variant="outline"
                  onClick={() => {
                    onSignOut();
                    closeMenu();
                  }}
                  className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign Out
                </Button>
              )}
              
              {userType === 'guest' && (
                <div className="space-y-2">
                  <Link to="/teacher-portal" onClick={closeMenu}>
                    <Button variant="outline" className="w-full justify-start">
                      <GraduationCap className="h-4 w-4 mr-3" />
                      Teacher Login
                    </Button>
                  </Link>
                  <Link to="/school-portal" onClick={closeMenu}>
                    <Button variant="outline" className="w-full justify-start">
                      <School className="h-4 w-4 mr-3" />
                      School Login
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavigation;
