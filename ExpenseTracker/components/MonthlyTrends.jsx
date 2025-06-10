import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal, FlatList } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTransactions } from '../redux/slices/transactionSlice';

const MonthlyTrends = () => {
  const dispatch = useDispatch();
  const { transactions, status } = useSelector(state => state.transactions);
  
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.toLocaleString('default', { month: 'long' }));
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear().toString());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const years = Array.from({length: currentDate.getFullYear() - 2019}, (_, i) => (2020 + i).toString());

  // Define your expense categories
  const categories = [
    'All',
    'Shopping',
    'Entertainment',
    'Bills',
    'Health',
    'Transport',
    'Food',
    'Other'
  ];

  // Process transaction data for the chart by category
  const processChartData = () => {
    const selectedMonthIndex = months.indexOf(selectedMonth);
    const selectedYearNum = parseInt(selectedYear);

    // Filter transactions for the selected month and year
    let filteredTransactions = transactions.filter(transaction => {
      if (transaction.type !== 'expense') return false;
      
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getFullYear() === selectedYearNum &&
        transactionDate.getMonth() === selectedMonthIndex
      );
    });

    // Further filter by selected category if not 'All'
    if (selectedCategory !== 'All') {
      filteredTransactions = filteredTransactions.filter(
        transaction => transaction.category === selectedCategory
      );
    }

    // Group by day of month
    const daysInMonth = new Date(selectedYearNum, selectedMonthIndex + 1, 0).getDate();
    const dailyData = Array(daysInMonth).fill(0);

    filteredTransactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      const dayOfMonth = transactionDate.getDate() - 1; // 0-based index
      dailyData[dayOfMonth] += transaction.amount;
    });

    return {
      labels: Array.from({length: daysInMonth}, (_, i) => (i + 1).toString()),
      datasets: [{
        data: dailyData,
        color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`, // Teal
        strokeWidth: 2
      }],
      legend: [selectedCategory === 'All' ? 'All Expenses' : `${selectedCategory} Expenses`]
    };
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#ffffff'
    },
    propsForBackgroundLines: {
      strokeWidth: 1,
      stroke: '#e5e7eb'
    },
    formatYLabel: (value) => `₹${value}`,
    fromZero: true
  };

  useEffect(() => {
    // Fetch all transactions initially and when year changes
    dispatch(fetchTransactions({ year: selectedYear }));
  }, [selectedYear, dispatch]);

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    setShowMonthPicker(false);
  };

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setShowYearPicker(false);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowCategoryPicker(false);
  };

  if (status === 'loading') {
    return (
      <View style={styles.chartCard}>
        <Text>Loading data...</Text>
      </View>
    );
  }

  const chartData = processChartData();
  const hasData = chartData.datasets[0].data.some(amount => amount > 0);

  return (
    <View style={styles.chartCard}>
      <View style={styles.header}>
        <Text style={styles.title}>Monthly Spending Trends</Text>
        <View style={styles.dateControls}>
          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => setShowMonthPicker(true)}
          >
            <Text style={styles.dateText}>{selectedMonth}</Text>
            <Icon name="chevron-down" size={14} color="#4b5563" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => setShowYearPicker(true)}
          >
            <Text style={styles.dateText}>{selectedYear}</Text>
            <Icon name="chevron-down" size={14} color="#4b5563" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => setShowCategoryPicker(true)}
          >
            <Text style={styles.dateText}>{selectedCategory}</Text>
            <Icon name="chevron-down" size={14} color="#4b5563" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Month Picker Modal */}
      <Modal
        visible={showMonthPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMonthPicker(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1}
          onPress={() => setShowMonthPicker(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={months}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    selectedMonth === item && styles.selectedItem
                  ]}
                  onPress={() => handleMonthSelect(item)}
                >
                  <Text style={styles.modalText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Year Picker Modal */}
      <Modal
        visible={showYearPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowYearPicker(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1}
          onPress={() => setShowYearPicker(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={years}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    selectedYear === item && styles.selectedItem
                  ]}
                  onPress={() => handleYearSelect(item)}
                >
                  <Text style={styles.modalText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Category Picker Modal */}
      <Modal
        visible={showCategoryPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCategoryPicker(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1}
          onPress={() => setShowCategoryPicker(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={categories}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    selectedCategory === item && styles.selectedItem
                  ]}
                  onPress={() => handleCategorySelect(item)}
                >
                  <Text style={styles.modalText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
      
      {hasData ? (
        <LineChart
          data={chartData}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      ) : (
        <View style={styles.emptyState}>
          <Icon name="bar-chart" size={40} color="#9ca3af" />
          <Text style={styles.emptyText}>
            No {selectedCategory === 'All' ? '' : `${selectedCategory} `}data for {selectedMonth} {selectedYear}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  chartCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  dateControls: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 5,
  },
  dateText: {
    fontSize: 14,
    marginRight: 6,
    color: '#374151',
  },
  chart: {
    borderRadius: 8,
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '70%',
    maxHeight: '60%',
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  selectedItem: {
    backgroundColor: '#f0fdf4',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#111827',
  },
  emptyState: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 12,
    color: '#6b7280',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default MonthlyTrends;