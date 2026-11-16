import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ActivityIndicator, Image, Pressable, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { RootStack } from "../../App";
import { FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useState } from "react";
import { useUserRegistration } from "../components/userContext";
import * as ImagePicker from 'expo-image-picker';
import { Feather } from "@expo/vector-icons";
import { validateProfileImage } from "../util/Validation";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { createNewAccount } from "../api/UserService";
import { AuthContext } from "../components/AuthProvider";

type AvatarScreenProps = NativeStackNavigationProp<RootStack, "AvatarScreen">
export default function AvatarScreen() {
    const navigation = useNavigation<AvatarScreenProps>();
    const [loading, setLoading] = useState(false);

    const [image, setImage] = useState<string | null>(null);
    const { userData, setUserData } = useUserRegistration();

    const avatars = [
        require("../../assets/avatar/avatar_1.png"),
        require("../../assets/avatar/avatar_2.png"),
        require("../../assets/avatar/avatar_3.png"),
        require("../../assets/avatar/avatar_4.png"),
        require("../../assets/avatar/avatar_5.png"),
        require("../../assets/avatar/avatar_6.png"),
        require("../../assets/avatar/avatar_7.png"),
    ];
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });
        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setImage(uri);
            setUserData((previous) => ({
                ...previous,
                profileImage: uri,
            }));
        }
    };
    const auth = useContext(AuthContext);
    return (
        <SafeAreaView className="bg-white flex-1" edges={["bottom", "left", "right"]}>
            <StatusBar hidden={false} />
            <View className="flex-1 items-center m-3 p-5">
                <View className="mt-3">
                    <Image source={require("../../assets/logo.png")} className="w-16 h-16" />
                </View>
                <View className="items-center mt-3">
                    <Text className="font-bold text-2xl text-slate-700">Choose a Your Profile Image</Text>
                </View>
                <View className="items-center mt-10 h-72">
                    <Pressable className="h-[220] w-[220] rounded-full bg-gray-100 justify-center 
                    items-center border-2 border-gray-400 border-dashed"
                        onPress={pickImage}
                    >
                        {image ? (<Image source={{ uri: image }} className="h-[221] w-[221] rounded-full border border-gray-300" />) : (
                            <View className="items-center">
                                <Text className="text-4xl text-gray-400">+</Text>
                                <Text className="text-2xl font-bold text-gray-400">click here</Text>
                            </View>
                        )}
                    </Pressable>
                    <Text className="text-lg mt-3 text-slate-600">Or select an Avatar</Text>

                </View>
                <View className="mt-4 h-24 w-96 p-3 bg-gray-50 border border-slate-300 rounded-xl">
                    <FlatList
                        data={avatars}
                        horizontal
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => {
                                    setImage(Image.resolveAssetSource(item).uri)
                                    setUserData((previous) => ({
                                        ...previous,
                                        profileImage: Image.resolveAssetSource(item).uri,
                                    }));
                                }}
                            >
                                <Image source={item} className="h-16 w-16 rounded-full mx-2 border-2 border-gray-200" />
                            </TouchableOpacity>
                        )}
                        contentContainerStyle={{ paddingHorizontal: 10 }}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
                <View className="mt-20 w-full">
                    <Pressable className="justify-center items-center bg-[#4DA8DA] h-12 rounded-2xl shadow-sm"
                        onPress={async () => {
                            const validProfile = validateProfileImage(
                                userData.profileImage
                                    ? { uri: userData.profileImage, type: "", fileSize: 0 }
                                    : null);

                            if (validProfile) {
                                Toast.show({
                                    type: ALERT_TYPE.WARNING,
                                    title: "Warning",
                                    textBody: validProfile
                                });
                            } else {
                                try {
                                    setLoading(true);
                                    const response = await createNewAccount(userData);
                                    console.log(response);

                                    if (response.status) {
                                        const id = response.userId;
                                        if (auth) {
                                            await auth.signUp(String(id));
                                        }
                                    } else {
                                        Toast.show({
                                            type: ALERT_TYPE.WARNING,
                                            title: "warning",
                                            textBody: response.messsage,
                                        });
                                    }
                                } catch (error) {
                                    console.log(error);
                                } finally {
                                    setLoading(false);
                                }
                            }
                        }}
                    >
                        {loading ? (<ActivityIndicator size={'large'} color="#0ea5e9" />) : (
                            <View className="flex-row items-center gap-x-3">
                                <Text className="text-white font-bold text-2xl">Create Contact</Text>
                                <Feather name="arrow-right-circle" size={24} color="white" />
                            </View>
                        )}

                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
}