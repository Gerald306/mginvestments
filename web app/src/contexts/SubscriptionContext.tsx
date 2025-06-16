import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { firebase } from '@/integrations/firebase/client';

interface SubscriptionContextType {
  subscriptionStatus: 'free' | 'basic' | 'premium' | 'enterprise';
  subscriptionExpiresAt: string | null;
  hasPremiumAccess: boolean;
  isLoading: boolean;
  updateSubscription: (status: string, expiresAt?: string) => Promise<void>;
  checkSubscriptionStatus: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

interface SubscriptionProviderProps {
  children: React.ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const { user, profile } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] = useState<'free' | 'basic' | 'premium' | 'enterprise'>('free');
  const [subscriptionExpiresAt, setSubscriptionExpiresAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user has premium access
  const hasPremiumAccess = React.useMemo(() => {
    // Admins always have access
    if (profile?.role === 'admin') return true;
    
    // Check subscription status
    const premiumTiers = ['premium', 'enterprise'];
    const hasValidSubscription = premiumTiers.includes(subscriptionStatus);
    
    // Check if subscription is not expired
    if (subscriptionExpiresAt) {
      const expiryDate = new Date(subscriptionExpiresAt);
      const now = new Date();
      return hasValidSubscription && expiryDate > now;
    }
    
    return hasValidSubscription;
  }, [profile?.role, subscriptionStatus, subscriptionExpiresAt]);

  // Load subscription status from profile
  useEffect(() => {
    if (profile) {
      setSubscriptionStatus(profile.subscription_status || 'free');
      setSubscriptionExpiresAt(profile.subscription_expires_at || null);
      setIsLoading(false);
    } else if (!user) {
      // User not logged in
      setSubscriptionStatus('free');
      setSubscriptionExpiresAt(null);
      setIsLoading(false);
    }
  }, [profile, user]);

  // Update subscription status
  const updateSubscription = async (status: string, expiresAt?: string) => {
    if (!user || !profile) {
      throw new Error('User must be logged in to update subscription');
    }

    try {
      setIsLoading(true);
      
      // Update in Firebase
      const updateData: any = {
        subscription_status: status,
        updated_at: new Date().toISOString()
      };
      
      if (expiresAt) {
        updateData.subscription_expires_at = expiresAt;
      }

      const result = await firebase
        .from('profiles')
        .update(profile.id, updateData);

      if (result.error) {
        throw result.error;
      }

      // Update local state
      setSubscriptionStatus(status as any);
      setSubscriptionExpiresAt(expiresAt || null);
      
      console.log('✅ Subscription updated successfully');
      
    } catch (error) {
      console.error('❌ Failed to update subscription:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Check subscription status (refresh from database)
  const checkSubscriptionStatus = async () => {
    if (!user || !profile) return;

    try {
      setIsLoading(true);
      
      const result = await firebase
        .from('profiles')
        .select('subscription_status, subscription_expires_at')
        .eq('id', profile.id)
        .single();

      if (result.data && !result.error) {
        setSubscriptionStatus(result.data.subscription_status || 'free');
        setSubscriptionExpiresAt(result.data.subscription_expires_at || null);
      }
      
    } catch (error) {
      console.error('❌ Failed to check subscription status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value: SubscriptionContextType = {
    subscriptionStatus,
    subscriptionExpiresAt,
    hasPremiumAccess,
    isLoading,
    updateSubscription,
    checkSubscriptionStatus
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
