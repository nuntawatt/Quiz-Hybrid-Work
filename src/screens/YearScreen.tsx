// src/screens/YearScreen.tsx
import React, { useState } from "react";
import { ScrollView, Text, View, Image } from "react-native";
import { Screen, Card, H1, Input, PrimaryButton } from "../components/UI";
import { getClassesByYear } from "../lib/cis";

function pick<T>(v: T | undefined | null, fallback: T): T {
  return v == null ? fallback : v;
}
function fullImage(url?: string) {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return `https://cis.kku.ac.th${url}`;
}

export default function YearScreen() {
  const [year, setYear] = useState("2565");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const list = await getClassesByYear(year.trim());
      setData(Array.isArray(list) ? list : []);
    } catch (e: any) {
      console.log("[YearScreen] fetch error:", e?.response?.data || e?.message || e);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Card>
          <H1>สมาชิกตามชั้นปี</H1>
          <Input
            value={year}
            onChangeText={setYear}
            keyboardType="numeric"
            placeholder="เช่น 2565"
            style={{ marginBottom: 12 }}
          />
          <PrimaryButton title={loading ? "กำลังดึง..." : "ดึงข้อมูล"} onPress={fetchData} />
        </Card>

        {data.map((u: any, i: number) => {
          const studentId = u?.education?.studentId ?? u?.education?.id ?? "-";
          const name = `${pick(u?.firstname, "")} ${pick(u?.lastname, "")}`.trim() || "(ไม่ระบุชื่อ)";
          const email = u?.email ?? "";
          const avatar = fullImage(u?.image);

          return (
            <Card key={u?._id ?? i}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                {avatar ? (
                  <Image source={{ uri: avatar }} style={{ width: 40, height: 40, borderRadius: 20 }} />
                ) : null}
                <View style={{ flex: 1 }}>
                  <Text style={{ color: "#fff", fontWeight: "700" }}>{name}</Text>
                  <Text style={{ color: "#9CA3AF" }}>รหัส: {studentId}</Text>
                  <Text style={{ color: "#9CA3AF" }}>{email}</Text>
                </View>
              </View>
            </Card>
          );
        })}

        {!loading && data.length === 0 && (
          <Text style={{ color: "#fff", opacity: 0.6, textAlign: "center", marginTop: 16 }}>
            ไม่พบสมาชิกในปี {year}
          </Text>
        )}
      </ScrollView>
    </Screen>
  );
}
