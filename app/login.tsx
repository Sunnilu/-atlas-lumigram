import { Text, View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Atlas{"\n"}<Text style={styles.school}>SCHOOL</Text></Text>
      <Text style={styles.loginTitle}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#ccc"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#ccc"
        secureTextEntry
      />

      <Pressable style={styles.signInButton} onPress={() => router.push('/(tabs)')}>
        <Text style={styles.signInText}>Sign in</Text>
      </Pressable>

      <Link href="/register" asChild>
        <Pressable style={styles.createAccountButton}>
          <Text style={styles.createAccountText}>Create a new account</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03014C',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  school: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4EE0BC',
  },
  loginTitle: {
    fontSize: 24,
    color: 'white',
    marginVertical: 20,
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: 'transparent',
    borderColor: '#4EE0BC',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
    color: 'white',
  },
  signInButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#4EE0BC',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
  },
  signInText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#03014C',
  },
  createAccountButton: {
    borderWidth: 1,
    borderColor: '#4EE0BC',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  createAccountText: {
    color: 'white',
  },
});
