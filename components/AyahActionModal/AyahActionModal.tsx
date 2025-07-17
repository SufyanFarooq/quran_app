import React from 'react';
import { Modal, View, TouchableOpacity, Image, Text, Alert } from 'react-native';
import styles from './AyahActionModal.styles';

interface AyahActionModalProps {
  visible: boolean;
  onClose: () => void;
  selectedAyah: any;
  onBookmark: (ayah: any) => Promise<void>;
  // You can add more action handlers as needed
}

const actions = [
  {
    key: 'play',
    label: 'Play Ayah',
    icon: require('../../assets/modal/play.png'),
    onPress: () => Alert.alert('Coming soon!'),
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
    onPress: () => Alert.alert('Coming soon!'),
  },
  {
    key: 'share',
    label: 'Share only text',
    icon: require('../../assets/modal/share-text.png'),
    onPress: () => Alert.alert('Coming soon!'),
  },
  {
    key: 'share_bg',
    label: 'Share text with background',
    icon: require('../../assets/modal/share-image.png'),
    onPress: () => Alert.alert('Coming soon!'),
  },
];

const AyahActionModal: React.FC<AyahActionModalProps> = ({ visible, onClose, selectedAyah, onBookmark }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
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
                  item.onPress();
                  onClose();
                }
              }}
            >
              <Image source={item.icon} style={styles.actionIcon} resizeMode="contain" />
              <Text style={styles.actionLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};

export default AyahActionModal; 