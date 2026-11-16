import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image, Pressable, Text, View } from "react-native";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import CountryPicker, { Country, CountryCode, } from "react-native-country-picker-modal";
import { useState } from "react";
import { useSendNewContact } from "../socket/useSendNewContact";
import { AntDesign, Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { FloatingLabelInput } from "react-native-floating-label-input";
import { validateCountryCode, validateFirstName, validateLastName, validatePhoneNo } from "../util/Validation";
import { ALERT_TYPE, AlertNotificationRoot, Toast } from "react-native-alert-notification";

type NewContactScreenProps = NativeStackNavigationProp<RootStack, "NewContactScreen">
export default function NewContactScreen() {
    const navigation = useNavigation();

    const [countryCode, setCountryCode] = useState<CountryCode>("LK");
    const [country, setCountry] = useState<Country | null>(null);
    const [show, setShow] = useState<boolean>(false);
    const [callingCode, setCallingCode] = useState("+94");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNo, setPhoneNo] = useState("");

    const newContact = useSendNewContact();
    const sendNewContact = newContact.sendNewContact;
    const responseText = newContact.responseText;

    const sendData = () => {
        sendNewContact({
            id: 0,
            firstName: firstName,
            lastName: lastName,
            countryCode: callingCode,
            contactNo: phoneNo,
            createdAt: "",
            updatedAt: "",
            status: "",
            password: "",
        });
        setFirstName("");
        setLastName("");
        setCallingCode("+94");
        setPhoneNo("");
    }
    return (
        <AlertNotificationRoot>
        <View className="flex-1 bg-white rounded-t-3xl mt-auto p-1">
            <View className="flex-1 px-5">
                <View className="justify-center items-center mt-3 mb-4">
                    <Image source={require("../../assets/logo.png")} className="w-12 h-12" />
                    <Text className="font-semibold text-2xl text-slate-600">New Contact</Text>
                </View>

                <View className="bg-gray-300 p-3 rounded-lg border border-gray-400">
                    <View className="flex-row items-center gap-x-2 h-14">
                        <MaterialCommunityIcons name="account-edit" size={26} color="black" />
                        <View className="flex-1 h-14">
                            <FloatingLabelInput
                                label="First Name"
                                value={firstName}
                                onChangeText={(text) => setFirstName(text)}
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
                    <View className="flex-row items-center gap-x-2 mt-2 h-14">
                        <MaterialCommunityIcons name="account-edit" size={26} color="black" />
                        <View className="flex-1 h-14">
                            <FloatingLabelInput
                                label="Last Name"
                                value={lastName}
                                onChangeText={(text) => setLastName(text)}
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
                </View>

                <View className="bg-gray-300 rounded-lg border border-gray-400 p-3 mt-4">
                    <View className="border-b-2 border-b-gray-500 justify-center items-center flex-row h-14 mb-3">
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
                    <View className="flex-row items-center gap-x-2 mt-4 h-14">
                        <Ionicons name="call" size={24} color="black" />
                        <View className="h-14 items-center justify-center px-2 w-28 max-w-28">
                            <FloatingLabelInput label="" editable={false}
                                value={country ? `+${country.callingCode}` : callingCode}
                                onChangeText={(text) => {
                                    setCallingCode(text);
                                }}
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
                        <View className="flex-1 h-14">
                            <FloatingLabelInput label="Phone" inputMode="tel" className="" value={phoneNo} onChangeText={(text) => setPhoneNo(text)}
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
                </View>


                <View className="mt-4">
                    <Pressable className="bg-blue-500 h-12 items-center justify-center rounded-full"
                        onPress={() => {
                            const firstNameValid = validateFirstName(firstName);
                            const lastNameValid = validateLastName(lastName);
                            const countryCodeValid = validateCountryCode(countryCode);
                            const phoneNoValid = validatePhoneNo(phoneNo);

                            if (firstNameValid) {
                                Toast.show({
                                    type: ALERT_TYPE.WARNING,
                                    title: "Warning",
                                    textBody: firstNameValid,
                                });
                            } else if (lastNameValid) {
                                Toast.show({
                                    type: ALERT_TYPE.WARNING,
                                    title: "Warning",
                                    textBody: lastNameValid,
                                });
                            }
                            // else  if (countryCodeValid) {
                            //     Toast.show({
                            //         type:ALERT_TYPE.WARNING,
                            //         title:"Warning",
                            //         textBody:countryCodeValid,
                            //     });
                            // }
                            else if (phoneNoValid) {
                                Toast.show({
                                    type: ALERT_TYPE.WARNING,
                                    title: "Warning",
                                    textBody: phoneNoValid,
                                });
                            } else {
                                sendData();

                            }
                        }}
                    >
                        <Text className="font-bold text-xl text-slate-100">Save Contact</Text>
                    </Pressable>
                </View>
            </View>
        </View>
        </AlertNotificationRoot>
    );
}