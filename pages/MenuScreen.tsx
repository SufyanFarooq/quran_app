import React, { useRef, useEffect, useState } from 'react';
import moment from 'moment-hijri';
import { SafeAreaView, View, StyleSheet, Text, TouchableOpacity, StatusBar, Dimensions, Image, Animated } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../App';

// @ts-ignore
declare module 'moment-hijri';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CARD_WIDTH = (SCREEN_WIDTH - 16 * 2 - 12) / 2; // 16px margin on both sides, 12px gap between cards
const CARD_HEIGHT = 150;
const BANNER_HEIGHT = Math.round(SCREEN_WIDTH * 0.45); // 20% of screen width (for portrait)

const MENU_ITEMS = [
  { key: 'resume', label: 'Resume Reading', icon: '📖', onPress: () => {} },
  { key: 'read', label: 'Read Quran', icon: '🕋', onPress: () => {} },
  { key: 'surahs', label: 'Surahs', icon: 'سورة', onPress: (nav: any) => nav.navigate('SurahList') },
  { key: 'juz', label: 'Juz', icon: 'پارہ', onPress: (nav: any) => nav.navigate('JuzList') },
  { key: 'settings', label: 'Settings', icon: '⚙️', onPress: () => {} },
  { key: 'jump', label: 'Jump to Ayah', icon: '↗️', onPress: () => {} },
  { key: 'bookmarks', label: 'Bookmarks', icon: '🔖', onPress: () => {} },
];

const BANNERS = [
  require('../assets/banners/banner_1.jpg'),
  require('../assets/banners/banner_2.jpg'),
  require('../assets/banners/banner_3.jpg'),
];

export default function MenuScreen({ navigation }: StackScreenProps<RootStackParamList, 'Menu'>) {
  const [bannerIndex, setBannerIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        // Change image
        setBannerIndex(prev => (prev + 1) % BANNERS.length);
        // Fade in
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
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const englishDate = `${days[now.getDay()]}, ${now.getDate()}-${months[now.getMonth()]}-${now.getFullYear().toString().slice(-2)}`;

  // Dynamic Hijri date
  const islamicDate = moment().format('iD iMMMM');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.background}>
        {/* Banner section (fixed height, 20% of screen) */}
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
        {/* Menu grid (scrollable) */}
        <View style={styles.menuGridWrapper}>
          <View style={styles.menuGridScrollContainer}>
            <View style={styles.menuGrid}>
              {MENU_ITEMS.map(item => (
                <TouchableOpacity
                  key={item.key}
                  style={styles.menuCard}
                  onPress={() => item.onPress(navigation)}
                  activeOpacity={0.8}
                >
                  <Image
                    source={
                      
                      item.key === 'resume' ? require('../assets/resume-reading.png') :
                      item.key === 'resume' ? require('../assets/parah.png') :
                      item.key === 'read' ? require('../assets/read-quran.png') :
                      item.key === 'surahs' ? require('../assets/surah.png') :
                      item.key === 'settings' ? require('../assets/settings.png') :
                      item.key === 'jump' ? require('../assets/jump.png') :
                      item.key === 'bookmarks' ? require('../assets/bookmarks.png') :

                      require('../assets/parah.png')
                    }
                    style={styles.menuIconImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.menuLabel}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingTop: 0,
    backgroundColor: '#f5f5f5',
  },
  bannerWrapper: {
    width: '100%',
    height: BANNER_HEIGHT,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    alignItems: 'center',
    // marginTop:7,
    // Remove marginTop and position to keep inside SafeArea
  },
  bannerCarousel: {
    width: '100%',
    height: '100%',
    // borderRadius: 24,
    overflow: 'hidden',
  },
  bannerCarouselContent: {
    alignItems: 'center',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    // borderRadius: 24,
    marginHorizontal: SCREEN_WIDTH * 0.04,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
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
  searchBarOverlapWrapper: {
    position: 'absolute',
    top: BANNER_HEIGHT - 28,
    left: 0,
    width: '100%',
    alignItems: 'center',
    zIndex: 2,
  },
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
  menuGridWrapper: {
    flex: 1,
    marginTop: 38,
    zIndex: 1,
  },
  menuGridScrollContainer: {
    flex: 1,
    paddingBottom: 24,
    overflow: 'hidden',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginHorizontal: 16,
    marginTop: 8,
  },
  menuCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  menuIconPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e0e0e0',
    marginBottom: 10,
  },
  menuIconImage: {
    width: 150,
    height: 80,
    marginBottom: 10,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
  },
}); 