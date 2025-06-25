import { useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const placeholderImages = [
  { id: '1', uri: 'https://picsum.photos/300?1' },
  { id: '2', uri: 'https://picsum.photos/300?2' },
  { id: '3', uri: 'https://picsum.photos/300?3' },
  { id: '4', uri: 'https://picsum.photos/300?4' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const [username] = useState('pink-flowers23131');
  const [profileUri] = useState('https://picsum.photos/200');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <Ionicons
          name="log-out-outline"
          size={24}
          color="#64e4cb"
          onPress={() => console.log('Logout pressed')}
        />
      </View>

      {/* Profile section */}
      <View style={styles.profileSection}>
        <Pressable onPress={() => router.push('/profile/edit')}>
          <Image source={{ uri: profileUri }} style={styles.profileImage} />
        </Pressable>
        <Text style={styles.username}>{username}</Text>
      </View>

      {/* Grid of images */}
      <FlatList
        data={placeholderImages}
        numColumns={3}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Image source={{ uri: item.uri }} style={styles.gridImage} />
        )}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
}

const screenWidth = Dimensions.get('window').width;
const imageSize = screenWidth / 3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#f0f0f0',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: '500',
  },
  grid: {
    padding: 4,
  },
  gridImage: {
    width: imageSize,
    height: imageSize,
    margin: 1,
  },
});
