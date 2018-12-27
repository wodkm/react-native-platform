import { StyleSheet } from 'react-native';
var Dimensions = require('Dimensions');
var currentWidth = Dimensions.get('window').width;
var currentHeight = Dimensions.get('window').height;
var vm = currentWidth>currentHeight?currentHeight:currentWidth;

export default StyleSheet.create({
	loading:{
		width:currentWidth,
		height:currentHeight
	}
})