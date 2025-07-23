import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { getBookmarks, removeBookmark } from '../storageUtils';
import styles from './Bookmarks.style';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { menuTranslations } from '../../locales/menu';
export default function BookmarksScreen({
  navigation,
}: StackScreenProps<RootStackParamList, 'Bookmarks'>) {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const quranLanguage = useSelector((state: RootState) => state.settings.quranLanguage);
  const t = menuTranslations[quranLanguage];

  useEffect(() => {
    const load = async () => {
      const data = await getBookmarks();
      setBookmarks(data.reverse()); // Most recent first
    };
    const unsubscribe = navigation.addListener('focus', load);
    return unsubscribe;
  }, [navigation]);

  const handleDelete = async (item: any) => {
    await removeBookmark(item);
    const data = await getBookmarks();
    setBookmarks(data.reverse());
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={{
      backgroundColor: '#fff',
      borderRadius: 12,
      marginBottom: 14,
      paddingVertical: 14,
      paddingHorizontal: 18,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    }}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { textAlign: 'right', fontWeight: 'bold', fontSize: 18, color: '#222' }]}>
          {item.type === 'surah'
            ? `سورة ${item.surahName} : ${item.ayahNumber}`
            : `${item.juzName} : ${item.ayahNumber}`}
        </Text>
        <Text style={[styles.type, { textAlign: 'right', color: '#888', fontSize: 14, marginTop: 2 }]}>
          {item.type === 'surah' ? t.surah : t.juz}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => handleDelete(item)}
        style={{ padding: 8, marginLeft: 8 }}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="trash-outline" size={22} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f9f9f2', padding: 16 }}>
      <Text style={styles.header}>{t.bookmarks}</Text>
      <FlatList
        data={bookmarks}
        keyExtractor={(_, i) => i.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 40, color: '#888' }}>
            {t.bookmarks} {t.surah ? '' : 'No bookmarks yet.'}
          </Text>
        }
      />
    </View>
  );
}
