import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView, StatusBar, Text, ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList, getSurah } from '../App';
import surahList from '../quran-data/surah.json';

function getJuzAyat(
  ayat: Array<{ surah: string; verse?: string; ayah?: string; text?: string }>,
  startSurah: string,
  startAyah: string,
  endSurah: string,
  endAyah: string
): Array<{ surah: string; verse?: string; ayah?: string; text?: string }> {
  const sStart = parseInt(startSurah, 10);
  const sEnd = parseInt(endSurah, 10);
  const aStart = parseInt(startAyah.replace('verse_', ''), 10);
  const aEnd = parseInt(endAyah.replace('verse_', ''), 10);
  return ayat.filter((a) => {
    const surah = parseInt(a.surah, 10);
    const ayah = parseInt(a.verse?.replace('verse_', '') || a.ayah || '0', 10);
    if (surah < sStart || surah > sEnd) return false;
    if (surah === sStart && ayah < aStart) return false;
    if (surah === sEnd && ayah > aEnd) return false;
    return true;
  });
}

export default function JuzReadingScreen({ route }: StackScreenProps<RootStackParamList, 'JuzReading'>) {
  const { startSurah, startAyah, endSurah, endAyah, juzName } = route.params;
  const [ayat, setAyat] = useState<Array<{ surah: string; verse?: string; ayah?: string; text?: string }>>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    setLoading(true);
    // Load all surahs in this Juz
    const surahNums: number[] = [];
    for (let i = parseInt(startSurah, 10); i <= parseInt(endSurah, 10); i++) {
      surahNums.push(i);
    }
    Promise.all(surahNums.map((num) => getSurah(num))).then((results) => {
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
      const juzAyat = getJuzAyat(allAyat, startSurah, startAyah, endSurah, endAyah);
      setAyat(juzAyat);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [startSurah, startAyah, endSurah, endAyah]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9f9f2' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Text style={styles.surahDetailTitle}>{juzName}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={{ paddingVertical: 16 }} ref={scrollRef}>
          {ayat.map((a, idx) => (
            <View
              key={idx}
              style={{
                backgroundColor: '#fff',
                borderRadius: 14,
                marginHorizontal: 12,
                marginBottom: 14,
                padding: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 6,
                elevation: 2,
                borderWidth: 1,
                borderColor: '#eee',
              }}
            >
              {/* Card header: Surah name (Arabic) and ayah number */}
              <Text
                style={{
                  fontSize: 16,
                  color: '#888',
                  marginBottom: 8,
                  textAlign: 'right',
                  fontWeight: 'bold',
                  fontFamily: 'QCF_BSML',
                }}
              >
                {`سورة ${
                  (surahList.find(s => s.index === a.surah.padStart(3, '0'))?.title_ar || a.surah)
                } : ${a.verse ? a.verse.replace('verse_', '') : a.ayah ? a.ayah : (idx + 1).toString()}`}
              </Text>
              {/* Ayat + Medal */}
              <View
                style={{
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 24,
                    color: '#222',
                    textAlign: 'right',
                    flexShrink: 1,
                    marginLeft: 2,
                    fontFamily: 'QCF_BSML',
                  }}
                >
                  {a.text}
                  <View
                    style={{
                      width: 28,
                      height: 34,
                      marginLeft: 0,
                      position: 'relative',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        position: 'absolute',
                        top: 23,
                        left: 0,
                        right: 8,
                        textAlign: 'center',
                        color: '#176d2c',
                        fontWeight: 'bold',
                        fontSize: 10,
                        backgroundColor: 'transparent',
                      }}
                    >
                      {a.verse ? a.verse.replace('verse_', '') : a.ayah ? a.ayah : (idx + 1).toString()}
                    </Text>
                  </View>
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const borderStyle = {
  borderColor: '#176d2c',
  borderWidth: 4,
  borderRadius: 16,
  marginHorizontal: 16,
};

const styles = StyleSheet.create({
  surahDetailTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 8,
    color: '#007bff',
  },
  topBorder: {
    ...borderStyle,
    borderBottomWidth: 0,
    height: 12,
    marginBottom: 8,
  },
  bottomBorder: {
    ...borderStyle,
    borderTopWidth: 0,
    height: 12,
    marginTop: 8,
  },
  ayatList: {
    padding: 20,
    minHeight: 400,
  },
  ayatText: {
    fontSize: 20,
    color: '#222',
    marginBottom: 12,
    textAlign: 'right',
    lineHeight: 32,
    fontFamily: 'System',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    gap: 16,
  },
  pageBtn: {
    backgroundColor: '#176d2c',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
  },
  pageBtnDisabled: {
    backgroundColor: '#b2b2b2',
  },
  pageBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pageNum: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#176d2c',
  },
}); 