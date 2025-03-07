
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Animated,
  Dimensions
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { Input } from './Input';
import { Button } from './Button';
import { DatePicker } from './DatePicker';
import { Task } from '../types';
import { theme } from '../theme';

interface TaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Task, 'id' | 'createdAt'>) => void;
  task?: Task;
  isLoading?: boolean;
  onDelete?: (taskId: string) => void;
}

type FormData = {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string | null;
};

export const TaskModal: React.FC<TaskModalProps> = ({
  visible,
  onClose,
  onSubmit,
  task,
  isLoading = false,
  onDelete,
}) => {
  const { control, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      dueDate: null,
    },
  });
  
  const slideAnim = React.useRef(new Animated.Value(Dimensions.get('window').height)).current;
  const backdropOpacity = React.useRef(new Animated.Value(0)).current;
  
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
  
  useEffect(() => {
    if (task) {
      setValue('title', task.title);
      setValue('description', task.description);
      setValue('priority', task.priority);
      setValue('dueDate', task.dueDate);
    } else {
      reset();
    }
  }, [task, visible]);
  
  const onSubmitForm = (data: FormData) => {
    onSubmit({
      ...data,
      completed: task ? task.completed : false,
      userId: task ? task.userId : '1',
    });
  };
  
  const handleDelete = () => {
    if (task && onDelete) {
      onDelete(task.id);
    }
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
              {task ? 'Edit Task' : 'Create Task'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.formContainer}>
            <Controller
              control={control}
              rules={{ required: 'Title is required' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Title"
                  placeholder="Enter task title"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.title?.message}
                  leftIcon="edit-2"
                />
              )}
              name="title"
            />
            
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Description"
                  placeholder="Enter task description"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  inputStyle={styles.textArea}
                  leftIcon="align-left"
                />
              )}
              name="description"
            />
            
            <Text style={styles.label}>Priority</Text>
            <Controller
              control={control}
              render={({ field: { value, onChange } }) => (
                <View style={styles.priorityContainer}>
                  <TouchableOpacity
                    style={[
                      styles.priorityButton,
                      value === 'low' && styles.priorityButtonActive,
                      { borderColor: theme.colors.success }
                    ]}
                    onPress={() => onChange('low')}
                  >
                    <View style={[styles.priorityDot, { backgroundColor: theme.colors.success }]} />
                    <Text style={styles.priorityText}>Low</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.priorityButton,
                      value === 'medium' && styles.priorityButtonActive,
                      { borderColor: '#F59E0B' }
                    ]}
                    onPress={() => onChange('medium')}
                  >
                    <View style={[styles.priorityDot, { backgroundColor: '#F59E0B' }]} />
                    <Text style={styles.priorityText}>Medium</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.priorityButton,
                      value === 'high' && styles.priorityButtonActive,
                      { borderColor: theme.colors.error }
                    ]}
                    onPress={() => onChange('high')}
                  >
                    <View style={[styles.priorityDot, { backgroundColor: theme.colors.error }]} />
                    <Text style={styles.priorityText}>High</Text>
                  </TouchableOpacity>
                </View>
              )}
              name="priority"
            />
            
            <Controller
              control={control}
              render={({ field: { value, onChange } }) => (
                <DatePicker
                  value={value}
                  onChange={onChange}
                  label="Due Date"
                />
              )}
              name="dueDate"
            />
          </ScrollView>
          
          <View style={styles.footer}>
            {task && onDelete && (
              <Button
                title="Delete"
                onPress={handleDelete}
                variant="outline"
                style={styles.deleteButton}
                textStyle={{ color: theme.colors.error }}
                loading={isLoading}
              />
            )}
            
            <Button
              title={task ? 'Update' : 'Create'}
              onPress={handleSubmit(onSubmitForm)}
              loading={isLoading}
              style={styles.submitButton}
            />
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
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: theme.colors.text,
    fontWeight: '500',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  priorityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    backgroundColor: theme.colors.surface,
  },
  priorityButtonActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  priorityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  priorityText: {
    color: theme.colors.text,
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  deleteButton: {
    marginRight: theme.spacing.md,
    borderColor: theme.colors.error,
    backgroundColor: 'transparent',
  },
  submitButton: {
    minWidth: 120,
  },
});
