import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_READ_KEY = 'last_read_position';

// position: { type: 'surah' | 'juz', surahNumber?, ayahNumber?, juzNumber?, ... }
export async function saveLastReadPosition(position) {
  try {
    await AsyncStorage.setItem(LAST_READ_KEY, JSON.stringify(position));
  } catch (e) {
    // handle errorr
  }
}

export async function loadLastReadPosition() {
  try {
    const value = await AsyncStorage.getItem(LAST_READ_KEY);
    console.log("value", value)
    if (value) return JSON.parse(value);
    return null;
  } catch (e) {
    return null;
  }
} 