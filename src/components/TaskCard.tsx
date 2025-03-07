
import React, { useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  PanResponder
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Task } from '../types';
import { theme } from '../theme';

interface TaskCardProps {
  task: Task;
  onPress: (task: Task) => void;
  onComplete: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onPress, 
  onComplete,
  onDelete
}) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return theme.colors.error;
      case 'medium':
        return '#F59E0B'; // Amber
      case 'low':
        return theme.colors.success;
      default:
        return theme.colors.textSecondary;
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          // Swipe left (delete)
          pan.x.setValue(Math.max(gestureState.dx, -100));
        } else if (gestureState.dx > 0) {
          // Swipe right (complete)
          pan.x.setValue(Math.min(gestureState.dx, 100));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -100) {
          // Delete task
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            onDelete(task.id);
          });
        } else if (gestureState.dx > 100) {
          // Complete task
          Animated.timing(pan, {
            toValue: { x: 0, y: 0 },
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            onComplete(task);
          });
        } else {
          // Reset position
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const getFormattedDate = (dateString: string | null) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Check if date is today
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return 'Today';
    }
    
    // Check if date is tomorrow
    if (
      date.getDate() === tomorrow.getDate() &&
      date.getMonth() === tomorrow.getMonth() &&
      date.getFullYear() === tomorrow.getFullYear()
    ) {
      return 'Tomorrow';
    }
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        { 
          transform: [{ translateX: pan.x }],
          opacity 
        }
      ]}
      {...panResponder.panHandlers}
    >
      {/* Background action indicators */}
      <View style={styles.actionsContainer}>
        <View style={styles.completeAction}>
          <Feather name="check-circle" size={20} color={theme.colors.success} />
          <Text style={styles.actionText}>Complete</Text>
        </View>
        <View style={styles.deleteAction}>
          <Feather name="trash-2" size={20} color={theme.colors.error} />
          <Text style={styles.actionText}>Delete</Text>
        </View>
      </View>
      
      {/* Card content */}
      <TouchableOpacity 
        style={[
          styles.card,
          task.completed && styles.completedCard
        ]} 
        onPress={() => onPress(task)}
        activeOpacity={0.7}
      >
        <View style={styles.leftSection}>
          <TouchableOpacity 
            style={styles.checkbox} 
            onPress={() => onComplete(task)}
          >
            {task.completed ? (
              <Feather name="check-circle" size={22} color={theme.colors.success} />
            ) : (
              <View style={[styles.checkboxInner, { borderColor: getPriorityColor(task.priority) }]} />
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.contentSection}>
          <Text 
            style={[
              styles.title,
              task.completed && styles.completedText
            ]}
            numberOfLines={1}
          >
            {task.title}
          </Text>
          
          {task.description ? (
            <Text 
              style={styles.description}
              numberOfLines={1}
            >
              {task.description}
            </Text>
          ) : null}
          
          {task.dueDate ? (
            <View style={styles.metaContainer}>
              <Feather name="calendar" size={12} color={theme.colors.textSecondary} />
              <Text style={styles.metaText}>{getFormattedDate(task.dueDate)}</Text>
            </View>
          ) : null}
        </View>
        
        <View style={styles.rightSection}>
          <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(task.priority) }]} />
          <Feather name="chevron-right" size={18} color={theme.colors.textSecondary} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: theme.spacing.md,
  },
  actionsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    zIndex: -1,
  },
  completeAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    color: theme.colors.text,
    marginLeft: 8,
    fontSize: 14,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  completedCard: {
    opacity: 0.7,
  },
  leftSection: {
    marginRight: theme.spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
  },
  contentSection: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  description: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 6,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing.sm,
  },
});
