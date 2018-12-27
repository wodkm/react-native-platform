import {
    StyleSheet,
    Platform
} from 'react-native';
import config from '../../Const/config';
var Dimensions = require('Dimensions');
var currentWidth = Dimensions.get('window').width;
var currentHeight = Dimensions.get('window').height;
var vm = currentWidth > currentHeight ? currentHeight : currentWidth;

export default StyleSheet.create({
    content: {
        marginTop: 55,
        marginLeft: 20,
        marginRight: 20,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3
    },
    text: {
        color: 'white',
        fontSize: 13,
    },
    container: {
        paddingBottom: 20
    },
    arrow: {
        width: currentHeight * .06 * .4,
        height: currentWidth * 2 / 75,
        marginLeft: currentWidth * .015,
        marginRight: currentWidth / 25,
    },
    icons: {
        width: currentWidth * 33 / 750,
        height: currentWidth * 33 / 750,
        marginLeft: currentWidth / 25,
        marginRight: 15,
    },
    item: {
        height: currentWidth * 100 / 750,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
    },
    item_text: {
        width: currentWidth * 687 / 750 - 15,
        height: currentWidth * 100 / 750,
        borderBottomWidth: 1,
        borderBottomColor: '#e1e1e1',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    font: {
        fontSize: currentWidth * 34 / 750,
        color: '#333333',
    },
    wrapper: {
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e1e1e1',
    },
    tag: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 'bold'
    },
    exit: {
        marginTop: 55,
        marginLeft: 20,
        marginRight: 20,
    },
    userSettings_bg: {
        width: currentWidth,
        height: currentWidth * 320 / 750,
        flexDirection: 'row',
    },
    userSettings_head: {
        width: currentWidth,
        height: currentWidth * 138 / 750,
        marginTop: currentWidth * 122 / 750,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    userIcon: {
        width: currentWidth * 138 / 750,
        height: currentWidth * 138 / 750,
        marginLeft: currentWidth / 25,
        marginRight: 15,
        borderRadius: currentWidth * 138 / 750,
        borderWidth: currentWidth * 5 / 750,
        borderColor: '#58adf3',
    },
    username: {
        color: 'white',
        fontSize: currentWidth * 38 / 750,
    },
    bind_status_1: {
        color: '#e2e2e2',
        fontSize: currentWidth * 27 / 750,
    },
    userSettings_head_arrow: {
        width: currentWidth * 18 / 750,
        height: currentWidth * 33 / 750,
        marginLeft: currentWidth * .015,
        marginRight: currentWidth / 25,
    }
});