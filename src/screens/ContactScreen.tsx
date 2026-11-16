import "../../global.css"
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, StatusBar, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import CountryPicker, { Country, CountryCode } from "react-native-country-picker-modal";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useUserRegistration } from "../components/userContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, Feather } from "@expo/vector-icons";
import { validateCountryCode, validatePhoneNo } from "../util/Validation";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";

type ContactScreenProps = NativeStackNavigationProp<RootStack, "ContactScreen">

export default function ContactScreen() { 
    const navigation = useNavigation<ContactScreenProps>();
    const [countryCode, setCountryCode] = useState<CountryCode>("LK");
    const [country, setCountry] = useState<Country | null>(null);
    const [show, setShow] = useState<boolean>(false);

    const { userData, setUserData } = useUserRegistration();
    const [callingCode, setCallingCode] = useState("+94");
    const [phoneNo, setPhoneNo] = useState("");
    return (
        <SafeAreaView className="flex-1 items-center" edges={["bottom", "right", "left"]}>
            <StatusBar hidden={true} />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 100}
                className="flex-1 dark:bg-slate-950"
            >
                <TouchableWithoutFeedback className="h-full" onPress={Keyboard.dismiss}>
                    <View className="m-3 mt-10 p-5">
                        <View className="justify-center items-center">
                            <Image source={require("../../assets/logo.png")} className="h-16 w-16 mb-4" />
                            <View className="p-2 bg-slate-200 rounded-md border border-gray-300">
                                <Text className="text-xs text-center text-slate-600">Voicy uses advanced
                                    <Text className="font-bold"> end-to-end encryption </Text>
                                    to ensure that every conversation remains private.
                                    Chat with confidence knowing your data is protected.
                                </Text>
                            </View> 

                            <Text className="mt-6 text-2xl font-bold text-sky-800">Verify your number here.</Text>
                            <View className="mt-5">
                                <View className="border-b-2 border-b-cyan-500 justify-center items-center flex-row h-14 mb-3">
                                    <CountryPicker
                                        countryCode={countryCode}
                                        withFilter
                                        withFlag
                                        withCountryNameButton
                                        withCallingCode
                                        visible={show}
                                        onClose={() => { setShow(false) }}
                                        onSelect={(c) => {
                                            setCountryCode(c.cca2);
                                            setCountry(c);
                                            setShow(false);
                                        }}
                                    />
                                    <AntDesign name="caret-down" size={18} style={{ marginTop: 5 }} color="black" />
                                </View>
                                <View className="mt-2  flex flex-row justify-center gap-1 w-full">
                                    <TextInput inputMode="tel"
                                        className="h-16 font-bold text-lg border border-gray-400 rounded-md w-1/6 text-center"
                                        placeholder="+94"
                                        editable={false}
                                        value={country ? `+${country.callingCode}` : callingCode}
                                        onChangeText={(text) => {
                                            setCallingCode(text);
                                        }}
                                    />
                                    <TextInput inputMode="tel"
                                        className="h-16 font-bold text-lg border border-gray-400 rounded-md w-5/6 text-start px-3"
                                        placeholder="## #### ###"
                                        value={phoneNo}
                                        onChangeText={(text) => {
                                            setPhoneNo(text);
                                        }}
                                    />
                                </View>
                                <Text className="border-b-2 border-b-cyan-500"></Text>
                            </View>

                            <View className="mt-20 w-full">
                                <Pressable className="justify-center items-center bg-[#4DA8DA] h-12 rounded-2xl shadow-sm" 
                                onPress={()=>{
                                    const validCountryCode = validateCountryCode(callingCode);
                                    const validPhoneNumber = validatePhoneNo(phoneNo);

                                    if (validCountryCode) {
                                        Toast.show({
                                            type:ALERT_TYPE.WARNING,
                                            title:"warning",
                                            textBody:validCountryCode,
                                        });
                                    }else if (validPhoneNumber) {
                                        Toast.show({
                                            type:ALERT_TYPE.WARNING,
                                            title:"warning",
                                            textBody:validPhoneNumber,
                                        });
                                    }else{
                                        setUserData((previous)=>({
                                            ...previous,
                                            countryCode:country?`+${country.callingCode}`:callingCode,
                                            contactNo:phoneNo,
                                        }));
                                        navigation.replace("PasswordScreen");
                                    }
                                }}
                                >
                                    <View className="flex-row items-center gap-x-3">
                                        <Text className="text-white font-bold text-2xl">Next</Text>
                                        <Feather name="arrow-right-circle" size={24} color="white" />
                                    </View>
                                </Pressable>
                            </View>

                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}