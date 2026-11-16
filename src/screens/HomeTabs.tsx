import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatsScreen from "./ChatsScreen";
import StatusScreen from "./StatusScreen";
import CallsScreen from "./CallScreen";
import { Ionicons } from "@expo/vector-icons";
import SettingsScreen from "./SettingScreen";


const Tabs = createBottomTabNavigator();
export default function HomeTabs(){
    return(
        <Tabs.Navigator screenOptions={({route})=>({
            tabBarIcon:({color})=>{
                let iconName = "chatbubble-ellipses";
                if(route.name === "Chats") iconName = "chatbubble-ellipses";
                else if(route.name === "Status") iconName="time";
                else if(route.name === "Calls") iconName="call";
                else if(route.name === "Settings") iconName="settings-sharp";
                return<Ionicons name={iconName as any} size={28} color={color}/>
            },
            tabBarLabelStyle:{fontSize:14,fontWeight:'600'},
            tabBarActiveTintColor:"#0088FF",
            tabBarInactiveTintColor:"#8E8E93",
            tabBarStyle:{
                height:100,
                backgroundColor:"#fff",
                paddingTop:8

            }
        })}>
            <Tabs.Screen name="Chats" component={ChatsScreen} options={{headerShown:false}}/>
            <Tabs.Screen name="Status" component={StatusScreen}/>
            <Tabs.Screen name="Calls" component={CallsScreen}/>
            <Tabs.Screen name="Settings" component={SettingsScreen}/>
        </Tabs.Navigator>
    );
}