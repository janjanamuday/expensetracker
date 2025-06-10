import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTransactions } from '../redux/slices/transactionSlice.js';

const FinancialSummary = () => {
  const dispatch = useDispatch();
  const { summary, status, error } = useSelector(state => state.transactions);
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const years = ['2023', '2024', '2025', '2026'];

  useEffect(() => {
    dispatch(fetchTransactions({ month: selectedMonth, year: selectedYear }));
  }, [selectedMonth, selectedYear, dispatch]);

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    setShowMonthPicker(false);
  };

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setShowYearPicker(false);
  };

  if (status === 'loading') {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (status === 'failed') {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Background Decoration */}
      <View style={styles.backgroundCircle1} />
      <View style={styles.backgroundCircle2} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Financial Summary</Text>
      </View>

      {/* Month/Year Filter */}
      <View style={styles.filterContainer}>
        <View style={styles.filterItem}>
          <Text style={styles.filterLabel}>Month:</Text>
          <TouchableOpacity 
            style={styles.dropdown}
            onPress={() => setShowMonthPicker(true)}
          >
            <Text style={styles.dropdownText}>{selectedMonth}</Text>
            <Icon name="chevron-down" size={12} color="#4b5563" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.filterItem}>
          <Text style={styles.filterLabel}>Year:</Text>
          <TouchableOpacity 
            style={styles.dropdown}
            onPress={() => setShowYearPicker(true)}
          >
            <Text style={styles.dropdownText}>{selectedYear}</Text>
            <Icon name="chevron-down" size={12} color="#4b5563" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Month Picker Modal */}
      <Modal
        visible={showMonthPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMonthPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={months}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleMonthSelect(item)}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Year Picker Modal */}
      <Modal
        visible={showYearPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowYearPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={years}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleYearSelect(item)}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Summary Cards */}
      <View style={styles.cardsContainer}>
        {/* Income Card */}
        <View style={[styles.card, styles.incomeCard]}>
          <View style={styles.cardHeader}>
            <Icon name="arrow-up" size={16} color="white" />
            <Text style={[styles.cardPercentage, { color: 'white' }]}>+12%</Text>
          </View>
          <Text style={[styles.cardLabel, { color: 'rgba(255,255,255,0.8)' }]}>Income</Text>
          <Text style={[styles.cardValue, { color: 'white' }]}>₹{summary.totalIncome?.toLocaleString() || '0'}</Text>
        </View>

        {/* Expenses Card */}
        <View style={[styles.card, styles.expenseCard]}>
          <View style={styles.cardHeader}>
            <Icon name="arrow-down" size={16} color="white" />
            <Text style={[styles.cardPercentage, { color: 'white' }]}>+8%</Text>
          </View>
          <Text style={[styles.cardLabel, { color: 'rgba(255,255,255,0.8)' }]}>Expenses</Text>
          <Text style={[styles.cardValue, { color: 'white' }]}>₹{summary.totalExpenses?.toLocaleString() || '0'}</Text>
        </View>

        {/* Balance Card */}
        <View style={[styles.card, styles.balanceCard]}>
          <View style={styles.cardHeader}>
            <Icon name="wallet" size={16} color="white" />
            <Text style={[styles.cardPercentage, { color: 'white' }]}>+15%</Text>
          </View>
          <Text style={[styles.cardLabel, { color: 'rgba(255,255,255,0.8)' }]}>Balance</Text>
          <Text style={[styles.cardValue, { color: 'white' }]}>₹{summary.balance?.toLocaleString() || '0'}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fd',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundCircle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(103, 58, 183, 0.1)',
    top: -100,
    left: -100,
  },
  backgroundCircle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    bottom: -50,
    right: -50,
  },
  header: {
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2c3e50',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fd',
  },
  loadingText: {
    fontSize: 18,
    color: '#7f8c8d',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fd',
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterLabel: {
    marginRight: 8,
    color: '#7f8c8d',
    fontSize: 14,
    fontWeight: '500',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dropdownText: {
    marginRight: 8,
    fontSize: 14,
    color: '#34495e',
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  incomeCard: {
    backgroundColor: '#4CAF50',
  },
  expenseCard: {
    backgroundColor: '#F44336',
  },
  balanceCard: {
    backgroundColor: '#2196F3',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardPercentage: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  cardValue: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 16,
    width: '80%',
    maxHeight: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  modalItemText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#2c3e50',
  },
});

export default FinancialSummary;