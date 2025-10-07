import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import AppNavigator from "./src/navigation/AppNavigator";
import { loadToken } from "./src/lib/token";

export default function App() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    (async () => {
      const t = await loadToken();
      setAuthed(!!t);
      setReady(true);
    })();
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }
  return <AppNavigator/>;
}
