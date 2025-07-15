import React from 'react';
import { SafeAreaView, StatusBar, FlatList, TouchableOpacity, Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import surahList from '../../quran-data/surah.json';
import styles from './SurahListScreen.style';
export default function SurahListScreen({ navigation }: StackScreenProps<RootStackParamList, 'SurahList'>) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', padding:5 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <FlatList
      style={{marginBottom:20}}
        data={surahList}
        keyExtractor={item => item.index}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.surahCard}
            onPress={() => navigation.navigate('SurahDetail', { surahNumber: item.index, surahName: item.title_ar })}
          >
            <View style={styles.surahRow}>
              {/* English title */}
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.surahTitleEn}>{item.title_en}</Text>
              </View>
              {/* Arabic title */}
              <Text style={styles.surahTitleAr}>{item.title_ar}</Text>
              {/* Medal/Surah number */}
              <View style={styles.surahMedal}>
                <Text style={styles.surahMedalText}>{parseInt(item.index, 10)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
