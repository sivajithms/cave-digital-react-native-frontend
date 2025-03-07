
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme';

export type FilterOption = 'all' | 'pending' | 'completed' | 'high' | 'medium' | 'low';

interface TaskFilterProps {
  selectedFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
}

interface FilterItem {
  id: FilterOption;
  label: string;
  icon: keyof typeof Feather.glyphMap;
}

export const TaskFilter: React.FC<TaskFilterProps> = ({
  selectedFilter,
  onFilterChange,
}) => {
  const filters: FilterItem[] = [
    { id: 'all', label: 'All', icon: 'list' },
    { id: 'pending', label: 'Pending', icon: 'clock' },
    { id: 'completed', label: 'Completed', icon: 'check-circle' },
    { id: 'high', label: 'High Priority', icon: 'alert-circle' },
    { id: 'medium', label: 'Medium', icon: 'alert-triangle' },
    { id: 'low', label: 'Low', icon: 'circle' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterItem,
              selectedFilter === filter.id && styles.selectedFilter,
            ]}
            onPress={() => onFilterChange(filter.id)}
            activeOpacity={0.7}
          >
            <Feather
              name={filter.icon}
              size={16}
              color={selectedFilter === filter.id ? '#fff' : theme.colors.text}
            />
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter.id && styles.selectedFilterText,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedFilter: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: 6,
  },
  selectedFilterText: {
    color: '#fff',
  },
});
