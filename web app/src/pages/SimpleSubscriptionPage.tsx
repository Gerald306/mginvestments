import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SimpleCreditModal from '@/components/SimpleCreditModal';

const SimpleSubscriptionPage = () => {
  const [showModal, setShowModal] = useState(false);

  const handlePurchaseComplete = (credits: number) => {
    console.log(`Purchased ${credits} credits successfully!`);
    alert(`Success! You purchased ${credits} credits.`);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
            MG Investments - Teacher Credits
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
            Purchase credits to contact teachers and access their full profiles
          </p>
        </div>

        {/* Credit Packages */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          <Card>
            <CardHeader>
              <CardTitle>1 Teacher Credit</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '1rem' }}>
                UGX 25,000
              </div>
              <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
                <li>Contact 1 teacher</li>
                <li>Full profile access</li>
                <li>Direct messaging</li>
              </ul>
              <Button 
                onClick={() => setShowModal(true)}
                style={{ width: '100%' }}
              >
                Purchase Credits
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5+1 Teacher Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '1rem' }}>
                UGX 120,000
              </div>
              <div style={{ color: '#16a34a', fontWeight: '600', marginBottom: '1rem' }}>
                🎉 1 Bonus Credit Included!
              </div>
              <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
                <li>Contact 6 teachers total</li>
                <li>Full profile access</li>
                <li>Direct messaging</li>
                <li>Save UGX 30,000</li>
              </ul>
              <Button 
                onClick={() => setShowModal(true)}
                style={{ width: '100%', backgroundColor: '#2563eb' }}
              >
                Purchase Credits
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10+3 Teacher Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '1rem' }}>
                UGX 225,000
              </div>
              <div style={{ color: '#16a34a', fontWeight: '600', marginBottom: '1rem' }}>
                🎉 3 Bonus Credits Included!
              </div>
              <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
                <li>Contact 13 teachers total</li>
                <li>Full profile access</li>
                <li>Direct messaging</li>
                <li>Save UGX 100,000</li>
              </ul>
              <Button 
                onClick={() => setShowModal(true)}
                style={{ width: '100%', backgroundColor: '#7c3aed' }}
              >
                Purchase Credits
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>20+8 Teacher Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '1rem' }}>
                UGX 400,000
              </div>
              <div style={{ color: '#16a34a', fontWeight: '600', marginBottom: '1rem' }}>
                🎉 8 Bonus Credits Included!
              </div>
              <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
                <li>Contact 28 teachers total</li>
                <li>Full profile access</li>
                <li>Direct messaging</li>
                <li>Save UGX 300,000</li>
              </ul>
              <Button 
                onClick={() => setShowModal(true)}
                style={{ width: '100%', backgroundColor: '#dc2626' }}
              >
                Purchase Credits
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Payment Methods */}
        <Card style={{ marginBottom: '2rem' }}>
          <CardHeader>
            <CardTitle style={{ textAlign: 'center' }}>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ textAlign: 'center', padding: '1rem', border: '2px solid #e5e7eb', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📱</div>
                <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>MTN Mobile Money</h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Pay with MTN MoMo</p>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', border: '2px solid #e5e7eb', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📲</div>
                <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Airtel Money</h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Pay with Airtel Money</p>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', border: '2px solid #e5e7eb', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏦</div>
                <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Stanbic Bank</h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Bank transfer</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Button */}
        <div style={{ textAlign: 'center' }}>
          <Button 
            onClick={() => setShowModal(true)}
            style={{ 
              fontSize: '1.125rem', 
              padding: '1rem 2rem',
              backgroundColor: '#059669',
              color: 'white'
            }}
          >
            🚀 Test Credit Purchase Modal
          </Button>
        </div>
      </div>

      {/* Credit Purchase Modal */}
      <SimpleCreditModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onPurchaseComplete={handlePurchaseComplete}
      />
    </div>
  );
};

export default SimpleSubscriptionPage;
