import {StyleSheet} from "react-native";

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

  export default styles;