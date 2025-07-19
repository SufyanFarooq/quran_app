import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Text,
  View,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Alert
} from 'react-native';
import juzList from '../../../quran-data/juzpdf.json';
import surahList from '../../../quran-data/surahpdf.json';
import styles from './ReadQuranList.style';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../../App';
import {
  getLastReadPdfPosition,
  getBookmarks,
  removeBookmark,
} from '../../../utils/storageUtils';
import showToast from '../../../utils/toastUtils';
export default function ReadQuranScreen({
  navigation,
}: StackScreenProps<RootStackParamList, 'ReadQuranList'>) {
  const [activeTab, setActiveTab] = useState<'manzil' | 'juz' | 'surah'>('juz');
  const [bookmarksModalVisible, setBookmarksModalVisible] = useState(false);
  const [bookmarks, setBookmarks] = useState<
    { start_page: number; index?: number }[]
  >([]);
  const tabLabels = [
    { key: 'manzil', label: 'منزل' },
    { key: 'surah', label: 'سورہ' },
    { key: 'juz', label: 'پاره' },
  ];

  const handleResumeReading = async () => {
    const last = await getLastReadPdfPosition();
    if (last && last.start_page) {
      navigation.navigate('ReadQuran', { page: last.start_page });
    } else {
      showToast('Resume Reading, No last reading position found.');
    }
  };

  const openBookmarksModal = async () => {
    const data = await getBookmarks();
    setBookmarks(data);
    setBookmarksModalVisible(true);
  };

  const handleDeleteBookmark = (start_page: number) => {
    Alert.alert(
      'Delete Bookmark',
      'Are you sure you want to delete this bookmark?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await removeBookmark(start_page);
            const data = await getBookmarks();
            setBookmarks(data);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', padding: 5 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {/* Floating Bookmarks Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={openBookmarksModal}
        activeOpacity={0.8}
      >
        <Image
          source={require('../../../assets/menu/bookmarks.png')}
          style={styles.fabIcon}
        />
      </TouchableOpacity>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        {tabLabels.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabItem}
            onPress={() => setActiveTab(tab.key as 'manzil' | 'juz' | 'surah')}
            activeOpacity={1}
          >
            <Text style={styles.tabText}>{tab.label}</Text>
            {activeTab === tab.key && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>
      {/* List */}
      {activeTab === 'juz' ? (
        <FlatList
          style={{ marginBottom: 80 }}
          data={juzList}
          keyExtractor={item => String(item.index)}
          renderItem={({ item }) => (
            <View style={styles.juzCard}>
              <TouchableOpacity
                style={styles.juzRow}
                onPress={() =>
                  navigation.navigate('ReadQuran', { page: item.start_page })
                }
              >
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.juzTitleEn}>{item.title_en}</Text>
                </View>
                <Text style={styles.juzTitleAr}>{item.title_ar}</Text>
                <View style={styles.juzMedal}>
                  <Text style={styles.juzMedalText}>{item.index}</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : activeTab === 'surah' ? (
        <FlatList
          style={{ marginBottom: 80 }}
          data={surahList}
          keyExtractor={item => String(item.index)}
          renderItem={({ item }) => (
            <View style={styles.surahCard}>
              <TouchableOpacity
                style={styles.juzRow}
                onPress={() =>
                  navigation.navigate('ReadQuran', { page: item.start_page })
                }
              >
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.surahTitleEn}>{item.title_en}</Text>
                </View>
                <Text style={styles.surahTitleAr}>{item.title_ar}</Text>
                <View style={styles.surahMedal}>
                  <Text style={styles.surahMedalText}>{item.index}</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        // Placeholder for Manzil tab (if needed)
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ color: '#888', fontSize: 18 }}>
            منزل list coming soon
          </Text>
        </View>
      )}
      {/* Resume Reading Button */}
      <View style={styles.resumeButtonContainer}>
        <TouchableOpacity
          style={styles.resumeButton}
          activeOpacity={0.8}
          onPress={handleResumeReading}
        >
          <Image
            source={require('../../../assets/menu/read-quran.png')}
            style={styles.resumeLogo}
          />
          <Text style={styles.resumeButtonText}>Resume Reading</Text>
          <View style={{ flex: 1 }} />
          <Image
            source={require('../../../assets/menu/next.png')}
            style={styles.resumeArrow}
          />
        </TouchableOpacity>
      </View>
      {/* Bookmarks Modal */}
      <Modal
        visible={bookmarksModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setBookmarksModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 12,
              padding: 20,
              width: '85%',
              maxHeight: '70%',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                Bookmarks
              </Text>
              <Pressable onPress={() => setBookmarksModalVisible(false)}>
                <Text style={{ fontSize: 18, color: '#4b3b2a' }}>Close</Text>
              </Pressable>
            </View>
            <ScrollView>
              {bookmarks.length === 0 ? (
                <Text
                  style={{ color: '#888', textAlign: 'center', marginTop: 24 }}
                >
                  No bookmarks found.
                </Text>
              ) : (
                bookmarks.map((bm, idx) => (
                  <View
                    key={bm.start_page + '-' + idx}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingVertical: 12,
                      borderBottomWidth: 1,
                      borderColor: '#eee',
                    }}
                  >
                    <TouchableOpacity
                      style={{ flex: 1 }}
                      onPress={() => {
                        setBookmarksModalVisible(false);
                        navigation.navigate('ReadQuran', { page: bm.start_page });
                      }}
                    >
                      <Text style={{ fontSize: 16 }}>Page {bm.start_page}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteBookmark(bm.start_page)}
                      style={{ padding: 8 }}
                    >
                      <Image
                        source={require('../../../assets/menu/delete.png')}
                        style={{ width: 20, height: 20, tintColor: '#b00' }}
                      />
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
