import { Text, View } from 'react-native';

export default function Page() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Register</Text>
            <link href="/login">
                <Text>Log in to existing</Text>
            </link>
        </View>
    );
}