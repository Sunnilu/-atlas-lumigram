import { Pressable, Text, View } from 'react-native';
import { Link, useRouter } from 'expo-router';

export default function Page() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Link href="/login" replace>
        <Text>Login</Text>
      </Link>

      <Text>Create a new account</Text>
      <Pressable onPress={() => router.push('/')}>
        <Text>Sign In</Text>
      </Pressable>
    </View>
  );
}
