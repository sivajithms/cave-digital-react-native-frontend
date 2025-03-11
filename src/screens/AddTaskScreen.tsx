
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Appbar, 
  TextInput, 
  Text, 
  Button, 
  HelperText, 
  RadioButton, 
  Chip,
  Snackbar,
} from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import { createTask } from '../store/taskSlice';
import { RootState, AppDispatch } from '../store';
import { theme } from '../theme';

export default function AddTaskScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.tasks);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const titleError = title.length === 0 ? 'Title is required' : '';

  const getSelectedPriorityStyle = (color: string) => ({
    backgroundColor: color,
    borderWidth: 2,
    borderColor: color,
    borderRadius: theme.borderRadius.sm,
  });


  const handleCreateTask = async () => {
    if (titleError) {
      showSnackbar('Please fix the errors in the form');
      return;
    }

    try {      
      await dispatch(createTask({
        title,
        description,
        priority,
        completed: false,
        userId: user?.id || '1',
      })).unwrap();
      
      showSnackbar('Task created successfully');
      navigation.goBack();
    } catch (error) {
      showSnackbar('Failed to create task');
    }
  };
  
  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };
  
  
  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color={theme.colors.text} />
        <Appbar.Content title="Add Task" titleStyle={styles.headerTitle} />
      </Appbar.Header>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <TextInput
                label="Title"
                value={title}
                onChangeText={setTitle}
                mode="outlined"
                error={!!titleError}
                style={styles.input}
                outlineColor={theme.colors.border}
                activeOutlineColor={theme.colors.primary}
                textColor = {theme.colors.text}
                theme={{ colors: { placeholder: theme.colors.textSecondary, text: theme.colors.text, background: theme.colors.background } }}
              />
              {titleError ? <HelperText type="error">{titleError}</HelperText> : null}
            </View>
            
            <View style={styles.inputContainer}>
              <TextInput
                label="Description"
                value={description}
                onChangeText={setDescription}
                mode="outlined"
                multiline
                numberOfLines={4}
                style={styles.textArea}
                outlineColor={theme.colors.border}
                activeOutlineColor={theme.colors.primary}
                textColor = {theme.colors.text}
                theme={{ colors: { placeholder: theme.colors.textSecondary, text: theme.colors.text, background: theme.colors.background } }}
              />
            </View>
            
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Priority</Text>
              <View style={styles.priorityContainer}>
                <TouchableOpacity
                  style={[
                    styles.priorityOption,
                    priority === 'low' && styles.selectedPriorityOption,
                    { borderColor: theme.colors.success }
                  ]}
                  onPress={() => setPriority('low')}
                >
                  <View style={[styles.priorityDot, { backgroundColor: theme.colors.success }]} />
                  <Text style={styles.priorityText}>Low</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.priorityOption,
                    priority === 'medium' && styles.selectedPriorityOption,
                    { borderColor: '#F59E0B' }
                  ]}
                  onPress={() => setPriority('medium')}
                >
                  <View style={[styles.priorityDot, { backgroundColor: '#F59E0B' }]} />
                  <Text style={styles.priorityText}>Medium</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.priorityOption,
                    priority === 'high' && styles.selectedPriorityOption,
                    { borderColor: theme.colors.error }
                  ]}
                  onPress={() => setPriority('high')}
                >
                  <View style={[styles.priorityDot, { backgroundColor: theme.colors.error }]} />
                  <Text style={styles.priorityText}>High</Text>
                </TouchableOpacity>
              </View>
            </View>
            
          
          </View>
        </ScrollView>
        
        <View style={styles.footer}>
          <Button
            mode="contained"
            onPress={handleCreateTask}
            loading={isLoading}
            disabled={isLoading}
            style={styles.createButton}
            labelStyle={styles.buttonLabel}
            color={theme.colors.primary}
          >
            Create Task
          </Button>
        </View>
      </KeyboardAvoidingView>
      
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.background,
    elevation: 0,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.lg,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  input: {
    backgroundColor: theme.colors.surface,
  },
  textArea: {
    backgroundColor: theme.colors.surface,
    minHeight: 120,
  },
  sectionContainer: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    backgroundColor: theme.colors.surface,
  },
  selectedPriorityOption: {
    backgroundColor: theme.colors.primary,
    borderWidth: 2,
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  priorityText: {
    color: theme.colors.text,
  },
  footer: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  createButton: {
    padding: 4,
    borderRadius: theme.borderRadius.sm,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 4,
  },
});
