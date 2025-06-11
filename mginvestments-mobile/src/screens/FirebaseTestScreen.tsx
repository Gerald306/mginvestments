import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import Button from '../components/Button';
import Card from '../components/Card';
import { FirebaseTestSuite, FirebaseTestResult } from '../utils/firebaseTest';

const FirebaseTestScreen: React.FC = () => {
  const { colors } = useTheme();
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<FirebaseTestResult[]>([]);
  const [summary, setSummary] = useState<{
    total: number;
    passed: number;
    failed: number;
    duration: number;
  } | null>(null);

  const runFirebaseTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    setSummary(null);

    try {
      const testSuite = new FirebaseTestSuite();
      const results = await testSuite.runAllTests();
      
      setTestResults(results);
      setSummary(testSuite.getTestSummary());
      
      // Print results to console for debugging
      testSuite.printResults();
      
      // Show summary alert
      const summaryData = testSuite.getTestSummary();
      Alert.alert(
        'Firebase Tests Complete',
        `Passed: ${summaryData.passed}/${summaryData.total}\nFailed: ${summaryData.failed}\nDuration: ${summaryData.duration}ms`,
        [{ text: 'OK' }]
      );
      
    } catch (error: any) {
      Alert.alert('Test Error', error.message);
      console.error('Firebase test error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (success: boolean) => {
    return success ? '✅' : '❌';
  };

  const getStatusColor = (success: boolean) => {
    return success ? colors.success : colors.error;
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Firebase Configuration Test
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Test your Firebase connection, authentication, and Firestore database
        </Text>
      </View>

      <Card variant="elevated" padding="large" style={styles.testCard}>
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
          🔥 Firebase Test Suite
        </Text>
        
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          This will test:
        </Text>
        
        <View style={styles.testList}>
          <Text style={[styles.testItem, { color: colors.textSecondary }]}>
            • Firebase connection and initialization
          </Text>
          <Text style={[styles.testItem, { color: colors.textSecondary }]}>
            • User registration and authentication
          </Text>
          <Text style={[styles.testItem, { color: colors.textSecondary }]}>
            • Firestore read/write operations
          </Text>
          <Text style={[styles.testItem, { color: colors.textSecondary }]}>
            • Data cleanup and security
          </Text>
        </View>

        <Button
          title={isRunning ? 'Running Tests...' : 'Run Firebase Tests'}
          onPress={runFirebaseTests}
          loading={isRunning}
          disabled={isRunning}
          icon="play"
          fullWidth
          style={styles.testButton}
        />
      </Card>

      {summary && (
        <Card variant="outlined" padding="large" style={styles.summaryCard}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
            📊 Test Summary
          </Text>
          
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, { color: colors.primary }]}>
                {summary.total}
              </Text>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                Total Tests
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, { color: colors.success }]}>
                {summary.passed}
              </Text>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                Passed
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, { color: colors.error }]}>
                {summary.failed}
              </Text>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                Failed
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, { color: colors.textPrimary }]}>
                {summary.duration}ms
              </Text>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                Duration
              </Text>
            </View>
          </View>
        </Card>
      )}

      {testResults.length > 0 && (
        <Card variant="outlined" padding="large" style={styles.resultsCard}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
            📋 Detailed Results
          </Text>
          
          {testResults.map((result, index) => (
            <View key={index} style={styles.resultItem}>
              <View style={styles.resultHeader}>
                <Text style={[styles.resultTitle, { color: colors.textPrimary }]}>
                  {getStatusIcon(result.success)} {result.test}
                </Text>
                <Text style={[styles.resultDuration, { color: colors.textSecondary }]}>
                  {result.duration}ms
                </Text>
              </View>
              
              <Text style={[
                styles.resultMessage, 
                { color: getStatusColor(result.success) }
              ]}>
                {result.message}
              </Text>
              
              {result.error && (
                <Text style={[styles.errorDetails, { color: colors.error }]}>
                  Error: {result.error.code || result.error.message}
                </Text>
              )}
            </View>
          ))}
        </Card>
      )}

      <Card variant="filled" padding="large" style={styles.infoCard}>
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
          💡 Troubleshooting Tips
        </Text>
        
        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
          If tests fail, check:
        </Text>
        
        <Text style={[styles.infoItem, { color: colors.textSecondary }]}>
          • Firebase configuration in .env or firebase.ts
        </Text>
        <Text style={[styles.infoItem, { color: colors.textSecondary }]}>
          • Internet connection
        </Text>
        <Text style={[styles.infoItem, { color: colors.textSecondary }]}>
          • Firebase project settings and permissions
        </Text>
        <Text style={[styles.infoItem, { color: colors.textSecondary }]}>
          • Authentication and Firestore enabled in console
        </Text>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  testCard: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
  },
  testList: {
    marginBottom: 20,
  },
  testItem: {
    fontSize: 14,
    marginBottom: 4,
    paddingLeft: 8,
  },
  testButton: {
    marginTop: 8,
  },
  summaryCard: {
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  resultsCard: {
    marginBottom: 16,
  },
  resultItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  resultDuration: {
    fontSize: 12,
  },
  resultMessage: {
    fontSize: 12,
    marginBottom: 4,
  },
  errorDetails: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  infoCard: {
    marginBottom: 32,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
  },
  infoItem: {
    fontSize: 12,
    marginBottom: 4,
    paddingLeft: 8,
  },
});

export default FirebaseTestScreen;
