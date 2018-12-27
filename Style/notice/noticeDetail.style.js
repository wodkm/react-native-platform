import {
    StyleSheet,
} from 'react-native';
var Dimensions = require('Dimensions');
var currentWidth = Dimensions.get('window').width;
var currentHeight = Dimensions.get('window').height;
var vm = currentWidth > currentHeight ? currentHeight : currentWidth;

export default StyleSheet.create({
    bottomView: {
        height: currentHeight - 64,
        width: currentHeight,
        flex: 1,
    },
    contentContainer: {
        paddingVertical: 0,
    },
    thumbnail: {
        height: 81,
        marginTop: 20,
        marginLeft: 50,
        marginRight: 50,
    },
    txtContent: {
        paddingLeft: 13,
        paddingRight: 13,
        marginTop: 20,
        marginBottom: 10,
        backgroundColor: 'white',
        height: currentHeight - 64 - 20 - 40,
    },
    topbg: {
        marginTop: 0,
        height: 25,
        paddingLeft: 13,
        paddingRight: 13,
    },
    openAddText: {
        textAlign: 'right',
        color: '#c9636f',
        fontSize: 13,
        marginTop: 10,
        height: 15,
    },
    txtTitle: {
        textAlign: 'center',
        marginTop: 20,
        color: 'black',
        fontSize: 17,
    },
    fengeXian: {
        height: 1,
        backgroundColor: '#595757'
    },
    publisher: {
        textAlign: 'right',
        paddingLeft: 13,
        paddingRight: 13,
        marginBottom: 20,
        color: '#595757',
        fontSize: 13,
    },
    openButton: {
        paddingRight: 43,
        height: 20,
        width: 100,
        backgroundColor: 'blue'
    },
});