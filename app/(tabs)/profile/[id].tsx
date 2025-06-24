import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { Stack } from 'expo-router';

export default function Page() {
  const { id } = useLocalSearchParams();

  return (
    <>
      <Stack.Screen options={{ title: 'My Profile' }} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>User Profile for: {id}</Text>
      </View>
    </>
  );
}
