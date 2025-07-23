import React, { useEffect, useState, useRef } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  ActivityIndicator,
  View,
  ScrollView,
  Image,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList, getSurah } from '../../App';
import { saveLastReadPosition, addBookmark } from '../storageUtils';
import styles from './SurahDetailScreen.style';
import AyahActionModal from '../../components/AyahActionModal/AyahActionModal';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
const quranTajweed = require('@kmaslesa/tajweed');
import medalBase64 from '../../assets/medalBase64';
import AutoHeightWebView from 'react-native-autoheight-webview';
import { Dimensions } from 'react-native';
import surahList from '../../quran-data/surah.json';
import getTajweedCSS from '../../utils/ayaCSS';
function convertToUrduNumeral(numStr: string) {
  const urduDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return numStr.replace(/\d/g, d => urduDigits[parseInt(d)]);
}
function getGlobalAyahIndex(surahNum: number, ayahNum: number): number {
  let index = 0;
  for (let i = 0; i < surahNum - 1; i++) {
    index += surahList[i].count;
  }
  return index + ayahNum;
}
export default function SurahDetailScreen({
  route,
}: StackScreenProps<RootStackParamList, 'SurahDetail'>) {
  const { surahNumber, surahName, startAyah } = route.params;
  const [ayat, setAyat] = useState<
    { verse?: string; ayah?: string; text?: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<ScrollView>(null);
  const [ayahPositions, setAyahPositions] = useState<{
    [ayahNum: string]: number;
  }>({});
  // Throttle state for last saved ayah
  const [lastSavedAyah, setLastSavedAyah] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAyah, setSelectedAyah] = useState<any>(null);
  const quranFont = useSelector((state: RootState) => state.settings.quranFont);
  const quranFontSize = useSelector((state: RootState) => state.settings.quranFontSize);

  useEffect(() => {
    setLoading(true);
    getSurah(surahNumber)
      .then(data => {
        console.log('surah data', data);
        setAyat(data);
        setLoading(false);
        // Save last read position (first ayah by default)
        saveLastReadPosition({
          type: 'surah',
          surahNumber,
          surahName,
          ayahNumber: startAyah || data[0]?.verse || data[0]?.ayah || '1',
        });
        // Reset to first page on surah change
      })
      .catch(() => setLoading(false));
  }, [surahNumber, startAyah, surahName]);

  // Scroll to the selected ayah after ayat are loaded
  useEffect(() => {
    if (
      !loading &&
      startAyah &&
      ayat.length > 0 &&
      scrollRef.current &&
      ayahPositions[startAyah] !== undefined
    ) {
      // Small delay to ensure all layouts are measured
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          y: ayahPositions[startAyah],
          animated: true,
        });
      }, 100);
    }
  }, [loading, startAyah, ayat, ayahPositions]);

  useEffect(() => {
    let attempts = 0;
    function tryScroll() {
      if (
        lastSavedAyah &&
        ayahPositions[lastSavedAyah] !== undefined &&
        scrollRef.current
      ) {
        scrollRef.current?.scrollTo({
          y: ayahPositions[lastSavedAyah],
          animated: false,
        });
      } else if (attempts < 5) {
        attempts++;
        setTimeout(tryScroll, 100);
      }
    }
    tryScroll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quranFont, quranFontSize, ayahPositions]);

  const handleScroll = (event: {
    nativeEvent: { contentOffset: { y: number } };
  }) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    let closestAyah = null;
    let minDiff = Infinity;
    Object.entries(ayahPositions).forEach(([ayahNum, y]) => {
      const diff = Math.abs(y - scrollY);
      if (diff < minDiff) {
        minDiff = diff;
        closestAyah = ayahNum;
      }
    });
    if (closestAyah && closestAyah !== lastSavedAyah) {
      setLastSavedAyah(closestAyah);
      saveLastReadPosition({
        type: 'surah',
        surahNumber,
        surahName,
        ayahNumber: closestAyah,
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9f9f2' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#007bff"
          style={{ marginTop: 40 }}
        />
      ) : (
        <View style={{ flex: 1 }}>
          {ayat.length > 0 &&
            (ayat[0].verse === 'verse_0' || ayat[0].ayah === '0') && (
              <Text style={styles.bismillahSeparate}>{ayat[0].text}</Text>
            )}
          {/* <Text style={{ color: 'red', textAlign: 'center', marginBottom: 8 }}>
            {ayat.length} ayat loaded
          </Text> */}
          <ScrollView
            ref={scrollRef}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingVertical: 16 }}
            onScroll={handleScroll}
            scrollEventThrottle={100}
          >
            {ayat
              .filter(
                (a, idx) =>
                  !(idx === 0 && (a.verse === 'verse_0' || a.ayah === '0')),
              )
              .map((a, idx) => {
                const ayahNum =
                  (a.verse && a.verse.replace('verse_', '')) ||
                  a.ayah ||
                  (idx + 1).toString();
                const webViewWidth = Dimensions.get('window').width - 32;
                let ayahView;
                if (quranFont === 'Tajweed') {
                  const surahNum = Number(surahNumber);
                  const globalIndex = getGlobalAyahIndex(
                    surahNum,
                    Number(ayahNum),
                  );
                  
                  const htmlAyah = quranTajweed.getAyahByIndex(
                    globalIndex,
                    true,
                  );
                  let htmlAyahStyled =
                    getTajweedCSS(quranFontSize) +
                    `<div class="ayah">
              ${htmlAyah} <img src="${medalBase64}" class="medal-img" />
              </div>`;
                  ayahView = (
                    <View style={{ alignItems: 'center', paddingVertical: 8 }}>
                      <AutoHeightWebView
                        style={{ width: webViewWidth }}
                        source={{ html: htmlAyahStyled }}
                        scrollEnabled={false}
                        viewportContent={'width=device-width, user-scalable=no'}
                      />
                    </View>
                  );
                } else {
                  ayahView = (
                    <View
                      style={[
                        styles.ayahMedalRow,
                        {
                          flexDirection: 'row-reverse',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                          paddingVertical: 8,
                        },
                      ]}
                    >
                      <Text style={[styles.ayahText, { flexShrink: 1, fontSize: quranFontSize }]}>
                        {a.text}
                        <View style={styles.medalContainer}>
                          <Image
                            source={require('../../assets/medal.png')}
                            style={styles.medalImage}
                            resizeMode="contain"
                          />
                          <Text style={styles.medalNumber}>{ayahNum}</Text>
                        </View>
                      </Text>
                    </View>
                  );
                }
                return (
                  <View
                    key={idx}
                    onLayout={event => {
                      const { y } = event.nativeEvent.layout;
                      setAyahPositions(pos => ({ ...pos, [ayahNum]: y }));
                    }}
                    style={styles.cardContainer}
                  >
                    {/* Card header: Surah name (Arabic) and ayah number */}
                    <View style={styles.cardHeader}>
                      {/* Left: 3 dots */}
                      <Text
                        style={styles.cardDots}
                        onPress={() => {
                          setSelectedAyah({
                            surahNumber,
                            surahName,
                            ayahNumber: ayahNum,
                            type: 'surah',
                            text: a.text,
                          });
                          setModalVisible(true);
                        }}
                      >
                        ⋮
                      </Text>
                      {/* Center: Surah name + ayah number */}
                      <View style={styles.cardHeaderCenter}>
                        <Text style={styles.cardHeaderText}>
                          {`سورة ${surahName} : ${convertToUrduNumeral(
                            ayahNum,
                          )}`}
                        </Text>
                      </View>
                      {/* Right: empty for symmetry */}
                      <View style={styles.cardHeaderRight} />
                    </View>
                    {/* Ayat + Medal */}
                    {ayahView}
                  </View>
                );
              })}
          </ScrollView>
        </View>
      )}
      <AyahActionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        selectedAyah={selectedAyah}
        onBookmark={async ayah => {
          await addBookmark(ayah);
        }}
      />
    </SafeAreaView>
  );
}
