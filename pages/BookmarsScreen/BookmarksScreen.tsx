import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { getBookmarks } from '../storageUtils';
import styles from './Bookmarks.style';
export default function BookmarksScreen({
  navigation,
}: StackScreenProps<RootStackParamList, 'Bookmarks'>) {
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await getBookmarks();
      setBookmarks(data.reverse()); // Most recent first
    };
    const unsubscribe = navigation.addListener('focus', load);
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        if (item.type === 'surah') {
          navigation.navigate('SurahDetail', {
            surahNumber: item.surahNumber,
            surahName: item.surahName,
            startAyah: item.ayahNumber,
          });
        } else if (item.type === 'juz') {
          navigation.navigate('JuzReading', {
            startSurah: item.startSurah,
            startAyah: item.startAyah,
            endSurah: item.endSurah,
            endAyah: item.endAyah,
            juzName: item.juzName,
            ayahNumber: item.ayahNumber,
          });
        }
      }}
    >
      <Text style={styles.title}>
        {item.type === 'surah'
          ? `سورة ${item.surahName} : ${item.ayahNumber}`
          : `${item.juzName} : ${item.ayahNumber}`}
      </Text>
      <Text style={styles.type}>{item.type === 'surah' ? 'Surah' : 'Juz'}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f9f9f2', padding: 16 }}>
      <Text style={styles.header}>Bookmarks</Text>
      <FlatList
        data={bookmarks}
        keyExtractor={(_, i) => i.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 40, color: '#888' }}>
            No bookmarks yet.
          </Text>
        }
      />
    </View>
  );
}
