import { Text, View } from 'react-native';

export default function Page() {
    return (
        <view style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <text>Search</text>
            <link href="/profile/1">
            <Text>Profile 1:</Text>
            </link>
            <link href="/profile/2">
            <Text>Profile 2:</Text>
            </link>
        </view>
    );
}