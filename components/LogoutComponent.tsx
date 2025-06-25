import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export function LogoutComponent() {
  const router = useRouter();

  function handleLogout() {
    // Optional: clear auth state or token here
    router.replace('/login'); // Navigate to login screen
  }

  return (
    <Pressable onPress={handleLogout} style={styles.button}>
      <Ionicons name="log-out-outline" size={24} color="white" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    marginRight: 16,
  },
});
