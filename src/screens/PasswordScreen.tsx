import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, Text, TouchableWithoutFeedback, View } from "react-native";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useUserRegistration } from "../components/userContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import { FloatingLabelInput } from "react-native-floating-label-input";
import { Feather } from "@expo/vector-icons";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { validatePassword } from "../util/Validation";

type PasswordScreenProps = NativeStackNavigationProp<RootStack, "PasswordScreen">

export default function PasswordScreen() {
    const navigation = useNavigation<PasswordScreenProps>();
    const [password, setPassword] = useState("");
    const { userData, setUserData } = useUserRegistration();
    return (
        <SafeAreaView className="flex-1 items-center" edges={["bottom", "right", "left"]}>
            <StatusBar hidden={true} />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}

            >
            </KeyboardAvoidingView>
            <TouchableWithoutFeedback className="h-full" onPress={Keyboard.dismiss}>
                <View className="m-3 mt-10 p-5">
                    <View className="justify-center items-center">
                        <Image source={require("../../assets/logo.png")} className="h-16 w-16 mb-4" />
                        <View className="p-2 bg-slate-200 rounded-md border border-gray-300">
                            <Text className="text-xs text-center text-slate-600">
                                Adding a strong password will help you make your account safe and private,
                                ensuring only you can access your chats and personal information.
                            </Text>
                        </View>
                        <Text className="mt-6 text-2xl font-bold text-sky-800">Setup a password here.</Text>
                        <View className="mt-5">
                            <View className="justify-center items-center flex-row h-24 mb-3">
                                <FloatingLabelInput label="Enter your password" className="h-16" inputMode="text" value={password} onChangeText={(text) => setPassword(text)}
                                    containerStyles={{
                                        borderWidth: 1,
                                        borderColor: "#9AA6B2",
                                        borderRadius: 10,
                                        paddingHorizontal: 10,
                                        backgroundColor: "#fff",
                                    }}
                                    inputStyles={{
                                        color: "black",
                                        fontSize: 16,
                                    }}
                                    customLabelStyles={{
                                        colorFocused: "#758694",
                                        colorBlurred: "#9CA3AF",
                                    }}
                                />
                            </View>

                        </View>
                                    
                        <View className="mt-20 w-full">
                            <Pressable className="justify-center items-center bg-[#4DA8DA] h-12 rounded-2xl shadow-sm"
                                onPress={() => {
                                    const validPassword = validatePassword(password);
                                    if (validPassword) {
                                        Toast.show({
                                            type: ALERT_TYPE.WARNING,
                                            title: "warning",
                                            textBody: validPassword,
                                        });
                                    } else {
                                        setUserData((previous) => ({
                                            ...previous,
                                            password: password,
                                        }));
                                        navigation.replace("AvatarScreen");
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
        </SafeAreaView>


    );

}