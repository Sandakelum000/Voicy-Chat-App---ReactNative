import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image, KeyboardAvoidingView, Platform, Pressable, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FloatingLabelInput } from "react-native-floating-label-input";
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { useUserRegistration } from "../components/userContext";
import { validateFirstName, validateLastName } from "../util/Validation";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";

type SignUpScreenProps = NativeStackNavigationProp<RootStack, "SignUpScreen">

export default function SignUpScreen() {
    const navigation = useNavigation<SignUpScreenProps>();
    const { userData, setUserData } = useUserRegistration();

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 100}
            className="flex-1 bg-white"
        >
            <View className="h-full">
                <View className="bg-[#384358] h-1/3 rounded-b-3xl">
                    <View className="p-5 justify-start mt-14">
                        <Image source={require("../../assets/logo.png")} className="h-16 w-16 mb-4" />
                        <Text className="text-4xl font-semibold text-white">Welcome to Voicy !</Text>
                        <Text className="mt-3 text-white italic text-base">Start creating your account here...</Text>
                    </View>

                </View>
                <View className="bg-white h-2/3 w-full flex-col">
                    <View className="m-4 p-4">
                        <View className="my-3">
                            <Text className="font-bold text-lg mb-1">First Name :</Text>
                            <FloatingLabelInput
                                value={userData.firstName}
                                label={"Enter Your First Name"}
                                onChangeText={(text) => {
                                    setUserData((previous) => ({
                                        ...previous,
                                        firstName: text,
                                    }));
                                }}
                                containerStyles={{
                                    borderWidth: 1,
                                    paddingHorizontal: 10,
                                    backgroundColor: '#fff',
                                    borderColor: 'gray',
                                    borderRadius: 8,
                                    height: 60
                                }}
                            />
                        </View>

                        <View className="my-3">
                            <Text className="font-bold text-lg mb-1">Last Name :</Text>
                            <FloatingLabelInput
                                value={userData.lastName}
                                label={"Enter Your Last Name"}
                                onChangeText={(text) => {
                                    setUserData((previous) => ({
                                        ...previous,
                                        lastName: text,
                                    }));
                                }}
                                containerStyles={{
                                    borderWidth: 1,
                                    paddingHorizontal: 10,
                                    backgroundColor: '#fff',
                                    borderColor: 'gray',
                                    borderRadius: 8,
                                    height: 60
                                }}
                            />
                        </View>

                        <View className="mt-20 w-full">
                            <Pressable className="justify-center items-center bg-[#4DA8DA] h-12 rounded-2xl shadow-sm"
                                onPress={() => {
                                    let ValidFirstName = validateFirstName(userData.firstName);
                                    let ValidLastName = validateLastName(userData.lastName);

                                    if (ValidFirstName) {
                                        Toast.show({
                                            type: ALERT_TYPE.WARNING,
                                            title: "warning",
                                            textBody: ValidFirstName,
                                        });
                                    } else if (ValidLastName) {
                                        Toast.show({
                                            type: ALERT_TYPE.WARNING,
                                            title: "warning",
                                            textBody: ValidLastName,
                                        });
                                    } else {
                                        navigation.navigate("ContactScreen");
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
                
            </View>
            <View className="absolute bottom-16 justify-center items-center w-full">
                    <TouchableOpacity
                        onPress={() => navigation.navigate("SignInScreen")}
                    >
                        <Text className="font-semibold">Already have an account ?
                            <Text className="font-extrabold underline"> Log In </Text>
                            here</Text>
                    </TouchableOpacity>
                </View>
        </KeyboardAvoidingView>

    );
}

