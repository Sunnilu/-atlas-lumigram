// app/(tabs)/addPost.tsx
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
import { getAuth } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { storage, db } from '@/lib/firebase'; // 👈 make sure these are exported from your firebase.ts

// ✅ STEP 1: Add this function here
const uriToBlob = async (uri: string): Promise<Blob> => {
  const response = await fetch(uri);
  const blob = await response.blob();
  return blob;
};

export default function AddPostScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!image || !caption) {
      Alert.alert('Missing data', 'Please select an image and enter a caption.');
      return;
    }

    try {
      const blob = await uriToBlob(image); // ✅ STEP 2: Convert image URI to blob
      const filename = `posts/${Date.now()}.jpg`;
      const storageRef = ref(storage, filename);

      await uploadBytes(storageRef, blob); // ✅ STEP 3: Upload blob
      const imageUrl = await getDownloadURL(storageRef);

      const user = getAuth().currentUser;

      await addDoc(collection(db, 'posts'), {
        imageUrl,
        caption,
        createdAt: serverTimestamp(),
        userId: user?.uid ?? 'anonymous',
      });

      Alert.alert('✅ Post uploaded!');
      setImage(null);
      setCaption('');
    } catch (error: any) {
      console.error('Upload failed:', error);
      Alert.alert('Upload failed', error.message);
    }
  };

  const handleReset = () => {
    setImage(null);
    setCaption('');
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={pickImage}>
        <Image
          source={
            image
              ? { uri: image }
              : require('@/assets/images/placeholder.png')
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

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </Pressable>

      <Pressable onPress={handleReset}>
        <Text style={styles.resetText}>Reset</Text>
      </Pressable>
    </View>
  );
}

// ✅ Your existing styles
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
