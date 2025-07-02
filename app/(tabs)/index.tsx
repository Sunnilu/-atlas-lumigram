import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { db, auth } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { homeFeed } from '@/constants/placeholder'; // Replace later with Firestore data

export default function HomeScreen() {
  const [showCaption, setShowCaption] = useState<{ [key: string]: boolean }>({});
  const [favoritePostIds, setFavoritePostIds] = useState<Set<string>>(new Set());

  // ✅ Fetch user's favorites on mount
  useEffect(() => {
    const fetchFavorites = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(collection(db, 'favorites'), where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      const ids = snapshot.docs.map((doc) => doc.data().postId);
      setFavoritePostIds(new Set(ids));
    };

    fetchFavorites();
  }, []);

  // ✅ Double Tap: Add to favorites in Firestore
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
      setFavoritePostIds((prev) => new Set(prev).add(item.id));
      Alert.alert('✅ Added to favorites!');
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
          {favoritePostIds.has(item.id) && (
            <Text style={styles.favoriteText}>❤️ Favorited</Text>
          )}
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
  favoriteText: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontWeight: 'bold',
  },
});
