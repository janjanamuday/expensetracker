import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTransactions } from '../redux/slices/transactionSlice.js';
import { useNavigation } from '@react-navigation/native';

const RecentTransactions = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const { transactions, status, error } = useSelector(state => state.transactions);
  
  useEffect(() => {
    dispatch(fetchTransactions({ month: currentMonth, year: currentYear }));
  }, [dispatch]);

  const renderTransactionItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.transactionItem}
      onPress={() => navigation.navigate('AllTransactions', { transactionId: item._id })}
    >
      <View style={styles.transactionLeft}>
        <View style={[
          styles.transactionIcon,
          item.type === 'income' ? styles.incomeBg : styles.expenseBg
        ]}>
          <Icon
            name={item.type === 'income' ? 'download' : 'upload'}
            size={14}
            color="#FFFFFF"
          />
        </View>
        <View style={styles.transactionInfo}>
          <View style={styles.transactionHeader}>
            <Text style={styles.transactionCategory}>{item.category}</Text>
            <Text style={[
              styles.transactionAmount,
              item.type === 'income' ? styles.incomeText : styles.expenseText
            ]}>
              {item.type === 'income' ? '+' : '-'}₹{item.amount.toLocaleString()}
            </Text>
          </View>
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionDate}>
              {new Date(item.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            </Text>
            {item.description && (
              <Text style={styles.transactionDescription} numberOfLines={1}>
                • {item.description}
              </Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (status === 'loading' && transactions.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  if (status === 'failed') {
    return (
      <View style={styles.errorContainer}>
        <Icon name="exclamation-circle" size={24} color="#EF4444" />
        <Text style={styles.errorText}>Failed to load transactions</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => dispatch(fetchTransactions({ month: currentMonth, year: currentYear }))}
        >
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Transactions</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('AllTransactions')}
          style={styles.seeAllButton}
        >
          <Text style={styles.seeAllText}>View All</Text>
          <Icon name="angle-right" size={16} color="#6366F1" />
        </TouchableOpacity>
      </View>

      {recentTransactions.length > 0 ? (
        <FlatList
          data={recentTransactions}
          renderItem={renderTransactionItem}
          keyExtractor={item => item._id}
          scrollEnabled={false}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Icon name="exchange" size={32} color="#9CA3AF" />
          </View>
          <Text style={styles.emptyText}>No recent transactions</Text>
          <Text style={styles.emptySubText}>Your transactions will appear here</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Inter-SemiBold',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  seeAllText: {
    color: '#6366F1',
    fontSize: 14,
    marginRight: 4,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  transactionItem: {
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  incomeBg: {
    backgroundColor: '#10B981',
  },
  expenseBg: {
    backgroundColor: '#EF4444',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  transactionCategory: {
    fontWeight: '500',
    color: '#1F2937',
    fontSize: 15,
    fontFamily: 'Inter-Medium',
  },
  transactionAmount: {
    fontWeight: '600',
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
  },
  incomeText: {
    color: '#10B981',
  },
  expenseText: {
    color: '#EF4444',
  },
  transactionDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionDate: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  transactionDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 4,
    fontFamily: 'Inter-Regular',
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#1F2937',
    marginVertical: 8,
    fontFamily: 'Inter-Medium',
  },
  retryButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  emptyContainer: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    backgroundColor: '#F3F4F6',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyText: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    fontFamily: 'Inter-Medium',
  },
  emptySubText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  listContainer: {
    paddingBottom: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 4,
  },
});

export default RecentTransactions;