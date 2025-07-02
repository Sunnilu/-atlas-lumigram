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
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  addDoc,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

export default function HomeScreen() {
  const [posts, setPosts] = useState<any[]>([]);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showCaption, setShowCaption] = useState<{ [key: string]: boolean }>({});

  const fetchPosts = async (initial = false) => {
    try {
      const postQuery = initial
        ? query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(5))
        : query(collection(db, 'posts'), orderBy('createdAt', 'desc'), startAfter(lastVisible!), limit(5));

      const snapshot = await getDocs(postQuery);
      const newPosts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      if (initial) {
        setPosts(newPosts);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
      }

      setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
    } catch (error) {
      console.error('Error fetching posts:', error);
      Alert.alert('Error', 'Failed to load posts.');
    }
  };

  useEffect(() => {
    fetchPosts(true);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPosts(true);
    setRefreshing(false);
  };

  const handleLoadMore = async () => {
    if (!loadingMore && lastVisible) {
      setLoadingMore(true);
      await fetchPosts();
      setLoadingMore(false);
    }
  };

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
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No posts found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000542' },
  imageWrapper: {
    marginVertical: 10,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  image: { width: '100%', height: 250, borderRadius: 12 },
  captionOverlay: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 6,
  },
  captionText: { color: '#fff', fontSize: 14 },
  emptyState: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: '#aaa',
    fontSize: 16,
  },
});
