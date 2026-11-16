import { NativeStackNavigationProp, NativeStackNavigatorProps } from "@react-navigation/native-stack";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useUserProfile } from "../socket/useUserProfile";
import { useContext, useLayoutEffect } from "react";
import { AuthContext } from "../components/AuthProvider";
import { ThemeOption, useTheme } from "../theme/ThemeProvider";

type SettingsScreenProps = NativeStackNavigationProp<RootStack, "SettingsScreen">
const options: ThemeOption[] = ["light", "dark", "system"];

export default function SettingsScreen() {
    const navigation = useNavigation<SettingsScreenProps>();
    const userProfile = useUserProfile();
    const auth = useContext(AuthContext);
    const { preference, applied, setPreference } = useTheme();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Settings",
            headerStyle: { backgroundColor: `${applied === "dark" ? "black" : "white"}` }
        });
    }, [navigation, applied]);
    return (
        <SafeAreaView className="flex-1" edges={["left", "right", "bottom"]}>
            <View className="flex-1 mt-3 w-full p-5">
                <View className="justify-center items-center 
                flex-row gap-x-12 bg-gray-300 p-4 rounded-xl border border-gray-300">

                    <View className="bg-gray-200 w-22 h-22 rounded-lg p-2">
                        <Image
                            className="w-20 h-20 rounded-full"
                            source={{
                                uri: `${userProfile?.profileImage}?t=${userProfile?.updatedAt || Date.now()}`
                            }}
                        />

                    </View>
                    <View className="flex-col">
                        <Text className="font-medium text-2xl text-slate-600">{userProfile?.firstName} {userProfile?.lastName}</Text>
                        <Pressable onPress={() => navigation.navigate("ProfileScreen")}>
                            <Text className="mt-3 text-sm">View User Profile</Text>
                        </Pressable>
                    </View>
                </View>

                <View className="mt-10">
                    <Text className="font-semibold text-xl">Choose the app theme</Text>
                    <View className="flex-row space-x-3 gap-x-3">
                        {options.map((option) => (
                            <TouchableOpacity key={option}
                                className={`py-2 px-5 rounded-full mb-2 ${preference === option ? "bg-sky-500" : "border bg-transparent"}
                    ${applied === "dark" ? "border-gray-400" : "border-gray-700"}`}
                                onPress={() => setPreference(option)}
                            >
                                <Text className={`text-center font-bold ${applied === "dark" ? "text-slate-100" : "text-slate-800"}`}>
                                    {option.charAt(0).toUpperCase() + option.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

            </View>
            <View className="bottom-2 absolute w-full p-3">
                <TouchableOpacity className="justify-center items-center bg-slate-300 h-8 rounded-lg"
                    onPress={() => { if (auth) auth.signOut() }}
                >
                    <Text>Sign Out</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
} 