import {
    StyleSheet,
    StatusBar
} from 'react-native';
var Dimensions = require('Dimensions');
var currentWidth = Dimensions.get('window').width;
var currentHeight = Dimensions.get('window').height;
var vm = currentWidth > currentHeight ? currentHeight : currentWidth;

export default StyleSheet.create({
    scroll: {
        height: currentHeight - StatusBar.currentHeight - currentWidth * 84 / 750,
    },
    container: {
        width: currentWidth,
    },
    notice: {
        width: currentWidth,
        height: currentWidth * 185 / 750,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#dddddd',
    },
    notice_icon_box: {
        width: currentWidth * 58 / 750,
        paddingLeft: currentWidth / 25,
        paddingTop: currentWidth * 28 / 750,
    },
    notice_icon: {
        width: currentWidth * 28 / 750,
        height: currentWidth * 26 / 750,
    },
    notice_title: {
        width: currentWidth * 692 / 750,
        height: currentWidth * 105 / 750,
        paddingTop: currentWidth * 20 / 750,
        lineHeight: currentWidth * 42 / 750,
        fontSize: currentWidth * 32 / 750,
        paddingLeft: currentWidth / 25,
        color: '#333333',
    },
    notice_date: {
        height: currentWidth * 80 / 750,
        paddingLeft: currentWidth / 25,
        flexDirection: 'row',
        alignItems: 'center',
    },
    notice_date_text: {
        fontSize: currentWidth * 24 / 750,
        color: '#999999',
    },
    // txt: {
    //     textAlign: 'left',
    //     paddingLeft: 13,
    //     marginTop: 5,
    //     color: 'black',
    //     fontSize: 17,
    // },
    // guideView: {
    //     marginLeft: 13,
    //     marginRight: 13,
    //     height: 40,
    //     marginTop: 10,
    //     alignItems: 'center',
    //     justifyContent: 'center',
    // },
    // upArrow: {
    //     marginLeft: 13,
    //     marginRight: 13,
    //     height: 30,
    //     marginTop: 0,
    //     alignItems: 'center',
    //     justifyContent: 'center',
    // },
    // datePickBtn: {
    //     marginLeft: 13,
    //     width: currentWidth / 4,
    //     height: 30,
    //     marginTop: 10,
    //     backgroundColor: 'white',
    //     borderColor: 'red',
    //     borderRadius: 6,
    //     borderWidth: 1,
    //     alignItems: 'center',
    //     justifyContent: 'center',
    // },
    // datePickBtn2: {
    //     marginLeft: 13,
    //     width: currentWidth / 4,
    //     height: 30,
    //     marginTop: 10,
    //     backgroundColor: 'white',
    //     borderColor: 'red',
    //     borderRadius: 6,
    //     borderWidth: 1,
    //     alignItems: 'center',
    //     justifyContent: 'center',
    // },
    // dateResetBtn: {
    //     flex: 1,
    //     marginLeft: 10,
    //     width: currentWidth / 8,
    //     height: 30,
    //     marginTop: 10,
    //     alignItems: 'center',
    //     justifyContent: 'center',
    // },
    // searchInput: {
    //     height: 30,
    //     marginTop: 10,
    //     marginLeft: 13,
    //     marginRight: 13,
    //     flex: 1,
    //     borderColor: '#979797',
    //     borderRadius: 6,
    //     borderWidth: 1,
    //     fontSize: 13,
    //     backgroundColor: 'white'
    // },
    // txtContent: {
    //     textAlign: 'left',
    //     paddingLeft: 13,
    //     marginTop: 5,
    //     color: '#595757',
    //     fontSize: 13,
    // },
    // dateTxtContent: {
    //     textAlign: 'left',
    //     paddingLeft: 0,
    //     marginTop: 5,
    //     color: '#595757',
    //     fontSize: 13,

    // },
    // rightArrow: {
    //     marginTop: 10,
    //     marginLeft: 50,
    //     height: 14,
    //     width: 7,
    // },
});