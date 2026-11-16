import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useContext, useLayoutEffect, useState } from "react";
import { useChatList } from "../socket/UseChatList";
import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Chat } from "../socket/chat";
import { formatChatTime } from "../util/DateFormatter";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { TextInput } from "react-native";
import { AuthContext } from "../components/AuthProvider";

type HomeScreenProps = NativeStackNavigationProp<RootStack, "HomeScreen">
export default function HomeScreen() {
    const navigation = useNavigation<HomeScreenProps>();
    const [search, setSearch] = useState("");

    const chatList = useChatList();
    const [isModalVisible, setModalVisible] = useState(false);
    const auth = useContext(AuthContext);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Voicy",
            headerTitleStyle: { fontWeight: 'bold', fontSize: 24 },
            headerRight: () => (
                <View className="flex-row space-x-4">
                    <TouchableOpacity className="me-4">
                        <Ionicons name="camera" size={26} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setModalVisible(true)} >
                        <Entypo name="circle-with-plus" size={28} color="#0088FF" />
                    </TouchableOpacity>
                </View>
            ),
            headerLeft: () => (
                <View className="flex-row space-x-4">
                    <TouchableOpacity className="me-5 mt-2">
                        <Ionicons name="ellipsis-horizontal-circle" size={28} color="black" />
                    </TouchableOpacity>
                </View>
            )


        });
    }, [navigation, isModalVisible]);

    const filteredChats = [...chatList].filter((chat) => {
        return (
            chat.friendName.toLowerCase().includes(search.toLowerCase()) ||
            chat.lastMessage.toLowerCase().includes(search.toLowerCase())
        );
    }).sort((a, b) => new Date(b.lastTimeStamp).getTime() - new Date(a.lastTimeStamp).getTime());

    const renderItem = ({ item }: { item: Chat }) => (
        <TouchableOpacity className="flex-row items-center py-1 px-3"
            onPress={() => {
                navigation.navigate("SingleChatScreen", {
                    chatId: item.friendId,
                    friendName: item.friendName, 
                    lastSeenTime: formatChatTime(item.lastTimeStamp),
                    profileImage: item.profileImage ? item.profileImage : `https://ui-avatars.com/api/?name=${item.friendName.replace(" ", "+")}&background=random`,
                });
            }}
        >
            <TouchableOpacity className="h-16 w-16 rounded-full border-1 border-gray-300 justify-center items-center bg-gray-300">
                {item.profileImage ? (<Image source={{ uri: item.profileImage }} className="h-14 w-14 rounded-full" />) : (

                    <Image source={{ uri: `https://ui-avatars.com/api/?name=${item.friendName.replace(" ", "+")}&background=random` }} className="h-14 w-14 rounded-full" />
                )}
            </TouchableOpacity>

            <View className="flex-1 ms-3 border-b border-gray-200 py-4">
                <View className="flex-row justify-between">
                    <Text className="font-bold text-xl text-slate-700" numberOfLines={1} ellipsizeMode="tail">{item.friendName}</Text>
                    <Text className="font-bold text-xs text-slate-500">{formatChatTime(item.lastTimeStamp)}</Text>

                </View>
                <View className="flex-row justify-between items-center">
                    <Text className="text-gray-500 flex-1 font-base" numberOfLines={1} ellipsizeMode="tail">{item.lastMessage}</Text>
                    {item.unreadCount > 0 && (
                        <View className="bg-green-500 rounded-full px-2 py-2 ms-2">
                            <Text className="text-slate-50 text-xs font-bold">{item.unreadCount}</Text>
                        </View>
                    )} 
                </View>
            </View>
            
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1" edges={["left", "right", "bottom"]}>
            <StatusBar hidden={false} />
            
            <View className=" items-center flex-row my-2 mx-2 border-gray-300 bg-gray-200 rounded-full px-3 h-14 mt-5">
                <Ionicons name="search" size={18} className={"gray"} />
                <TextInput className="flex-1 text-lg font-bold ps-2" placeholder="Search" placeholderTextColor={"#636366"}
                    value={search}
                    onChangeText={(text) => setSearch(text)}
                />
            </View> 

            <View className="mt-1">
                <FlatList data={filteredChats} renderItem={(renderItem)} contentContainerStyle={{ paddingBottom: 100 }}/>
            </View>
            <View className="absolute bg-[#A0DEFF] bottom-16 right-12 h-20 w-20 rounded-3xl">
                <TouchableOpacity className="h-20 w-20 rounded-3xl justify-center items-center" onPress={() => {navigation.navigate("NewChatScreen")}}>
                    <MaterialIcons name="message" size={24} color="black" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}