import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import { G, Text as SVGText } from 'react-native-svg';
import { useSelector } from 'react-redux';

const IncomeVsExpenses = () => {
  const { summary } = useSelector(state => state.transactions);

  const income = summary.totalIncome || 0;
  const expenses = summary.totalExpenses || 0;
  const total = income + expenses;
  const netBalance = income - expenses;

  const pieData = total > 0
    ? [
        {
          key: 1,
          amount: income,
          svg: { fill: '#00C853' }, // Green
          label: 'Income',
        },
        {
          key: 2,
          amount: expenses,
          svg: { fill: '#FF3D00' }, // Red
          label: 'Expenses',
        },
      ]
    : [];

  const Labels = ({ slices }) => {
    return slices.map((slice, index) => {
      const { pieCentroid, data } = slice;
      return (
        <SVGText
          key={index}
          x={pieCentroid[0]}
          y={pieCentroid[1]}
          fill="white"
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={14}
          stroke="black"
          strokeWidth={0.2}
        >
          {`${Math.round((data.amount / total) * 100)}%`}
        </SVGText>
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Financial Overview</Text>
        {total > 0 && (
          <View style={styles.netContainer}>
            <Text style={styles.netLabel}>Net:</Text>
            <Text
              style={[
                styles.netValue,
                { color: netBalance >= 0 ? '#00C853' : '#FF3D00' },
              ]}
            >
              ₹{Math.abs(netBalance).toLocaleString()}
            </Text>
          </View>
        )}
      </View>

      {total > 0 ? (
        <>
          <PieChart
            style={{ height: 220 }}
            valueAccessor={({ item }) => item.amount}
            data={pieData}
            spacing={0}
            outerRadius="90%"
            innerRadius="45%" // For donut style
          >
            <Labels />
          </PieChart>

          <View style={styles.legendContainer}>
            {pieData.map(item => (
              <View key={item.key} style={styles.legendItem}>
                <View
                  style={[styles.legendColor, { backgroundColor: item.svg.fill }]}
                />
                <View>
                  <Text style={styles.legendTitle}>{item.label}</Text>
                  <Text style={styles.legendAmount}>
                    ₹{item.amount.toLocaleString()}
                  </Text>
                </View>
                <Text style={styles.legendPercentage}>
                  {Math.round((item.amount / total) * 100)}%
                </Text>
              </View>
            ))}
          </View>
        </>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No transactions recorded</Text>
          <Text style={styles.emptySubText}>
            Add income or expenses to see your financial overview
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 16,
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
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
  },
  netContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  netLabel: {
    fontSize: 14,
    color: '#616161',
    marginRight: 4,
  },
  netValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  legendContainer: {
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  legendTitle: {
    fontSize: 14,
    color: '#616161',
  },
  legendAmount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212121',
    marginTop: 2,
  },
  legendPercentage: {
    marginLeft: 'auto',
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 16,
    color: '#616161',
    marginBottom: 4,
  },
  emptySubText: {
    fontSize: 14,
    color: '#9E9E9E',
    textAlign: 'center',
  },
});

export default IncomeVsExpenses;
