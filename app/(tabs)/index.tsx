import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { homeFeed } from '@/constants/placeholder';

export default function HomeScreen() {
  const [showCaption, setShowCaption] = useState<{ [key: string]: boolean }>({});

  const handleDoubleTap = () => {
    Alert.alert('Double tapped!');
  };

  const handleLongPress = (id: string) => {
    setShowCaption((prev) => ({ ...prev, [id]: true }));
  };

  const renderItem = ({ item }: any) => {
    const doubleTapGesture = Gesture.Tap()
      .numberOfTaps(2)
      .onEnd((_event, success) => {
        if (success) handleDoubleTap();
      });

    const longPressGesture = Gesture.LongPress()
      .minDuration(600)
      .onStart(() => handleLongPress(item.id));

    const composedGesture = Gesture.Race(doubleTapGesture, longPressGesture);

    return (
      <GestureDetector gesture={composedGesture}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: item.image }} style={styles.image} />
          {showCaption[item.id] && (
            <View style={styles.captionBox}>
              <Text style={styles.captionText}>{item.caption}</Text>
            </View>
          )}
        </View>
      </GestureDetector>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={homeFeed}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000542',
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
