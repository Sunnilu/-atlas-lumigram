import { Text, View } from 'react-native';
import { Link } from 'expo-router';

export default function Page() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Link href="/login">
        <Text>Login</Text>
      </Link>

      <Text>Create a new account</Text>
    </View>
  );
}
