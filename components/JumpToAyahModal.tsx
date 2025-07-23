import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { menuTranslations } from '../locales/menu';

interface JumpToAyahModalProps {
  visible: boolean;
  onClose: () => void;
  onJump: (params: any) => void;
  surahList: any[];
  juzList: any[];
}

export default function JumpToAyahModal({
  visible,
  onClose,
  onJump,
  surahList,
  juzList,
}: JumpToAyahModalProps) {
  const quranLanguage = useSelector((state: RootState) => state.settings.quranLanguage);
  const t = menuTranslations[quranLanguage];
  console.log('juz list', juzList);
  const [jumpType, setJumpType] = useState<'surah' | 'juz'>('surah');
  // Surah dropdown state
  const [surahDropdownOpen, setSurahDropdownOpen] = useState(false);
  const [surahDropdownValue, setSurahDropdownValue] = useState(
    surahList[0]?.index || '001',
  );

  const [surahDropdownItems, setSurahDropdownItems] = useState(
    surahList.map(s => ({
      label: `${t.surah} ${s.title_ar} - ${parseInt(s.index)}`,
      value: s.index,
    })),
  );
  // Juz dropdown state
  const [juzDropdownOpen, setJuzDropdownOpen] = useState(false);
  const [selectedJuz, setSelectedJuz] = useState(juzList[0]?.index || '1');
  const [juzDropdownItems, setJuzDropdownItems] = useState(
    juzList.map(j => ({
      label: `${t.juz} ${j.title_ar || j.index} - ${parseInt(j.index, 10)}`,
      value: j.index,
    })),
  );
  const [ayahNumber, setAyahNumber] = useState('');

  // For Surah dropdown label
  const selectedSurahObj = surahList.find(s => s.index === surahDropdownValue);
  const surahTitle = selectedSurahObj ? selectedSurahObj.title_ar : '';

  // For Juz dropdown label
  const selectedJuzObj = juzList.find(j => j.index === selectedJuz);
  const juzTitle = selectedJuzObj ? (selectedJuzObj.title_ar || selectedJuzObj.index) : selectedJuz;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{t.jumpToAyahTitle}</Text>
          {/* Radio buttons */}
          <View style={styles.radioRow}>
            <TouchableOpacity
              onPress={() => setJumpType('surah')}
              style={styles.radioBtnRow}
            >
              <View
                style={[
                  styles.radioCircle,
                  jumpType === 'surah' && styles.radioCircleSelected,
                ]}
              />
              <Text style={styles.radioLabel}>{t.surah}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setJumpType('juz')}
              style={styles.radioBtnRow}
            >
              <View
                style={[
                  styles.radioCircle,
                  jumpType === 'juz' && styles.radioCircleSelected,
                ]}
              />
              <Text style={styles.radioLabel}>{t.juz}</Text>
            </TouchableOpacity>
          </View>
          {/* Dropdown */}
          {jumpType === 'surah' ? (
            <>
              <Text style={styles.dropdownLabel}>
                {`${t.surah} ${surahTitle || ''} - ${parseInt(surahDropdownValue)}`}
              </Text>
              <DropDownPicker
                open={surahDropdownOpen}
                value={surahDropdownValue}
                items={surahDropdownItems}
                setOpen={setSurahDropdownOpen}
                setValue={setSurahDropdownValue}
                setItems={setSurahDropdownItems}
                style={{ marginBottom: 18, zIndex: 1000 }}
                textStyle={{
                  fontFamily: 'QCF_BSML',
                  fontSize: 20,
                  textAlign: 'right',
                }}
                dropDownDirection="AUTO"
              />
            </>
          ) : (
            <>
              <Text style={styles.dropdownLabel}>
                {`${t.juz} ${juzTitle || ''} - ${parseInt(selectedJuz, 10)}`}
              </Text>
              <DropDownPicker
                open={juzDropdownOpen}
                value={selectedJuz}
                items={juzDropdownItems}
                setOpen={setJuzDropdownOpen}
                setValue={setSelectedJuz}
                setItems={setJuzDropdownItems}
                style={{ marginBottom: 18, zIndex: 1000 }}
                textStyle={{
                  fontFamily: 'QCF_BSML',
                  fontSize: 20,
                  textAlign: 'right',
                }}
                dropDownDirection="AUTO"
              />
            </>
          )}
          {/* Ayah Number Label */}
          <Text style={styles.ayahLabel}>{t.ayahNumber}</Text>
          {/* Ayah input */}
          <TextInput
            value={ayahNumber}
            onChangeText={setAyahNumber}
            placeholder={t.ayahNumber}
            keyboardType="numeric"
            style={styles.ayahInput}
          />
          {/* Buttons */}
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>{t.cancel}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.goBtn}
              onPress={() => {
                if (jumpType === 'surah') {
                  const selectedSurahObj = surahList.find(s => s.index === surahDropdownValue);
                  onJump({
                    type: 'surah',
                    surahNumber: surahDropdownValue,
                    surahName: selectedSurahObj ? selectedSurahObj.title_ar : '',
                    startAyah: ayahNumber,
                  });
                } else {
                  const juz = juzList.find(j => j.index === selectedJuz);
                  onJump({
                    type: 'juz',
                    startSurah: juz && juz.start ? juz.start.index : '',
                    startAyah: juz && juz.start ? juz.start.verse : '',
                    endSurah: juz && juz.end ? juz.end.index : '',
                    endAyah: juz && juz.end ? juz.end.verse : '',
                    juzName: `${t.juz} ${juz ? juz.index : ''}`,
                    ayahNumber: ayahNumber,
                  });
                }
                onClose();
              }}
            >
              <Text style={styles.goBtnText}>{t.go}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    alignItems: 'stretch',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 18,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  radioBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#2e5d32',
    marginRight: 6,
    backgroundColor: '#fff',
  },
  radioCircleSelected: {
    backgroundColor: '#2e5d32',
  },
  radioLabel: {
    fontSize: 18,
    color: '#222',
    fontWeight: 'bold',
  },
  dropdownLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
    fontFamily: 'QCF_BSML',
    marginBottom: 6,
  },
  ayahLabel: {
    marginBottom: 4,
    fontWeight: 'bold',
    fontSize: 18,
  },
  ayahInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 18,
    fontSize: 18,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  cancelBtn: {
    borderWidth: 2,
    borderColor: '#2e5d32',
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 28,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  cancelBtnText: {
    color: '#2e5d32',
    fontWeight: 'bold',
    fontSize: 18,
  },
  goBtn: {
    backgroundColor: '#2e5d32',
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 32,
  },
  goBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
