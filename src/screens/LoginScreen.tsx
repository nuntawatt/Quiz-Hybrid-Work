import React, { useState } from "react";
import { View, Alert } from "react-native";
import { Screen, Card, H1, Input, PrimaryButton } from "../components/UI";
import { signin } from "../lib/cis";
import { saveToken } from "../lib/token";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    try {
      setLoading(true);
      const { token } = await signin(email, password);
      await saveToken(token);
      navigation.reset({ index: 0, routes: [{ name: "Feed" }] });
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.response?.data?.error || e.message;
      Alert.alert("ล็อกอินล้มเหลว", String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
        <Card>
          <H1>เข้าสู่ระบบ CIS</H1>
          <Input placeholder="อีเมล" autoCapitalize="none" keyboardType="email-address"
            value={email} onChangeText={setEmail} style={{ marginBottom: 10 }} />
          <Input placeholder="รหัสผ่าน" secureTextEntry value={password} onChangeText={setPassword}
            style={{ marginBottom: 12 }} />
          <PrimaryButton title={loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"} onPress={onSubmit} />
        </Card>
      </View>
    </Screen>
  );
}
