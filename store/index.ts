import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  quranFont: 'Uthmani' | 'Tajweed';
  quranFontSize: number;
  quranLanguage: 'en' | 'ur' | 'ar';
}

const initialState: SettingsState = {
  quranFont: 'Uthmani',
  quranFontSize: 22,
  quranLanguage: 'en',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setQuranFont(state, action: PayloadAction<'Uthmani' | 'Tajweed'>) {
      state.quranFont = action.payload;
    },
    setQuranFontSize(state, action: PayloadAction<number>) {
      state.quranFontSize = action.payload;
    },
    setQuranLanguage(state, action: PayloadAction<'en' | 'ur' | 'ar'>) {
      state.quranLanguage = action.payload;
    },
  },
});

export const { setQuranFont, setQuranFontSize, setQuranLanguage } = settingsSlice.actions;

const store = configureStore({
  reducer: {
    settings: settingsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store; 