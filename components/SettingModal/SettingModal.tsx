import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getQuranFont } from '../../pages/storageUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import {
  RootState,
  setQuranFont as setQuranFontRedux,
  setQuranFontSize,
  setQuranLanguage,
  setQuranTranslation,
} from '../../store';
import { menuTranslations } from '../../locales/menu';

const FONT_OPTIONS = [
  { label: 'Uthmani', value: 'Uthmani' },
  { label: 'Tajweed', value: 'Tajweed' },
];

const QURAN_FONT_SIZE_KEY = 'quran_font_size';
const TRANSLATION_FONT_SIZE_KEY = 'translation_font_size';
const EXPLANATION_FONT_SIZE_KEY = 'explanation_font_size';
const HIDE_TAFSEER_KEY = 'hide_tafseer';

interface SettingModalProps {
  visible: boolean;
  onClose: () => void;
}

const SettingModal: React.FC<SettingModalProps> = ({ visible, onClose }) => {
  const quranFont = useSelector((state: RootState) => state.settings.quranFont);
  const quranFontSize = useSelector(
    (state: RootState) => state.settings.quranFontSize,
  );
  const quranLanguage = useSelector((state: RootState) => state.settings.quranLanguage);
  const quranTranslation = useSelector((state: RootState) => state.settings.quranTranslation);
  const t = menuTranslations[quranLanguage];
  const dispatch = useDispatch();
  const [translationFontSize, setTranslationFontSize] = React.useState(18);
  const [explanationFontSize, setExplanationFontSize] = React.useState(18);
  const [hideTafseer, setHideTafseer] = React.useState(false);

  React.useEffect(() => {
    if (visible) {
      getQuranFont().then(setQuranFontRedux);
      AsyncStorage.getItem(QURAN_FONT_SIZE_KEY).then(val => {
        const size = val ? Number(val) : 22;
        dispatch(setQuranFontSize(size));
      });
      AsyncStorage.getItem(TRANSLATION_FONT_SIZE_KEY).then(val => {
        if (val) setTranslationFontSize(Number(val));
      });
      AsyncStorage.getItem(EXPLANATION_FONT_SIZE_KEY).then(val => {
        if (val) setExplanationFontSize(Number(val));
      });
      AsyncStorage.getItem(HIDE_TAFSEER_KEY).then(val => {
        setHideTafseer(val === 'true');
      });
      AsyncStorage.getItem('quran_language').then(val => {
        if (val) dispatch(setQuranLanguage(val as 'en' | 'ur' | 'ar'));
      });
      AsyncStorage.getItem('quran_translation').then(val => {
        if (val) dispatch(setQuranTranslation(val as 'en' | 'ur' | 'bn'));
      });
    }
  }, [visible, dispatch]);

  const handleFontChange = (font: 'Uthmani' | 'Tajweed') => {
    dispatch(setQuranFontRedux(font));
  };
  const handleQuranFontSizeChange = async (size: number) => {
    if (size < 10) return; // minimum font size
    await AsyncStorage.setItem(QURAN_FONT_SIZE_KEY, String(size));
    dispatch(setQuranFontSize(size));
  };
  const handleTranslationFontSizeChange = (size: number) => {
    setTranslationFontSize(size);
    AsyncStorage.setItem(TRANSLATION_FONT_SIZE_KEY, String(size));
  };
  const handleExplanationFontSizeChange = (size: number) => {
    setExplanationFontSize(size);
    AsyncStorage.setItem(EXPLANATION_FONT_SIZE_KEY, String(size));
  };
  const handleHideTafseerChange = (val: boolean) => {
    setHideTafseer(val);
    AsyncStorage.setItem(HIDE_TAFSEER_KEY, val ? 'true' : 'false');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <TouchableOpacity style={styles.arrowContainer} onPress={onClose}>
            <Ionicons name="chevron-down" size={32} color="#888" />
          </TouchableOpacity>
          <Text style={styles.title}>{t.settingsTitle}</Text>
          <View style={[styles.row, { marginBottom: 10 }]}>
            <Text style={[styles.label, { fontWeight: 'bold', fontSize: 16 }]}>{t.quranFont}</Text>
            <View style={styles.fontSegmentContainer}>
              {FONT_OPTIONS.map((opt, idx) => (
                <React.Fragment key={opt.value}>
                  <TouchableOpacity
                    style={[
                      styles.fontSegment,
                      quranFont === opt.value && styles.fontSegmentSelected,
                    ]}
                    onPress={() => handleFontChange(opt.value as any)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.fontSegmentText,
                        quranFont === opt.value &&
                          styles.fontSegmentTextSelected,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                  {idx < FONT_OPTIONS.length - 1 && (
                    <View style={styles.fontSegmentDivider} />
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>
          <View style={[styles.row, { alignItems: 'center', justifyContent: 'flex-end' }]}>
            <Text style={[styles.label, { minWidth: 110 }]}>{t.quranFontSize}</Text>
            <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', marginLeft: 8, justifyContent: 'flex-end' }}>
              <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                marginVertical: 8,
                alignSelf: 'stretch',
              }}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  width: '100%',
                }}>
                  {(() => {
                    const steps = [16, 18, 20, 22, 24, 26, 28, 30];
                    return steps.map((val, idx) => (
                      <React.Fragment key={val}>
                        {idx !== 0 && (
                          <View style={{
                            width: 6,
                            height: 2,
                            backgroundColor: '#ddd',
                            alignSelf: 'center',
                            marginHorizontal: 0,
                          }} />
                        )}
                        <TouchableOpacity onPress={() => handleQuranFontSizeChange(val)} activeOpacity={0.7}>
                          <View style={{
                            width: 12,
                            height: 12,
                            transform: [{ rotate: '45deg' }],
                            borderWidth: 1.5,
                            borderColor: val === quranFontSize ? '#4CAF50' : '#ddd',
                            backgroundColor: val === quranFontSize ? '#4CAF50' : '#fff',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: idx === steps.length - 1 ? 0 : 2,
                          }} />
                        </TouchableOpacity>
                      </React.Fragment>
                    ));
                  })()}
                </View>
              </View>
              <Text style={[styles.fontSizeValue, { textAlign: 'right', marginLeft: 8 }]}>{quranFontSize}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t.translationFontSize}</Text>
            <View style={styles.fontSizeControl}>
              <TouchableOpacity
                onPress={() =>
                  handleTranslationFontSizeChange(translationFontSize - 1)
                }
              >
                <Ionicons name="chevron-down" size={18} color="#222" />
              </TouchableOpacity>
              <Text style={styles.fontSizeValue}>{translationFontSize}</Text>
              <TouchableOpacity
                onPress={() =>
                  handleTranslationFontSizeChange(translationFontSize + 1)
                }
              >
                <Ionicons name="chevron-up" size={18} color="#222" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t.explanationFontSize}</Text>
            <View style={styles.fontSizeControl}>
              <TouchableOpacity
                onPress={() =>
                  handleExplanationFontSizeChange(explanationFontSize - 1)
                }
              >
                <Ionicons name="chevron-down" size={18} color="#222" />
              </TouchableOpacity>
              <Text style={styles.fontSizeValue}>{explanationFontSize}</Text>
              <TouchableOpacity
                onPress={() =>
                  handleExplanationFontSizeChange(explanationFontSize + 1)
                }
              >
                <Ionicons name="chevron-up" size={18} color="#222" />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.sectionTitle}>{t.readingMode}</Text>
          <View style={styles.row}>
            <Text style={styles.label}>{t.hideTranslation}</Text>
            <Switch
              value={hideTafseer}
              onValueChange={handleHideTafseerChange}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t.translation}</Text>
            <View style={{ flex: 1, flexDirection: 'row', marginLeft: 8 }}>
              {['en', 'ur', 'bn'].map((lang, idx) => (
                <TouchableOpacity
                  key={lang}
                  style={{
                    backgroundColor: quranTranslation === lang ? '#e0f7fa' : '#fff',
                    borderRadius: 8,
                    paddingVertical: 6,
                    paddingHorizontal: 14,
                    marginRight: idx < 2 ? 8 : 0,
                    borderWidth: 1,
                    borderColor: quranTranslation === lang ? '#26c6da' : '#ccc',
                  }}
                  onPress={async () => {
                    dispatch(setQuranTranslation(lang as 'en' | 'ur' | 'bn'));
                    await AsyncStorage.setItem('quran_translation', lang);
                  }}
                >
                  <Text style={{ color: quranTranslation === lang ? '#00796b' : '#222', fontWeight: 'bold' }}>
                    {lang === 'en' ? 'English' : lang === 'ur' ? 'Urdu' : 'Bangla'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t.language}</Text>
            <View style={{ flex: 1, flexDirection: 'row', marginLeft: 8 }}>
              {['en', 'ur', 'ar'].map((lang, idx) => (
                <TouchableOpacity
                  key={lang}
                  style={{
                    backgroundColor: quranLanguage === lang ? '#e0f7fa' : '#fff',
                    borderRadius: 8,
                    paddingVertical: 6,
                    paddingHorizontal: 14,
                    marginRight: idx < 2 ? 8 : 0,
                    borderWidth: 1,
                    borderColor: quranLanguage === lang ? '#26c6da' : '#ccc',
                  }}
                  onPress={async () => {
                    dispatch(setQuranLanguage(lang as 'en' | 'ur' | 'ar'));
                    await AsyncStorage.setItem('quran_language', lang);
                  }}
                >
                  <Text style={{ color: quranLanguage === lang ? '#00796b' : '#222', fontWeight: 'bold' }}>
                    {lang === 'en' ? 'English' : lang === 'ur' ? 'Urdu' : 'Arabic'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 32,
    minHeight: 340,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  arrowContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 18,
    color: '#222',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 8,
    color: '#222',
    textAlign: 'left',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  label: {
    fontSize: 16,
    color: '#222',
  },
  fontSizeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fontSizeValue: {
    fontSize: 14,
    // fontWeight: 'bold',
    marginHorizontal: 8,
    minWidth: 28,
    textAlign: 'center',
  },
  fontSegmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#f7f8fa',
    borderRadius: 18,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
    marginBottom: 0,
    minHeight: 32,
  },
  fontSegment: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
    backgroundColor: 'transparent',
    minWidth: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontSegmentSelected: {
    backgroundColor: '#e0f7e9', // light green
    shadowColor: 'transparent',
    elevation: 0,
  },
  fontSegmentText: {
    fontSize: 14,
    color: '#222',
    fontWeight: '500',
  },
  fontSegmentTextSelected: {
    color: '#176d2c',
    fontWeight: 'bold',
  },
  fontSegmentDivider: {
    width: 1,
    height: 18,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 2,
  },
});

export default SettingModal;
