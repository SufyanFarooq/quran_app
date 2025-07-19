import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Modal,
  Image,
} from 'react-native';
import styles from './AyahActionModal.styles';
import Clipboard from '@react-native-clipboard/clipboard';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import showToast from '../../utils/toastUtils';
const shareStyles = StyleSheet.create({
  shareBg: {
    width: 320,
    height: 420,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#222',
  },
  shareText: {
    color: '#000',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '600',
    fontFamily: 'QCF_BSML',
  },
});
type AyahActionModalProps = {
  visible: boolean;
  onClose: () => void;
  selectedAyah: {
    surahName?: string;
    ayahNumber?: number;
    text?: string;
    // add other fields if needed
  };
  onBookmark: (ayah: any) => Promise<void>;
};
function convertToUrduNumeral(numStr: string) {
  const urduDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return numStr.replace(/\d/g, d => urduDigits[parseInt(d)]);
}
const AyahActionModal: React.FC<AyahActionModalProps> = ({
  visible,
  onClose,
  selectedAyah,
  onBookmark,
}) => {
  const viewShotRef = useRef<ViewShot>(null);
  const [shareModalVisible, setShareModalVisible] = useState(false);
 
  const formattedAyahText = `سُورَةُ ${selectedAyah?.surahName || ''} آیت نمبر ${
    selectedAyah?.ayahNumber || ''
  }
أَعـوذُ بِاللهِ مِنَ الشَّيْـطانِ الرَّجيـم
بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ\n\n${selectedAyah?.text || ''}(${convertToUrduNumeral(String(selectedAyah?.ayahNumber ?? ''))})`;

  const handleShareWithBackground = async () => {
    setShareModalVisible(true);
    setTimeout(async () => {
      if (viewShotRef.current) {
        const uri = await viewShotRef.current.capture?.();
        setShareModalVisible(false);
        if (uri) await Share.open({ url: uri });
      }
    }, 500);
  };

  const actions = [
    {
      key: 'play',
      label: 'Play Ayah',
      icon: require('../../assets/modal/play.png'),
      onPress: () => showToast('Coming soon!'),
    },
    {
      key: 'bookmark',
      label: 'Bookmark',
      icon: require('../../assets/modal/favorite.png'),
      isBookmark: true, // special handling
    },
    {
      key: 'copy',
      label: 'Copy',
      icon: require('../../assets/modal/sheet.png'),
      onPress: () => {
        Clipboard.setString(formattedAyahText);
        showToast('Ayah copied to clipboard.');
      },
    },
    {
      key: 'share',
      label: 'Share only text',
      icon: require('../../assets/modal/share-text.png'),
      onPress: async () => {
        try {
          await Share.open({ message: formattedAyahText });
        } catch (e) {}
      },
    },
    {
      key: 'share_bg',
      label: 'Share text with background',
      icon: require('../../assets/modal/share-image.png'),
      onPress: handleShareWithBackground,
    },
  ];
  return (
    <>
      {/* Main Modal */}
      <Modal
        visible={visible}
        onRequestClose={onClose}
        transparent
        animationType="slide"
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            {/* Dropdown Arrow */}
            <TouchableOpacity style={styles.arrowContainer} onPress={onClose}>
              <Image
                source={require('../../assets/modal/down.png')}
                style={styles.arrow}
                resizeMode="contain"
              />
            </TouchableOpacity>
            {/* Menu List */}
            {actions.map(item => (
              <TouchableOpacity
                key={item.key}
                style={styles.actionRow}
                onPress={async () => {
                  if (item.isBookmark) {
                    if (selectedAyah) await onBookmark(selectedAyah);
                    onClose();
                  } else if (item.onPress) {
                    await item.onPress();
                    onClose();
                  }
                }}
              >
                <Image
                  source={item.icon}
                  style={styles.actionIcon}
                  resizeMode="contain"
                />
                <Text style={styles.actionLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
      {/* Hidden Share Modal for ViewShot */}
      <Modal visible={shareModalVisible} transparent animationType="none">
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent',
          }}
        >
          <ViewShot
            ref={viewShotRef}
            options={{ format: 'jpg', quality: 0.95 }}
            style={{ borderRadius: 16, overflow: 'hidden' }}
          >
            <ImageBackground
              source={require('../../assets/ayat_bg.jpg')}
              style={shareStyles.shareBg}
              imageStyle={{ borderRadius: 16 }}
            >
              <Text style={shareStyles.shareText}>{formattedAyahText}</Text>
            </ImageBackground>
          </ViewShot>
        </View>
      </Modal>
    </>
  );
};

export default AyahActionModal;
