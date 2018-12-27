

import React, { Component } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
} from 'react-native';

import TouchID from "react-native-touch-id";
import config from '@const/config';
import topBar from '@style/topBar.style';
var Dimensions = require('Dimensions');
var currentWidth = Dimensions.get('window').width;
var currentHeight = Dimensions.get('window').height;
var vm = currentWidth > currentHeight ? currentHeight : currentWidth;
export default class FingerSettings extends Component {
    static navigationOptions = ({
        navigation,
        screenProps
    }) => {
        return ({
            headerTitle: '指纹',
            headerBackTitle: null,
            gesturesEnabled: true,
            headerStyle: {
                height: currentHeight * .06,
                elevation: 0,
                shadowOpacity: 0,
                backgroundColor: global.themeColor ? global.themeColor : config.theme.default.backgroundcolor
            },
            headerTitleStyle: {
                color: 'white',
                alignSelf: 'center',
                fontSize: vm * .044
            },
            headerLeft: (
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                    }}
                    style={topBar.left}
                >
                    <Image
                        source={require('@image/topBar/arrow_left_white.png')}
                        style={{
                            width: currentHeight * .06 * .5 * .59,
                            height: currentHeight * .06 * .5,
                            marginLeft: currentWidth * .06
                        }}
                    />
                </TouchableOpacity>
            ),
            headerRight: <View />,
        });
    }
    clickHandler = () => {
        TouchID.isSupported()
            .then(authenticate)
            .catch(error => {
                Alert.alert('TouchID not supported');
            });
    }
    render() {
        return (
            <TouchableOpacity activeOpacity={0.9} underlayColor="#0380BE" onPress={this.clickHandler}>
                <View style={[styles.btn, { backgroundColor: global.themeColor ? global.themeColor : config.theme.default.backgroundcolor }]}>
                    <Text style={styles.text}>TouchID</Text>
                </View>
            </TouchableOpacity>
        );
    }
}
const styles = StyleSheet.create({
    text: {
        color: '#fff',
        fontWeight: '600',
        textAlign: 'center'
    },
    btn: {
        marginTop: 55,
        marginLeft: 20,
        marginRight: 20,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3
    }
});

const errors = {
    "LAErrorAuthenticationFailed": "Authentication was not successful because the user failed to provide valid credentials.",
    "LAErrorUserCancel": "Authentication was canceled by the user—for example, the user tapped Cancel in the dialog.",
    "LAErrorUserFallback": "Authentication was canceled because the user tapped the fallback button (Enter Password).",
    "LAErrorSystemCancel": "Authentication was canceled by system—for example, if another application came to foreground while the authentication dialog was up.",
    "LAErrorPasscodeNotSet": "Authentication could not start because the passcode is not set on the device.",
    "LAErrorTouchIDNotAvailable": "Authentication could not start because Touch ID is not available on the device",
    "LAErrorTouchIDNotEnrolled": "Authentication could not start because Touch ID has no enrolled fingers.",
    "RCTTouchIDUnknownError": "Could not authenticate for an unknown reason.",
    "RCTTouchIDNotSupported": "Device does not support Touch ID."
};

function authenticate() {
    return TouchID.authenticate()
        .then(success => {
            Alert.alert('Authenticated Successfully');
        })
        .catch(error => {
            console.log(error)
            Alert.alert(error.message);
        });
}

function passcodeAuth() {
    return PasscodeAuth.isSupported()
        .then(() => {
            return PasscodeAuth.authenticate()
        })
        .then(success => {
            Alert.alert('Authenticated Successfully');
        })
        .catch(error => {
            console.log(error)
            Alert.alert(error.message);
        });
}


