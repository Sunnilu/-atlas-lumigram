import { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
  Pressable,
  Alert,
} from 'react-native';
import { Link, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Example user data
const users = [
  { id: '1', username: 'testuser', avatar: 'https://picsum.photos/seed/test/50' },
  { id: '2', username: 'pink-flowers23131', avatar: 'https://picsum.photos/seed/flower/50' },
  { id: '3', username: 'greenleaf88', avatar: 'https://picsum.photos/seed/green/50' },
  { id: '4', username: 'sunshine_day', avatar: 'https://picsum.photos/seed/sun/50' },
];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const navigation = useNavigation();

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(query.toLowerCase())
  );

  // Add top-right icon button
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => Alert.alert('Top right button pressed')}
          style={{ paddingRight: 16 }}
        >
          <Ionicons name="log-out-outline" size={24} color="#4ce0b3" />
        </Pressable>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search</Text>
      <TextInput
        style={styles.input}
        placeholder="Search users..."
        value={query}
        onChangeText={setQuery}
      />

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={`/profile/${item.id}`} asChild>
            <Pressable style={styles.userRow}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <Text style={styles.username}>{item.username}</Text>
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    height: 40,
    borderColor: '#4ce0b3',
    borderWidth: 1.5,
    borderRadius: 6,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  username: {
    fontSize: 16,
  },
});
