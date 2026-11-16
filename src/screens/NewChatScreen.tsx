import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlatList, Image, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect, useState } from "react";
import { useUserList } from "../socket/UseUserList";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { User } from "../socket/chat";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native";
import { AlertNotificationRoot } from "react-native-alert-notification";

type NewChatScreenProps = NativeStackNavigationProp<RootStack, "NewChatScreen">
export default function NewChatScreen() {
    const navigation = useNavigation<NewChatScreenProps>();
    const [search, setSearch] = useState("");
    const users = useUserList();

    const renderItem = ({ item }: { item: User }) => (
        <TouchableOpacity className="justify-start items-center gap-x-3 px-3 py-2 flex-row bg-gray-100 mt-1"
            onPress={() => {
                navigation.replace("SingleChatScreen", {
                    chatId: item.id,
                    friendName: `${item.firstName} ${item.lastName}`,
                    lastSeenTime: item.updatedAt,
                    profileImage: item.profileImage ? item.profileImage : `https://ui-avatars.com/api/?name=${item.firstName}+${item.lastName}&background=random`,
                });
            }}
        >
            <View>
                <TouchableOpacity className="h-14 w-14 rounded-full border-1 border-gray-300 justify-center items-center bg-gray-300">
                    {item.profileImage ? (<Image source={{ uri: item.profileImage }} className="h-14 w-14 rounded-full" />) : (
                        <Image source={{ uri: `https://ui-avatars.com/api/?name=${item.firstName}+${item.lastName}&background=random` }} className="h-14 w-14 rounded-full" />
                    )}
                </TouchableOpacity>

            </View>
            <View className="flex-col gap-y-1">
                <Text className="font-bold text-xl">{item.firstName} {item.lastName}</Text>
                <Text className="text-md italic">{item.status === "ACTIVE" ? "Already in friend list; Message Now" :
                    "Hello there! I'm using ChatApp"}</Text>
            </View>

        </TouchableOpacity>);

    const filteredUsers = [...users].filter((user) => {
        return (
            user.firstName.toLowerCase().includes(search.toLowerCase()) ||
            user.lastName.toLowerCase().includes(search.toLowerCase()) ||
            user.contactNo.includes(search)
        );
    }).sort((a, b) =>
        a.firstName.localeCompare(b.firstName)
    );
    return (
        <AlertNotificationRoot>
            <View className="flex-1 bg-white rounded-t-3xl mt-auto p-2">
                <View className="items-center flex-row gap-x-2">
                    <TouchableOpacity className="justify-center items-center" onPress={() => { navigation.goBack() }}>
                        <Ionicons name="arrow-back-sharp" size={24} color="black" />
                    </TouchableOpacity>
                    <View className="flex-col">
                        <Text className="text-lg font-bold">Select Contact</Text>
                        <Text className="text-sm font-bold">{users.length} Contacts</Text>
                    </View>
                </View>

                <View className=" items-center flex-row my-2 mx-2 border-gray-300 bg-gray-200 rounded-full px-3 h-14 mt-5">
                    <Ionicons name="search" size={18} className={"gray"} />
                    <TextInput className="flex-1 text-lg font-bold ps-2" placeholder="Search"
                        value={search}
                        onChangeText={(text) => setSearch(text)}
                    />
                </View>
                <View className="px-2 my-2 bottom-b-2 py-1 bg-gray-200 rounded-lg m-1 border border-gray-300">
                    <TouchableOpacity className="justify-start flex-row gap-x-3 items-center h-16 border-b-2 border-gray-100"
                        onPress={() => navigation.navigate("NewContactScreen")}
                    >
                        <View className="flex-row w-full items-center justify-start gap-x-5">
                            <View className="bg-[#0088FF] w-12 h-12 items-center justify-center rounded-full">
                                <Feather name="user-plus" size={18} color={"white"} />
                            </View>
                            <Text className="text-lg font-bold">New Contact</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity className="justify-start flex-row gap-x-3 items-center h-14 border-b-2 border-gray-100"
                        onPress={() => { }}
                    >
                        <View className="flex-row w-full items-center justify-start gap-x-5">
                            <View className="bg-[#0088FF] w-12 h-12 items-center justify-center rounded-full">
                                <AntDesign name="usergroup-add" size={20} color="white" />
                            </View>
                            <Text className="text-lg font-bold">New Group</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View className="mt-2">
                    <FlatList data={filteredUsers} renderItem={renderItem} keyExtractor={(_, index) => index.toString()} />
                </View>
            </View>
        </AlertNotificationRoot>
    );
}