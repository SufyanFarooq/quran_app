import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { ScrollView } from 'react-native-gesture-handler';
import { loadLastReadPosition } from '../storageUtils';
import surahList from '../../quran-data/surah.json';
import juzList from '../../quran-data/juz.json';
import BannerCarousel from '../../components/BannerCarousel';
import JumpToAyahModal from '../../components/JumpToAyahModal';
import styles from './MenuScreen.styles';

// @ts-ignore
declare module 'moment-hijri';

export default function MenuScreen({
  navigation,
}: StackScreenProps<RootStackParamList, 'Menu'>) {
  const [jumpModalVisible, setJumpModalVisible] = useState(false);

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
    {
      key: 'read',
      label: 'Read Quran',
      icon: '🕋',
      onPress: (nav: any) => nav.navigate('ReadQuranList'),
    },
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
    {
      key: 'jump',
      label: 'Jump to Ayah',
      icon: '↗️',
      onPress: () => setJumpModalVisible(true),
    },
    {
      key: 'bookmarks',
      label: 'Bookmarks',
      icon: '🔖',
      onPress: (nav: any) => nav.navigate('Bookmarks'),
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.background}>
        {/* Banner section (fixed height, 20% of screen) */}
        <BannerCarousel />
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
                        ? require('../../assets/menu/resume-reading.png')
                        : item.key === 'juz'
                        ? require('../../assets/menu/parah.png')
                        : item.key === 'read'
                        ? require('../../assets/menu/read-quran.png')
                        : item.key === 'surahs'
                        ? require('../../assets/menu/surah.png')
                        : item.key === 'settings'
                        ? require('../../assets/menu/settings.png')
                        : item.key === 'jump'
                        ? require('../../assets/menu/jump.png')
                        : item.key === 'bookmarks'
                        ? require('../../assets/menu/bookmarks.png')
                        : require('../../assets/menu/parah.png')
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
        <JumpToAyahModal
          visible={jumpModalVisible}
          onClose={() => setJumpModalVisible(false)}
          onJump={params => {
            setJumpModalVisible(false);
            if (params.type === 'surah') {
              navigation.navigate('SurahDetail', {
                surahNumber: params.surahNumber,
                surahName: params.surahName,
                startAyah: params.startAyah,
              });
            } else if (params.type === 'juz') {
              navigation.navigate('JuzReading', {
                startSurah: params.startSurah,
                startAyah: params.startAyah,
                endSurah: params.endSurah,
                endAyah: params.endAyah,
                juzName: params.juzName,
                ayahNumber: params.ayahNumber,
              });
            }
          }}
          surahList={surahList}
          juzList={juzList}
        />
      </View>
    </SafeAreaView>
  );
}
