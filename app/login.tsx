import { Text, View } from 'react-native';
import { Link } from 'expo-router';

export default function Page() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Login</Text>

      <Link href="/register">
        <Text>Register</Text>
      </Link>

      <Text>Create a new account</Text>
    </View>
  );
}
