import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

interface MenuButtonProps {
  title: string;
  onPress: () => void;
}

export default function MenuButton({ title, onPress }: MenuButtonProps) {
  return (
    <Pressable style={styles.button} onPress={onPress} android_ripple={{ color: '#145a23' }}>
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    backgroundColor: '#176d2c',
    paddingVertical: 24,
    borderRadius: 12,
    marginVertical: 12,
    alignItems: 'center',
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
}); 