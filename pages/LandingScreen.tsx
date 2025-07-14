import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Animated,
  Dimensions,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import moment from 'moment-hijri';
import surahList from '../quran-data/surah.json';
import RNFS from 'react-native-fs';
import { RootStackParamList } from '../App';
import { days, months } from './dateUtils';

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

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_HEIGHT = Math.round(SCREEN_WIDTH * 0.45);
const BANNERS = [
  require('../assets/banners/banner_1.jpg'),
  require('../assets/banners/banner_2.jpg'),
  require('../assets/banners/banner_3.jpg'),
];

export default function LandingScreen({ navigation }: Props) {
  // Removed unused date and hijri state
  const [ayah, setAyah] = useState<any>(null);
  const [bannerIndex, setBannerIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Get random ayah
    getRandomAyat().then(setAyah);
    // Banner carousel
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        setBannerIndex(prev => (prev + 1) % BANNERS.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [fadeAnim]);

  // Dynamic English date
  const now = new Date();
  const englishDate = `${days[now.getDay()]}, ${now.getDate()}-${
    months[now.getMonth()]
  }-${now.getFullYear().toString().slice(-2)}`;
  // Dynamic Hijri date
  const islamicDate = moment().format('iD iMMMM');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f7f7f7' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {/* Banner section (fixed height) */}
      <View style={styles.bannerWrapper}>
        <Animated.Image
          source={BANNERS[bannerIndex]}
          style={[styles.bannerImage, { opacity: fadeAnim }]}
          resizeMode="cover"
        />
        <View style={styles.bannerDateOverlay}>
          <Text style={styles.bannerDateText}>{islamicDate}</Text>
          <Text style={styles.bannerDateSub}>{englishDate}</Text>
        </View>
      </View>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  banner: { height: 120, justifyContent: 'flex-end' },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  bannerContent: { flexDirection: 'row', alignItems: 'flex-end', padding: 16 },
  hijri: { color: '#fff', fontSize: 28, fontWeight: 'bold', letterSpacing: 1 },
  gregorian: { color: '#fff', fontSize: 16, marginTop: 2 },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 22,
    width: '88%',
    marginBottom: 0,
    paddingHorizontal: 18,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  searchPlaceholder: {
    color: '#bbb',
    fontSize: 16,
  },
  searchBarOverlapWrapper: {
    position: 'absolute',
    top: BANNER_HEIGHT - 28,
    left: 0,
    width: '100%',
    alignItems: 'center',
    zIndex: 2,
  },
  ayatCard: {
    backgroundColor: '#fff',
    margin:18,
    marginTop: 36,
    borderRadius: 16,
    padding: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    alignItems: 'flex-end',
  },
  ayatArabic: {
    fontSize: 22,
    color: '#222',
    textAlign: 'right',
    fontFamily: 'System',
    marginBottom: 8,
  },
  ayatSurah: { fontSize: 14, color: '#888', textAlign: 'right' },
  promoCard: {
    backgroundColor: '#eaf2fa',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 18,
    marginTop: 8,
    alignItems: 'center',
  },
  promoTitle: {
    color: '#d32f2f',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 6,
  },
  promoText: { color: '#222', fontSize: 16, textAlign: 'center' },
  quranButton: {
    backgroundColor: '#4b3b2a',
    borderRadius: 16,
    margin: 16,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  quranButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  bannerWrapper: {
    height: BANNER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bannerImage: {
    ...StyleSheet.absoluteFillObject,
    width: SCREEN_WIDTH,
    height: BANNER_HEIGHT,
  },
  bannerDateOverlay: {
    position: 'absolute',
    left: 24,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 2,
  },
  bannerDateText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    letterSpacing: 1,
  },
  bannerDateSub: {
    color: '#f0f0f0',
    fontSize: 16,
    fontWeight: '400',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginTop: 2,
    letterSpacing: 0.5,
  },
});
