import { StyleSheet } from 'react-native';
import config from '../Const/config';
var Dimensions = require('Dimensions');
var currentWidth = Dimensions.get('window').width;
var currentHeight = Dimensions.get('window').height;
var vm = currentWidth > currentHeight ? currentHeight : currentWidth;

export default StyleSheet.create({
    reclock: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    reclockScheduling: {
        width: currentWidth,
        height: currentWidth * 3 / 25,
        paddingLeft: currentWidth / 25 + 2,
        justifyContent: 'center',
    },
    reclockScheduling_text: {
        color: '#a2a2a2',
        fontSize: currentWidth * 24 / 750,
        fontWeight: 'bold',
    },
    reclockSchedulingTime: {
        width: currentWidth,
        height: currentWidth * 2 / 15,
        paddingLeft: currentWidth / 25 + 2,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#e1e1e1'
    },
    reclockSchedulingTime_text1: {
        fontSize: currentWidth / 25,
        color: '#333333',
    },
    reclockSchedulingTime_text2: {
        fontSize: currentWidth * 28 / 750,
        color: '#333333',
    },
    reclockSchedulingTime_choose: {
        width: currentWidth * .5,
        alignItems: 'flex-end',
        paddingRight: currentWidth / 25,
    },
    reclockReason: {
        width: currentWidth,
        height: currentWidth / 3,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e1e1e1',
    },
    reclockReason_textBox: {
        width: currentWidth,
        marginTop: currentWidth * 4 / 75,
        flexDirection: 'row',
        alignItems: 'center',
    },
    reclockReason_text_icon: {
        width: currentWidth / 25 + 2,
        textAlign: 'center',
        color: 'red',
    },
    reclockReason_text: {
        fontSize: currentWidth * 28 / 750,
        color: '#333333',
    },
    reclockReason_input: {
        width: currentWidth * 23 / 25 - 4,
        height: currentWidth * 2 / 9,
        padding: 0,
        textAlignVertical: 'top',
    },
    commitButton: {
        width: currentWidth * 23 / 25,
        height: currentWidth * 88 / 750,
        marginTop: currentWidth / 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: config.topicColor,
        borderRadius: currentWidth * 88 / 750,
    },
    commitButton_text: {
        fontSize: currentWidth * 34 / 750,
        color: 'white'
    },
    loading: {
        width: currentWidth,
        height: currentHeight * .4,
        position: 'absolute',
        top: 0
    }
});