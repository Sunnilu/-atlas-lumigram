import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { getApps } from 'firebase/app';
import { firebaseApp } from '@/lib/firebase'; // your firebase.ts export

export default function TestFirebase() {
  useEffect(() => {
    console.log('Firebase apps:', getApps());
  }, []);

  return (
    <View>
      <Text>Firebase Initialized: {getApps().length > 0 ? '✅' : '❌'}</Text>
    </View>
  );
}
