import { StyleSheet, Dimensions } from "react-native";
import { themas } from "../../global/themes";

const { width } = Dimensions.get('window');

export const style = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        
    },
    boxtop: {
       height: Dimensions.get('window').height/3,
       width: width, // Define a largura como a largura da tela
      // backgroundColor:'red',
       justifyContent:'center',
       alignItems: 'center',
    },
    boxmid:{
        height: Dimensions.get('window').height/4,
       width: width,
      // backgroundColor:'green',
       paddingHorizontal:37
    },
    boxbot:{
        height: Dimensions.get('window').height/3,
       width: width,
        // backgroundColor:'blue',
        alignItems:'center',
       //  justifyContent:'center'
    },
    logo:{
      marginLeft:11,
      marginBottom:-20,
      width:100,
      height:80
    },
    text:{
     fontWeight:'bold',
     marginTop:40,
     fontSize:18
    },
    titleInput:{
       marginLeft:5,
       color:themas.colors.Gray,
       marginTop:20
    },
    boxinput:{
     width: '100%',
     height:40,
     borderWidth:1,
     borderRadius:40,
     marginTop:10,
     flexDirection:'row',
     alignItems:'center',
     paddingHorizontal:30,
     paddingBottom:1,
     paddingTop:2,
     backgroundColor:themas.colors.lightGray,
     borderColor:themas.colors.lightGray
     
    },
    input:{
        height:'100%',
        width:'98%',
        //backgroundColor:themas.colors.Gray,
        borderRadius:40,
        paddingLeft:5
    },
    button:{
     width:250,
     height:50,
     alignItems:'center',
     justifyContent:'center',
     backgroundColor:themas.colors.primary,
     borderRadius:40,
     shadowColor: "#000",
     shadowOffset:{
        width: 0,
        height: 3,
     }
    },
    textbutton:{
     fontWeight:'bold',
     fontSize:16,
     color:'FFF',

    },
    textbottom:{
        fontSize:16,
        color:themas.colors.Gray
    }
})