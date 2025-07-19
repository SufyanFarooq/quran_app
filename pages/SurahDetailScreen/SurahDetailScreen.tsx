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
function convertToUrduNumeral(numStr: string) {
  const urduDigits = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
  return numStr.replace(/\d/g, d => urduDigits[parseInt(d)]);
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
  const [ayahPositions, setAyahPositions] = useState<{ [ayahNum: string]: number }>({});
  // Throttle state for last saved ayah
  const [lastSavedAyah, setLastSavedAyah] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAyah, setSelectedAyah] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    getSurah(surahNumber)
      .then(data => {
        console.log("surah data", data)
        setAyat(data);
        setLoading(false);
        // Save last read position (first ayah by default)
        saveLastReadPosition({
          type: 'surah',
          surahNumber,
          surahName,
          ayahNumber: startAyah || (data[0]?.verse || data[0]?.ayah || '1'),
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
        scrollRef.current?.scrollTo({ y: ayahPositions[startAyah], animated: true });
      }, 100);
    }
  }, [loading, startAyah, ayat, ayahPositions]);

  const handleScroll = (event: { nativeEvent: { contentOffset: { y: number } } }) => {
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
          <Text style={{ color: 'red', textAlign: 'center', marginBottom: 8 }}>
            {ayat.length} ayat loaded
          </Text>
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
                    <View
                      style={styles.cardHeader}
                    >
                      {/* Left: 3 dots */}
                      <Text
                        style={styles.cardDots}
                        onPress={() => {
                          setSelectedAyah({
                            surahNumber,
                            surahName,
                            ayahNumber: a.verse ? a.verse.replace('verse_', '') : a.ayah ? a.ayah : (idx + 1).toString(),
                            type: 'surah',
                            text:a.text,
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
                            a.verse
                              ? a.verse.replace('verse_', '')
                              : a.ayah
                              ? a.ayah
                              : (idx + 1).toString()
                          )}`}
                        </Text>
                      </View>
                      {/* Right: empty for symmetry */}
                      <View style={styles.cardHeaderRight} />
                    </View>
                    {/* Ayat + Medal */}
                    <View style={styles.ayahMedalRow}>
                      <Text style={styles.ayahText}>
                        {a.text}
                        <View style={styles.medalContainer}>
                          <Image
                            source={require('../../assets/medal.png')}
                            style={styles.medalImage}
                            resizeMode="contain"
                          />
                          <Text style={styles.medalNumber}>
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
        </View>
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


