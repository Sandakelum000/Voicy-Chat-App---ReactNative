import { useWebSocket } from "./WebSocketProvider";
import * as FileSystem from "expo-file-system/legacy"; 

export function UseSendImage() {
    const { sendMessage } = useWebSocket();

    const sendImage = async (toUserId: number, message?: string, imageUri?: string|null) => {
        if (imageUri) {
            try {
                const base64 = await FileSystem.readAsStringAsync(imageUri, {
                    encoding: "base64" 
                });

                sendMessage({
                    type: "send_image",
                    toUserId,
                    message: message || "",
                    image: `data:image/jpeg;base64,${base64}`
                });
            } catch (error) {
                console.error("Error reading image file:", error);
            }
        } 
    };

    return sendImage;
}
