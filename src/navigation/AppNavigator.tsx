import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import YearScreen from "../screens/YearScreen";
import FeedScreen from "../screens/FeedScreen";
import PostDetailScreen from "../screens/PostDetailScreen";
import MyStatusScreen from "../screens/MyStatusScreen";

export type RootStackParamList = {
  Login: undefined;
  Feed: undefined;
  Year: undefined;
  PostDetail: { postId: string };
  MyStatus: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerStyle: { backgroundColor: "#0f172a" }, headerTintColor: "#fff" }}
      >
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: "เข้าสู่ระบบ CIS" }} />
        <Stack.Screen name="Feed" component={FeedScreen} options={{ title: "ฟีดสถานะ" }} />
        <Stack.Screen name="Year" component={YearScreen} options={{ title: "สมาชิกตามชั้นปี" }} />
        <Stack.Screen name="PostDetail" component={PostDetailScreen} options={{ title: "รายละเอียดโพสต์" }} />
        <Stack.Screen name="MyStatus" component={MyStatusScreen} options={{ title: "โพสต์ของฉันตาม ID" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
