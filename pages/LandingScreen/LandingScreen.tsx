import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import surahList from '../../quran-data/surah.json';
import RNFS from 'react-native-fs';
import { RootStackParamList } from '../../App';
import BannerCarousel from '../../components/BannerCarousel';
import styles from './LandingScreen.style';
// Helper to get a random ayat
const getRandomAyat = async () => {
  // Pick a random surah
  const surah = surahList[Math.floor(Math.random() * surahList.length)];
  const surahNum = parseInt(surah.index, 10).toString();
  const fileName = `surah_${surahNum}.json`;
  try {
    let content;
    if (Platform.OS === 'android') {
      const filePath = `quran-data/surah/${fileName}`;
      content = await RNFS.readFileAssets(filePath, 'utf8');
    } else {
      const filePath = `${RNFS.MainBundlePath}/quran-data/surah/${fileName}`;
      content = await RNFS.readFile(filePath, 'utf8');
    }
    const data = JSON.parse(content);
    let ayatArray = Array.isArray(data)
      ? data
      : data.verses || Object.values(data.verse || {});
    const ayah = ayatArray[Math.floor(Math.random() * ayatArray.length)];
    return {
      surahName: surah.title_ar,
      surahNameEn: surah.title_en,
      ayahText: ayah.text || ayah,
      ayahNum: ayah.verse || ayah.number || '',
    };
  } catch (e) {
    return null;
  }
};

type Props = StackScreenProps<RootStackParamList, any>;



export default function LandingScreen({ navigation }: Props) {
  const [ayah, setAyah] = useState<any>(null);


  useEffect(() => {
    // Get random ayah
    getRandomAyat().then(setAyah);
  }, []);


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f7f7f7' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {/* Banner section (fixed height) */}
      <BannerCarousel />
      {/* Search bar (overlapping banner and menu) */}
      <View style={styles.searchBarOverlapWrapper}>
        <View style={styles.searchBar}>
          <Text style={styles.searchPlaceholder}>Search</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Ayat Card */}
        {ayah && (
          <View style={styles.ayatCard}>
            <Text style={styles.ayatArabic}>{ayah.ayahText}</Text>
            <Text style={styles.ayatSurah}>
              {ayah.surahName} ({ayah.surahNameEn})
            </Text>
          </View>
        )}
        {/* Promotion Banner Placeholder */}
        <View style={styles.promoCard}>
          <Text style={styles.promoTitle}>عظیم خوشخبری</Text>
          <Text style={styles.promoText}>
            جلد ہی یہاں پر خصوصی فیچر یا پروموشن نظر آئے گی۔
          </Text>
        </View>
        {/* Empty space for future features */}
        <View style={{ flex: 1, minHeight: 80 }} />
      </ScrollView>
      {/* Quran Button */}
      <TouchableOpacity
        style={styles.quranButton}
        onPress={() => navigation.navigate('Menu')}
      >
        <Text style={styles.quranButtonText}>Quran</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}


