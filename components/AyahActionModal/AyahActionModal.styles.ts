import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingHorizontal:12
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    width: '100%',
    overflow: 'hidden',
    // No bottom radius, no margin/padding at bottom
  },
  arrowContainer: {
    alignItems: 'center',
  },
  arrow: {
    width: 32,
    height: 32,
    marginVertical: 8,
    tintColor: '#aaa',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  actionIcon: {
    width: 28,
    height: 28,
    marginRight: 8,
  },
  actionLabel: {
    fontSize: 18,
    marginLeft: 8,
    color: '#222',
  },
});

export default styles; 