import React, { useEffect, useState, useCallback } from "react";
import { ScrollView, Text, View, Pressable, Alert, RefreshControl } from "react-native";
import { Screen, Card, H1, PrimaryButton } from "../components/UI";
import {
    listStatuses,
    deleteStatus,
    likeStatus,
    unlikeStatus, // ✅ นำเข้า unlike
    commentStatus,
    StatusItem,
} from "../lib/cis";
import { loadToken } from "../lib/token";
import { jwtDecode } from "jwt-decode";
import PostCard from "../components/PostCard";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "MyStatus">;

export default function MyStatusScreen({ navigation }: Props) {
    const [myId, setMyId] = useState<string>("");
    const [myEmail, setMyEmail] = useState<string>("");
    const [posts, setPosts] = useState<StatusItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
    const setComment = (id: string, text: string) =>
        setCommentTexts((prev) => ({ ...prev, [id]: text }));

    const loadMe = useCallback(async () => {
        const t = await loadToken();
        if (!t) {
            Alert.alert("ต้องเข้าสู่ระบบก่อน", "โปรดล็อกอินใหม่");
            navigation.reset({ index: 0, routes: [{ name: "Login" }] });
            return;
        }
        try {
            const payload: any = jwtDecode(t);
            setMyId(String(payload?.id || payload?.sub || ""));
            setMyEmail(String(payload?.email || ""));
        } catch {
            setMyId("");
            setMyEmail("");
        }
    }, [navigation]);

    const fetchMyPosts = useCallback(async () => {
        if (!myId) return;
        setLoading(true);
        try {
            const all = await listStatuses();
            const mine = (all || []).filter((p) => p?.createdBy?._id === myId);
            setPosts(mine);
        } catch (e: any) {
            console.log("❌ [MyStatus] fetch error:", e?.response?.data || e?.message || e);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    }, [myId]);

    useEffect(() => {
        (async () => {
            await loadMe();
        })();
    }, [loadMe]);

    useEffect(() => {
        fetchMyPosts();
    }, [myId, fetchMyPosts]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchMyPosts();
        setRefreshing(false);
    };

    const onDelete = async (id: string) => {
        try {
            const ok = await new Promise<boolean>((resolve) => {
                Alert.alert("ยืนยันการลบ", "ต้องการลบโพสต์นี้หรือไม่?", [
                    { text: "ยกเลิก", style: "cancel", onPress: () => resolve(false) },
                    { text: "ลบ", style: "destructive", onPress: () => resolve(true) },
                ]);
            });
            if (!ok) return;
            await deleteStatus(id);
            await fetchMyPosts();
        } catch (e: any) {
            Alert.alert("ลบไม่สำเร็จ", e?.response?.data?.message || e.message);
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
            await fetchMyPosts();
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
            await fetchMyPosts();
        } catch (e: any) {
            Alert.alert("คอมเมนต์ไม่สำเร็จ", e?.response?.data?.message || e.message);
        }
    };

    return (
        <Screen>
            <ScrollView
                contentContainerStyle={{ padding: 16 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <Card>
                    <H1>โพสต์ของฉัน</H1>
                    <Text style={{ color: "#9CA3AF", marginTop: 6 }}>
                        จะแสดงเฉพาะโพสต์ที่สร้างโดยบัญชีของคุณ
                    </Text>
                    <View style={{ height: 10 }} />
                    <PrimaryButton
                        title={loading ? "กำลังดึงข้อมูล..." : "รีเฟรช"}
                        onPress={fetchMyPosts}
                    />
                </Card>

                {Array.isArray(posts) && posts.length > 0 ? (
                    posts.map((p) => (
                        <Card key={p._id}>
                            <PostCard
                                post={{
                                    id: p._id,
                                    authorEmail: p.createdBy?.email ?? "unknown",
                                    authorImage: p.createdBy?.image,
                                    content: p.content ?? "",
                                    likesCount: Array.isArray(p.like) ? p.like.length : 0,
                                    commentsCount: Array.isArray(p.comment) ? p.comment.length : 0,
                                }}
                                onLike={() => onToggleLike(p)} // ✅ toggle like/unlike
                                onPress={() => navigation.navigate("PostDetail", { postId: p._id })}
                                onComment={() => onSendComment(p._id)}
                                commentText={commentTexts[p._id] || ""}
                                onChangeComment={(t) => setComment(p._id, t)}
                            />

                            {/* ปุ่มลบโพสต์ */}
                            <Pressable
                                onPress={() => onDelete(p._id)}
                                style={{
                                    marginTop: 8,
                                    paddingVertical: 8,
                                    borderRadius: 10,
                                    borderWidth: 1,
                                    borderColor: "rgba(255,255,255,0.12)",
                                }}
                            >
                                <Text style={{ color: "tomato", textAlign: "center" }}>ลบโพสต์นี้</Text>
                            </Pressable>
                        </Card>
                    ))
                ) : (
                    !loading && (
                        <Text style={{ color: "#fff", textAlign: "center", marginTop: 16, opacity: 0.6 }}>
                            ยังไม่มีโพสต์ของคุณ
                        </Text>
                    )
                )}
            </ScrollView>
        </Screen>
    );
}
