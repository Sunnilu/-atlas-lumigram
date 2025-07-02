import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import storage from '@/lib/storage'; // 🔗 Your helper with .upload()

export default function AddPostScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);

  // 📸 Open media library
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'We need access to your photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], // ✅ Fix for deprecation warning
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  // 💾 Save post to Firestore + Firebase Storage
  const save = async () => {
    if (!image || !caption) {
      Alert.alert('Missing data', 'Please select an image and enter a caption.');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Not logged in', 'You must be logged in to post.');
      return;
    }

    try {
      setUploading(true);

      const name = image.split('/').pop() || `image_${Date.now()}.jpg`;
      const { downloadURL, metadata } = await storage.upload(image, name, 'post');

      await addDoc(collection(db, 'posts'), {
        imageUrl: downloadURL,
        caption,
        createdAt: serverTimestamp(),
        userId: user.uid,
        metadata,
      });

      Alert.alert('✅ Post uploaded!');
      setImage(null);
      setCaption('');
    } catch (error: any) {
      console.error('Upload failed:', error);
      Alert.alert('Upload failed', error.message || 'Unknown error.');
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setCaption('');
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={pickImage}>
        <Image
          source={
            image ? { uri: image } : require('@/assets/images/placeholder.png')
          }
          style={styles.image}
        />
      </Pressable>

      <TextInput
        placeholder="Add a caption"
        placeholderTextColor="#999"
        style={styles.input}
        value={caption}
        onChangeText={setCaption}
      />

      <Pressable style={styles.saveButton} onPress={save} disabled={uploading}>
        <Text style={styles.saveButtonText}>
          {uploading ? 'Uploading...' : 'Save'}
        </Text>
      </Pressable>

      <Pressable onPress={reset}>
        <Text style={styles.resetText}>Reset</Text>
      </Pressable>
    </View>
  );
}

// 🎨 Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8F8F8',
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 20,
    marginVertical: 20,
    resizeMode: 'cover',
    backgroundColor: '#e1e1e1',
  },
  input: {
    width: '100%',
    borderColor: '#4EE0BC',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    backgroundColor: '#fff',
    color: '#000',
  },
  saveButton: {
    backgroundColor: '#4EE0BC',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 12,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resetText: {
    color: '#333',
    fontSize: 16,
  },
});
