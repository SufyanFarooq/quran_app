import React, { useEffect, useState, useRef } from 'react';
import {
  StatusBar,
  Text,
  ActivityIndicator,
  ScrollView,
  View,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList, getSurah } from '../../App';
import surahList from '../../quran-data/surah.json';
import { saveLastReadPosition, addBookmark } from '../storageUtils';
import styles from './JuzReadingScreen.style';
import AyahActionModal from '../../components/AyahActionModal/AyahActionModal';
function getJuzAyat(
  ayat: Array<{ surah: string; verse?: string; ayah?: string; text?: string }>,
  startSurah: string,
  startAyah: string,
  endSurah: string,
  endAyah: string,
): Array<{ surah: string; verse?: string; ayah?: string; text?: string }> {
  const sStart = parseInt(startSurah, 10);
  const sEnd = parseInt(endSurah, 10);
  const aStart = parseInt(startAyah.replace('verse_', ''), 10);
  const aEnd = parseInt(endAyah.replace('verse_', ''), 10);
  return ayat.filter(a => {
    const surah = parseInt(a.surah, 10);
    const ayah = parseInt(a.verse?.replace('verse_', '') || a.ayah || '0', 10);
    if (surah < sStart || surah > sEnd) return false;
    if (surah === sStart && ayah < aStart) return false;
    if (surah === sEnd && ayah > aEnd) return false;
    return true;
  });
}

function convertToUrduNumeral(numStr: string) {
  const urduDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return numStr.replace(/\d/g, d => urduDigits[parseInt(d)]);
}

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9f9f2',  }} edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Text style={styles.surahDetailTitle}>{juzName}</Text>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#007bff"
          // style={{ marginTop: 40 }}
        />
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
              (idx + 1).toString();
            return (
              <View
                key={idx}
                onLayout={event => {
                  const { y } = event.nativeEvent.layout;
                  setAyahPositions(pos => ({ ...pos, [ayahNum]: y }));
                }}
                style={styles.ayahCard}
              >
                {/* Card header: Surah name (Arabic) and ayah number */}
                <View
                  style={styles.cardHeader}
                >
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
                        surahNumber: a.surah,
                        ayahNumber: a.verse
                          ? a.verse.replace('verse_', '')
                          : a.ayah
                          ? a.ayah
                          : (idx + 1).toString(),
                      });
                      setModalVisible(true);
                    }}
                  >
                    ⋮
                  </Text>
                  {/* Center: Surah name + ayah number */}
                  <View
                    style={styles.cardHeaderCenter}
                  >
                    <Text
                      style={styles.cardHeaderTitle}
                    >
                      {`سورة ${
                        surahList.find(
                          s => s.index === a.surah.padStart(3, '0'),
                        )?.title_ar || a.surah
                      } : ${convertToUrduNumeral(
                        a.verse
                          ? a.verse.replace('verse_', '')
                          : a.ayah
                          ? a.ayah
                          : (idx + 1).toString(),
                      )}`}
                    </Text>
                  </View>
                  {/* Right: empty for symmetry */}
                  <View style={styles.cardHeaderRight} />
                </View>
                {/* Ayat + Medal */}
                <View
                  style={styles.ayatMedalContainer}
                >
                  <Text
                    style={styles.ayatText}
                  >
                    {a.text}
                    <View
                      style={styles.medalContainer}
                    >
                      <Image
                        source={require('../../assets/medal.png')}
                        style={styles.medalImage}
                        resizeMode="contain"
                      />
                      <Text
                        style={styles.medalText}
                      >
                        {a.verse
                          ? a.verse.replace('verse_', '')
                          : a.ayah
                          ? a.ayah
                          : (idx + 1).toString()}
                      </Text>
                    </View>
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
      <AyahActionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        selectedAyah={selectedAyah}
        onBookmark={async (ayah) => {
          await addBookmark(ayah);
        }}
      />
      
    </SafeAreaView>
  );
}
