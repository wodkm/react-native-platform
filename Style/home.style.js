import {
    StyleSheet,
    Platform
} from 'react-native';
import config from '../Const/config';
var Dimensions = require('Dimensions');
var currentWidth = Dimensions.get('window').width;
var currentHeight = Dimensions.get('window').height;
var vm = currentWidth > currentHeight ? currentHeight : currentWidth;

export default StyleSheet.create({
    weather_bg: {
        width: currentWidth,
        height: currentWidth * 477 / 750,
    },
    weather_box: {
        width: currentWidth,
        height: currentWidth * 14 / 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    weather_text_large: {
        fontSize: currentWidth * 8 / 75,
        lineHeight: currentWidth * 13.5 / 75,
        color: "white",
    },
    weather_text_middle: {
        fontSize: currentWidth * 4 / 75,
        lineHeight: currentWidth * 13.5 / 75,
        color: "white",
    },
    weather_text_small: {
        fontSize: currentWidth * 2.8 / 75,
        lineHeight: currentWidth * 5 / 75,
        color: "white",
    },
    notice: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: currentWidth * 8 / 75,
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: -currentWidth * 5.7 / 75,
        backgroundColor: 'white',
        zIndex: -1,
    },
    notice_textBox: {
        flexDirection: "row",
        alignItems: 'center'
    },
    notice_text: {
        marginLeft: 10,
        fontSize: currentWidth * 2.8 / 75,
        fontWeight: 'bold',
    },
    notice_date: {
        fontSize: currentWidth * 2.8 / 75,
        color: "#999999",
    },
    notice_image: {
        width: currentWidth * 2.8 / 75,
        height: currentWidth * 2.6 / 75,
    },
    clock: {
        height: currentWidth * 16 / 75,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 1,
        marginBottom: 10,
    },
    clock_bg: {
        height: currentWidth * 16 / 75,
        justifyContent: 'center',
        alignItems: 'center',
    },
    clock_touch: {
        width: currentWidth * 668 / 750,
        height: currentWidth * 19 / 125,
        justifyContent: 'center',
        alignItems: 'center',
    },
    clock_text: {
        fontSize: currentWidth * 3.2 / 75,
        color: 'white',
    },
    option: {
        maxHeight: currentWidth * 40 / 75,
        paddingLeft: 7.5,
        paddingRight: 7.5,
        backgroundColor: 'white',
        paddingBottom: 0,
    },
    option_title: {
        height: currentWidth * 8 / 75,
        paddingLeft: 7.5,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eeeeee',
    },
    option_title_text: {
        fontSize: currentWidth * 3.2 / 75,
    },
    option_scroll: {
        width: currentWidth,
        height: currentHeight - 11 - currentWidth * 64 / 75,
        maxHeight: currentWidth * 32 / 75,
    },
    option_list: {
        width: currentWidth - 30,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    option_item: {
        width: (currentWidth - 30) * .5,
        height: currentWidth * 16 / 75,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    option_item_icon: {
        width: currentWidth * 7.8 / 75,
        height: currentWidth * 7.8 / 75,
        marginLeft: 7.5,
    },
    option_text1: {
        width: (currentWidth - 30) * .5 - currentWidth * 7.8 / 75 - 22.5,
        borderRightWidth: 1,
        borderRightColor: '#eeeeee',
    },
    option_text2: {
        width: (currentWidth - 30) * .5 - currentWidth * 7.8 / 75 - 30,
    },
    option_name: {
        fontSize: currentWidth * 2.8 / 75,
    },
    option_intro: {
        fontSize: currentWidth * 2.2 / 75,
        color: '#999999',
    }
});