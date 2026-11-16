import { Animated,Image, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css"
import CircleShape from "../components/CircleShape";
import { useEffect, useRef } from "react";
//import Animated,{ useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useWebSocketPing } from "../socket/UseWebSocketPing";

type SignUpScreenProps = NativeStackNavigationProp<RootStack, "SplashScreen">;

export default function SplashScreen() {
  const navigation = useNavigation<SignUpScreenProps>();
  useWebSocketPing(60000);
const fadeIn = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.timing(fadeIn, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
        }).start(()=>{
             //navigation.replace("SignUpScreen");
        });
       
    }, [fadeIn]);
    return (
        <SafeAreaView className="flex-1 items-center justify-center">
            <StatusBar hidden={true} />
            <CircleShape width={220} height={280} fillColor="#BBFBFF" borderRadius={12} bottomValue={-5} leftValue={-30} />
            <CircleShape width={200} height={220} fillColor="#8DD8FF" borderRadius={12} bottomValue={-10} leftValue={-45} />
            <CircleShape width={200} height={200} fillColor="#4E71FF" borderRadius={12} bottomValue={-32} leftValue={-82} />


            <CircleShape width={220} height={280} fillColor="#4E71FF" borderRadius={12} topValue={-120} rightValue={-70} />
            <CircleShape width={200} height={220} fillColor="#8DD8FF" borderRadius={12} topValue={-90} rightValue={-85} />
            <CircleShape width={200} height={200} fillColor="#BBFBFF" borderRadius={12} topValue={-102} rightValue={-112} />
            
            <Animated.View style={{ opacity: fadeIn }}>
                <Image source={require("../../assets/logo.png")} style={{ height: 150, width: 150 }} />
            </Animated.View>


            <Animated.View className=" absolute bottom-10" style={{ opacity: fadeIn }}>
            <View className="absolute bottom-0 mb-10 flex-1 flex-col justify-center items-center">
                <Text className="text-xs font-bold text-gray-500">POWERED BY: {process.env.EXPO_PUBLIC_APP_OWNER}</Text>
                <Text className="text-xs font-extralight text-gray-500">VERSION: {process.env.EXPO_PUBLIC_APP_VERSION}</Text>

            </View>
            </Animated.View>
            
        </SafeAreaView>
    );
}

 