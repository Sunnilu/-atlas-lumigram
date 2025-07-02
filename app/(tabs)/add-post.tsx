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
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';

// 🔗 Import initialized Firebase instances (adjust path if needed)
import { auth, db, storage } from '@/lib/firebase';

// 📦 Convert local file URI to a Blob
const uriToBlob = async (uri: string): Promise<Blob> => {
  const response = await fetch(uri);
  return await response.blob();
};

export default function AddPostScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // 📷 Launch Image Picker
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow access to your photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  // 💾 Save post to Firebase
  const handleSave = async () => {
    if (!image || !caption) {
      Alert.alert('Missing data', 'Please select an image and enter a caption.');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'You must be logged in to upload.');
      return;
    }

    try {
      const blob = await uriToBlob(image);
      const filename = `posts/${user.uid}/${Date.now()}.jpg`;
      const storageRef = ref(storage, filename);

      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Upload error:', error);
          Alert.alert('Upload failed', error.message || 'Unexpected error');
        },
        async () => {
          const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
          await addDoc(collection(db, 'posts'), {
            imageUrl,
            caption,
            createdAt: serverTimestamp(),
            userId: user.uid,
          });

          Alert.alert('✅ Post uploaded successfully!');
          setImage(null);
          setCaption('');
          setUploadProgress(0);
        }
      );
    } catch (error: any) {
      console.error('Upload failed:', error);
      Alert.alert('Upload failed', error.message || 'Unexpected error occurred.');
    }
  };

  const handleReset = () => {
    setImage(null);
    setCaption('');
    setUploadProgress(0);
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

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </Pressable>

      {uploadProgress > 0 && (
        <Text style={styles.progressText}>
          Uploading: {uploadProgress.toFixed(1)}%
        </Text>
      )}

      <Pressable onPress={handleReset}>
        <Text style={styles.resetText}>Reset</Text>
      </Pressable>
    </View>
  );
}

// 🎨 Styles
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
  progressText: {
    color: '#666',
    marginBottom: 12,
  },
});
