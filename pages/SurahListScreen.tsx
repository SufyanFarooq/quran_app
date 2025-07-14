import React from 'react';
import { SafeAreaView, StatusBar, FlatList, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import surahList from '../quran-data/surah.json';

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

const styles = StyleSheet.create({
  surahCard: {
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
  surahRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  surahMedal: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    marginRight: 0,
  },
  surahMedalText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 12,
  },
  surahTitleAr: {
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
  surahTitleEn: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 0,
  },
}); 