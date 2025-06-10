import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

// const Header = () => {
//   return (
//     <SafeAreaView>
//     <View style={styles.header}>
      // <Text style={styles.headerTitle}>Financial Overview</Text>
//       <TouchableOpacity style={styles.userButton}>
//         <Icon name="user" size={16} color="#4b5563" />
//       </TouchableOpacity>
//     </View>
//     </SafeAreaView>
//   );
// };
// const Header = () => {
//   return (
//     <SafeAreaView>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Financial Overview</Text>

//         <View style={styles.centerHeadingContainer}>
//           <Text style={styles.centerHeading}>ExpenseTracker</Text>
//         </View>

//         <TouchableOpacity style={styles.userButton}>
//           <Icon name="user" size={16} color="#4b5563" />
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };
const Header = () => {
  return (
    <SafeAreaView>
      <View style={styles.header}>
        
        
        {/* ExpenseTracker Heading in the middle */}
        <Text style={styles.expenseTrackerTitle}>ExpenseTracker</Text>
        
        <TouchableOpacity style={styles.userButton}>
          <Icon name="user" size={16} color="#4b5563" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = {
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 20,
    color: '#4b5563',
  },
  expenseTrackerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '800', // Extra bold
    fontFamily: 'System', // Or use a custom font like 'Inter-Black'
    color: '#000',
    zIndex: -1, // Ensures it stays behind the other elements
  },
  userButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
};


// const styles = StyleSheet.create({
//   header: {
//     width: '100%',
//     backgroundColor: 'white',
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 1,
//     elevation: 2,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//   },
//   userButton: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: '#f3f4f6',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

export default Header;