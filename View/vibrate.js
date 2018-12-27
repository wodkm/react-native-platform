//震动
import React, {
	Component
} from 'react';
import {
	StyleSheet,
	View,
	Vibration,
	Button
} from 'react-native';

export default class Work extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				<Button title='震动' onPress={() => { Vibration.vibrate([0, 500, 1000, 500], true) }} />
				<Button title='取消' onPress={() => { Vibration.cancel() }} />
			</View>
		);
	}
}

var styles = StyleSheet.create({
	wrapper: {
		borderRadius: 5,
		marginBottom: 5,
	},
	button: {
		backgroundColor: '#eeeeee',
		padding: 10,
	},
});