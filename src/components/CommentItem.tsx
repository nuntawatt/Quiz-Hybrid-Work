import React from "react";
import { View, Text } from "react-native";
import { Card } from "./UI";

export default function CommentItem({author,content}:{author:string;content:string}) {
  return (
    <Card style={{ marginBottom:8 }}>
      <Text style={{ color:'#fff', fontWeight:'700' }}>{author}</Text>
      <Text style={{ color:'#fff', marginTop:6 }}>{content}</Text>
    </Card>
  );
}
