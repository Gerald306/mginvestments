import { AppRegistry } from 'react-native';
import App from '../../App';

// Register the main app component
export const registerAppComponents = () => {
  try {
    AppRegistry.registerComponent('main', () => App);
    console.log('App components registered successfully');
  } catch (error) {
    console.error('Error registering app components:', error);
  }
};

// Call this function to ensure components are registered
registerAppComponents();
