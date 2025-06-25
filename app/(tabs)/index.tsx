import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  StyleSheet,
  FlatList,
} from 'react-native';
import {
  GestureHandlerRootView,
  TapGestureHandler,
  LongPressGestureHandler,
  State,
} from 'react-native-gesture-handler';
import { homeFeed } from '@/constants/placeholder'; // ✅ adjust path if needed

export default function HomeScreen() {
  const [showCaption, setShowCaption] = useState<{ [key: string]: boolean }>({});

  const handleDoubleTap = () => {
    Alert.alert('Double tapped!');
  };

  const handleLongPress = (id: string) => {
    setShowCaption((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <FlatList
        data={homeFeed}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LongPressGestureHandler
            onHandlerStateChange={({ nativeEvent }) => {
              if (nativeEvent.state === State.ACTIVE) {
                handleLongPress(item.id);
              }
            }}
            minDurationMs={600}
          >
            <TapGestureHandler
              numberOfTaps={2}
              onHandlerStateChange={({ nativeEvent }) => {
                if (nativeEvent.state === State.ACTIVE) {
                  handleDoubleTap();
                }
              }}
            >
              <View style={styles.imageWrapper}>
                <Image source={{ uri: item.image }} style={styles.image} />
                {showCaption[item.id] && (
                  <View style={styles.captionBox}>
                    <Text style={styles.captionText}>{item.caption}</Text>
                  </View>
                )}
              </View>
            </TapGestureHandler>
          </LongPressGestureHandler>
        )}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000542', // Matches screenshot background
  },
  imageWrapper: {
    marginVertical: 8,
    marginHorizontal: 12,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 12,
  },
  captionBox: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 6,
    borderRadius: 4,
  },
  captionText: {
    color: '#fff',
    fontSize: 14,
  },
});
