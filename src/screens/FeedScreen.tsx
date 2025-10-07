import React, { useEffect, useState } from "react";
import {
  ScrollView,
  TextInput,
  Text,
  Pressable,
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Screen, Card, H1, PrimaryButton } from "../components/UI";
import PostCard from "../components/PostCard";
import {
  listStatuses,
  createStatus,
  likeStatus,
  unlikeStatus,
  commentStatus,
  StatusItem,
} from "../lib/cis";
import { loadToken, clearToken } from "../lib/token";
import { jwtDecode } from "jwt-decode";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Feed">;

export default function FeedScreen({ navigation }: Props) {
  const [myId, setMyId] = useState<string>("");
  const [myEmail, setMyEmail] = useState<string>("");
  const [posts, setPosts] = useState<StatusItem[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
  const setComment = (id: string, text: string) =>
    setCommentTexts((prev) => ({ ...prev, [id]: text }));

  const refresh = async () => {
    setLoading(true);
    try {
      const list = await listStatuses();
      setPosts(Array.isArray(list) ? list : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const t = await loadToken();
      if (!t) {
        navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        return;
      }
      try {
        const payload: any = jwtDecode(t);
        setMyId(String(payload?.id || payload?.sub || ""));
        setMyEmail(String(payload?.email || ""));
      } catch {}
      await refresh();
    })();
  }, []);

  const onCreate = async () => {
    if (!content.trim()) return;
    try {
      setLoading(true);
      await createStatus(content.trim());
      setContent("");
      await refresh();
    } catch (e: any) {
      Alert.alert("โพสต์ล้มเหลว", e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  const onToggleLike = async (p: StatusItem) => {
    const didILike =
      Array.isArray(p.like) &&
      p.like.some((l) => (myId && l._id === myId) || (myEmail && l.email === myEmail));
    try {
      if (didILike) {
        await unlikeStatus(p._id);
      } else {
        await likeStatus(p._id);
      }
      await refresh();
    } catch (e: any) {
      Alert.alert("ดำเนินการไม่สำเร็จ", e?.response?.data?.message || e.message);
    }
  };

  const onSendComment = async (id: string) => {
    const text = (commentTexts[id] || "").trim();
    if (!text) return;
    try {
      await commentStatus(id, text);
      setComment(id, "");
      await refresh();
    } catch (e: any) {
      Alert.alert("คอมเมนต์ไม่สำเร็จ", e?.response?.data?.message || e.message);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            padding: 20,
            gap: 16,
            backgroundColor: "#0f172a",
          }}
        >
          {/* ========= กล่องโพสต์ ========= */}
          <Card style={{ backgroundColor: "#1e293b", padding: 16 }}>
            <H1>📢 สร้างโพสต์ใหม่</H1>
            <Text
              style={{
                color: "#94a3b8",
                fontSize: 13,
                marginTop: 4,
                marginBottom: 10,
              }}
            >
              เขียนสิ่งที่อยากแชร์กับเพื่อนใน CIS
            </Text>
            <TextInput
              placeholder="คุณกำลังคิดอะไรอยู่..."
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={content}
              onChangeText={setContent}
              multiline
              style={{
                color: "#fff",
                backgroundColor: "#334155",
                borderRadius: 12,
                padding: 10,
                minHeight: 90,
                textAlignVertical: "top",
              }}
            />
            <View style={{ height: 10 }} />
            <PrimaryButton
              title={loading ? "กำลังโพสต์..." : "โพสต์เลย"}
              onPress={onCreate}
            />
          </Card>

          {/* ========= เมนูการนำทาง ========= */}
          <Card
            style={{
              backgroundColor: "#1e293b",
              padding: 16,
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <Pressable onPress={() => navigation.navigate("Year")}>
              <Text style={{ color: "#22c55e", fontWeight: "600" }}>👥 สมาชิกชั้นปี</Text>
            </Pressable>

            <Pressable onPress={() => navigation.navigate("MyStatus")}>
              <Text style={{ color: "#38bdf8", fontWeight: "600" }}>🧾 โพสต์ของฉัน</Text>
            </Pressable>

            <Pressable
              onPress={async () => {
                await clearToken();
                navigation.reset({ index: 0, routes: [{ name: "Login" }] });
              }}
            >
              <Text style={{ color: "tomato", fontWeight: "600" }}>🚪 ออกจากระบบ</Text>
            </Pressable>
          </Card>

          {/* ========= ฟีด ========= */}
          {Array.isArray(posts) && posts.length > 0 ? (
            posts.map((p) => (
              <PostCard
                key={p._id}
                post={{
                  id: p._id,
                  authorEmail: p.createdBy?.email ?? "unknown",
                  authorImage: p.createdBy?.image,
                  content: p.content ?? "",
                  likesCount: Array.isArray(p.like) ? p.like.length : 0,
                  commentsCount: Array.isArray(p.comment) ? p.comment.length : 0,
                }}
                onLike={() => onToggleLike(p)}
                onPress={() => navigation.navigate("PostDetail", { postId: p._id })}
                onComment={() => onSendComment(p._id)}
                commentText={commentTexts[p._id] || ""}
                onChangeComment={(t) => setComment(p._id, t)}
              />
            ))
          ) : (
            !loading && (
              <View style={{ paddingTop: 40 }}>
                <Text
                  style={{
                    color: "#64748b",
                    textAlign: "center",
                    fontSize: 16,
                    fontStyle: "italic",
                  }}
                >
                  💤 ยังไม่มีโพสต์ในระบบ
                </Text>
              </View>
            )
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
