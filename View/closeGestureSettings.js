import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    Alert,
} from 'react-native';
import PasswordGesture from 'react-native-gesture-password';
import topBar from '@style/topBar.style';
import config from '@const/config';
var Dimensions = require('Dimensions');
var currentWidth = Dimensions.get('window').width;
var currentHeight = Dimensions.get('window').height;
var vm = currentWidth > currentHeight ? currentHeight : currentWidth;
export default class CloseGestureSettings extends Component {
    constructor() {
        super();
        this.state = {
            message: '请您验证手势密码.',
            status: 'normal'
        }
    }
    componentDidMount() {
        // const didBlurSubscription = this.props.navigation.addListener('didFocus',
        // () => {
        //     this.setState({

        //     });
        //     this.props.navigation.setParams({
        //         themeColor: global.themeColor,
        //     });
        // }
        // );
    }
    static navigationOptions = ({
        navigation,
        screenProps
    }) => {
        return ({
            headerTitle: '手势密码验证',
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
    //触摸结束
    onEnd(password) {
        if (password == '14789') {
            this.setState({
                status: 'right',
                message: '验证成功.'
            });
            setTimeout(() => {
                this.props.navigation.goBack();
            }, 1200);


        } else {
            this.setState({
                status: 'wrong',
                message: '验证失败,请重试.'
            });
        }
    }
    //触摸开始
    onStart() {
        this.setState({
            status: 'normal',
            message: '请验证手势密码.'
        });
    }
    //管理手势密码
    managePass = () => {
        Alert.alert('管理手势密码');
    }
    render() {
        return (
            <View style={styles.container}>
                <PasswordGesture
                    ref='pg'
                    status={this.state.status}
                    message={this.state.message}
                    onStart={() => this.onStart()}
                    onEnd={(password) => this.onEnd(password)}
                    style={{ backgroundColor: '#F5F5F5' }}
                    textStyle={{ fontSize: 18, color: '#6F6262' }}
                    normalColor='#6F6262'
                />
                {/* <Text style={styles.text1} onPress={this.managePass()}>管理手势密码</Text> */}
            </View>

        );
    }
}
var styles = StyleSheet.create({
    container: {
        flex: 1
    },
    text1: {
        fontSize: 14,
        color: 'blue',
        marginLeft: currentWidth * .02,
        marginBottom: currentHeight * .01
    }
});
