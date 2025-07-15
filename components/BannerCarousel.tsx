import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, Dimensions, StyleSheet } from 'react-native';
import moment from 'moment-hijri';
import { days, months } from '../pages/dateUtils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_HEIGHT = Math.round(SCREEN_WIDTH * 0.45);


export default function BannerCarousel() {

    const banners = [
        require('../assets/banners/banner_1.jpg'),
        require('../assets/banners/banner_2.jpg'),
        require('../assets/banners/banner_3.jpg'),
      ];
  const [bannerIndex, setBannerIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        setBannerIndex(prev => (prev + 1) % banners.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [fadeAnim, banners.length]);

  // Dynamic English date
  const now = new Date();
  const englishDate = `${days[now.getDay()]}, ${now.getDate()}-${months[now.getMonth()]}-${now.getFullYear().toString().slice(-2)}`;
  // Dynamic Hijri date
  const islamicDate = moment().format('iD iMMMM');

  return (
    <View style={styles.bannerWrapper}>
      <Animated.Image
        source={banners[bannerIndex]}
        style={[styles.bannerImage, { opacity: fadeAnim }]}
        resizeMode="cover"
      />
      <View style={styles.bannerDateOverlay}>
        <Text style={styles.bannerDateText}>{islamicDate}</Text>
        <Text style={styles.bannerDateSub}>{englishDate}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bannerWrapper: {
    width: '100%',
    height: BANNER_HEIGHT,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  bannerDateOverlay: {
    position: 'absolute',
    left: 24,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 2,
  },
  bannerDateText: {
    color: '#222',
    fontSize: 28,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    letterSpacing: 1,
    fontFamily: 'QCF_BSML',
  },
  bannerDateSub: {
    color: '#222',
    fontSize: 16,
    fontWeight: '400',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginTop: 2,
    letterSpacing: 0.5,
    fontFamily: 'QCF_BSML',
  },
});
