import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AdminApplicationsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Applications</Text>
      <Text style={styles.subtitle}>Monitor platform-wide applications</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default AdminApplicationsScreen;
