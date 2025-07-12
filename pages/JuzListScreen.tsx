import React from 'react';
import {
  SafeAreaView,
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { useNavigation } from '@react-navigation/native';
import juzListRaw from '../quran-data/juz.json';

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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <FlatList
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
                juzName: `${item.title_ar} - ${item.index}`,
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
                <Text style={styles.juzMedalText}>{item.index}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  juzCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 0,
    paddingVertical: 8,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
  },
  juzRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  juzMedal: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    marginRight: 0,
  },
  juzMedalText: {
    color: '#176d2c',
    fontWeight: 'bold',
    fontSize: 14,
  },
  juzTitleAr: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 8,
    marginLeft: 8,
    textAlign: 'right',
    fontFamily: 'QCF_BSML',
    flex: 0,
    minWidth: 50,
  },
  juzTitleEn: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 0,
  },
  pageNo: {
    color: '#888',
    fontStyle: 'italic',
    fontSize: 12,
  },
});
