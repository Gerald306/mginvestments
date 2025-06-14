import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  StatusBar,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';
import { AuthStackParamList } from '../../types';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const { width, height } = Dimensions.get('window');

const ModernLoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'teacher' | 'school' | 'admin'>('teacher');
  const [showPassword, setShowPassword] = useState(false);

  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login } = useAuth();
  const { colors, typography, shadows, spacing } = useTheme();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Please check your credentials');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    {
      key: 'teacher' as const,
      title: 'Teacher',
      subtitle: 'Find teaching opportunities',
      icon: 'school-outline' as const,
      color: colors.teacher.primary,
      gradient: [colors.teacher.primary, colors.teacher.light],
    },
    {
      key: 'school' as const,
      title: 'School',
      subtitle: 'Hire qualified teachers',
      icon: 'business-outline' as const,
      color: colors.school.primary,
      gradient: [colors.school.primary, colors.school.light],
    },
    {
      key: 'admin' as const,
      title: 'Admin',
      subtitle: 'Manage the platform',
      icon: 'settings-outline' as const,
      color: colors.admin.primary,
      gradient: [colors.admin.primary, colors.admin.light],
    },
  ];

  const demoCredentials = {
    teacher: { email: 'demo@teacher.com', password: 'demo123' },
    school: { email: 'demo@school.com', password: 'demo123' },
    admin: { email: 'demo@admin.com', password: 'demo123' },
  };

  const handleDemoLogin = (role: 'teacher' | 'school' | 'admin') => {
    const credentials = demoCredentials[role];
    setEmail(credentials.email);
    setPassword(credentials.password);
    setSelectedRole(role);
    setTimeout(() => handleLogin(), 100);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* Header with Gradient */}
      <LinearGradient
        colors={[colors.primary, colors.primaryLight]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <View style={[styles.logo, { backgroundColor: colors.white }]}>
              <Ionicons name="school" size={32} color={colors.primary} />
            </View>
          </View>
          <Text style={[styles.title, { color: colors.white }]}>
            MG Investments
          </Text>
          <Text style={[styles.subtitle, { color: colors.white }]}>
            Connect Teachers & Schools
          </Text>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Role Selection */}
          <View style={styles.roleSection}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              I am a...
            </Text>
            <View style={styles.roleGrid}>
              {roleOptions.map((role) => (
                <Pressable
                  key={role.key}
                  style={[
                    styles.roleCard,
                    {
                      backgroundColor: selectedRole === role.key ? role.color : colors.surface,
                      borderColor: selectedRole === role.key ? role.color : colors.border,
                      ...shadows.sm,
                    },
                  ]}
                  onPress={() => setSelectedRole(role.key)}
                >
                  <Ionicons
                    name={role.icon}
                    size={24}
                    color={selectedRole === role.key ? colors.white : role.color}
                  />
                  <Text
                    style={[
                      styles.roleTitle,
                      {
                        color: selectedRole === role.key ? colors.white : colors.textPrimary,
                      },
                    ]}
                  >
                    {role.title}
                  </Text>
                  <Text
                    style={[
                      styles.roleSubtitle,
                      {
                        color: selectedRole === role.key ? colors.white : colors.textSecondary,
                      },
                    ]}
                  >
                    {role.subtitle}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Login Form */}
          <Card style={[styles.formCard, shadows.lg]}>
            <Text style={[styles.formTitle, { color: colors.textPrimary }]}>
              Welcome Back
            </Text>
            <Text style={[styles.formSubtitle, { color: colors.textSecondary }]}>
              Sign in to your account
            </Text>

            <View style={styles.form}>
              <Input
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                leftIcon="mail-outline"
                style={styles.input}
              />

              <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                autoComplete="password"
                leftIcon="lock-closed-outline"
                rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
                onRightIconPress={() => setShowPassword(!showPassword)}
                style={styles.input}
              />

              <Button
                title="Forgot Password?"
                variant="ghost"
                size="small"
                onPress={() => navigation.navigate('ForgotPassword')}
                style={styles.forgotButton}
              />

              <Button
                title={loading ? 'Signing In...' : 'Sign In'}
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
                icon="log-in-outline"
                fullWidth
                style={styles.loginButton}
                gradient={roleOptions.find(r => r.key === selectedRole)?.gradient}
              />
            </View>
          </Card>

          {/* Demo Login Section */}
          <Card style={[styles.demoCard, shadows.md]}>
            <Text style={[styles.demoTitle, { color: colors.textPrimary }]}>
              Quick Demo Access
            </Text>
            <View style={styles.demoButtons}>
              {roleOptions.map((role) => (
                <Button
                  key={role.key}
                  title={`Demo ${role.title}`}
                  variant="outline"
                  size="small"
                  icon={role.icon}
                  onPress={() => handleDemoLogin(role.key)}
                  style={[styles.demoButton, { borderColor: role.color }]}
                  textStyle={{ color: role.color }}
                />
              ))}
            </View>
          </Card>

          {/* Register Link */}
          <View style={styles.registerSection}>
            <Text style={[styles.registerText, { color: colors.textSecondary }]}>
              Don't have an account?
            </Text>
            <Button
              title="Create Account"
              variant="ghost"
              onPress={() => navigation.navigate('Register')}
              style={styles.registerButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    height: height * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: StatusBar.currentHeight || 44,
  },
  headerContent: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 16,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.9,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  roleSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  roleGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  roleTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  roleSubtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  formCard: {
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  form: {
    gap: 16,
  },
  input: {
    marginBottom: 4,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: -8,
    marginBottom: 8,
  },
  loginButton: {
    marginTop: 8,
  },
  demoCard: {
    marginBottom: 20,
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  demoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  demoButton: {
    flex: 1,
  },
  registerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  registerText: {
    fontSize: 14,
  },
  registerButton: {
    marginLeft: -8,
  },
});

export default ModernLoginScreen;
