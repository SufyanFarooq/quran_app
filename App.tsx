/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import { Image, Platform, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import store, { RootState } from './store/index';
import { useSelector } from 'react-redux';
import RNFS from 'react-native-fs';
import MenuScreen from './pages/MenuScreen/MenuScreen';
import SurahListScreen from './pages/SurahListScreen/SurahListScreen';
import SurahDetailScreen from './pages/SurahDetailScreen/SurahDetailScreen';
import JuzListScreen from './pages/JuzListScreen/JuzListScreen';
import JuzReadingScreen from './pages/JuzReadingScreen/JuzReadingScreen';
import LandingScreen from './pages/LandingScreen/LandingScreen';
import BookmarksScreen from './pages/BookmarsScreen/BookmarksScreen';
import ReadQuranList from './pages/ReadQuran/ReadQuranList/ReadQuranList';
import QuranPdfReader from './pages/ReadQuran/ReadQuranScreen/ReadQuranScreen';
import SettingModal from './components/SettingModal/SettingModal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { menuTranslations } from './locales/menu';
// Root stack param list for navigation types
export type RootStackParamList = {
  Landing: undefined;
  Menu: undefined;
  SurahList: undefined;
  SurahDetail: {
    surahNumber: string | number;
    surahName: string;
    startAyah?: string;
  };
  JuzList: undefined;
  JuzReading: {
    startSurah: string;
    startAyah: string;
    endSurah: string;
    endAyah: string;
    juzName: string;
    ayahNumber?: string;
  };
  Bookmarks: undefined;
  ReadQuranList: undefined;
  ReadQuran: { page?: number };
};

const Stack = createStackNavigator<RootStackParamList>();

// Local file fetch function
export const getSurah = async (surahNumber: string | number) => {
  const surahNum = parseInt(String(surahNumber), 10).toString();
  const fileName = `surah_${surahNum}.json`;
  try {
    let content;
    if (Platform.OS === 'android') {
      const filePath = `quran-data/surah/${fileName}`;
      content = await RNFS.readFileAssets(filePath, 'utf8');
      console.log('Loaded surah file (android):', filePath);
    } else {
      const filePath = `${RNFS.MainBundlePath}/quran-data/surah/${fileName}`;
      content = await RNFS.readFile(filePath, 'utf8');
      console.log('Loaded surah file (ios):', filePath);
    }
    const data = JSON.parse(content);
    let ayatArray = [];
    if (Array.isArray(data)) {
      ayatArray = data;
    } else if (data.verses) {
      ayatArray = data.verses;
    } else if (data.verse) {
      ayatArray = Object.entries(data.verse).map(([key, value]) => ({
        verse: key,
        text: value,
      }));
    }
    console.log(
      'Ayat loaded:',
      Array.isArray(ayatArray) ? ayatArray.length : typeof ayatArray,
    );
    return ayatArray || [];
  } catch (e) {
    console.log('Error loading surah:', e);
    return [];
  }
};

export default function App() {
  const [settingModalVisible, setSettingModalVisible] = useState(false);
  return (
    <Provider store={store}>
      <AppContent settingModalVisible={settingModalVisible} setSettingModalVisible={setSettingModalVisible} />
    </Provider>
  );
}

function AppContent({ settingModalVisible, setSettingModalVisible }: { settingModalVisible: boolean; setSettingModalVisible: (v: boolean) => void }) {
  const quranLanguage = useSelector((state: RootState) => state.settings.quranLanguage);
  const t = menuTranslations[quranLanguage];
  return (
    <NavigationContainer>
      <>
        <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen
              name="Landing"
              component={LandingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Menu"
              component={MenuScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SurahList"
              component={SurahListScreen}
              options={{
                headerTitle: () => (
                  <Image
                    source={require('./assets/menu/surah.png')}
                    style={{ width: 150, height: 80, resizeMode: 'contain', marginBottom: 20 }}
                  />
                ),
                headerTitleAlign: 'center',
              }}
            />
            <Stack.Screen
              name="SurahDetail"
              component={SurahDetailScreen}
              options={({ route }) => ({
                // title: route.params.surahName,
                headerTitle: () => (
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: 'bold',
                    }}
                  >
                    {route.params.surahName}
                  </Text>
                ),
                headerTitleAlign: 'center',
                headerRight: () => (
                  <Ionicons
                    name="settings-outline"
                    size={26}
                    color="#222"
                    style={{ marginRight: 18 }}
                    onPress={() => setSettingModalVisible(true)}
                  />
                ),
              })}
            />
            <Stack.Screen
              name="JuzList"
              component={JuzListScreen}
              options={{
                headerTitle: () => (
                  <Image
                    source={require('./assets/menu/parah.png')}
                    style={{ width: 150, height: 80, resizeMode: 'contain', marginBottom: 20 }}
                  />
                ),
                headerTitleAlign: 'center',
              }}
            />
            <Stack.Screen
              name="JuzReading"
              component={JuzReadingScreen}
              options={({ route }) => ({
                // title: route.params.juzName,
                headerTitle: () => (
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: 'bold',
                    }}
                  >
                    {route.params.juzName}
                  </Text>
                ),
                headerTitleAlign: 'center',
                headerRight: () => (
                  <Ionicons
                    name="settings-outline"
                    size={26}
                    color="#222"
                    style={{ marginRight: 18 }}
                    onPress={() => setSettingModalVisible(true)}
                  />
                ),
              })}
            />
            <Stack.Screen
              name="Bookmarks"
              component={BookmarksScreen}
              options={{ title: t.bookmarks }}
            />
            <Stack.Screen
              name="ReadQuranList"
              component={ReadQuranList}
              options={{
                // title: 'Surahs'
                headerTitle: () => (
                  <Image
                    source={require('./assets/menu/read-quran.png')}
                    style={{ width: 150, height: 70, resizeMode: 'contain' }}
                  />
                ),
                headerTitleAlign: 'center',
              }}
            />
            <Stack.Screen
              name="ReadQuran"
              component={QuranPdfReader}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
          <SettingModal
            visible={settingModalVisible}
            onClose={() => setSettingModalVisible(false)}
          />
        </>
      </NavigationContainer>
    );
}
