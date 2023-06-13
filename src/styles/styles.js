import { StyleSheet} from 'react-native';
//! https://colorhunt.co/palette/f7f1e5e7b10a8981214c4b16
export const styles = StyleSheet.create({
    safearea:{
        flex:1
    },
    container :{
        paddingHorizontal:10, 
        paddingVertical:10,
        marginVertical:10
        
    },
    centeredView: {
        flex: 1,
        justifyContent:"flex-end",
        alignItems:"flex-end",
        marginTop: 22,
      },

      fab: {
        position: "relative",
        marginBottom: 50,
        width: 55,
        backgroundColor: "#1D267D",
      },

      bgDark:'#2A2F4F',
      textcolor:'#FDE2F3',
      btnPrimary:'#1D267D',
      btnSecondary:'#E5BEEC',
      btntertiary:'#5C469C'
})