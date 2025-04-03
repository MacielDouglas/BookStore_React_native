import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";
import { useAuthStore } from "./../store/authStore";
import { useEffect } from "react";

export default function Index() {
  const { user, token, checkAuth, logout } = useAuthStore();

  console.log(user, token);
  useEffect(() => {
    checkAuth();
  }, []);
  return (
    <View style={styles.container}>
      <Text>Hello {user?.username}</Text>
      <Text>Token: {token}</Text>
      <TouchableOpacity>
        <Text>Logout</Text>
      </TouchableOpacity>
      <Link href="/(auth)/signup">Signup Page</Link>
      <Link href="/(auth)">Login Page</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
