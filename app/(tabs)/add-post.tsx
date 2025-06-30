import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { storage, db, auth } from '@/lib/firebase';

export default function AddPostScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string): Promise<string> => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const fileName = `posts/${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const imageRef = ref(storage, fileName);

    await uploadBytes(imageRef, blob);
    return await getDownloadURL(imageRef);
  };

  const handleSave = async () => {
    if (!image || !caption) {
      Alert.alert('Error', 'Image and caption are required.');
      return;
    }

    try {
      setLoading(true);
      const imageUrl = await uploadImage(image);
      const user = auth.currentUser;

      await addDoc(collection(db, 'posts'), {
        imageUrl,
        caption,
        createdAt: serverTimestamp(),
        userId: user?.uid || 'anonymous',
      });

      Alert.alert('✅ Post uploaded!');
      setImage(null);
      setCaption('');
    } catch (err) {
      console.error(err);
      Alert.alert('Upload failed', 'Something went wrong.');
    } finally {
      setLoading(false);
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

      {loading ? (
        <ActivityIndicator size="large" color="#4EE0BC" />
      ) : (
        <>
          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </Pressable>

          <Pressable onPress={handleReset}>
            <Text style={styles.resetText}>Reset</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

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
