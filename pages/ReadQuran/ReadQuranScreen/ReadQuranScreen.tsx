import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Pdf from 'react-native-pdf';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../App';
import {
  saveLastReadPdfPosition,
  addBookmark,
} from '../../../utils/storageUtils';
import showToast from '../../../utils/toastUtils';
type Props = {
  route: RouteProp<RootStackParamList, 'ReadQuran'>;
};

const QuranPdfReader = ({ route }: Props) => {
  const page = route.params?.page || 1;
  const [currentPage, setCurrentPage] = useState(page);
  useEffect(() => {
    StatusBar.setHidden(true); // Already used
  }, []);
  if (Platform.OS !== 'android') {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#fff', textAlign: 'center', marginTop: 40 }}>
          PDF viewing is currently only supported on Android.
        </Text>
      </View>
    );
  }

  const source = { uri: 'bundle-assets://16_Line_Quran.pdf' };

  const handlePageChanged = (currentPageNum: number) => {
    setCurrentPage(currentPageNum);
    saveLastReadPdfPosition({ start_page: currentPageNum });
  };

  const handleAddBookmark = () => {
    Alert.alert('Add Bookmark', `Bookmark this page (${currentPage})?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Add',
        onPress: async () => {
          await addBookmark({ start_page: currentPage });
          showToast(`Bookmark Added, Page ${currentPage} bookmarked!`);
        },
      },
    ]);
  };

  return (
    <View style={styles.fullScreen}>
      <StatusBar hidden={true} />
      <Pdf
        source={source}
        page={page}
        style={styles.pdf}
        fitPolicy={2} // <-- FIT_HEIGHT
        enablePaging={false}
        horizontal={false}
        // scale={1.1}
        onError={error => {
          console.log('PDF load error:', error);
        }}
        onLoadComplete={(_numberOfPages, _filePath) => {
          console.log('PDF loaded');
        }}
        onPageChanged={handlePageChanged}
      />
      {/* Floating Add Bookmark Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddBookmark}
        activeOpacity={0.8}
      >
        <Image
          source={require('../../../assets/menu/add.png')}
          style={styles.fabIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 0, // Ensure no padding
    margin: 0, // Ensure no margin
  },
  fullScreen: {
    flex: 1,
    backgroundColor: '#000',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    backgroundColor: '#4b3b2a',
    borderRadius: 28,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  fabIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
});

export default QuranPdfReader;
