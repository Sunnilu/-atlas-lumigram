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
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase'; // your firebase exports
import { homeFeed } from '@/constants/placeholder'; // use Firestore data later

export default function HomeScreen() {
  const [showCaption, setShowCaption] = useState<{ [key: string]: boolean }>({});

  const handleDoubleTap = async (item: any) => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Login required', 'Please log in to favorite posts.');
      return;
    }

    try {
      await addDoc(collection(db, 'favorites'), {
        userId: user.uid,
        postId: item.id,
        favoritedAt: new Date(),
      });
      Alert.alert('✅ Favorited!');
    } catch (error) {
      console.error('Failed to favorite:', error);
      Alert.alert('Error', 'Could not save to favorites.');
    }
  };

  const handleLongPress = (id: string) => {
    setShowCaption((prev) => ({ ...prev, [id]: true }));
  };

  const renderItem = ({ item }: any) => {
    const doubleTap = Gesture.Tap()
      .numberOfTaps(2)
      .onEnd((_e, success) => {
        if (success) handleDoubleTap(item);
      });

    const longPress = Gesture.LongPress()
      .minDuration(500)
      .onStart(() => handleLongPress(item.id));

    const gesture = Gesture.Race(doubleTap, longPress);

    return (
      <GestureDetector gesture={gesture}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: item.image }} style={styles.image} />
          {showCaption[item.id] && (
            <View style={styles.captionOverlay}>
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
        data={homeFeed} // replace with Firestore posts later
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
    marginVertical: 10,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 12,
  },
  captionOverlay: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 6,
  },
  captionText: {
    color: '#fff',
    fontSize: 14,
  },
});
