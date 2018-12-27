import { StyleSheet, StatusBar } from 'react-native';
var Dimensions = require('Dimensions');
var currentWidth = Dimensions.get('window').width;
var currentHeight = Dimensions.get('window').height;
var vm = currentWidth > currentHeight ? currentHeight : currentWidth;

export default StyleSheet.create({
	header: {
		height: currentWidth * 84 / 750 + StatusBar.currentHeight,
		elevation: 0,
		shadowOpacity: 0,
		backgroundColor: global.themeColor ? global.themeColor : config.theme.default.backgroundcolor,
		paddingTop: StatusBar.currentHeight,
	},
	left: {
		width: currentWidth * .15,
		height: currentHeight * .06,
		flexDirection: 'row',
		alignItems: 'center',
	},
	left_arrow: {
		width: currentWidth * 19 / 750,
		height: currentWidth * 34 / 750,
		marginLeft: currentWidth / 25,
	},
	title: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
	},
	title_text: {
		color: 'white',
		fontSize: currentWidth * 4 / 75,
	},
	right: {
		width: currentWidth * .15,
		height: currentHeight * .06,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	right_text: {
		color: 'white',
		fontSize: currentWidth * 3 / 75,
	},
	back: {
		width: currentHeight * .06 * .5,
		height: currentHeight * .06 * .5,
		marginLeft: currentWidth * .06
	},
	close: {
		width: currentHeight * .06 * .5,
		height: currentHeight * .06 * .5,
		marginLeft: currentWidth * .05
	},
});