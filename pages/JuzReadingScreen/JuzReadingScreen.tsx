import React, { useEffect, useState, useRef } from 'react';
import {
  StatusBar,
  Text,
  ActivityIndicator,
  ScrollView,
  View,
  Image,
} from 'react-native';
import { WebView } from 'react-native-webview';
import AutoHeightWebView from 'react-native-autoheight-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList, getSurah } from '../../App';
import surahList from '../../quran-data/surah.json';
import { saveLastReadPosition, addBookmark } from '../storageUtils';
import styles from './JuzReadingScreen.style';
import AyahActionModal from '../../components/AyahActionModal/AyahActionModal';
import medalBase64 from '../../assets/medalBase64';
import tajweedFiles from '../../tajweedRequireMap';
import AutoSizedWebView from '../../components/WebViews/AutoSizedWebView';
// Example: statically import surah_1.json for tajweed
// import tajweed1 from '../../android/app/src/main/assets/tajweed/surah_1.json';

const tajweedColors: Record<string, string> = {
  hamzat_wasl: '#FF0000', // red
  lam_shamsiyyah: '#00FF00', // green
  madd_2: '#0000FF', // blue
  madd_246: '#FFA500', // orange
  madd_6: '#800080', // purple
};

function ayahToTajweedHTML(
  ayahText: string,
  tajweedArr: any[],
  tajweedColors: Record<string, string>,
  ayahNum: number,
) {
  if (!Array.isArray(tajweedArr) || tajweedArr.length === 0) {
    return `<div dir="rtl" style="font-size:22px; font-family:'NotoNaskhArabic'; line-height:2;">${ayahText} <img src="${medalBase64}" style="height: 28px; vertical-align: middle; margin-left: 4px;" /><span style="font-size: 16px; color: #176d2c; font-weight: bold; vertical-align: middle;">${ayahNum}</span></div>`;
  }
  let html = '';
  let lastIdx = 0;
  for (let i = 0; i < tajweedArr.length; i++) {
    const ruleObj = tajweedArr[i];
    if (ruleObj.start > lastIdx) {
      html += ayahText.slice(lastIdx, ruleObj.start);
    }
    const color = tajweedColors[ruleObj.rule] || '#000';
    html += `<span style="color:${color}">${ayahText.slice(
      ruleObj.start,
      ruleObj.end,
    )}</span>`;
    lastIdx = ruleObj.end;
  }
  if (lastIdx < ayahText.length) {
    html += ayahText.slice(lastIdx);
  }
  html += `
  <span style="display: inline-flex; align-items: center; margin-right: 8px;">
    <img src="${medalBase64}" style="height: 24px; width: 18px; vertical-align: middle; margin-left: 2px;" />
    <span style="font-size: 16px; color: #176d2c; font-weight: bold; vertical-align: middle; margin-left: 2px;">${ayahNum}</span>
  </span>
`;
  return `<div dir="rtl" style="font-size:22px; font-family:'NotoNaskhArabic'; line-height:2;">${html}</div>`;
}

// Helper to dynamically load tajweed JSON for a given surah number
function getTajweedDataForAyah(surahNum: string, ayahNum: string) {
  const file = tajweedFiles[parseInt(surahNum, 10)];
  if (!file) return null;
  return file.verse[`verse_${ayahNum}`];
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
  const [webViewHeights, setWebViewHeights] = useState<{
    [key: number]: number;
  }>({});

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
  function getJuzAyat(
    ayat: Array<{
      surah: string;
      verse?: string;
      ayah?: string;
      text?: string;
    }>,
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
      const ayah = parseInt(
        a.verse?.replace('verse_', '') || a.ayah || '0',
        10,
      );
      if (surah < sStart || surah > sEnd) return false;
      if (surah === sStart && ayah < aStart) return false;
      if (surah === sEnd && ayah > aEnd) return false;
      return true;
    });
  }
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#f9f9f2' }}
      edges={['left', 'right', 'bottom']}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Text style={styles.surahDetailTitle}>{juzName}</Text>
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
              (idx + 1).toString();
            const tajweedArr = getTajweedDataForAyah(a.surah, ayahNum);
            const htmlAyah = ayahToTajweedHTML(
              a.text || '',
              tajweedArr,
              tajweedColors,
              ayahNum,
            );
            const injectedJS = `
  setTimeout(function() {
    window.ReactNativeWebView.postMessage(document.body.scrollHeight.toString());
  }, 100);
  true;
`;
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
                  <View style={styles.cardHeaderCenter}>
                    <Text style={styles.cardHeaderTitle}>
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
                <View style={styles.ayatMedalContainer}>

<AutoHeightWebView
  style={{ width: '100%', backgroundColor: 'transparent' }}
  customStyle={`
    body, div, p { margin: 0 !important; padding: 0 !important; }
    * { font-family: 'NotoNaskhArabic', 'Times New Roman'; }
  `}
  source={{ html: htmlAyah }}
  scrollEnabled={false}
  viewportContent={'width=device-width, user-scalable=no'}
/>
                  {/* <WebView
                    originWhitelist={['*']}
                    source={{ html: htmlAyah }}
                    style={{
                      height:
                        webViewHeights[ayahNum] && webViewHeights[ayahNum] > 0
                          ? webViewHeights[ayahNum]
                          : 60,
                      backgroundColor: 'transparent',
                    }}
                    scrollEnabled={false}
                    injectedJavaScript={injectedJS}
                    onMessage={event => {
                      const height = Number(event.nativeEvent.data);
                      if (
                        !isNaN(height) &&
                        height > 0 &&
                        height !== webViewHeights[ayahNum]
                      ) {
                        setWebViewHeights(h => ({ ...h, [ayahNum]: height }));
                      }
                    }}
                  /> */}
                  {/* <Text style={{ fontSize: 12, color: 'gray' }}>
  Height: {webViewHeights[ayahNum] || '...'}
</Text> */}
                  {/* <View style={styles.medalContainer}>
                    <Image
                      source={require('../../assets/medal.png')}
                      style={styles.medalImage}
                      resizeMode="contain"
                    />
                    <Text style={styles.medalText}>
                      {a.verse
                        ? a.verse.replace('verse_', '')
                        : a.ayah
                        ? a.ayah
                        : (idx + 1).toString()}
                    </Text>
                  </View> */}
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
        onBookmark={async ayah => {
          await addBookmark(ayah);
        }}
      />
    </SafeAreaView>
  );
}
