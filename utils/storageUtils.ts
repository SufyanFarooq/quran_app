import AsyncStorage from '@react-native-async-storage/async-storage';


const LAST_READ_PDF_KEY = 'pdfLastRead';
const BOOKMARKS_KEY = 'pdfBookmarks';

export type LastReadPdfPosition = {
  start_page: number;
  index?: number; // optional, in case you want to save surah/juz index
};

export const saveLastReadPdfPosition = async (data: LastReadPdfPosition) => {
  await AsyncStorage.setItem(LAST_READ_PDF_KEY, JSON.stringify(data));
};

export const getLastReadPdfPosition = async (): Promise<LastReadPdfPosition | null> => {
  const value = await AsyncStorage.getItem(LAST_READ_PDF_KEY);
  return value ? JSON.parse(value) : null;
};

// --- Bookmarks ---
export const addBookmark = async (bookmark: LastReadPdfPosition) => {
  const existing = await AsyncStorage.getItem(BOOKMARKS_KEY);
  let bookmarks: LastReadPdfPosition[] = existing ? JSON.parse(existing) : [];
  if (!bookmarks.some(b => b.start_page === bookmark.start_page)) {
    bookmarks.push(bookmark);
    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  }
};

export const getBookmarks = async (): Promise<LastReadPdfPosition[]> => {
  const existing = await AsyncStorage.getItem(BOOKMARKS_KEY);
  return existing ? JSON.parse(existing) : [];
};

export const removeBookmark = async (start_page: number) => {
  const existing = await AsyncStorage.getItem(BOOKMARKS_KEY);
  let bookmarks: LastReadPdfPosition[] = existing ? JSON.parse(existing) : [];
  bookmarks = bookmarks.filter(b => b.start_page !== start_page);
  await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
}; 