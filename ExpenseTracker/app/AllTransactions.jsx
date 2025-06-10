import React, { useEffect, useState } from 'react';
import { View, Text,TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTransactions } from '../redux/slices/transactionSlice.js';
import { useIsFocused, useNavigation } from '@react-navigation/native';

const AllTransactions = () => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDateSelector, setShowDateSelector] = useState(false);

  const monthYearString = selectedDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const { transactions, status, error } = useSelector(state => state.transactions);

  useEffect(() => {
    const month = selectedDate.getMonth() + 1;
    const year = selectedDate.getFullYear();
    dispatch(fetchTransactions({ month, year }));
  }, [dispatch, filter, isFocused, selectedDate]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const month = selectedDate.getMonth() + 1;
      const year = selectedDate.getFullYear();
      await dispatch(fetchTransactions({ month, year })).unwrap();
    } finally {
      setRefreshing(false);
    }
  };

  const changeMonth = (increment) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setSelectedDate(newDate);
  };

  const changeYear = (increment) => {
    const newDate = new Date(selectedDate);
    newDate.setFullYear(newDate.getFullYear() + increment);
    setSelectedDate(newDate);
  };

  const filteredTransactions = [...transactions]
    .filter(transaction => {
      if (filter === 'all') return true;
      return transaction.type === filter;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
      } else {
        return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
    });

  const renderTransactionItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <TouchableOpacity
        style={styles.transactionContent}
        onPress={() => navigation.navigate('TransactionDetail', { transactionId: item._id })}
      >
        <View style={styles.transactionLeft}>
          <View
            style={[
              styles.transactionIcon,
              item.type === 'income' ? styles.incomeBg : styles.expenseBg,
            ]}
          >
            <Icon
              name={item.type === 'income' ? 'arrow-down' : 'arrow-up'}
              size={16}
              color={item.type === 'income' ? '#4CAF50' : '#F44336'}
            />
          </View>
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionCategory}>{item.category}</Text>
            <Text style={styles.transactionDate}>
              {new Date(item.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>
            {item.description && (
              <Text style={styles.transactionDescription} numberOfLines={1}>
                {item.description}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.transactionRight}>
          <Text
            style={[
              styles.transactionAmount,
              item.type === 'income' ? styles.incomeText : styles.expenseText,
            ]}
          >
            {item.type === 'income' ? '+' : '-'}₹{item.amount.toLocaleString()}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.filterContainer}>
      <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>Viewing:</Text>
        <TouchableOpacity 
          style={styles.dateFilterButton} 
          onPress={() => setShowDateSelector(!showDateSelector)}
        >
          <Text style={styles.dateFilterText}>{monthYearString}</Text>
          <Icon name={showDateSelector ? "chevron-up" : "chevron-down"} size={14} color="#3B82F6" />
        </TouchableOpacity>
      </View>
      
      {showDateSelector && (
        <View style={styles.dateSelectorContainer}>
          <View style={styles.dateSelectorRow}>
            <TouchableOpacity 
              style={styles.dateSelectorButton} 
              onPress={() => changeMonth(-1)}
            >
              <Icon name="chevron-left" size={16} color="#3B82F6" />
              <Text style={styles.dateSelectorText}>Prev Month</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.dateSelectorButton} 
              onPress={() => changeMonth(1)}
            >
              <Text style={styles.dateSelectorText}>Next Month</Text>
              <Icon name="chevron-right" size={16} color="#3B82F6" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.dateSelectorRow}>
            <TouchableOpacity 
              style={styles.dateSelectorButton} 
              onPress={() => changeYear(-1)}
            >
              <Icon name="chevron-left" size={16} color="#3B82F6" />
              <Text style={styles.dateSelectorText}>Prev Year</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.dateSelectorButton} 
              onPress={() => changeYear(1)}
            >
              <Text style={styles.dateSelectorText}>Next Year</Text>
              <Icon name="chevron-right" size={16} color="#3B82F6" />
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>Filter:</Text>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterButtonText, filter === 'all' && styles.activeFilterText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'income' && styles.activeFilter]}
          onPress={() => setFilter('income')}
        >
          <Text style={[styles.filterButtonText, filter === 'income' && styles.activeFilterText]}>Income</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'expense' && styles.activeFilter]}
          onPress={() => setFilter('expense')}
        >
          <Text style={[styles.filterButtonText, filter === 'expense' && styles.activeFilterText]}>Expense</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>Sort by:</Text>
        <TouchableOpacity
          style={[styles.filterButton, sortBy === 'date' && styles.activeFilter]}
          onPress={() => setSortBy('date')}
        >
          <Text style={[styles.filterButtonText, sortBy === 'date' && styles.activeFilterText]}>Date</Text>
          {sortBy === 'date' && <Icon name={sortOrder === 'asc' ? 'sort-asc' : 'sort-desc'} size={12} color="#3B82F6" style={styles.sortIcon} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, sortBy === 'amount' && styles.activeFilter]}
          onPress={() => setSortBy('amount')}
        >
          <Text style={[styles.filterButtonText, sortBy === 'amount' && styles.activeFilterText]}>Amount</Text>
          {sortBy === 'amount' && <Icon name={sortOrder === 'asc' ? 'sort-asc' : 'sort-desc'} size={12} color="#3B82F6" style={styles.sortIcon} />}
        </TouchableOpacity>
        <TouchableOpacity style={styles.sortOrderButton} onPress={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}>
          <Icon name={sortOrder === 'asc' ? 'sort-asc' : 'sort-desc'} size={16} color="#3B82F6" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (status === 'loading' && transactions.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (status === 'failed') {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {filteredTransactions.length > 0 ? (
        <FlatList
          data={filteredTransactions}
          renderItem={renderTransactionItem}
          keyExtractor={item => item._id}
          ListHeaderComponent={renderHeader}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#3B82F6"]} tintColor="#3B82F6" />}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="file-text-o" size={40} color="#9CA3AF" />
          <Text style={styles.emptyText}>No transactions found</Text>
          <Text style={styles.emptySubText}>Try changing your filters or date</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  filterContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  filterLabel: {
    marginRight: 8,
    color: '#6B7280',
    fontSize: 14,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#F3F4F6',
  },
  activeFilter: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  filterButtonText: {
    color: '#6B7280',
    fontSize: 14,
  },
  activeFilterText: {
    color: '#3B82F6',
    fontWeight: '500',
  },
  sortIcon: {
    marginLeft: 4,
  },
  sortOrderButton: {
    padding: 6,
    marginLeft: 4,
  },
  transactionItem: {
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  transactionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  incomeBg: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  expenseBg: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  transactionInfo: {
    marginLeft: 12,
    flex: 1,
  },
  transactionCategory: {
    fontWeight: '500',
    color: '#111827',
    fontSize: 16,
  },
  transactionDate: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  transactionDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  transactionAmount: {
    fontWeight: '600',
    fontSize: 16,
    marginRight: 10,
  },
  incomeText: {
    color: '#4CAF50',
  },
  expenseText: {
    color: '#F44336',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#EF4444',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    padding: 10,
    borderRadius: 5,
  },
  retryText: {
    color: 'white',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 8,
    color: '#111827',
    fontWeight: '500',
    fontSize: 16,
  },
  emptySubText: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 4,
  },
  listContainer: {
    paddingBottom: 16,
  },
  dateFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  dateFilterText: {
    color: '#3B82F6',
    fontWeight: '500',
    marginRight: 4,
  },
  dateSelectorContainer: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  dateSelectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dateSelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  dateSelectorText: {
    color: '#3B82F6',
    fontWeight: '500',
    marginHorizontal: 4,
  },
});

export default AllTransactions;