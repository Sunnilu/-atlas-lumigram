import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { collection, getDocs, query, orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const PAGE_SIZE = 10;

export default function HomeScreen() {
  const [posts, setPosts] = useState<any[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showCaption, setShowCaption] = useState<{ [key: string]: boolean }>({});

  const fetchPosts = async (reset = false) => {
    setLoading(true);
    try {
      const postsQuery = reset
        ? query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(PAGE_SIZE))
        : query(
            collection(db, 'posts'),
            orderBy('createdAt', 'desc'),
            startAfter(lastDoc),
            limit(PAGE_SIZE)
          );

      const snapshot = await getDocs(postsQuery);
      const newPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setPosts(prev => (reset ? newPosts : [...prev, ...newPosts]));
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    } catch (error) {
      console.error('Error fetching posts:', error);
      Alert.alert('Error', 'Failed to load posts.');
    } finally {
      setLoading(false);
      if (reset) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts(true);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setLastDoc(null);
    fetchPosts(true);
  };

  const handleLoadMore = () => {
    if (!loading && lastDoc) {
      fetchPosts();
    }
  };

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
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
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
      {loading && posts.length === 0 ? (
        <ActivityIndicator size="large" color="#4EE0BC" />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.2}
        />
      )}
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
