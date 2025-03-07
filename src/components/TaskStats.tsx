
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Task } from '../types';
import { theme } from '../theme';

interface TaskStatsProps {
  tasks: Task[];
}

export const TaskStats: React.FC<TaskStatsProps> = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  
  const highPriorityTasks = tasks.filter(task => task.priority === 'high' && !task.completed).length;
  const mediumPriorityTasks = tasks.filter(task => task.priority === 'medium' && !task.completed).length;
  const lowPriorityTasks = tasks.filter(task => task.priority === 'low' && !task.completed).length;
  
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task Overview</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(99, 102, 241, 0.1)' }]}>
            <Feather name="list" size={20} color={theme.colors.primary} />
          </View>
          <Text style={styles.statValue}>{totalTasks}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        
        <View style={styles.statItem}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(34, 197, 94, 0.1)' }]}>
            <Feather name="check-circle" size={20} color={theme.colors.success} />
          </View>
          <Text style={styles.statValue}>{completedTasks}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        
        <View style={styles.statItem}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
            <Feather name="clock" size={20} color={theme.colors.error} />
          </View>
          <Text style={styles.statValue}>{pendingTasks}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Completion Rate</Text>
          <Text style={styles.progressPercentage}>{completionRate}%</Text>
        </View>
        
        <View style={styles.progressBarContainer}>
          <View 
            style={[
              styles.progressBar, 
              { width: `${completionRate}%` }
            ]} 
          />
        </View>
      </View>
      
      <View style={styles.priorityContainer}>
        <Text style={styles.priorityTitle}>Priority Breakdown</Text>
        
        <View style={styles.priorityItem}>
          <View style={styles.priorityLabelContainer}>
            <View style={[styles.priorityDot, { backgroundColor: theme.colors.error }]} />
            <Text style={styles.priorityLabel}>High</Text>
          </View>
          <Text style={styles.priorityValue}>{highPriorityTasks}</Text>
        </View>
        
        <View style={styles.priorityItem}>
          <View style={styles.priorityLabelContainer}>
            <View style={[styles.priorityDot, { backgroundColor: '#F59E0B' }]} />
            <Text style={styles.priorityLabel}>Medium</Text>
          </View>
          <Text style={styles.priorityValue}>{mediumPriorityTasks}</Text>
        </View>
        
        <View style={styles.priorityItem}>
          <View style={styles.priorityLabelContainer}>
            <View style={[styles.priorityDot, { backgroundColor: theme.colors.success }]} />
            <Text style={styles.priorityLabel}>Low</Text>
          </View>
          <Text style={styles.priorityValue}>{lowPriorityTasks}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  progressContainer: {
    marginBottom: theme.spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 14,
    color: theme.colors.text,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  priorityContainer: {
    marginTop: theme.spacing.sm,
  },
  priorityTitle: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 8,
  },
  priorityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  priorityLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  priorityLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  priorityValue: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
  },
});
