import { Ionicons } from '@expo/vector-icons';
import React from 'react';

type TabBarIconProps = {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  size?: number;
};

export function TabBarIcon({ name, color, size = 28 }: TabBarIconProps) {
  return <Ionicons name={name} color={color} size={size} />;
}
