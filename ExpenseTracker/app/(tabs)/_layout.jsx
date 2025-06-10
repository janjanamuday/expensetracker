import { Tabs } from "expo-router"
const tablayout = () => {
    return(
    <Tabs>
        <Tabs.Screen name = "index"  options={{headerShown : false}}></Tabs.Screen>
        <Tabs.Screen name = "Forms"  options={{headerShown : false}}></Tabs.Screen>
    </Tabs>
    )
}

export default tablayout;