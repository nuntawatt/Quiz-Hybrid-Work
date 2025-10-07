import React from "react";
import { View, Text, Pressable, TextInput, ViewStyle, TextStyle } from "react-native";
import { theme } from "../theme/theme";

export function Screen({ children }: { children: React.ReactNode }) {
  return (
    <View style={{ flex: 1, backgroundColor: theme.light.bg }}>
      <View style={{ position: "absolute", top: -120, left: -80, width: 280, height: 280, borderRadius: 9999,
        backgroundColor: "rgba(34,197,94,0.15)", ...( { filter: "blur(100px)" } as any) }} />
      <View style={{ position: "absolute", bottom: -150, right: -80, width: 320, height: 320, borderRadius: 9999,
        backgroundColor: "rgba(59,130,246,0.18)", ...( { filter: "blur(110px)" } as any) }} />
      {children}
    </View>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return (
    <View style={[{
      backgroundColor: theme.light.card, borderColor: theme.light.border, borderWidth: 1,
      borderRadius: 16, padding: 14, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.25,
      shadowRadius: 10, elevation: 3
    }, style]}>
      {children}
    </View>
  );
}

export function H1({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return <Text style={[{ color: theme.light.text, fontSize: 24, fontWeight: "700", marginBottom: 12 }, style]}>{children}</Text>;
}

export function Input(props: React.ComponentProps<typeof TextInput>) {
  return (
    <TextInput
      placeholderTextColor="rgba(255,255,255,0.5)"
      {...props}
      style={[{
        color: theme.light.text, borderColor: theme.light.border, borderWidth: 1,
        backgroundColor: "rgba(255,255,255,0.03)", padding: 12, borderRadius: 12
      }, props.style]}
    />
  );
}

export function PrimaryButton({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={{
      backgroundColor: theme.light.brand, paddingVertical: 12, paddingHorizontal: 16,
      borderRadius: 12, alignItems: "center"
    }}>
      <Text style={{ color: "#0b1b0e", fontWeight: "700" }}>{title}</Text>
    </Pressable>
  );
}
