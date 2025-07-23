import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  StatusBar,
  Text,
  ActivityIndicator,
  ScrollView,
  View,
  Dimensions,
  Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AutoHeightWebView from 'react-native-autoheight-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList, getSurah } from '../../App';
import surahList from '../../quran-data/surah.json';
import {
  saveLastReadPosition,
  addBookmark,
} from '../storageUtils';
import styles from './JuzReadingScreen.style';
import AyahActionModal from '../../components/AyahActionModal/AyahActionModal';
import medalBase64 from '../../assets/medalBase64';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import getTajweedCSS from '../../utils/ayaCSS';
const quranTajweed = require('@kmaslesa/tajweed');

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

type AyahCardProps = {
  a: { surah: string; verse?: string; ayah?: string; text?: string };
  idx: number;
  quranFont: string;
  quranFontSize: number;
  handleAyahLayout: (ayahNum: string, y: number) => void;
  surahList: Array<{ index: string; title_ar: string }>;
  startSurah: string;
  startAyah: string;
  endSurah: string;
  endAyah: string;
  juzName: string;
  setSelectedAyah: React.Dispatch<any>;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const AyahCard = function AyahCard({ a, idx, quranFont, quranFontSize, handleAyahLayout, surahList, startSurah, startAyah, endSurah, endAyah, juzName, setSelectedAyah, setModalVisible }: AyahCardProps) {
  let globalIndex;
  const webViewWidth = Dimensions.get('window').width - 32;
  const ayahNum =
    (a.verse && a.verse.replace('verse_', '')) ||
    a.ayah ||
    (idx + 1).toString();
  const surahNum = Number(a.surah);
  if(Number(ayahNum) == 0 && surahNum !== 9) {
    globalIndex = 1;
  }else{
    globalIndex = getGlobalAyahIndex(surahNum, Number(ayahNum));
  }
  const htmlAyah = quranTajweed.getAyahByIndex(globalIndex, true);
  const htmlAyahStyled =
    getTajweedCSS(quranFontSize) +
    `<div class="ayah">
    ${htmlAyah} <img src="${medalBase64}" class="medal-img" />
    </div>`;
  return (
    <View
      key={`${a.surah}-${ayahNum}`}
      onLayout={event => handleAyahLayout(ayahNum, event.nativeEvent.layout.y)}
      style={styles.ayahCard}
    >
      {/* Card header: Surah name (Arabic) and ayah number */}
      <View style={styles.cardHeader}>
        <Text
          style={styles.cardHeaderText}
          onPress={() => {
            setSelectedAyah({
              type: 'juz',
              startSurah,
              startAyah,
              endSurah,
              endAyah,
              juzName,
              text: a.text,
              surahNumber: a.surah,
              ayahNumber: ayahNum,
            });
            setModalVisible(true);
          }}
        >
          ⋮
        </Text>
        {/* Center: Surah name + ayah number */}
        <View style={styles.cardHeaderCenter}>
          <Text style={styles.cardHeaderTitle}>
            {`سورة ${
              surahList.find(
                (s: { index: string; title_ar: string }) => s.index === a.surah.padStart(3, '0'),
              )?.title_ar || a.surah
            } : ${convertToUrduNumeral(ayahNum)}`}
          </Text>
        </View>
        {/* Right: empty for symmetry */}
        <View style={styles.cardHeaderRight} />
      </View>
      {/* Ayat + Medal */}
      {quranFont == 'Tajweed' ? (
        <View
          style={{
            alignItems: 'center',
            paddingVertical: 8,
          }}
        >
          <AutoHeightWebView
            style={{
              width: webViewWidth,
              backgroundColor: 'transparent',
            }}
            source={{ html: htmlAyahStyled }}
            scrollEnabled={false}
            viewportContent={'width=device-width, user-scalable=no'}
          />
        </View>
      ) : (
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
          <Text style={[styles.ayahText, { fontSize: quranFontSize }]}>{a.text}
            <View style={styles.medalContainer}>
              <Image
                source={require('../../assets/medal.png')}
                style={styles.medalImage}
                resizeMode="contain"
              />
              <Text style={styles.medalText}>{String(ayahNum)}</Text>
            </View>
          </Text>
        </View>
      )}
    </View>
  );
};

export default function JuzReadingScreen({
  route,
}: StackScreenProps<RootStackParamList, 'JuzReading'>) {
  const { startSurah, startAyah, endSurah, endAyah, juzName, ayahNumber } =
    route.params as RootStackParamList['JuzReading'] & { ayahNumber?: string };
  const [ayat, setAyat] = useState<
    Array<{ surah: string; verse?: string; ayah?: string; text?: string }>
  >([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<ScrollView>(null);
  const [ayahPositions, setAyahPositions] = useState<{
    [ayahNum: string]: number;
  }>({});
  const [lastSavedAyah, setLastSavedAyah] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAyah, setSelectedAyah] = useState<any>(null);
  const quranFont = useSelector((state: RootState) => state.settings.quranFont);
  const quranFontSize = useSelector((state: RootState) => state.settings.quranFontSize);

  useFocusEffect(
    React.useCallback(() => {
      // getQuranFont().then(setQuranFont); // This line is removed as per the edit hint
    }, [])
  );

  useEffect(() => {
    // AsyncStorage.getItem(QURAN_FONT_SIZE_KEY).then(val => {
    //   if (val) setQuranFontSize(Number(val));
    //   else setQuranFontSize(22);
    // });
  }, []);

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
        type: 'juz',
        startSurah,
        startAyah,
        endSurah,
        endAyah,
        juzName,
        ayahNumber: closestAyah,
      });
    }
  };

  const handleAyahLayout = useCallback((ayahNum: string, y: number) => {
    setAyahPositions(pos => {
      if (pos[ayahNum] === y) return pos;
      return { ...pos, [ayahNum]: y };
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    // Load all surahs in this Juz
    const surahNums: number[] = [];
    for (let i = parseInt(startSurah, 10); i <= parseInt(endSurah, 10); i++) {
      surahNums.push(i);
    }
    Promise.all(surahNums.map(num => getSurah(num)))
      .then(results => {
        // Flatten and add surah number to each ayah
        const allAyat = results.flat().map((a, idx) => {
          // Find which surah this ayah belongs to
          let surah = surahNums[0];
          let count = 0;
          for (let i = 0; i < results.length; i++) {
            count += results[i].length;
            if (idx < count) {
              surah = surahNums[i];
              break;
            }
          }
          return { ...a, surah: surah.toString() };
        });
        const juzAyat = getJuzAyat(
          allAyat,
          startSurah,
          startAyah,
          endSurah,
          endAyah,
        );
        setAyat(juzAyat);
        setLoading(false);
        // Save last read position for juz
        saveLastReadPosition({
          type: 'juz',
          startSurah,
          startAyah,
          endSurah,
          endAyah,
          juzName,
        });
      })
      .catch(() => setLoading(false));
  }, [startSurah, startAyah, endSurah, endAyah, juzName]);

  useEffect(() => {
    if (!loading && ayahNumber && ayahPositions[ayahNumber] !== undefined) {
      scrollRef.current?.scrollTo({
        y: ayahPositions[ayahNumber],
        animated: true,
      });
    }
  }, [loading, ayahPositions, ayahNumber]);

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

  function getJuzAyat(
    allAyat: Array<{
      surah: string;
      verse?: string;
      ayah?: string;
      text?: string;
    }>,
    sStart: string,
    aStart: string,
    sEnd: string,
    aEnd: string,
  ): Array<{ surah: string; verse?: string; ayah?: string; text?: string }> {
    const startSurahNum = parseInt(sStart, 10);
    const endSurahNum = parseInt(sEnd, 10);
    const startAyahNum = parseInt(aStart.replace('verse_', ''), 10);
    const endAyahNum = parseInt(aEnd.replace('verse_', ''), 10);
    return allAyat.filter(a => {
      const surah = parseInt(a.surah, 10);
      const ayah = parseInt(
        a.verse?.replace('verse_', '') || a.ayah || '0',
        10,
      );
      if (surah < startSurahNum || surah > endSurahNum) return false;
      if (surah === startSurahNum && ayah < startAyahNum) return false;
      if (surah === endSurahNum && ayah > endAyahNum) return false;
      return true;
    });
  }
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#f9f9f2' }}
      edges={['left', 'right', 'bottom']}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingVertical: 16 }}
          ref={scrollRef}
          onScroll={handleScroll}
          scrollEventThrottle={100}
        >
          {ayat.map((a, idx) => {
            const ayahNum =
              (a.verse && a.verse.replace('verse_', '')) ||
              a.ayah ||
              (idx + 1).toString(); // fallback to index+1 if nothing else
            return (
              <AyahCard
                key={`${a.surah || 's'}-${ayahNum || idx}`}
                a={a}
                idx={idx}
                quranFont={quranFont}
                quranFontSize={quranFontSize}
                handleAyahLayout={handleAyahLayout}
                surahList={surahList}
                startSurah={startSurah}
                startAyah={startAyah}
                endSurah={endSurah}
                endAyah={endAyah}
                juzName={juzName}
                setSelectedAyah={setSelectedAyah}
                setModalVisible={setModalVisible}
              />
            );
          })}
        </ScrollView>
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