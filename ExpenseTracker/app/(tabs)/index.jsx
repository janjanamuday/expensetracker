import { SafeAreaView, ScrollView, View } from "react-native";
import Header from "../../components/Header";
import FinancialSummary from "../../components/FinancialSummary";
import IncomeVsExpenses from "../../components/IncomeVsExpenses";
import MonthlyTrends from "../../components/MonthlyTrends";
import RecentTransactions from "../../components/RecentTransactions";

const index = () => {
    

    
    return (
    <ScrollView>
      <View style={{ flex: 1 }}>
        <Header />
        <FinancialSummary/>
        <IncomeVsExpenses/>
        <MonthlyTrends/>
        <RecentTransactions/>
        
      </View>
      </ScrollView>
     
    );
}

export default index;