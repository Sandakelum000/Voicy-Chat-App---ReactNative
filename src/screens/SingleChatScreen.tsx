import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlatList, Image, Platform, Pressable, StatusBar, Text, View } from "react-native";
import { RootStack } from "../../App";
import { useSingleChat } from "../socket/UseSingleChat";
import { UseSendChat } from "../socket/UseSendChat";
import { useEffect, useLayoutEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { formatChatTime } from "../util/DateFormatter";
import { Chat } from "../socket/chat";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView } from "react-native";
import { TextInput } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { UseSendImage } from "../socket/UseSendImage";

type SingleChatScreenProps = NativeStackScreenProps<RootStack, "SingleChatScreen">;
export default function SingleChatScreen({ route, navigation }: SingleChatScreenProps) {

    const { chatId, friendName, lastSeenTime, profileImage } = route.params;
    const singleChat = useSingleChat(chatId);
    const messages = singleChat.messages;
    const friend = singleChat.friend;

    const [image, setImage] = useState<string | null>(null);
    const sendMessage = UseSendChat();
    const [input, setInput] = useState("");

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "",
            headerLeft: () => (
                <View className="flex-row items-center gap-4">
                    <TouchableOpacity className="justify-center items-center" onPress={() => { navigation.goBack() }}>
                        <Ionicons name="chevron-back-outline" size={24} color="black" />
                    </TouchableOpacity>

                    <TouchableOpacity className="h-12 w-12 rounded-full border-1 border-gray-300 justify-center items-center bg-gray-300">
                        <Image source={{ uri: profileImage }} className="h-12 w-12 rounded-full" />
                    </TouchableOpacity>

                    <View className="space-y-4">
                        <Text className="font-bold text-xl">{friend ? `${friend.firstName} ${friend.lastName}` : friendName}</Text>
                        <Text className="text-sm">{friend?.status === "ONLINE" ? "Online" : friend?.updatedAt ? `last seen ` + formatChatTime(friend.updatedAt) : ""}</Text>
                    </View>
                </View>
            ),
            headerRight: () => (
                <TouchableOpacity>
                    <Ionicons name="ellipsis-vertical" size={24} color={"black"} />
                </TouchableOpacity>
            ),
        });
    }, [navigation, friend]);

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
        }
    };

    const renderItem = ({ item }: { item: Chat }) => {
        const isMe = item.from.id !== chatId;

        return (
            <View className={`my-1 px-3 py-3 rounded-2xl max-w-[75%] 
            ${isMe ? `self-end bg-[#A0DEFF] rounded-tl-xl rounded-bl-xl rounded-br-xl` :
                    `self-start rounded-tr-xl rounded-br-xl bg-gray-700`

                }`}>
                {item.message === "IMAGE" && item.files ? (
                    <Image
                        source={{ uri: `${process.env.EXPO_PUBLIC_APP_URL}/VoicyApp/${item.files}` }}
                        className="w-48 h-48 rounded-xl"
                        resizeMode="cover"
                    />
                ) :
                    (<Text className={`${isMe ? 'text-black text-base' : 'text-white text-base'}`}>{item.message}</Text>)}

                <View className="flex-row justify-end items-center mt-1">
                    
                    <Text className={`${isMe ?`text-gray-500 `:`text-gray-200`} italic text-xs me-4`}>{formatChatTime(item.createdAt)}</Text>
                    {isMe && (<Ionicons name={
                        item.status === "READ"
                            ? "checkmark-done"
                            : item.status === "DELIVERED"
                                ? "checkmark-done" : "checkmark"}

                        size={16}
                        color={item.status === "READ" ? "#63C8FF" : "#fff"}
                    />)}
                </View>
            </View>
        );
    };

    const handleSendChat = () => {
        if (!input.trim() && !image) {
            return;
        };
        sendMessage(chatId, input, image);
        setInput("");
        setImage(null);
    };

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['right', 'bottom', 'left']}>
            <StatusBar hidden={false} />
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}

                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
                className="flex-1">
                <FlatList data={messages}
                    renderItem={renderItem}
                    className="px-3 flex-1"
                    inverted
                    contentContainerStyle={{ paddingBottom: 60 }}
                    keyExtractor={(_, index) => index.toString()} />

                <View className="flex-row p-2 bg-white justify-center items-center">
                    <Pressable onPress={pickImage}>
                        <Feather name="plus" size={24} color="black" />
                    </Pressable>
                    <TextInput value={input} onChangeText={(text) => setInput(text)} multiline placeholder="Type a message"
                        className="flex-1 min-h-14 max-h-32 h-auto px-5 py-2 bg-gray-200 rounded-3xl text-base"
                    />
                    <TouchableOpacity className="bg-sky-500 h-14 w-14 items-center justify-center rounded-full" onPress={handleSendChat}>
                        <Ionicons name="send" size={24} color="white" />
                    </TouchableOpacity>
                </View>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
} 