import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useContext, useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { uploadProfileImage } from "../api/UserService";
import { useUserProfile } from "../socket/useUserProfile";
import { formatChatTime } from "../util/DateFormatter";
import { AuthContext } from "../components/AuthProvider";

type ProfileScreenProp = NativeStackNavigationProp<RootStack, "ProfileScreen">
export default function ProfileScreen() {
    const navigation = useNavigation<ProfileScreenProp>();
    const userProfile = useUserProfile();
    const [image, setImage] = useState<string | null>(null);
    const auth = useContext(AuthContext);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync(
            {
                mediaTypes: ["images"],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1
            }
        );

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setImage(uri);
            uploadProfileImage(String(auth ? auth.userId : 0), uri);
        }
    };
    return (
        <SafeAreaView className="flex-1" edges={["left", "right",]}>
            <View className="w-full h-full">
                <View className="bg-white h-1/6 rounded-b-3xl">

                </View>
                <View className="bg-[#384358] h-5/6 rounded-t-2xl">
                    <View className="absolute top-[-12%] left-1/2" style={{ transform: [{ translateX: -80 }] }}>
                        <Image
                            className="w-40 h-40 rounded-full border-4 border-white"
                            source={{
                                uri: image
                                    ? image
                                    : `${userProfile?.profileImage}?t=${userProfile?.updatedAt || Date.now()}`
                            }}
                        />

                    </View>
                    <View className="w-full justify-center items-center mt-24">
                        <TouchableOpacity
                            onPress={pickImage}
                        >
                            <Text className="text-white text-xl font-semibold">Edit Profile</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="flex-col justify-center items-start gap-x-2 mt-4 h-24 m-3 p-3 bg-gray-400 rounded-lg border border-gray-100">
                        <View className="flex-row items-center">
                            <Text className="text-blue-950 font-semibold text-xl">First Name :</Text>
                            <Text className="text-white text-base mx-5">{userProfile?.firstName}</Text>
                        </View>
                        <View className="flex-row mt-4 items-center">
                            <Text className="text-blue-950 font-semibold text-xl">Last Name :</Text>
                            <Text className="text-white text-base mx-5">{userProfile?.lastName}</Text>
                        </View>
                    </View>
                    <View className="flex-col justify-center items-start gap-x-2 mt-4 h-14 m-3 p-3 bg-gray-400 rounded-lg border border-gray-100">
                        <View className="flex-row items-center">
                            <Text className="text-blue-950 font-semibold text-xl">Phone Number :</Text>
                            <Text className="text-white text-base mx-5">{userProfile?.countryCode} {userProfile?.contactNo}</Text>
                        </View>
                    </View>
                    <View className="flex-col justify-center items-start gap-x-2 mt-4 h-14 m-3 p-3 bg-gray-400 rounded-lg border border-gray-100">
                        <View className="flex-row items-center">
                            <Text className="text-blue-950 font-semibold text-xl">Registered at :</Text>
                            <Text className="text-white text-base mx-5">{userProfile?.createdAt ? formatChatTime(userProfile.createdAt) : ""}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}