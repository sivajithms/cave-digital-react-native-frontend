
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import {
  TextInput,
  Button,
  Text,
  Headline,
  Paragraph,
  HelperText,
  Snackbar,
} from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import { signup, clearError } from '../store/authSlice';
import { RootState, AppDispatch } from '../store';
import { theme } from '../theme';

export default function SignupScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [confirmSecureTextEntry, setConfirmSecureTextEntry] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const nameError = name.trim() === '' ? '' : name.length < 2 ? 'Name must be at least 2 characters' : '';
  const emailError = email.trim() === '' ? '' : !email.includes('@') ? 'Invalid email address' : '';
  const passwordError = password.trim() === '' ? '' : password.length < 6 ? 'Password must be at least 6 characters' : '';
  const confirmPasswordError = confirmPassword.trim() === '' ? '' :
    password !== confirmPassword ? 'Passwords do not match' : '';

  const handleSignup = async () => {
    if (nameError || emailError || passwordError || confirmPasswordError ||
      !name || !email || !password || !confirmPassword) {
      setSnackbarVisible(true);
      return;
    }

    try {
      console.log('ivda ethi');
      
      await dispatch(signup({ name, email, password })).unwrap();
      // Navigation will be handled by the auth state change in App.tsx
    } catch (error) {
      // Error is already handled by the reducer
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Headline style={styles.title}>Create Account</Headline>
            <Paragraph style={styles.subtitle}>
              Sign up to start managing your tasks
            </Paragraph>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <TextInput
                label="Name"
                value={name}
                onChangeText={setName}
                mode="outlined"
                left={<TextInput.Icon icon={() => <Feather name="user" size={20} color={theme.colors.textSecondary} />} />}
                style={styles.input}
                error={!!nameError}
                outlineColor={theme.colors.border}
                activeOutlineColor={theme.colors.primary}
                textColor={theme.colors.text}
                theme={{ colors: { placeholder: theme.colors.textSecondary, text: theme.colors.text, background: theme.colors.background } }}
              />
              {nameError ? <HelperText type="error">{nameError}</HelperText> : null}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                autoCapitalize="none"
                keyboardType="email-address"
                left={<TextInput.Icon icon={() => <Feather name="mail" size={20} color={theme.colors.textSecondary} />} />}
                style={styles.input}
                error={!!emailError}
                outlineColor={theme.colors.border}
                activeOutlineColor={theme.colors.primary}
                textColor={theme.colors.text}
                theme={{ colors: { placeholder: theme.colors.textSecondary, text: theme.colors.text, background: theme.colors.background } }}
              />
              {emailError ? <HelperText type="error">{emailError}</HelperText> : null}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry={secureTextEntry}
                left={<TextInput.Icon icon={() => <Feather name="lock" size={20} color={theme.colors.textSecondary} />} />}
                right={
                  <TextInput.Icon
                    icon={() => (
                      <Feather
                        name={secureTextEntry ? "eye" : "eye-off"}
                        size={20}
                        color={theme.colors.textSecondary}
                      />
                    )}
                    onPress={() => setSecureTextEntry(!secureTextEntry)}
                  />
                }
                style={styles.input}
                error={!!passwordError}
                outlineColor={theme.colors.border}
                activeOutlineColor={theme.colors.primary}
                textColor={theme.colors.text}
                theme={{ colors: { placeholder: theme.colors.textSecondary, text: theme.colors.text, background: theme.colors.background } }}
              />
              {passwordError ? <HelperText type="error">{passwordError}</HelperText> : null}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                mode="outlined"
                secureTextEntry={confirmSecureTextEntry}
                left={<TextInput.Icon icon={() => <Feather name="lock" size={20} color={theme.colors.textSecondary} />} />}
                right={
                  <TextInput.Icon
                    icon={() => (
                      <Feather
                        name={confirmSecureTextEntry ? "eye" : "eye-off"}
                        size={20}
                        color={theme.colors.textSecondary}
                      />
                    )}
                    onPress={() => setConfirmSecureTextEntry(!confirmSecureTextEntry)}
                  />
                }
                style={styles.input}
                error={!!confirmPasswordError}
                outlineColor={theme.colors.border}
                activeOutlineColor={theme.colors.primary}
                textColor={theme.colors.text}
                theme={{ colors: { placeholder: theme.colors.textSecondary, text: theme.colors.text, background: theme.colors.background } }}
              />
              {confirmPasswordError ? <HelperText type="error">{confirmPasswordError}</HelperText> : null}
            </View>

            <Button
              mode="contained"
              onPress={handleSignup}
              style={styles.button}
              labelStyle={styles.buttonLabel}
              disabled={isLoading}
              loading={isLoading}
              buttonColor={theme.colors.primary}
            >
              Create Account
            </Button>

            {error ? (
              <View style={styles.errorContainer}>
                <Feather name="alert-circle" size={16} color={theme.colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={styles.loginText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={styles.snackbar}
      >
        Please fix the errors in the form
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.lg,
    justifyContent: 'center',
  },
  header: {
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    marginBottom: theme.spacing.xl,
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  input: {
    backgroundColor: theme.colors.surface,
  },
  button: {
    padding: 4,
    marginTop: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    marginTop: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.error,
    marginLeft: 8,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: theme.colors.textSecondary,
    marginRight: 4,
  },
  loginText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  snackbar: {
    backgroundColor: theme.colors.error,
  },
});
