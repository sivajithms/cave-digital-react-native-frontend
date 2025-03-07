
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import {
  Text,
  Appbar,
  FAB,
  Searchbar,
  Chip,
  Card,
  Avatar,
  ActivityIndicator,
  Divider,
  Badge,
  IconButton,
  Menu,
  Snackbar,
} from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import { RootState, AppDispatch } from '../store';
import { fetchTasks, updateTask, deleteTask } from '../store/taskSlice';
import { logout } from '../store/authSlice';
import { Task } from '../types';
import { theme } from '../theme';

export default function HomeScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { tasks, isLoading } = useSelector((state: RootState) => state.tasks);

  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showSearchArea, setShowSearchArea] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      await dispatch(fetchTasks()).unwrap();
    } catch (error) {
      showSnackbar('Failed to load tasks');
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchTasks()).unwrap();
    } catch (error) {
      showSnackbar('Failed to refresh tasks');
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      showSnackbar('Logged out successfully');
    } catch (error) {
      showSnackbar('Failed to logout');
    }
  };

  const navigateToAddTask = () => {
    navigation.navigate('AddTask' as never);
  };

  const navigateToTaskDetails = (task: Task) => {
    navigation.navigate('TaskDetails' as never, { taskId: task.id } as never);
  };

  const handleCompleteTask = async (task: Task) => {
    try {
      await dispatch(updateTask({ ...task, completed: !task.completed })).unwrap();
      showSnackbar(task.completed ? 'Task marked as incomplete' : 'Task completed');
    } catch (error) {
      showSnackbar('Failed to update task');
    }
  };

  // const handleDeleteTask = async (taskId: string) => {
  //   try {
  //     await dispatch(deleteTask(taskId)).unwrap();
  //     showSnackbar('Task deleted');
  //   } catch (error) {
  //     showSnackbar('Failed to delete task');
  //   }
  // };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const filteredTasks = tasks.filter(task => {
    // Apply search filter
    const matchesSearch = searchQuery === '' ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Apply status filter
    const matchesFilter =
      selectedFilter === 'all' ||
      (selectedFilter === 'pending' && !task.completed) ||
      (selectedFilter === 'completed' && task.completed);

    return matchesSearch && matchesFilter;
  });

  const pendingTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);

  const renderTaskItem = ({ item }: { item: Task }) => {
    const priorityColors = {
      high: theme.colors.error,
      medium: '#F59E0B',
      low: theme.colors.success,
    };

    return (
      <Card
        style={[styles.taskCard, item.completed && styles.completedCard]}
        onPress={() => navigateToTaskDetails(item)}
      >
        <Card.Content style={styles.taskCardContent}>
          <TouchableOpacity
            style={[styles.checkbox, item.completed && styles.checkedBox]}
            onPress={() => handleCompleteTask(item)}
          >
            {item.completed && <Feather name="check" size={16} color="#fff" />}
          </TouchableOpacity>

          <View style={styles.taskDetails}>
            <Text
              style={[styles.taskTitle, item.completed && styles.completedText]}
              numberOfLines={1}
            >
              {item.title}
            </Text>

            {item.description ? (
              <Text
                style={styles.taskDescription}
                numberOfLines={1}
              >
                {item.description}
              </Text>
            ) : null}

            <View style={styles.taskMeta}>
              {item.dueDate && (
                <View style={styles.dueDateContainer}>
                  <Feather name="calendar" size={12} color={theme.colors.textSecondary} />
                  <Text style={styles.dueDate}>
                    {new Date(item.dueDate).toLocaleDateString()}
                  </Text>
                </View>
              )}

              <Badge
                style={[
                  styles.priorityBadge,
                  { backgroundColor: priorityColors[item.priority] }
                ]}
              >
                {item.priority}
              </Badge>
            </View>
          </View>

          {/* <IconButton
            icon="dots-vertical"
            size={20}
            color={theme.colors.textSecondary}
            onPress={() => {
              // Show task options menu
              navigateToTaskDetails(item);
            }}
          /> */}
        </Card.Content>
      </Card>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Feather name="clipboard" size={50} color={theme.colors.primary} />
      <Text style={styles.emptyTitle}>No Tasks Found</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery
          ? "Try changing your search query"
          : "Tap the + button to create your first task"}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content
          title="My Tasks"
          titleStyle={styles.headerTitle}
        />

        <Appbar.Action
          icon="magnify"
          color={theme.colors.text}
          onPress={() => { setShowSearchArea((prev) => !prev) }}
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
          anchorPosition="bottom"
        >
          <Menu.Item
            icon="logout"
            onPress={() => {
              setMenuVisible(false);
              handleLogout();
            }}
            title="Logout"
          />
        </Menu>
      </Appbar.Header>

      {showSearchArea && <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search tasks..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          iconColor={theme.colors.textSecondary}
          inputStyle={{ color: theme.colors.text }}
          theme={{ colors: { placeholder: theme.colors.textSecondary, text: theme.colors.text } }}
        />
      </View>}

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Chip
            selected={selectedFilter === 'all'}
            onPress={() => setSelectedFilter('all')}
            style={styles.filterChip}
            selectedColor={theme.colors.primary}
          >
            All
          </Chip>
          <Chip
            selected={selectedFilter === 'pending'}
            onPress={() => setSelectedFilter('pending')}
            style={styles.filterChip}
            selectedColor={theme.colors.primary}
          >
            Pending
          </Chip>
          <Chip
            selected={selectedFilter === 'completed'}
            onPress={() => setSelectedFilter('completed')}
            style={styles.filterChip}
            selectedColor={theme.colors.primary}
          >
            Completed
          </Chip>
        </ScrollView>
      </View>

      {isLoading && !refreshing && tasks.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator animating={true} color={theme.colors.primary} size="large" />
          <Text style={styles.loadingText}>Loading tasks...</Text>
        </View>
      ) : (
        <FlatList
          data={[
            ...pendingTasks,
            { id: 'divider', title: '', description: '', completed: false, priority: 'low', dueDate: null, createdAt: '', userId: '' },
            ...completedTasks,
          ]}
          renderItem={({ item, index }) => {
            if (item.id === 'divider' && completedTasks.length > 0) {
              return (
                <View style={styles.dividerContainer}>
                  <Divider style={styles.divider} />
                  <Text style={styles.dividerText}>Completed</Text>
                  <Divider style={styles.divider} />
                </View>
              );
            }
            return renderTaskItem({ item });
          }}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
        />
      )}

      <FAB
        style={styles.fab}
        icon="plus"
        color="#fff"
        onPress={navigateToAddTask}
      />

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
  searchContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md
  },
  searchbar: {
    backgroundColor: theme.colors.surface,
    elevation: 0,
    borderWidth: 1,
    borderColor: theme.colors.border,
    height: 50,
  },
  filterContainer: {
    marginTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  filterChip: {
    marginRight: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
  },
  listContent: {
    padding: theme.spacing.md,
    paddingBottom: 80,
  },
  taskCard: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
  },
  completedCard: {
    opacity: 0.7,
  },
  taskCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    marginRight: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: theme.colors.primary,
  },
  taskDetails: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  taskDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 6,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  dueDate: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  priorityBadge: {
    fontSize: 10,
    height: 20,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.md,
  },
  divider: {
    flex: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    color: theme.colors.textSecondary,
    marginHorizontal: theme.spacing.md,
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    right: theme.spacing.lg,
    bottom: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
});
