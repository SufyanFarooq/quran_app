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
  console.log('juz list', juzList);
  const [jumpType, setJumpType] = useState<'surah' | 'juz'>('surah');
  // Surah dropdown state
  const [surahDropdownOpen, setSurahDropdownOpen] = useState(false);
  const [surahDropdownValue, setSurahDropdownValue] = useState(
    surahList[0]?.index || '001',
  );
  const [surahDropdownItems, setSurahDropdownItems] = useState(
    surahList.map(s => ({
      label: `سورة ${s.title_ar} - ${parseInt(s.index)}`,
      value: s.index,
    })),
  );
  // Juz dropdown state
  const [juzDropdownOpen, setJuzDropdownOpen] = useState(false);
  const [selectedJuz, setSelectedJuz] = useState(juzList[0]?.index || '1');
  const [juzDropdownItems, setJuzDropdownItems] = useState(
    juzList.map(j => ({
      label: `پارہ ${j.title_ar || j.index} - ${parseInt(j.index, 10)}`,
      value: j.index,
    })),
  );
  const [ayahNumber, setAyahNumber] = useState('');

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Jump to Ayah</Text>
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
              <Text style={styles.radioLabel}>Surah</Text>
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
              <Text style={styles.radioLabel}>Juz</Text>
            </TouchableOpacity>
          </View>
          {/* Dropdown */}
          {jumpType === 'surah' ? (
            <>
              <Text style={styles.dropdownLabel}>
                {`سورة ${
                  surahList.find(s => s.index === surahDropdownValue)
                    ?.title_ar || ''
                } - ${parseInt(surahDropdownValue)}`}
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
                {`پارہ ${
                  juzList.find(j => j.index === selectedJuz)?.title_ar ||
                  selectedJuz
                } - ${parseInt(selectedJuz, 10)}`}
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
          <Text style={styles.ayahLabel}>Ayah Number</Text>
          {/* Ayah input */}
          <TextInput
            value={ayahNumber}
            onChangeText={setAyahNumber}
            placeholder="Ayah Number"
            keyboardType="numeric"
            style={styles.ayahInput}
          />
          {/* Buttons */}
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.goBtn}
              onPress={() => {
                if (jumpType === 'surah') {
                  onJump({
                    type: 'surah',
                    surahNumber: surahDropdownValue,
                    surahName:
                      surahList.find(s => s.index === surahDropdownValue)
                        ?.title_ar || '',
                    startAyah: ayahNumber,
                  });
                } else {
                  const juz = juzList.find(j => j.index === selectedJuz);
                  if (juz) {
                    onJump({
                      type: 'juz',
                      startSurah: juz.start.index,
                      startAyah: juz.start.verse,
                      endSurah: juz.end.index,
                      endAyah: juz.end.verse,
                      juzName: `Juz ${juz.index}`,
                      ayahNumber: ayahNumber,
                    });
                  }
                }
                onClose();
              }}
            >
              <Text style={styles.goBtnText}>Go</Text>
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
