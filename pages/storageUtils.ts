import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_READ_KEY = 'last_read_position';
const BOOKMARKS_KEY = 'bookmarks';
const QURAN_FONT_KEY = 'quran_font';

// position: { type: 'surah' | 'juz', surahNumber?, ayahNumber?, juzNumber?, ... }
export async function saveLastReadPosition(position:any) {
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

export async function getBookmarks() {
  try {
    const json = await AsyncStorage.getItem(BOOKMARKS_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    return [];
  }
}

export async function addBookmark(bookmark:any) {
  try {
    const bookmarks = await getBookmarks();
    // Avoid duplicates (by type+surah+ayah)
    const exists = bookmarks.some((b: any) =>
      b.type === bookmark.type &&
      b.surahNumber === bookmark.surahNumber &&
      b.ayahNumber === bookmark.ayahNumber &&
      (b.type === 'juz' ? b.juzName === bookmark.juzName : true)
    );
    if (!exists) {
      bookmark.timestamp = Date.now();
      bookmarks.push(bookmark);
      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    }
  } catch (e) {}
}

export async function removeBookmark(bookmark:any) {
  try {
    let bookmarks = await getBookmarks();
    bookmarks = bookmarks.filter((b: any)  =>
      !(
        b.type === bookmark.type &&
        b.surahNumber === bookmark.surahNumber &&
        b.ayahNumber === bookmark.ayahNumber &&
        (b.type === 'juz' ? b.juzName === bookmark.juzName : true)
      )
    );
    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  } catch (e) {}
}

export async function setQuranFont(font: 'Uthmani' | 'Tajweed') {
  try {
    await AsyncStorage.setItem(QURAN_FONT_KEY, font);
  } catch (e) {}
}

export async function getQuranFont(): Promise<'Uthmani' | 'Tajweed'> {
  try {
    const value = await AsyncStorage.getItem(QURAN_FONT_KEY);
    if (value === 'Uthmani' || value === 'Tajweed') return value;
    return 'Uthmani'; // default
  } catch (e) {
    return 'Uthmani';
  }
} 