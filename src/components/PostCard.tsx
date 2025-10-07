import React from "react";
import { View, Text, Pressable, Image, TextInput } from "react-native";
import { Card } from "./UI";

function fullImage(url?: string) {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return `https://cis.kku.ac.th${url}`;
}

type PostCardProps = {
  post: {
    id: string;
    authorEmail: string;
    authorImage?: string;
    content: string;
    likesCount: number;
    commentsCount: number;
  };
  onPress: () => void;
  onLike: () => void;
  onComment: () => void;
  commentText: string;
  onChangeComment: (t: string) => void;
};

export default function PostCard({
  post,
  onPress,
  onLike,
  onComment,
  commentText,
  onChangeComment,
}: PostCardProps) {
  return (
    <Card>
      <Pressable onPress={onPress} style={{ flexDirection: "row", gap: 12 }}>
        {post.authorImage ? (
          <Image
            source={{ uri: fullImage(post.authorImage) }}
            style={{ width: 36, height: 36, borderRadius: 18 }}
          />
        ) : null}
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            {post.authorEmail}
          </Text>
          <Text style={{ color: "#fff", marginTop: 8 }}>{post.content}</Text>
        </View>
      </Pressable>

      {/* ปุ่มไลก์ + จำนวนคอมเมนต์ */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginTop: 10 }}>
        <Pressable
          onPress={onLike}
          style={{
            paddingVertical: 6,
            paddingHorizontal: 10,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.12)",
          }}
        >
          <Text style={{ color: "#fff" }}>❤️ {post.likesCount}</Text>
        </Pressable>

        <View
          style={{
            paddingVertical: 6,
            paddingHorizontal: 10,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.12)",
          }}
        >
          <Text style={{ color: "#fff" }}>💬 {post.commentsCount}</Text>
        </View>
      </View>

      {/* กล่องพิมพ์คอมเมนต์เร็ว */}
      <View style={{ marginTop: 10 }}>
        <TextInput
          placeholder="แสดงความคิดเห็น..."
          placeholderTextColor="rgba(255,255,255,0.5)"
          value={commentText}
          onChangeText={onChangeComment}
          style={{
            color: "#fff",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.12)",
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}
        />
        <Pressable
          onPress={onComment}
          style={{
            marginTop: 8,
            paddingVertical: 10,
            borderRadius: 10,
            alignItems: "center",
            backgroundColor: "#22c55e",
          }}
        >
          <Text style={{ color: "#000", fontWeight: "700" }}>ส่งคอมเมนต์</Text>
        </Pressable>
      </View>
    </Card>
  );
}
