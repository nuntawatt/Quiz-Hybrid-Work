import React, { useEffect, useState } from "react";
import { ScrollView, TextInput, View, Text, Image, Pressable, Alert } from "react-native";
import { Screen, Card, H1, PrimaryButton } from "../components/UI";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { getStatusById, listComments, commentStatus, deleteComment } from "../lib/cis";

function fullImage(url?: string) {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return `https://cis.kku.ac.th${url}`;
}

type Props = { route: RouteProp<RootStackParamList, "PostDetail"> };

export default function PostDetailScreen({ route }: Props) {
  const { postId } = route.params;
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState("");

  const refresh = async () => {
    const res = await getStatusById(postId);
    if (!res.success) {
      Alert.alert("แจ้งเตือน", res.message);
      return;
    }
    setPost(res.data);
    const cs = await listComments(postId).catch(() => []);
    setComments(Array.isArray(cs) && cs.length ? cs : res.data?.comment ?? []);
  };

  useEffect(() => {
    refresh();
  }, [postId]);

  const onSubmit = async () => {
    if (!text.trim()) return;
    await commentStatus(postId, text.trim());
    setText("");
    await refresh();
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Card>
          <H1>โพสต์โดย {post?.createdBy?.email ?? ""}</H1>
          <Text style={{ color: "#fff", marginBottom: 8 }}>{post?.content ?? ""}</Text>
        </Card>

        <Card>
          <H1>คอมเมนต์</H1>
          <TextInput
            placeholder="เขียนคอมเมนต์..."
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={text}
            onChangeText={setText}
            style={{ color: "#fff", minHeight: 48 }}
          />
          <View style={{ height: 10 }} />
          <PrimaryButton title="ส่งคอมเมนต์" onPress={onSubmit} />
        </Card>

        {comments.map((c: any) => (
          <Card key={c._id}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                {c?.createdBy?.image ? (
                  <Image source={{ uri: fullImage(c.createdBy.image) }} style={{ width: 28, height: 28, borderRadius: 14 }} />
                ) : null}
                <Text style={{ color: "#fff", fontWeight: "700" }}>
                  {c?.createdBy?.email ?? "ไม่ทราบผู้เขียน"}
                </Text>
              </View>
              <Pressable onPress={async () => { await deleteComment(postId, c._id); await refresh(); }}>
                <Text style={{ color: "tomato" }}>ลบ</Text>
              </Pressable>
            </View>
            <Text style={{ color: "#fff", marginTop: 6 }}>{c?.content ?? ""}</Text>
          </Card>
        ))}
      </ScrollView>
    </Screen>
  );
}
