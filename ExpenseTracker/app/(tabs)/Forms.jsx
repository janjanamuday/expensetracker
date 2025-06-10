import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { addNewTransaction } from '../../redux/slices/transactionSlice.js';
import Header from "../../components/Header.jsx";

const AddTransaction = () => {
  const dispatch = useDispatch();
  const { status } = useSelector(state => state.transactions);
  
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('expense');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const categories = {
    expense: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other'],
    income: ['Salary', 'Freelance', 'Investments', 'Gifts', 'Other']
  };

  const handleSubmit = async () => {
    if (!amount || !category) return;
    
    try {
      const newTransaction = {
        amount: parseFloat(amount),
        type: transactionType,
        category,
        date: new Date(date).toISOString(),
        notes
      };

      const result = await dispatch(addNewTransaction(newTransaction)).unwrap();
      
      if (result) {
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          resetForm();
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to add transaction:', error);
    }
  };

  const resetForm = () => {
    setAmount('');
    setCategory('');
    setNotes('');
    setTransactionType('expense');
  };

  return (
    <View style={styles.phoneContainer}>
      <View style={styles.phoneScreen}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          {/* Bubble background elements */}
          <View style={[styles.bubble, styles.bubble1]} />
          <View style={[styles.bubble, styles.bubble2]} />
          <View style={[styles.bubble, styles.bubble3]} />
          
          <Header/>
          <View style={styles.formContainer}>
            <Text style={styles.screenTitle}>Add Transaction</Text>
            
            {/* Centered Type Toggle */}
            <View style={styles.typeToggleWrapper}>
              <View style={styles.typeToggleContainer}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    transactionType === 'expense' && styles.expenseActive
                  ]}
                  onPress={() => setTransactionType('expense')}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.typeButtonText,
                    transactionType === 'expense' && styles.typeButtonTextActive
                  ]}>
                    Expense
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    transactionType === 'income' && styles.incomeActive
                  ]}
                  onPress={() => setTransactionType('income')}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.typeButtonText,
                    transactionType === 'income' && styles.typeButtonTextActive
                  ]}>
                    Income
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Amount Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Amount</Text>
              <View style={styles.amountInputContainer}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                  style={styles.amountInput}
                  keyboardType="decimal-pad"
                  value={amount}
                  onChangeText={text => setAmount(text.replace(/[^0-9.]/g, ''))}
                  placeholder="0.00"
                  placeholderTextColor="#A0AEC0"
                />
              </View>
            </View>

            {/* Category Selector */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Category</Text>
              <TouchableOpacity 
                style={styles.categorySelector}
                onPress={() => setShowCategoryModal(true)}
                activeOpacity={0.8}
              >
                <Text style={category ? styles.categorySelected : styles.categoryPlaceholder}>
                  {category || 'Select a category'}
                </Text>
                <Icon name="chevron-down" size={16} color="#4A5568" />
              </TouchableOpacity>
            </View>

            {/* Date Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Date</Text>
              <View style={styles.dateInputContainer}>
                <Icon name="calendar" size={16} color="#4A5568" style={styles.dateIcon} />
                <TextInput
                  style={styles.dateInput}
                  value={date}
                  onChangeText={setDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#A0AEC0"
                />
              </View>
            </View>

            {/* Notes Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Notes (optional)</Text>
              <TextInput
                style={[styles.input, styles.notesInput]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Add any additional notes..."
                placeholderTextColor="#A0AEC0"
                multiline
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity 
              style={[
                styles.submitButton,
                (!amount || !category || status === 'loading') && styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={!amount || !category || status === 'loading'}
              activeOpacity={0.8}
            >
              {status === 'loading' ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.submitButtonText}>Add Transaction</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Category Modal */}
          <Modal
            visible={showCategoryModal}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowCategoryModal(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Category</Text>
                {categories[transactionType].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={styles.categoryItem}
                    onPress={() => {
                      setCategory(cat);
                      setShowCategoryModal(false);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.categoryItemText}>{cat}</Text>
                    <Icon name="chevron-right" size={14} color="#CBD5E0" />
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.closeModalButton}
                  onPress={() => setShowCategoryModal(false)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.closeModalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Success Modal */}
          <Modal
            visible={showSuccessModal}
            animationType="fade"
            transparent={true}
          >
            <View style={styles.successModalContainer}>
              <View style={styles.successModalContent}>
                <View style={styles.successIcon}>
                  <Icon name="check" size={32} color="white" />
                </View>
                <Text style={styles.successTitle}>Transaction Added!</Text>
                <Text style={styles.successMessage}>
                  Your {transactionType} of ₹{amount} has been recorded.
                </Text>
              </View>
            </View>
          </Modal>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  phoneContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
    padding: 20,
  },
  phoneScreen: {
    width: 585, // Standard phone width
    height: 880, // Standard phone height
    backgroundColor: 'white',
    borderRadius: 40,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
    position: 'relative',
    borderWidth: 10,
    borderColor: '#4444',
  },
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
    position: 'relative',
    overflow: 'hidden',
  },
  // Bubble background styles
  bubble: {
    position: 'absolute',
    borderRadius: 500,
    backgroundColor: 'rgba(49, 130, 206, 0.1)',
  },
  bubble1: {
    width: 300,
    height: 300,
    top: -150,
    right: -100,
  },
  bubble2: {
    width: 200,
    height: 200,
    bottom: -50,
    left: -50,
  },
  bubble3: {
    width: 150,
    height: 150,
    top: '30%',
    right: -50,
  },
  formContainer: {
    padding: 24,
    paddingTop: 16,
    zIndex: 1,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 24,
    textAlign: 'center',
  },
  typeToggleWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  typeToggleContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#EDF2F7',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 1,
    width: '70%', // Make the toggle narrower
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  expenseActive: {
    backgroundColor: '#FED7D7',
  },
  incomeActive: {
    backgroundColor: '#C6F6D5',
  },
  typeButtonText: {
    fontWeight: '600',
    color: '#718096',
    fontSize: 14,
  },
  typeButtonTextActive: {
    color: '#2D3748',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    marginBottom: 6,
    color: '#4A5568',
    fontWeight: '600',
    fontSize: 13,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 50,
    elevation: 1,
  },
  currencySymbol: {
    fontSize: 18,
    color: '#4A5568',
    marginRight: 8,
    fontWeight: '600',
  },
  amountInput: {
    flex: 1,
    fontSize: 16,
    color: '#2D3748',
    fontWeight: '500',
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 50,
    elevation: 1,
  },
  categorySelected: {
    color: '#2D3748',
    fontWeight: '500',
  },
  categoryPlaceholder: {
    color: '#A0AEC0',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 50,
    elevation: 1,
  },
  dateIcon: {
    marginRight: 12,
  },
  dateInput: {
    flex: 1,
    color: '#2D3748',
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    color: '#2D3748',
    fontWeight: '500',
    elevation: 1,
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#3182CE',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
    shadowColor: '#3182CE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  submitButtonDisabled: {
    backgroundColor: '#CBD5E0',
    shadowColor: '#CBD5E0',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 32,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    color: '#2D3748',
    textAlign: 'center',
  },
  categoryItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryItemText: {
    fontSize: 15,
    color: '#2D3748',
    fontWeight: '500',
  },
  closeModalButton: {
    marginTop: 20,
    padding: 14,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#3182CE',
  },
  closeModalButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  successModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  successModalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    width: '80%',
    elevation: 5,
  },
  successIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3182CE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#2D3748',
  },
  successMessage: {
    textAlign: 'center',
    color: '#4A5568',
    marginBottom: 16,
    fontSize: 15,
    lineHeight: 22,
  },
});

export default AddTransaction;