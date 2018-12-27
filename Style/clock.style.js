import {
	StyleSheet,
	Platform,
	StatusBar,
} from 'react-native';
import config from '../Const/config';
var Dimensions = require('Dimensions');
var currentWidth = Dimensions.get('window').width;
var currentHeight = Dimensions.get('window').height;
var vm = currentWidth > currentHeight ? currentHeight : currentWidth;

let location_image = Platform.OS == 'ios' ? (
	{
		resizeMode: 'cover',
		height: vm * .038,
		width: vm * .035,
	}
) : (
		{
			resizeMode: 'cover'
		}
	)

export default StyleSheet.create({
	body: {
		width: currentWidth,
		height: currentHeight,
		flexDirection: "column"
	},
	top: {
		width: currentWidth,
		height: currentWidth * 16 / 75,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: 'white',
		borderBottomWidth: 1,
		borderBottomColor: '#e2e2e2',
	},
	top_date: {
		width: currentWidth * 214 / 750,
		height: currentWidth / 15,
		marginRight: currentWidth / 25,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: currentWidth / 15,
	},
	top_date_text: {
		fontSize: vm * .036,
		color: 'white'
	},
	top_date_arrow: {
		width: currentWidth / 50,
		height: currentWidth * 8 / 750,
		marginLeft: 5,
	},
	user: {
		flexDirection: "row",
		alignItems: 'center',
	},
	man: {
		width: currentWidth * 2 / 15,
		height: currentWidth * 2 / 15,
		marginLeft: currentWidth / 25,
		borderRadius: currentWidth * 2 / 15,
	},
	userInfo: {
		marginLeft: 15,
	},
	userName: {
		color: '#333333',
		fontSize: currentWidth * 35 / 750,
	},
	groupName: {
		color: '#999999',
		fontSize: currentWidth * 27 / 750,
	},
	record: {
		width: vm * .1,
		height: vm * .1,
		borderRadius: 50,
		position: 'relative',
		top: -vm * .06,
		left: currentWidth * .86
	},
	record_img: {
		width: vm * .1,
		height: vm * .1
	},
	whisper: {
		width: currentWidth,
		height: currentWidth * 107 / 750,
		backgroundColor: 'white',
		flexDirection: 'row',
		alignItems: 'center'
	},
	whispe_text: {
		fontSize: currentWidth * 27 / 750,
		color: '#999999',
		marginLeft: currentWidth / 25,
	},
	clockInfo: {
		width: currentWidth,
		flexDirection: 'column',
		alignItems: 'center',
		backgroundColor: 'white',
	},
	clockInfo_circle: {
		width: currentWidth * 18 / 750,
		height: currentWidth * 18 / 750,
		marginLeft: currentWidth / 25,
		borderRadius: currentWidth * 18 / 750,
		borderWidth: 1,
		borderColor: '#ffaa05',
	},
	clockInfo_info_head: {
		width: currentWidth,
		flexDirection: 'row',
		alignItems: 'center',
	},
	clockInfo_info_body: {
		width: currentWidth * 672 / 750,
		paddingTop: currentWidth / 25,
		flexDirection: 'row',
		alignItems: 'center',
		borderLeftWidth: 1,
		borderLeftColor: '#ffa800',
	},
	clockInfo_info_time: {
		width: currentWidth * .63,
		height: currentHeight * .05,
		flexDirection: 'row',
		alignItems: 'center',
	},
	clockInfo_rule_time: {
		width: currentWidth * .57,
		flexDirection: 'row',
		alignItems: 'center',
		marginLeft: vm * .04,
		height: currentHeight * .03,
	},
	clockInfo_info_time_icon: {
		width: vm * .04,
		height: vm * .04,
	},
	clockInfo_info_time_text1: {
		fontSize: currentWidth * 27 / 750,
		marginLeft: 15,
		color: '#999999'
	},
	clockInfo_info_time_text2: {
		fontSize: currentWidth * 32 / 750,
		marginLeft: currentWidth * 7.5 / 750 + 15,
		color: '#333333'
	},
	clockInfo_info_time_text3: {
		fontSize: currentWidth * 25 / 750,
		marginLeft: 5,
	},
	clockInfo_info_time_text4: {
		fontSize: vm * .038,
		marginLeft: vm * .015,
		color: '#55c57f'
	},
	clockInfo_icon: {
		width: currentWidth * 20 / 750,
		height: currentWidth * 27 / 750,
		marginLeft: currentWidth * 7.5 / 750 + 15,
	},
	clockInfo_info_address: {
		width: currentWidth * .63,
		height: currentHeight * .05,
		flexDirection: 'row',
		alignItems: 'center',
	},
	clockInfo_info_address_icon: {
		width: vm * .04,
		height: vm * .04,
	},
	clockInfo_info_address_text: {
		fontSize: vm * .038,
		paddingLeft: vm * .02,
		color: 'black'
	},
	clockInfo_info_update: {
		borderWidth: 1,
		borderColor: '#0078D7',
		color: '#0078D7',
		padding: 2,
		fontSize: vm * .033
	},
	clockInfo_status: {
		paddingRight: currentWidth * .016,
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center'
	},
	clockInfo_status_box: {
		height: currentWidth * 30 / 750,
		marginLeft: 10,
		paddingRight: 4,
		paddingLeft: 4,
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 4,
	},
	clockInfo_status_text: {
		color: 'white',
		fontSize: currentWidth * 20 / 750,
	},
	cry: {
		width: vm * .08,
		height: vm * .08,
		marginRight: currentWidth * .03
	},
	clockButton: {
		height: currentWidth * 36 / 750,
		paddingLeft: 10,
		paddingRight: 10,
		borderRadius: currentWidth * 18 / 750,
		borderWidth: 2,
		borderColor: '#2c94ff',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: currentWidth * 7.5 / 750 + 15,
	},
	clockButton_icon: {
		width: vm * .03,
		height: vm * .03,
		marginLeft: vm * .018
	},
	clockButton_text: {
		fontSize: currentWidth * 22 / 750,
		color: '#2c94ff',
	},
	clock: {
		width: currentWidth * 26 / 75,
		height: currentWidth * 26 / 75,
		borderWidth: 2,
		borderColor: '#00a0e9',
		borderRadius: currentWidth * 26 / 75,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden'
	},
	clock_scroll: {
		width: currentWidth,
		height: currentHeight - currentWidth * 351 / 750 - StatusBar.currentHeight,
	},
	clock_scroll_content: {
		width: currentWidth,
		flexDirection: 'column',
		alignItems: 'center',
		backgroundColor: 'white',
		paddingBottom: 10,
	},
	clock_box: {
		width: currentWidth * 672 / 750,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		paddingBottom: currentWidth * 62 / 750,
		borderLeftWidth: 1,
		borderLeftColor: '#ffa800',
	},
	clock_linearGradient: {
		width: currentWidth * 237 / 750,
		height: currentWidth * 237 / 750,
		borderRadius: currentWidth * 237 / 750,
		alignItems: 'center',
		justifyContent: 'center',
	},
	clock_text: {
		fontSize: vm * .044,
		fontWeight: 'bold',
		color: 'white',
		backgroundColor: 'transparent'
	},
	clock_time: {
		fontSize: vm * .033,
		fontWeight: 'bold',
		color: 'white',
		backgroundColor: 'transparent'
	},
	location: {
		// width: currentWidth * .8,
		marginTop: vm * .035,
		flexDirection: 'row',
		justifyContent: 'center',
	},
	location_reload: {
		height: currentHeight * .05,
		flexDirection: 'row',
		alignItems: 'center'
	},
	location_reload_text: {
		color: '#55c57f'
	},
	location_image: location_image,
	location_text: {
		fontSize: vm * .035,
	},
	scheduling: {
		width: currentWidth,
		height: currentHeight * .075,
		flexDirection: 'row',
		alignItems: 'center'
	},
	scheduling_text1: {
		width: currentWidth * .2,
		marginLeft: currentWidth * .02
	},
	scheduling_text2: {
		width: currentWidth * .8,
		color: '#3AB3FF'
	},
	scheduling_option: {
		width: currentWidth * .7,
		height: currentHeight * .07,
		borderBottomWidth: 1,
		borderBottomColor: '#dddddd',
		flexDirection: 'row',
		alignItems: 'center'
	},
	scheduling_title: {
		width: currentWidth * .7,
		height: currentHeight * .05,
		alignItems: 'center',
		justifyContent: 'center',
		borderBottomColor: '#d3d3d3',
		borderBottomWidth: 1,
	},
	scheduling_title_text: {
		color: 'black'
	},
	scheduling_option_text: {
	},
	scheduling_icon: {
		width: currentHeight * .03,
		height: currentHeight * .03,
		marginLeft: currentWidth * .02,
		marginRight: currentWidth * .02
	},
	modal_bg: {
		width: currentWidth,
		height: currentHeight,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: 'center',
		alignItems: 'center'
	},
	modal_box: {
		flexDirection: 'column',
		backgroundColor: 'white',
		maxHeight: currentHeight * .5,
		borderRadius: 4
	},
	modal_button: {
		width: currentWidth * .7,
		height: currentHeight * .05,
		flexDirection: 'row',
		borderTopWidth: 1,
		borderTopColor: "#d3d3d3"
	},
	modal_confirm: {
		width: currentWidth * .35 - 0.5,
		height: currentHeight * .05,
		justifyContent: 'center',
		alignItems: 'center',
		borderRightWidth: 1,
		borderRightColor: '#d3d3d3'
	},
	modal_cancel: {
		width: currentWidth * .35 - 0.5,
		height: currentHeight * .05,
		justifyContent: 'center',
		alignItems: 'center'
	},
	modal_confirm_text: {
		color: '#ff6600'
	},
	modal_cancel_text: {
		color: '#757575'
	},
	modal_textInput: {
		height: 60
	},
	cannotClock: {
		width: currentWidth,
		height: currentHeight * .825,
		justifyContent: 'center',
		alignItems: 'center'
	},
	cannotClock_image: {
		width: currentWidth * .3,
		height: currentWidth * .3
	},
	cannotClock_text: {
		color: config.topicColor,
		fontSize: vm * .07,
		marginTop: 20
	},
	loading: {
		width: currentWidth,
		height: currentHeight
	},
});