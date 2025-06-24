import { Text, View } from 'react-native';
import { Link } from 'expo-router';

export default function Page() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Register</Text>

      <Link href="/login" replace>
        <Text>Log in to existing account</Text>
      </Link>
    </View>
  );
}
