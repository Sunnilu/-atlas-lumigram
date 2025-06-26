import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from 'expo-router';
import { LogoutComponent } from '@/components/LogoutComponent';

export default function EditProfileScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('pink-flowers23131');
  const [image, setImage] = useState('https://source.unsplash.com/200x200/?leaf');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const saveProfile = () => {
    Alert.alert('✅ Profile updated!');
    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Edit Profile',
          headerRight: () => <LogoutComponent />,
        }}
      />
      <View style={styles.container}>
        <Pressable onPress={pickImage}>
          <Image source={{ uri: image }} style={styles.avatar} />
        </Pressable>

        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter username"
          placeholderTextColor="#888"
        />

        <Pressable style={styles.button} onPress={saveProfile}>
          <Text style={styles.buttonText}>Save profile</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    alignItems: 'center',
    paddingTop: 60,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 48,
    borderWidth: 1,
    borderColor: '#3CE3BF',
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 20,
    backgroundColor: 'white',
    color: '#000',
  },
  button: {
    backgroundColor: '#3CE3BF',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
