import { StyleSheet } from 'react-native';

const borderStyle = {
  borderColor: '#176d2c',
  borderWidth: 4,
  borderRadius: 16,
  marginHorizontal: 0,
};

const styles = StyleSheet.create({
  surahDetailTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 6,
    color: '#007bff',
  },
  topBorder: {
    ...borderStyle,
    borderBottomWidth: 0,
    height: 12,
    marginBottom: 8,
  },
  bottomBorder: {
    ...borderStyle,
    borderTopWidth: 0,
    height: 12,
    marginTop: 8,
  },
  ayatList: {
    padding: 20,
    minHeight: 400,
  },
  ayatText: {
    fontSize: 20,
    color: '#222',
    textAlign: 'right',
    lineHeight: 32,
    fontFamily: 'NotoNaskhArabic', // Only here!
    writingDirection: 'rtl',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    gap: 16,
  },
  pageBtn: {
    backgroundColor: '#176d2c',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
  },
  pageBtnDisabled: {
    backgroundColor: '#b2b2b2',
  },
  pageBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pageNum: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#176d2c',
  },
  ayahCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginHorizontal: 12,
    marginBottom: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#b7aea7',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    paddingVertical: 8,
    marginHorizontal: -16,
    marginTop: -16,
    marginBottom: 8,
  },
  cardHeaderTitle: {
    fontSize: 16,
    color: '#222',
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'QCF_BSML', // ya jo bhi aapka Arabic font hai
  },
  cardHeaderText: {
    fontSize: 22,
    color: '#222',
    width: 32,
    textAlign: 'left',
    paddingLeft: 10,
  },
  cardHeaderCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderRight: {
    width: 32,
  },
  ayatMedalContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
  },
  medalImage: {
    width: 20,
    height: 28,
    position: 'absolute',
    top: 18,
    left: 0,
  },
  medalText: {
    position: 'absolute',
    top: 23,
    left: 0,
    right: 8,
    textAlign: 'center',
    color: '#176d2c',
    fontWeight: 'bold',
    fontSize: 10,
    backgroundColor: 'transparent',
  },
  ayahMedalRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 8,
  },
  ayahText: {
    fontSize: 21,
    color: '#222',
    textAlign: 'right',
    flexShrink: 1,
    fontFamily: 'NotoNaskhArabic', // or your Uthmani font
    marginLeft: 8,
  },
  medalContainer: {
    width: 28,
    height: 34,
    marginLeft: 0,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  medalNumber: {
    position: 'absolute',
    top: 5,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#176d2c',
    fontWeight: 'bold',
    fontSize: 12,
    backgroundColor: 'transparent',
  },
});

export default styles;
