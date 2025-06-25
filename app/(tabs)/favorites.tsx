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
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { homeFeed } from '@/constants/placeholder'; // ✅ update this path if needed

export default function FavoritesScreen() {
  const [showCaptions, setShowCaptions] = useState<{ [key: string]: boolean }>({});

  const renderItem = ({ item }: any) => {
    const doubleTap = Gesture.Tap()
      .numberOfTaps(2)
      .onEnd(() => {
        Alert.alert('Double tapped on favorite!');
      });

    const longPress = Gesture.LongPress()
      .minDuration(300)
      .onStart(() => {
        setShowCaptions((prev) => ({ ...prev, [item.id]: true }));
      });

    const composed = Gesture.Race(doubleTap, longPress);

    return (
      <GestureDetector gesture={composed}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: item.image }} style={styles.image} />
          {showCaptions[item.id] && (
            <View style={styles.captionBox}>
              <Text style={styles.captionText}>{item.caption}</Text>
            </View>
          )}
        </View>
      </GestureDetector>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <FlatList
        data={homeFeed}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageWrapper: {
    marginVertical: 10,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 12,
  },
  captionBox: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 6,
    borderRadius: 6,
  },
  captionText: {
    color: '#fff',
    fontSize: 14,
  },
});
