import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  FlatList,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { useNavigation } from '@react-navigation/native';
import juzListRaw from '../../quran-data/juz.json';
import styles from './JuzListScreen.style';

type NavigationProp = StackNavigationProp<RootStackParamList, 'JuzList'>;

type JuzItem = {
  index: string;
  title_en: string;
  title_ar: string;
  start: { index: string; verse: string; name: string };
  end: { index: string; verse: string; name: string };
};

// If juzListRaw is an array of arrays, flatten it
const juzList: JuzItem[] = (
  Array.isArray(juzListRaw[0]) ? juzListRaw.flat() : juzListRaw
) as JuzItem[];

export default function JuzListScreen() {
  const navigation = useNavigation<NavigationProp>();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', padding:5 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <FlatList
      style={{marginBottom:20}}
        data={juzList}
        keyExtractor={item => String(item.index)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.juzCard}
            onPress={() =>
              navigation.navigate('JuzReading', {
                startSurah: item.start.index,
                startAyah: item.start.verse,
                endSurah: item.end.index,
                endAyah: item.end.verse,
                juzName: `${item.title_ar} - ${parseInt(item.index, 10)}`,
              })
            }
          >
            <View style={styles.juzRow}>
              {/* Medal/Juz number */}
              {/* English title and page */}
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.juzTitleEn}>{item.title_en}</Text>
              </View>
              {/* Arabic title */}
              <Text style={styles.juzTitleAr}>{item.title_ar}</Text>
              <View style={styles.juzMedal}>
                <Text style={styles.juzMedalText}>{parseInt(item.index, 10)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
