import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';
import { AuthStackParamList } from '../../types';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login } = useAuth();
  const { colors } = useTheme();

  const validateForm = () => {
    const newErrors: {email?: string; password?: string} = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>MG Investments</Text>
          <Text style={styles.subtitle}>Welcome back! Please sign in to continue.</Text>
        </View>

        <Card variant="elevated" padding="large" style={styles.formCard}>
          <Input
            label="Email Address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors({...errors, email: undefined});
            }}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            leftIcon="mail"
            error={errors.email}
          />

          <Input
            label="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors({...errors, password: undefined});
            }}
            placeholder="Enter your password"
            secureTextEntry
            autoCapitalize="none"
            leftIcon="lock-closed"
            error={errors.password}
          />

          <Button
            title="Forgot Password?"
            variant="ghost"
            size="small"
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotPasswordButton}
          />

          <Button
            title={loading ? 'Signing In...' : 'Sign In'}
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            icon="log-in"
            fullWidth
            style={styles.loginButton}
          />

          {/* Demo Login Buttons */}
          <View style={styles.demoSection}>
            <Text style={styles.demoTitle}>Quick Demo Access</Text>
            <Button
              title="🎓 Teacher Portal"
              variant="outline"
              onPress={() => {
                setEmail('demo@teacher.com');
                setPassword('demo123');
                setTimeout(() => handleLogin(), 100);
              }}
              fullWidth
              style={styles.demoButton}
            />
            <Button
              title="🏫 School Portal"
              variant="outline"
              onPress={() => {
                setEmail('demo@school.com');
                setPassword('demo123');
                setTimeout(() => handleLogin(), 100);
              }}
              fullWidth
              style={styles.demoButton}
            />
            <Button
              title="⚙️ Admin Portal"
              variant="outline"
              onPress={() => {
                setEmail('demo@admin.com');
                setPassword('demo123');
                setTimeout(() => handleLogin(), 100);
              }}
              fullWidth
              style={styles.demoButton}
            />
          </View>

          <View style={styles.registerContainer}>
            <Text style={[styles.registerText, { color: colors.textSecondary }]}>
              Don't have an account?{' '}
            </Text>
            <Button
              title="Sign Up"
              variant="ghost"
              size="small"
              onPress={() => navigation.navigate('Register')}
              style={styles.registerButton}
            />
          </View>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
  },
  formCard: {
    width: '100%',
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 16,
    marginTop: -8,
  },
  loginButton: {
    marginBottom: 16,
  },
  demoSection: {
    marginBottom: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 12,
  },
  demoButton: {
    marginBottom: 8,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
  },
  registerButton: {
    marginLeft: -8,
  },
});

export default LoginScreen;
