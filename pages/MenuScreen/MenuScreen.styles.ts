import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 16 * 2 - 12) / 2;
const CARD_HEIGHT = 150;
const BANNER_HEIGHT = Math.round(SCREEN_WIDTH * 0.45);

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingTop: 0,
    backgroundColor: '#f5f5f5',
  },
  searchBarOverlapWrapper: {
    position: 'absolute',
    top: BANNER_HEIGHT - 28,
    left: 0,
    width: '100%',
    alignItems: 'center',
    zIndex: 2,
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 22,
    width: '88%',
    marginBottom: 0,
    paddingHorizontal: 18,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  searchPlaceholder: {
    color: '#bbb',
    fontSize: 16,
  },
  menuGridWrapper: {
    flex: 1,
    marginTop: 38,
    zIndex: 1,
  },
  menuGridScrollContainer: {
    flex: 1,
    paddingBottom: 24,
    overflow: 'hidden',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginHorizontal: 16,
    marginTop: 8,
  },
  menuCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  menuIconPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e0e0e0',
    marginBottom: 10,
  },
  menuIconImage: {
    width: 150,
    height: 80,
    marginBottom: 10,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
  },
});

export default styles; 