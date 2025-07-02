import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showCaptions, setShowCaptions] = useState<{ [key: string]: boolean }>({});

  const fetchFavorites = async (initial = false) => {
    const user = auth.currentUser;
    if (!user) return;

    const favoritesRef = collection(db, 'favorites');
    const favQuery = initial
      ? query(
          favoritesRef,
          where('userId', '==', user.uid),
          orderBy('favoritedAt', 'desc'),
          limit(5)
        )
      : query(
          favoritesRef,
          where('userId', '==', user.uid),
          orderBy('favoritedAt', 'desc'),
          startAfter(lastVisible),
          limit(5)
        );

    const snapshot = await getDocs(favQuery);
    const newFavorites = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    if (initial) {
      setFavorites(newFavorites);
    } else {
      setFavorites((prev) => [...prev, ...newFavorites]);
    }

    setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
  };

  useEffect(() => {
    fetchFavorites(true);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchFavorites(true);
    setRefreshing(false);
  };

  const handleLoadMore = async () => {
    if (!loadingMore && lastVisible) {
      setLoadingMore(true);
      await fetchFavorites();
      setLoadingMore(false);
    }
  };

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
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
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
