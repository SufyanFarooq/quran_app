import React, { useEffect, useState, useRef } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
  ScrollView,
  Image,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList, getSurah } from '../App';
import Svg, { Circle } from 'react-native-svg';

export default function SurahDetailScreen({
  route,
}: StackScreenProps<RootStackParamList, 'SurahDetail'>) {
  const { surahNumber, surahName, startAyah } = route.params;
  const [ayat, setAyat] = useState<
    { verse?: string; ayah?: string; text?: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    setLoading(true);
    getSurah(surahNumber)
      .then(data => {
        console.log("surah data", data)
        setAyat(data);
        setLoading(false);
        // Reset to first page on surah change
      })
      .catch(() => setLoading(false));
  }, [surahNumber]);

  // Inline SVG medal component for verse number (bigger for new font size)
  const InlineMedalSVG = ({ verseNum }: { verseNum: string }) => (
    <Svg
      height="32"
      width="32"
      style={{ marginHorizontal: 8, marginBottom: -2 }}
    >
      <Circle
        cx="16"
        cy="16"
        r="15"
        stroke="#176d2c"
        strokeWidth="2"
        fill="#fff"
      />
      <Text
        x="16"
        y="21"
        fontSize="16"
        fill="#176d2c"
        fontWeight="bold"
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        {verseNum}
      </Text>
    </Svg>
  );

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
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingVertical: 16 }}
          >
            {ayat
              .filter(
                (a, idx) =>
                  !(idx === 0 && (a.verse === 'verse_0' || a.ayah === '0')),
              )
              .map((a, idx) => (
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
                    {`سورة ${surahName} : ${
                      a.verse
                        ? a.verse.replace('verse_', '')
                        : a.ayah
                        ? a.ayah
                        : (idx + 1).toString()
                    }`}
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
                        <Image
                          source={require('../assets/medal.png')}
                          style={{
                            width: 20,
                            height: 28,
                            position: 'absolute',
                            top: 18,
                            left: 0,
                          }}
                          resizeMode="contain"
                        />
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
              ))}
          </ScrollView>
        </View>
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
  surahStart: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#176d2c',
    textAlign: 'center',
    marginBottom: 12,
    marginTop: 4,
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
    // Not used in new layout
  },
  ayahRow: {
    // Not used in new layout
  },
  ayahInline: {
    // Not used in new layout
  },
  ayahBorder: {
    // Not used in new layout
  },
  ayahInlineClean: {
    flexDirection: 'row-reverse', // Ayat aur number sath sath // Ayah and number side by side
    alignItems: 'center',
    marginLeft: 4,
    marginBottom: 8,
    paddingHorizontal: 0,
    paddingVertical: 0,
    minHeight: 28,
    // No background, no shadow
  },
  ayahBorderClean: {
    borderRightWidth: 2, // Har ayat ke baad border // Border after each ayah
    borderRightColor: '#b2d8b2', // Light green
  },
  ayatText: {
    fontSize: 18,
    color: '#222',
    textAlign: 'right',
    lineHeight: 32,
    fontFamily: 'QCF_BSML', // Quran font applied
    writingDirection: 'rtl',
    flexShrink: 1,
    marginLeft: 2,
    marginRight: 0,
  },
  bismillah: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#176d2c',
    marginBottom: 4,
    fontFamily: 'QCF_BSML', // Quran font applied
  },
  verseCircleSmall: {
    // Not used in new layout
  },
  verseCircleTextSmall: {
    // Not used in new layout
  },
  // Naya style: modern rounded circle // New style: modern rounded circle
  verseCircleModern: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#176d2c',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 3,
    shadowColor: '#176d2c',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  verseCircleTextModern: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 11,
    lineHeight: 13,
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
  readingPageOutline: {
    borderWidth: 3, // Page outline border
    borderColor: '#176d2c', // Green border
    borderRadius: 18, // Rounded corners
    marginHorizontal: 10,
    marginTop: 6,
    marginBottom: 6,
    paddingVertical: 10,
    paddingHorizontal: 6,
    backgroundColor: '#f9f9f2', // Match page bg
    minHeight: 420,
    shadowColor: '#176d2c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  bismillahSeparate: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#176d2c',
    fontSize: 22,
    marginVertical: 8,
    letterSpacing: 1,
  },
  ayatParagraph: {
    fontSize: 18,
    color: '#222',
    textAlign: 'right',
    lineHeight: 32,
    fontFamily: 'System',
    writingDirection: 'rtl',
    marginTop: 8,
    marginBottom: 8,
  },
  inlineCircle: {
    backgroundColor: '#176d2c',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    borderRadius: 10,
    overflow: 'hidden',
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginHorizontal: 8, // Zyada space // More space
    textAlign: 'center',
  },
  ayatLinesContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end', // Right align for RTL
    justifyContent: 'flex-start',
    marginTop: 8,
    marginBottom: 8,
  },
  ayahLineRow: {
    // Only margin/padding here if needed
  },
  medalCircle: {
    fontSize: 22,
    color: '#176d2c',
    marginLeft: 8,
    marginRight: 2,
    fontWeight: 'bold',
    // Unicode medal style
    textShadowColor: '#b2d8b2',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  svgVerseNum: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 13, // smaller font
    color: '#176d2c',
    fontWeight: 'bold',
    includeFontPadding: false,
    paddingTop: 4,
  },
});
