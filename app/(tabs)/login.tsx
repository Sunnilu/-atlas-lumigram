import { Text, View } from 'react-native';
import { Link } from 'expo-router';

export default function Page() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    
      <Link href="/register">
        <Text>Register</Text>
      </Link>

      <Text>Log in to existing account</Text>
    </View>
  );
}
