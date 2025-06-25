// app/register.tsx
import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Atlas</Text>
      <Text style={styles.subLogo}>SCHOOL</Text>

      <Text style={styles.title}>Register</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#7FFFD4"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#7FFFD4"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Pressable style={styles.button} onPress={() => router.replace('/(tabs)')}>
        <Text style={styles.buttonText}>Create Account</Text>
      </Pressable>

      <Pressable style={styles.outlineButton} onPress={() => router.replace('/login')}>
        <Text style={styles.outlineButtonText}>Login to existing account</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000542',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subLogo: {
    fontSize: 20,
    color: '#3CE3BF',
    letterSpacing: 3,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#3CE3BF',
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 16,
    paddingHorizontal: 12,
    color: '#fff',
  },
  button: {
    backgroundColor: '#3CE3BF',
    paddingVertical: 14,
    width: '100%',
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  outlineButton: {
    borderColor: '#3CE3BF',
    borderWidth: 1,
    paddingVertical: 14,
    width: '100%',
    borderRadius: 6,
    alignItems: 'center',
  },
  outlineButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
