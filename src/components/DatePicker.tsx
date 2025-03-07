
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Platform,
  ScrollView
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme';

interface DatePickerProps {
  value: string | null;
  onChange: (date: string | null) => void;
  label?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label = 'Due Date',
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const formatDate = (date: Date): string => {
    return date.toISOString();
  };
  
  const getDisplayDate = (dateString: string | null): string => {
    if (!dateString) return 'No due date';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: today.getFullYear() !== date.getFullYear() ? 'numeric' : undefined
    });
  };
  
  const isToday = (dateString: string): boolean => {
    if (!dateString) return false;
    
    const date = new Date(dateString);
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  
  const isTomorrow = (dateString: string): boolean => {
    if (!dateString) return false;
    
    const date = new Date(dateString);
    return (
      date.getDate() === tomorrow.getDate() &&
      date.getMonth() === tomorrow.getMonth() &&
      date.getFullYear() === tomorrow.getFullYear()
    );
  };
  
  const getRelativeLabel = (dateString: string | null): string => {
    if (!dateString) return 'No due date';
    
    if (isToday(dateString)) return 'Today';
    if (isTomorrow(dateString)) return 'Tomorrow';
    
    return getDisplayDate(dateString);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity 
        style={styles.dateButton}
        onPress={() => setModalVisible(true)}
      >
        <Feather name="calendar" size={18} color={theme.colors.textSecondary} />
        <Text style={styles.dateText}>
          {value ? getRelativeLabel(value) : 'Set due date'}
        </Text>
        <Feather name="chevron-down" size={18} color={theme.colors.textSecondary} />
      </TouchableOpacity>
      
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Due Date</Text>
            
            <ScrollView style={styles.optionsContainer}>
              <TouchableOpacity 
                style={styles.option}
                onPress={() => {
                  onChange(null);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.optionText}>No due date</Text>
                {!value && <Feather name="check" size={18} color={theme.colors.primary} />}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.option}
                onPress={() => {
                  onChange(formatDate(today));
                  setModalVisible(false);
                }}
              >
                <Text style={styles.optionText}>Today</Text>
                {value && isToday(value) && <Feather name="check" size={18} color={theme.colors.primary} />}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.option}
                onPress={() => {
                  onChange(formatDate(tomorrow));
                  setModalVisible(false);
                }}
              >
                <Text style={styles.optionText}>Tomorrow</Text>
                {value && isTomorrow(value) && <Feather name="check" size={18} color={theme.colors.primary} />}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.option}
                onPress={() => {
                  onChange(formatDate(nextWeek));
                  setModalVisible(false);
                }}
              >
                <Text style={styles.optionText}>In a week</Text>
              </TouchableOpacity>
            </ScrollView>
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: theme.colors.text,
    fontWeight: '500',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  dateText: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    color: theme.colors.text,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: theme.spacing.md,
  },
  modalContent: {
    width: '90%',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  optionsContainer: {
    marginBottom: theme.spacing.md,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  optionText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  closeButton: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
  },
  closeButtonText: {
    color: theme.colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
});
