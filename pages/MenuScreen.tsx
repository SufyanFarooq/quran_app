import React, { useRef, useEffect, useState } from 'react';
import moment from 'moment-hijri';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Image,
  Animated,
  Modal,
  TextInput,
  Pressable,
} from 'react-native';
// Remove Picker from 'react-native' import
// import { Picker } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { ScrollView } from 'react-native-gesture-handler';
import { days, months } from './dateUtils';
import { loadLastReadPosition } from './storageUtils';
import surahList from '../quran-data/surah.json';
import juzList from '../quran-data/juz.json';

// @ts-ignore
declare module 'moment-hijri';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CARD_WIDTH = (SCREEN_WIDTH - 16 * 2 - 12) / 2; // 16px margin on both sides, 12px gap between cards
const CARD_HEIGHT = 150;
const BANNER_HEIGHT = Math.round(SCREEN_WIDTH * 0.45); // 20% of screen width (for portrait)

export default function MenuScreen({
  navigation,
}: StackScreenProps<RootStackParamList, 'Menu'>) {
  const [bannerIndex, setBannerIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [jumpModalVisible, setJumpModalVisible] = useState(false);
  const [jumpType, setJumpType] = useState('surah');
  const [selectedSurah, setSelectedSurah] = useState(surahList[0]?.index || '001');
  const [selectedJuz, setSelectedJuz] = useState(juzList[0]?.index || '1');
  const [ayahNumber, setAyahNumber] = useState('');

  // Dropdown state for Surah
  const [surahDropdownOpen, setSurahDropdownOpen] = useState(false);
  const [surahDropdownValue, setSurahDropdownValue] = useState(selectedSurah);
  const [surahDropdownItems, setSurahDropdownItems] = useState(
    surahList.map(s => ({
      label: `سورة ${s.title_ar} - ${parseInt(s.index)}`,
      value: s.index,
    }))
  );

  // Move MENU_ITEMS inside the component to access setJumpModalVisible
  const MENU_ITEMS = [
    {
      key: 'resume',
      label: 'Resume Reading',
      icon: '📖',
      onPress: async (nav: any) => {
        const last = await loadLastReadPosition();
        if (!last) return;
        if (last.type === 'surah') {
          nav.navigate('SurahDetail', {
            surahNumber: last.surahNumber,
            surahName: last.surahName,
            startAyah: last.ayahNumber,
          });
        } else if (last.type === 'juz') {
          nav.navigate('JuzReading', {
            startSurah: last.startSurah,
            startAyah: last.startAyah,
            endSurah: last.endSurah,
            endAyah: last.endAyah,
            juzName: last.juzName,
            ayahNumber: last.ayahNumber, // Pass ayahNumber for resume
          });
        }
      },
    },
    { key: 'read', label: 'Read Quran', icon: '🕋', onPress: () => {} },
    {
      key: 'surahs',
      label: 'Surahs',
      icon: 'سورة',
      onPress: (nav: any) => nav.navigate('SurahList'),
    },
    {
      key: 'juz',
      label: 'Juz',
      icon: 'پارہ',
      onPress: (nav: any) => nav.navigate('JuzList'),
    },
    { key: 'settings', label: 'Settings', icon: '⚙️', onPress: () => {} },
    { key: 'jump', label: 'Jump to Ayah', icon: '↗️', onPress: () => setJumpModalVisible(true) },
    { key: 'bookmarks', label: 'Bookmarks', icon: '🔖', onPress: () => {} },
  ];

  const BANNERS = [
    require('../assets/banners/banner_1.jpg'),
    require('../assets/banners/banner_2.jpg'),
    require('../assets/banners/banner_3.jpg'),
  ];

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
  const englishDate = `${days[now.getDay()]}, ${now.getDate()}-${
    months[now.getMonth()]
  }-${now.getFullYear().toString().slice(-2)}`;

  // Dynamic Hijri date
  const islamicDate = moment().format('iD iMMMM');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.background}>
        {/* Banner section (fixed height, 20% of screen) */}
        <View style={styles.bannerWrapper}>
          {/* Back button icon */}
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 105,
              left: 12,
              zIndex: 10,
              // backgroundColor: 'rgba(0,0,0,0.35)',
              // borderRadius: 20,
              padding: 6,
            }}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text
              style={{
                color: '#fff',
                fontSize: 50,
                fontWeight: 'bold',
                // textShadowColor: 'rgba(0,0,0,0.7)',
                // textShadowOffset: { width: 1, height: 1 },
                // textShadowRadius: 4,
              }}
            >
              ←
            </Text>
          </TouchableOpacity>
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
        <ScrollView style={styles.menuGridWrapper}>
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
                      item.key === 'resume'
                        ? require('../assets/menu/resume-reading.png')
                        : item.key === 'juz'
                        ? require('../assets/menu/parah.png')
                        : item.key === 'read'
                        ? require('../assets/menu/read-quran.png')
                        : item.key === 'surahs'
                        ? require('../assets/menu/surah.png')
                        : item.key === 'settings'
                        ? require('../assets/menu/settings.png')
                        : item.key === 'jump'
                        ? require('../assets/menu/jump.png')
                        : item.key === 'bookmarks'
                        ? require('../assets/menu/bookmarks.png')
                        : require('../assets/menu/parah.png')
                    }
                    style={styles.menuIconImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.menuLabel}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
        {/* Jump to Ayah Modal */}
        <Modal
          visible={jumpModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setJumpModalVisible(false)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.3)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 20,
                padding: 24,
                width: '90%',
                maxWidth: 400,
                alignItems: 'stretch',
              }}
            >
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: 'bold',
                  marginBottom: 18,
                  textAlign: 'center',
                  letterSpacing: 0.5,
                }}
              >
                Jump to Ayah
              </Text>
              {/* Dropdown */}
              {jumpType === 'surah' ? (
                <>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'right', fontFamily: 'QCF_BSML', marginBottom: 6 }}>
                    {`سورة ${surahList.find(s => s.index === surahDropdownValue)?.title_ar || ''} - ${parseInt(surahDropdownValue)}`}
                  </Text>
                  <DropDownPicker
                    open={surahDropdownOpen}
                    value={surahDropdownValue}
                    items={surahDropdownItems}
                    setOpen={setSurahDropdownOpen}
                    setValue={setSurahDropdownValue}
                    setItems={setSurahDropdownItems}
                    style={{ marginBottom: 18, zIndex: 1000 }}
                    textStyle={{ fontFamily: 'QCF_BSML', fontSize: 20, textAlign: 'right' }}
                    dropDownDirection="AUTO"
                  />
                </>
              ) : (
                <>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'right', fontFamily: 'QCF_BSML', marginBottom: 6 }}>
                    {`پارہ ${juzList.find(j => j.index === selectedJuz)?.name || ''}`}
                  </Text>
                  <View style={{ flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 18 }}>
                    <Picker
                      selectedValue={selectedJuz}
                      onValueChange={setSelectedJuz}
                      style={{ flex: 1, direction: 'rtl', textAlign: 'left' }}
                      itemStyle={{ textAlign: 'right', fontFamily: 'QCF_BSML', fontSize: 20 }}
                    >
                      {juzList.map(j => (
                        <Picker.Item
                          key={j.index}
                          label={`پارہ ${j.name} - ${j.index}`}
                          value={j.index}
                          style={{ textAlign: 'right', fontFamily: 'QCF_BSML', fontSize: 20 }}
                        />
                      ))}
                    </Picker>
                  </View>
                </>
              )}
              {/* Ayah Number Label */}
              <Text style={{ marginBottom: 4, fontWeight: 'bold', fontSize: 18 }}>Ayah Number</Text>
              {/* Ayah input */}
              <TextInput
                value={ayahNumber}
                onChangeText={setAyahNumber}
                placeholder="Ayah Number"
                keyboardType="numeric"
                style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 18, fontSize: 18 }}
              />
              {/* Buttons */}
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 8 }}>
                <TouchableOpacity
                  style={{
                    borderWidth: 2,
                    borderColor: '#2e5d32',
                    borderRadius: 24,
                    paddingVertical: 8,
                    paddingHorizontal: 28,
                    marginRight: 8,
                    backgroundColor: '#fff',
                  }}
                  onPress={() => setJumpModalVisible(false)}
                >
                  <Text style={{ color: '#2e5d32', fontWeight: 'bold', fontSize: 18 }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#2e5d32',
                    borderRadius: 24,
                    paddingVertical: 8,
                    paddingHorizontal: 32,
                  }}
                  onPress={() => {
                    setJumpModalVisible(false);
                    if (jumpType === 'surah') {
                      navigation.navigate('SurahDetail', {
                        surahNumber: surahDropdownValue,
                        surahName:
                          surahList.find(s => s.index === surahDropdownValue)?.title_ar || '',
                        startAyah: ayahNumber,
                      });
                    } else {
                      // Find Juz params from juzList
                      const juz = juzList.find(j => j.index === selectedJuz);
                      if (juz) {
                        navigation.navigate('JuzReading', {
                          startSurah: juz.start.index,
                          startAyah: juz.start.verse,
                          endSurah: juz.end.index,
                          endAyah: juz.end.verse,
                          juzName: `Juz ${juz.index}`,
                          ayahNumber: ayahNumber, // Pass last read ayah number
                        });
                      }
                    }
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Go</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
    shadowOpacity: 0.1,
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
