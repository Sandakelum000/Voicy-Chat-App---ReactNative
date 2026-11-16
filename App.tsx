import "./global.css"
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AlertNotificationRoot } from "react-native-alert-notification";
import SplashScreen from "./src/screens/SplashScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import ContactScreen from "./src/screens/ContactScreen";
import AvatarScreen from "./src/screens/AvatarScreen";
import SignInScreen from "./src/screens/SignInScreen";
import 'react-native-reanimated';
import { UserRegistrationProvider } from "./src/components/userContext";
import { WebSocketProvider } from "./src/socket/WebSocketProvider";
import HomeScreen from "./src/screens/HomeScreen";
import HomeTabs from "./src/screens/HomeTabs";
import SingleChatScreen from "./src/screens/SingleChatScreen";
import NewChatScreen from "./src/screens/NewChatScreen";
import NewContactScreen from "./src/screens/NewContactScreen";
import SettingsScreen from "./src/screens/SettingScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import PasswordScreen from "./src/screens/PasswordScreen";
import { useContext } from "react";
import { AuthContext, AuthProvider } from "./src/components/AuthProvider";
import { ThemeProvider } from "./src/theme/ThemeProvider";

export type RootStack = {
  SplashScreen: undefined,
  SignUpScreen: undefined,
  ContactScreen: undefined,
  AvatarScreen: undefined,
  SignInScreen: undefined,
  HomeScreen: undefined,
  SingleChatScreen: {
    chatId: number,
    friendName: string,
    lastSeenTime: string,
    profileImage: string,
  },
  NewChatScreen: undefined,
  NewContactScreen: undefined,
  SettingsScreen: undefined,
  ProfileScreen: undefined,
  PasswordScreen: undefined,
};

const Stack = createNativeStackNavigator<RootStack>();

function ChatApp() {
  const auth = useContext(AuthContext);
  return (
    <WebSocketProvider userId={auth ? Number(auth.userId) : 0}>
      <ThemeProvider>
        <UserRegistrationProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ animation: "ios_from_right" }}>
              {auth?.isLoading ? (<Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />) :
                auth?.userId === null ? (
                  <Stack.Group>
                    <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="ContactScreen" component={ContactScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="PasswordScreen" component={PasswordScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="AvatarScreen" component={AvatarScreen} options={{ headerShown: true }} />
                    <Stack.Screen name="SignInScreen" component={SignInScreen} options={{ headerShown: false }} />
                  </Stack.Group>
                ) : (
                  <Stack.Group>
                    <Stack.Screen name="HomeScreen" component={HomeTabs} options={{ headerShown: false }} />
                    <Stack.Screen name="SingleChatScreen" component={SingleChatScreen} />
                    <Stack.Screen name="NewChatScreen" component={NewChatScreen}
                      options={{
                        headerShown: false,
                        presentation: "modal",
                        animation: "slide_from_bottom",
                        contentStyle: { backgroundColor: "rgba(0,0,0,0.5)" },
                      }}
                    />
                    <Stack.Screen name="NewContactScreen" component={NewContactScreen}
                      options={{
                        headerShown: false,
                        presentation: "modal",
                        animation: "slide_from_bottom",
                        contentStyle: { backgroundColor: "rgba(0,0,0,0.5)" },
                      }}
                    />
                    <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
                  </Stack.Group>
                )
              }
            </Stack.Navigator>
          </NavigationContainer>
        </UserRegistrationProvider>
      </ThemeProvider>
    </WebSocketProvider>
  );
}

export default function App() {

  return (
    <AlertNotificationRoot>
      <AuthProvider>
        <ChatApp />
      </AuthProvider>
    </AlertNotificationRoot>
  );
}
