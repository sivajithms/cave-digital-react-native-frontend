
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { Input } from './Input';
import { Button } from './Button';
import { theme } from '../theme';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
  onLogin: (data: { email: string; password: string }) => void;
  onSignup: (data: { name: string; email: string; password: string }) => void;
  isLoading: boolean;
  error: string | null;
}

type LoginFormData = {
  email: string;
  password: string;
};

type SignupFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const AuthModal: React.FC<AuthModalProps> = ({
  visible,
  onClose,
  onLogin,
  onSignup,
  isLoading,
  error,
}) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const slideAnim = React.useRef(new Animated.Value(Dimensions.get('window').height)).current;
  const backdropOpacity = React.useRef(new Animated.Value(0)).current;
  
  const loginForm = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const signupForm = useForm<SignupFormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: Dimensions.get('window').height,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);
  
  const handleLoginSubmit = (data: LoginFormData) => {
    onLogin(data);
  };
  
  const handleSignupSubmit = (data: SignupFormData) => {
    if (data.password !== data.confirmPassword) {
      signupForm.setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match',
      });
      return;
    }
    
    onSignup({
      name: data.name,
      email: data.email,
      password: data.password,
    });
  };
  
  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    loginForm.reset();
    signupForm.reset();
  };
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Animated.View 
          style={[
            styles.backdrop,
            { opacity: backdropOpacity }
          ]}
          onTouchEnd={onClose}
        />
        
        <Animated.View 
          style={[
            styles.modalContent,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {isLoginMode ? 'Login' : 'Create Account'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.formContainer}>
            {error && (
              <View style={styles.errorContainer}>
                <Feather name="alert-circle" size={18} color={theme.colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
            
            {isLoginMode ? (
              // Login Form
              <>
                <Controller
                  control={loginForm.control}
                  rules={{ 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    }
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Email"
                      placeholder="Enter your email"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={loginForm.formState.errors.email?.message}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      leftIcon="mail"
                    />
                  )}
                  name="email"
                />
                
                <Controller
                  control={loginForm.control}
                  rules={{ required: 'Password is required' }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Password"
                      placeholder="Enter your password"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={loginForm.formState.errors.password?.message}
                      secureTextEntry
                      leftIcon="lock"
                    />
                  )}
                  name="password"
                />
              </>
            ) : (
              // Signup Form
              <>
                <Controller
                  control={signupForm.control}
                  rules={{ required: 'Name is required' }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Name"
                      placeholder="Enter your name"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={signupForm.formState.errors.name?.message}
                      leftIcon="user"
                    />
                  )}
                  name="name"
                />
                
                <Controller
                  control={signupForm.control}
                  rules={{ 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    }
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Email"
                      placeholder="Enter your email"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={signupForm.formState.errors.email?.message}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      leftIcon="mail"
                    />
                  )}
                  name="email"
                />
                
                <Controller
                  control={signupForm.control}
                  rules={{ 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    }
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Password"
                      placeholder="Create a password"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={signupForm.formState.errors.password?.message}
                      secureTextEntry
                      leftIcon="lock"
                    />
                  )}
                  name="password"
                />
                
                <Controller
                  control={signupForm.control}
                  rules={{ required: 'Please confirm your password' }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Confirm Password"
                      placeholder="Confirm your password"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={signupForm.formState.errors.confirmPassword?.message}
                      secureTextEntry
                      leftIcon="lock"
                    />
                  )}
                  name="confirmPassword"
                />
              </>
            )}
          </ScrollView>
          
          <View style={styles.footer}>
            <Button
              title={isLoginMode ? 'Login' : 'Create Account'}
              onPress={
                isLoginMode 
                  ? loginForm.handleSubmit(handleLoginSubmit)
                  : signupForm.handleSubmit(handleSignupSubmit)
              }
              loading={isLoading}
              style={styles.submitButton}
            />
            
            <TouchableOpacity onPress={toggleMode} style={styles.toggleButton}>
              <Text style={styles.toggleText}>
                {isLoginMode ? "Don't have an account? Sign up" : "Already have an account? Login"}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    paddingTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: Platform.OS === 'ios' ? 40 : theme.spacing.md,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  closeButton: {
    padding: 4,
  },
  formContainer: {
    marginTop: theme.spacing.md,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.error,
    marginLeft: 8,
    flex: 1,
  },
  footer: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  submitButton: {
    width: '100%',
  },
  toggleButton: {
    marginTop: theme.spacing.md,
    alignItems: 'center',
  },
  toggleText: {
    color: theme.colors.primary,
    fontSize: 14,
  },
});
