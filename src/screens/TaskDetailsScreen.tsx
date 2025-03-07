
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Appbar, 
  TextInput, 
  Text, 
  Button, 
  HelperText, 
  Chip,
  Divider,
  Menu,
  Dialog,
  Portal,
  Snackbar,
} from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import { updateTask, deleteTask } from '../store/taskSlice';
import { RootState, AppDispatch } from '../store';
import { Task } from '../types';
import { theme } from '../theme';

type ParamList = {
  TaskDetails: {
    taskId: string;
  };
};

export default function TaskDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'TaskDetails'>>();
  const dispatch = useDispatch<AppDispatch>();
  const { taskId } = route.params;
  
  const { tasks, isLoading } = useSelector((state: RootState) => state.tasks);
  const task = tasks.find(t => t.id === taskId);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [completed, setCompleted] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setCompleted(task.completed);
    }
  }, [task]);
  
  const titleError = title.trim() === '' ? 'Title is required' : '';
  
  const handleUpdateTask = async () => {
    if (!task || titleError) {
      showSnackbar('Please fix the errors in the form');
      return;
    }
    
    try {
      await dispatch(updateTask({
        ...task,
        title,
        description,
        priority,
        completed,
      })).unwrap();
      
      showSnackbar('Task updated successfully');
      setIsEditing(false);
    } catch (error) {
      showSnackbar('Failed to update task');
    }
  };
  
  const handleDeleteTask = async () => {
    if (!task) return;
    
    try {
      await dispatch(deleteTask(task.id)).unwrap();
      showSnackbar('Task deleted successfully');
      navigation.goBack();
    } catch (error) {
      showSnackbar('Failed to delete task');
    }
  };
  
  const handleToggleComplete = async () => {
    if (!task) return;
    
    try {
      await dispatch(updateTask({
        ...task,
        completed: !completed,
      })).unwrap();
      
      setCompleted(!completed);
      showSnackbar(completed ? 'Task marked as incomplete' : 'Task completed');
    } catch (error) {
      showSnackbar('Failed to update task');
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
        <Appbar.Content 
          title={isEditing ? "Edit Task" : "Task Details"} 
          titleStyle={styles.headerTitle} 
        />
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Appbar.Action 
              icon="dots-vertical" 
              color={theme.colors.text}
              onPress={() => setMenuVisible(true)}
            />
          }
          anchorPosition='bottom'
        >
          <Menu.Item 
            icon={isEditing ? "eye" : "pencil"} 
            onPress={() => {
              setMenuVisible(false);
              setIsEditing((prev) => !prev);
            }} 
            title={isEditing ? "View Details" : "Edit Task"} 
          />
          <Menu.Item 
            icon={completed ? "close-circle" : "check-circle"} 
            onPress={() => {
              setMenuVisible(false);
              handleToggleComplete();
            }} 
            title={completed ? "Mark Incomplete" : "Mark Complete"} 
          />
          <Divider />
          <Menu.Item 
            icon="delete" 
            onPress={() => {
              setMenuVisible(false);
              setDeleteDialogVisible(true);
            }} 
            title="Delete Task" 
            titleStyle={{ color: theme.colors.error }}
          />
        </Menu>
      </Appbar.Header>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {isEditing ? (
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
                  textColor={theme.colors.text}
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
                  textColor={theme.colors.text}
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
          ) : (
            <View style={styles.detailsContainer}>
              <View style={styles.statusContainer}>
                <Chip 
                  mode="outlined" 
                  style={[
                    styles.statusChip,
                    { borderColor: completed ? theme.colors.success : theme.colors.primary }
                  ]}
                  textStyle={{ color: completed ? theme.colors.success : theme.colors.primary }}
                >
                  {completed ? 'Completed' : 'In Progress'}
                </Chip>
                
                <Chip 
                  mode="outlined" 
                  style={[
                    styles.priorityChip,
                    { 
                      borderColor: 
                        priority === 'high' ? theme.colors.error : 
                        priority === 'medium' ? '#F59E0B' : 
                        theme.colors.success 
                    }
                  ]}
                  textStyle={{ 
                    color: 
                      priority === 'high' ? theme.colors.error : 
                      priority === 'medium' ? '#F59E0B' : 
                      theme.colors.success 
                  }}
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
                </Chip>
              </View>
              
              <Text style={styles.detailsTitle}>{title}</Text>
              
              {description ? (
                <View style={styles.descriptionContainer}>
                  <Text style={styles.descriptionTitle}>Description</Text>
                  <Text style={styles.descriptionText}>{description}</Text>
                </View>
              ) : null}
              
              
            </View>
          )}
        </ScrollView>
        
        {isEditing && (
          <View style={styles.footer}>
            <Button
              mode="outlined"
              onPress={() => setIsEditing(false)}
              style={styles.cancelButton}
              labelStyle={styles.buttonLabel}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleUpdateTask}
              loading={isLoading}
              disabled={isLoading}
              style={styles.saveButton}
              labelStyle={styles.buttonLabel}
              color={theme.colors.primary}
            >
              Save Changes
            </Button>
          </View>
        )}
      </KeyboardAvoidingView>
      
      <Portal>
        <Dialog
          visible={deleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}
          style={{ backgroundColor: theme.colors.background }}
        >
          <Dialog.Title style={{ color: theme.colors.text }}>Delete Task</Dialog.Title>
          <Dialog.Content>
            <Text style={{ color: theme.colors.text }}>
              Are you sure you want to delete this task? This action cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
            <Button 
              onPress={() => {
                setDeleteDialogVisible(false);
                handleDeleteTask();
              }}
              color={theme.colors.error}
            >
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    marginRight: theme.spacing.md,
    borderColor: theme.colors.border,
  },
  saveButton: {
    flex: 1,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailsContainer: {
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
  },
  statusChip: {
    marginRight: theme.spacing.sm,
  },
  priorityChip: {},
  detailsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  descriptionContainer: {
    marginBottom: theme.spacing.lg,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  descriptionText: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 24,
  },
  metaContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  metaTextContainer: {
    marginLeft: theme.spacing.md,
  },
  metaLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  metaValue: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  errorText: {
    fontSize: 18,
    color: theme.colors.error,
    marginBottom: theme.spacing.lg,
  },
});
