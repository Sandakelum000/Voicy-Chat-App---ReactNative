import { Image, KeyboardAvoidingView, Platform, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CountryPicker, { Country, CountryCode } from "react-native-country-picker-modal";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useContext, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { validateCountryCode, validatePhoneNo } from "../util/Validation";
import { userSignIn } from "../api/UserService";
import { AuthContext } from "../components/AuthProvider";
import { useNavigation } from "@react-navigation/native";

type SignInScreenProps = NativeStackNavigationProp<RootStack, "SignInScreen">
export default function SignInScreen() {
    const navigation = useNavigation<SignInScreenProps>();

    const [countryCode, setCountryCode] = useState<CountryCode>("LK");
    const [country, setCountry] = useState<Country | null>(null);
    const [callingCode, setCallingCode] = useState("+94");
    const [phoneNo, setPhoneNo] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState<boolean>(false);

    const auth = useContext(AuthContext);
    return (
        <SafeAreaView className="flex-1 items-center" edges={["bottom", "right", "left"]}>
            <StatusBar hidden={true} />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
                className="flex-1"
            >
                <View className="m-3 p-2">
                    <View className="items-center mt-10">
                        <Image source={require("../../assets/logo.png")} className="w-16 h-16" />
                        <Text className="mt-8 font-semibold text-2xl">Sign In here</Text>


                        <View className="mt-5">
                            <View className="">
                                <View className="justify-center items-center flex-row h-8 mb-3">
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
                                <View className="mt-4">
                                    <TextInput placeholder="Enter your password" className="h-16 font-bold text-lg border 
                                    border-gray-400 rounded-md text-start px-3" value={password} onChangeText={setPassword}/>
                                </View>

                                <TouchableOpacity className="justify-center items-center mt-10 bg-sky-500 h-10 
                                rounded-lg"
                                onPress={async ()=>{
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
                                    }else if (!password.trim()) {
                                        Toast.show({
                                            type: ALERT_TYPE.WARNING,
                                            title: "warning",
                                            textBody: "Enter your password",
                                        });
                                    }else{
                                        const responseJSON = await userSignIn(callingCode, phoneNo, password);
                                        if (responseJSON.status) {
                                            const userId = responseJSON.userId
                                            if (auth) {
                                                await auth.signUp(String(userId));
                                                //navigation.replace("HomeScreen");
                                            }
                                        }else{
                                            Toast.show({
                                                type:ALERT_TYPE.DANGER,
                                                title:"",
                                                textBody: "Login failed.",
                                            });
                                        }
                                    }
                                }}
                                >
                                    <Text className="text-white font-bold text-lg">Log In</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}