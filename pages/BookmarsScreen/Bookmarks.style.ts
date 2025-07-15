import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
    header: {
      fontSize: 22,
      fontWeight: 'bold',
      textAlign: 'center',
      marginVertical: 16,
      color: '#176d2c',
    },
    item: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 2,
      borderWidth: 1,
      borderColor: '#eee',
    },
    title: {
      fontSize: 18,
      color: '#222',
      fontWeight: 'bold',
      marginBottom: 4,
      textAlign: 'right',
      fontFamily: 'QCF_BSML',
    },
    type: {
      fontSize: 14,
      color: '#888',
      textAlign: 'right',
    },
  }); 

  export default styles;