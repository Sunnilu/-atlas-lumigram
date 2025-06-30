import { Pressable, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // ✅ Adjust path if needed

export function LogoutComponent() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await signOut(auth);
      router.replace('/login');
    } catch (error: any) {
      Alert.alert('Logout Failed', error.message);
    }
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
