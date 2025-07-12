/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */


import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, StatusBar, ActivityIndicator, ImageBackground, View, Pressable, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StackScreenProps } from '@react-navigation/stack';
import surahList from './quran-data/surah.json';
import RNFS from 'react-native-fs';
import MenuScreen from './pages/MenuScreen';
import SurahListScreen from './pages/SurahListScreen';
import SurahDetailScreen from './pages/SurahDetailScreen';
import JuzListScreen from './pages/JuzListScreen';
import JuzReadingScreen from './pages/JuzReadingScreen';

// Root stack param list for navigation types
export type RootStackParamList = {
  Menu: undefined;
  SurahList: undefined;
  SurahDetail: { surahNumber: string | number; surahName: string; startAyah?: string };
  JuzList: undefined;
  JuzReading: { startSurah: string; startAyah: string; endSurah: string; endAyah: string; juzName: string };
};

const Stack = createStackNavigator<RootStackParamList>();

// Local file fetch function
export const getSurah = async (surahNumber: string | number) => {
  const surahNum = parseInt(String(surahNumber), 10).toString();
  const fileName = `surah_${surahNum}.json`;
  try {
    let content;
    if (Platform.OS === 'android') {
      const filePath = `quran-data/surah/${fileName}`;
      content = await RNFS.readFileAssets(filePath, 'utf8');
      console.log('Loaded surah file (android):', filePath);
    } else {
      const filePath = `${RNFS.MainBundlePath}/quran-data/surah/${fileName}`;
      content = await RNFS.readFile(filePath, 'utf8');
      console.log('Loaded surah file (ios):', filePath);
    }
    const data = JSON.parse(content);
    let ayatArray = [];
    if (Array.isArray(data)) {
      ayatArray = data;
    } else if (data.verses) {
      ayatArray = data.verses;
    } else if (data.verse) {
      ayatArray = Object.entries(data.verse).map(([key, value]) => ({ verse: key, text: value }));
    }
    console.log('Ayat loaded:', Array.isArray(ayatArray) ? ayatArray.length : typeof ayatArray);
    return ayatArray || [];
  } catch (e) {
    console.log('Error loading surah:', e);
    return [];
  }
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Menu">
        <Stack.Screen name="Menu" component={MenuScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SurahList" component={SurahListScreen} options={{ title: 'Surahs' }} />
        <Stack.Screen name="SurahDetail" component={SurahDetailScreen} options={({ route }) => ({ title: route.params.surahName })} />
        <Stack.Screen name="JuzList" component={JuzListScreen} options={{ title: 'Juz Index' }} />
        <Stack.Screen name="JuzReading" component={JuzReadingScreen} options={({ route }) => ({ title: route.params.juzName })} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  surahItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
  surahName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  surahInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  surahDetailTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#007bff',
  },
  ayatList: {
    padding: 20,
  },
  ayatText: {
    fontSize: 20,
    color: '#222',
    marginBottom: 12,
    textAlign: 'right',
    lineHeight: 32,
    fontFamily: 'System',
  },
});
