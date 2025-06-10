import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTransactionDetails } from '../slices/transactionSlice.js';

const TransactionDetail = ({ route }) => {
  const { transactionId } = route.params;
  const dispatch = useDispatch();
  const { currentTransaction, status, error } = useSelector(state => state.transactions);

  useEffect(() => {
    dispatch(fetchTransactionDetails(transactionId));
  }, [dispatch, transactionId]);

  if (status === 'loading') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (status === 'failed') {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  if (!currentTransaction) {
    return (
      <View style={styles.container}>
        <Text>Transaction not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaction Details</Text>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Amount:</Text>
        <Text style={[
          styles.value,
          currentTransaction.type === 'income' ? styles.income : styles.expense
        ]}>
          {currentTransaction.type === 'income' ? '+' : '-'}
          ₹{currentTransaction.amount.toLocaleString()}
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Category:</Text>
        <Text style={styles.value}>{currentTransaction.category}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>
          {new Date(currentTransaction.date).toLocaleDateString()}
        </Text>
      </View>
      {currentTransaction.description && (
        <View style={styles.detailRow}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.value}>{currentTransaction.description}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  income: {
    color: '#4CAF50',
  },
  expense: {
    color: '#F44336',
  },
});

export default TransactionDetail;