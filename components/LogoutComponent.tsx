import { GestureResponderEvent, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export function LogoutComponent() {
  const router = useRouter();

  function handleLogout() {
    // Here you could also clear auth state if needed
    router.replace('/login'); // redirect to login screen
  }

  function Logout(event: GestureResponderEvent): void {
    throw new Error('Function not implemented.');
  }

  return (
    <Pressable onPress={Logout}>
      <Ionicons name="log-out-outline" size={24} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    marginRight: 16,
  },
});
