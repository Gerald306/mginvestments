import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, Dimensions, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from './src/config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// MG Investments Mobile App - Enhanced UI with Database Integration
export default function App() {
  const [currentScreen, setCurrentScreen] = React.useState('landing');
  const [loading, setLoading] = React.useState(false);

  // Get screen dimensions for responsive design
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const isSmallScreen = screenWidth < 375;
  const isMediumScreen = screenWidth >= 375 && screenWidth < 414;

  // Form states
  const [loginForm, setLoginForm] = React.useState({
    email: '',
    password: ''
  });

  const [registerForm, setRegisterForm] = React.useState({
    fullName: '',
    email: '',
    password: '',
    role: 'teacher'
  });

  // Enhanced stats with real-time feel
  const stats = {
    totalTeachers: 150,
    totalSchools: 45,
    totalJobs: 23,
    successfulPlacements: 89
  };

  // Authentication functions
  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginForm.email, loginForm.password);
      const user = userCredential.user;

      // Get user profile from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        Alert.alert('Success', `Welcome back, ${userData.full_name || 'User'}!`);
        // Navigate to appropriate dashboard based on role
        console.log('User logged in:', userData);
      }
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!registerForm.fullName || !registerForm.email || !registerForm.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (registerForm.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, registerForm.email, registerForm.password);
      const user = userCredential.user;

      // Save user profile to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        full_name: registerForm.fullName,
        email: registerForm.email,
        role: registerForm.role,
        created_at: new Date().toISOString(),
        is_active: true,
        profile_completed: false
      });

      Alert.alert('Success', 'Account created successfully!');
      setCurrentScreen('login');
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderLandingScreen = () => (
    <ScrollView style={styles.landingContainer} showsVerticalScrollIndicator={false}>
      {/* Enhanced Hero Section with Gradient */}
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={[styles.heroSection, { minHeight: screenHeight * 0.85 }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={[styles.heroContent, { paddingHorizontal: isSmallScreen ? 16 : 24 }]}>
          <View style={[styles.badge, { marginTop: screenHeight * 0.08 }]}>
            <Text style={[styles.badgeText, { fontSize: isSmallScreen ? 12 : 14 }]}>
              🎓 Welcome to MG Education Services
            </Text>
          </View>

          <Text style={[styles.heroTitle, {
            fontSize: isSmallScreen ? 28 : isMediumScreen ? 32 : 36,
            lineHeight: isSmallScreen ? 34 : isMediumScreen ? 38 : 42
          }]}>
            <Text style={styles.heroTitleMain}>Empowering Education</Text>
            {'\n'}
            <Text style={styles.heroTitleSub}>Through </Text>
            <Text style={styles.heroTitleAccent}>Innovation</Text>
          </Text>

          <Text style={[styles.heroDescription, {
            fontSize: isSmallScreen ? 16 : 18,
            lineHeight: isSmallScreen ? 24 : 28,
            paddingHorizontal: isSmallScreen ? 8 : 16
          }]}>
            MG Investments provides comprehensive educational services including{' '}
            <Text style={styles.highlightBlue}>professional printing</Text>, {' '}
            <Text style={styles.highlightPurple}>creative design</Text>, {' '}
            <Text style={styles.highlightTeal}>quality embroidery</Text>, and connects qualified teachers with leading schools across Uganda.
          </Text>

          <View style={[styles.heroButtons, {
            flexDirection: isSmallScreen ? 'column' : 'row',
            width: '100%',
            paddingHorizontal: isSmallScreen ? 0 : 20
          }]}>
            <TouchableOpacity
              style={[styles.primaryButton, {
                width: isSmallScreen ? '100%' : 'auto',
                minWidth: isSmallScreen ? 0 : 140,
                marginBottom: isSmallScreen ? 12 : 0
              }]}
              onPress={() => setCurrentScreen('login')}
            >
              <Text style={[styles.primaryButtonText, { fontSize: isSmallScreen ? 15 : 16 }]}>
                Get Started
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryButton, {
                width: isSmallScreen ? '100%' : 'auto',
                minWidth: isSmallScreen ? 0 : 140,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderColor: 'rgba(255, 255, 255, 0.5)'
              }]}
              onPress={() => {
                // Scroll to services section
                console.log('Scroll to services');
              }}
            >
              <Text style={[styles.secondaryButtonText, {
                color: '#fff',
                fontSize: isSmallScreen ? 15 : 16
              }]}>
                View Services
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Enhanced Stats Section */}
      <View style={[styles.statsSection, { paddingHorizontal: isSmallScreen ? 16 : 24 }]}>
        <Text style={[styles.sectionTitle, {
          fontSize: isSmallScreen ? 24 : 28,
          marginBottom: isSmallScreen ? 24 : 32
        }]}>
          Our Impact
        </Text>
        <View style={[styles.statsGrid, {
          flexDirection: isSmallScreen ? 'column' : 'row',
          flexWrap: isSmallScreen ? 'nowrap' : 'wrap'
        }]}>
          <View style={[styles.statCard, {
            width: isSmallScreen ? '100%' : '48%',
            marginBottom: 16,
            padding: isSmallScreen ? 16 : 20
          }]}>
            <Text style={[styles.statNumber, { fontSize: isSmallScreen ? 28 : 32 }]}>
              {stats.totalTeachers}+
            </Text>
            <Text style={[styles.statLabel, { fontSize: isSmallScreen ? 13 : 14 }]}>
              Qualified Teachers
            </Text>
          </View>
          <View style={[styles.statCard, {
            width: isSmallScreen ? '100%' : '48%',
            marginBottom: 16,
            padding: isSmallScreen ? 16 : 20
          }]}>
            <Text style={[styles.statNumber, { fontSize: isSmallScreen ? 28 : 32 }]}>
              {stats.totalSchools}+
            </Text>
            <Text style={[styles.statLabel, { fontSize: isSmallScreen ? 13 : 14 }]}>
              Partner Schools
            </Text>
          </View>
          <View style={[styles.statCard, {
            width: isSmallScreen ? '100%' : '48%',
            marginBottom: 16,
            padding: isSmallScreen ? 16 : 20
          }]}>
            <Text style={[styles.statNumber, { fontSize: isSmallScreen ? 28 : 32 }]}>
              {stats.totalJobs}+
            </Text>
            <Text style={[styles.statLabel, { fontSize: isSmallScreen ? 13 : 14 }]}>
              Active Jobs
            </Text>
          </View>
          <View style={[styles.statCard, {
            width: isSmallScreen ? '100%' : '48%',
            marginBottom: 16,
            padding: isSmallScreen ? 16 : 20
          }]}>
            <Text style={[styles.statNumber, { fontSize: isSmallScreen ? 28 : 32 }]}>
              {stats.successfulPlacements}+
            </Text>
            <Text style={[styles.statLabel, { fontSize: isSmallScreen ? 13 : 14 }]}>
              Successful Placements
            </Text>
          </View>
        </View>
      </View>

      {/* Services Section */}
      <View style={styles.servicesSection}>
        <Text style={styles.sectionTitle}>Our Services</Text>
        <Text style={styles.sectionSubtitle}>Comprehensive educational solutions for modern institutions</Text>

        <View style={styles.serviceGrid}>
          <View style={styles.serviceCard}>
            <Text style={styles.serviceIcon}>🖨️</Text>
            <Text style={styles.serviceTitle}>Professional Printing</Text>
            <Text style={styles.serviceDescription}>High-quality printing services for educational materials, books, and institutional documents.</Text>
          </View>

          <View style={styles.serviceCard}>
            <Text style={styles.serviceIcon}>🎨</Text>
            <Text style={styles.serviceTitle}>Creative Design</Text>
            <Text style={styles.serviceDescription}>Professional graphic design for educational content, branding, and marketing materials.</Text>
          </View>

          <View style={styles.serviceCard}>
            <Text style={styles.serviceIcon}>✂️</Text>
            <Text style={styles.serviceTitle}>Embroidery Services</Text>
            <Text style={styles.serviceDescription}>Custom embroidery for school uniforms, badges, and institutional branding.</Text>
          </View>

          <View style={styles.serviceCard}>
            <Text style={styles.serviceIcon}>👥</Text>
            <Text style={styles.serviceTitle}>Teacher Placement</Text>
            <Text style={styles.serviceDescription}>Connecting qualified teachers with leading educational institutions across Uganda.</Text>
          </View>
        </View>
      </View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitleWhite}>Why Choose MG Investments?</Text>
        <Text style={styles.sectionSubtitleWhite}>We provide comprehensive solutions that make educational excellence accessible to everyone</Text>

        <View style={styles.featureGrid}>
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>✅</Text>
            <Text style={styles.featureTitle}>Verified Teachers</Text>
            <Text style={styles.featureDescription}>All teachers are thoroughly vetted and verified for qualifications</Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>⚡</Text>
            <Text style={styles.featureTitle}>Real-time Matching</Text>
            <Text style={styles.featureDescription}>Advanced matching system connects schools with ideal candidates</Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🔒</Text>
            <Text style={styles.featureTitle}>Secure Platform</Text>
            <Text style={styles.featureDescription}>Safe and secure platform for all your hiring needs</Text>
          </View>
        </View>
      </View>

      {/* CTA Section */}
      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>Ready to Get Started?</Text>
        <Text style={styles.ctaDescription}>Join thousands of teachers and schools already using our platform</Text>

        <View style={styles.ctaButtons}>
          <TouchableOpacity
            style={styles.ctaPrimaryButton}
            onPress={() => setCurrentScreen('register')}
          >
            <Text style={styles.ctaPrimaryButtonText}>Join as Teacher</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ctaSecondaryButton}
            onPress={() => setCurrentScreen('register')}
          >
            <Text style={styles.ctaSecondaryButtonText}>Join as School</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => setCurrentScreen('login')}
        >
          <Text style={styles.loginLinkText}>Already have an account? Login here</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderLoginScreen = () => (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.authGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView
          contentContainerStyle={[styles.scrollContainer, {
            paddingHorizontal: isSmallScreen ? 20 : 32,
            minHeight: screenHeight * 0.9
          }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.authCard, {
            marginTop: screenHeight * 0.1,
            padding: isSmallScreen ? 20 : 32
          }]}>
            <Text style={[styles.authTitle, { fontSize: isSmallScreen ? 24 : 28 }]}>
              Welcome Back
            </Text>
            <Text style={[styles.authSubtitle, { fontSize: isSmallScreen ? 14 : 16 }]}>
              Login to your MG Investments account
            </Text>

            <View style={styles.formContainer}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={[styles.textInput, {
                  fontSize: isSmallScreen ? 15 : 16,
                  paddingVertical: isSmallScreen ? 14 : 16
                }]}
                placeholder="Enter your email"
                placeholderTextColor="#9ca3af"
                value={loginForm.email}
                onChangeText={(text) => setLoginForm({...loginForm, email: text})}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />

              <Text style={styles.label}>Password</Text>
              <TextInput
                style={[styles.textInput, {
                  fontSize: isSmallScreen ? 15 : 16,
                  paddingVertical: isSmallScreen ? 14 : 16
                }]}
                placeholder="Enter your password"
                placeholderTextColor="#9ca3af"
                value={loginForm.password}
                onChangeText={(text) => setLoginForm({...loginForm, password: text})}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />

              <TouchableOpacity
                style={[styles.authButton, {
                  opacity: loading ? 0.7 : 1,
                  paddingVertical: isSmallScreen ? 14 : 16
                }]}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={[styles.authButtonText, { fontSize: isSmallScreen ? 15 : 16 }]}>
                  {loading ? 'Logging in...' : 'Login'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => setCurrentScreen('register')}
                disabled={loading}
              >
                <Text style={styles.linkButtonText}>
                  Don't have an account? Register here
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setCurrentScreen('landing')}
              disabled={loading}
            >
              <Text style={styles.backButtonText}>← Back to Home</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );

  const renderRegisterScreen = () => (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.authGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView
          contentContainerStyle={[styles.scrollContainer, {
            paddingHorizontal: isSmallScreen ? 20 : 32,
            minHeight: screenHeight * 0.9
          }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.authCard, {
            marginTop: screenHeight * 0.05,
            padding: isSmallScreen ? 20 : 32
          }]}>
            <Text style={[styles.authTitle, { fontSize: isSmallScreen ? 24 : 28 }]}>
              Join MG Investments
            </Text>
            <Text style={[styles.authSubtitle, { fontSize: isSmallScreen ? 14 : 16 }]}>
              Create your account and get started
            </Text>

            <View style={styles.formContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={[styles.textInput, {
                  fontSize: isSmallScreen ? 15 : 16,
                  paddingVertical: isSmallScreen ? 14 : 16
                }]}
                placeholder="Enter your full name"
                placeholderTextColor="#9ca3af"
                value={registerForm.fullName}
                onChangeText={(text) => setRegisterForm({...registerForm, fullName: text})}
                autoCapitalize="words"
                editable={!loading}
              />

              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={[styles.textInput, {
                  fontSize: isSmallScreen ? 15 : 16,
                  paddingVertical: isSmallScreen ? 14 : 16
                }]}
                placeholder="Enter your email"
                placeholderTextColor="#9ca3af"
                value={registerForm.email}
                onChangeText={(text) => setRegisterForm({...registerForm, email: text})}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />

              <Text style={styles.label}>Password</Text>
              <TextInput
                style={[styles.textInput, {
                  fontSize: isSmallScreen ? 15 : 16,
                  paddingVertical: isSmallScreen ? 14 : 16
                }]}
                placeholder="Create a password (min 6 characters)"
                placeholderTextColor="#9ca3af"
                value={registerForm.password}
                onChangeText={(text) => setRegisterForm({...registerForm, password: text})}
                secureTextEntry
                autoCapitalize="none"
                editable={!loading}
              />

              <Text style={styles.label}>I am a:</Text>
              <View style={[styles.roleContainer, {
                flexDirection: isSmallScreen ? 'column' : 'row',
                gap: isSmallScreen ? 12 : 16
              }]}>
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    {
                      flex: isSmallScreen ? 0 : 1,
                      width: isSmallScreen ? '100%' : 'auto',
                      backgroundColor: registerForm.role === 'teacher' ? '#2563eb' : '#fff',
                      borderColor: registerForm.role === 'teacher' ? '#2563eb' : '#d1d5db'
                    }
                  ]}
                  onPress={() => setRegisterForm({...registerForm, role: 'teacher'})}
                  disabled={loading}
                >
                  <Text style={[
                    styles.roleButtonText,
                    { color: registerForm.role === 'teacher' ? '#fff' : '#6b7280' }
                  ]}>
                    👨‍🏫 Teacher
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    {
                      flex: isSmallScreen ? 0 : 1,
                      width: isSmallScreen ? '100%' : 'auto',
                      backgroundColor: registerForm.role === 'school' ? '#10b981' : '#fff',
                      borderColor: registerForm.role === 'school' ? '#10b981' : '#d1d5db'
                    }
                  ]}
                  onPress={() => setRegisterForm({...registerForm, role: 'school'})}
                  disabled={loading}
                >
                  <Text style={[
                    styles.roleButtonText,
                    { color: registerForm.role === 'school' ? '#fff' : '#6b7280' }
                  ]}>
                    🏫 School
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.authButton, {
                  opacity: loading ? 0.7 : 1,
                  paddingVertical: isSmallScreen ? 14 : 16
                }]}
                onPress={handleRegister}
                disabled={loading}
              >
                <Text style={[styles.authButtonText, { fontSize: isSmallScreen ? 15 : 16 }]}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => setCurrentScreen('login')}
                disabled={loading}
              >
                <Text style={styles.linkButtonText}>
                  Already have an account? Login here
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setCurrentScreen('landing')}
              disabled={loading}
            >
              <Text style={styles.backButtonText}>← Back to Home</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );

  // Removed complex register screen for now

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        {currentScreen === 'landing' && renderLandingScreen()}
        {currentScreen === 'login' && renderLoginScreen()}
        {currentScreen === 'register' && renderRegisterScreen()}
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  // Landing Page Styles
  landingContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heroSection: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  heroContent: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 500,
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  badgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 42,
    color: '#fff',
  },
  heroTitleMain: {
    color: '#fff',
  },
  heroTitleSub: {
    color: '#f1f5f9',
  },
  heroTitleAccent: {
    color: '#fbbf24',
  },
  heroDescription: {
    fontSize: 18,
    color: '#f1f5f9',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  highlightBlue: {
    color: '#60a5fa',
    fontWeight: '700',
  },
  highlightPurple: {
    color: '#a78bfa',
    fontWeight: '700',
  },
  highlightTeal: {
    color: '#34d399',
    fontWeight: '700',
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 140,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#1f2937',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 8,
    minWidth: 140,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '600',
  },

  // Stats Section
  statsSection: {
    backgroundColor: '#fff',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 40,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#f8fafc',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: '500',
  },

  // Services Section
  servicesSection: {
    backgroundColor: '#f8fafc',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  serviceGrid: {
    gap: 20,
  },
  serviceCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  serviceIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  // Features Section
  featuresSection: {
    backgroundColor: '#2563eb',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  sectionTitleWhite: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionSubtitleWhite: {
    fontSize: 16,
    color: '#bfdbfe',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  featureGrid: {
    gap: 20,
  },
  featureCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    color: '#bfdbfe',
    textAlign: 'center',
    lineHeight: 20,
  },

  // CTA Section
  ctaSection: {
    backgroundColor: '#fff',
    paddingVertical: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  ctaDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  ctaButtons: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  ctaPrimaryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 8,
    minWidth: 140,
    alignItems: 'center',
  },
  ctaPrimaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  ctaSecondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#10b981',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 8,
    minWidth: 140,
    alignItems: 'center',
  },
  ctaSecondaryButtonText: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: '600',
  },
  loginLink: {
    padding: 12,
  },
  loginLinkText: {
    color: '#6b7280',
    fontSize: 14,
    textDecorationLine: 'underline',
  },

  // Authentication Styles
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  authGradient: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    width: '100%',
    maxWidth: 400,
  },
  authTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  authSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 20,
  },
  textInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#111827',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  authButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  authButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
    marginTop: 8,
  },
  roleButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  roleButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  linkButtonText: {
    color: '#2563eb',
    fontSize: 15,
    fontWeight: '500',
  },
  backButton: {
    marginTop: 24,
    padding: 16,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '500',
  },
});
