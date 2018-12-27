import React, { Component } from 'react';
import {
    Image,
    TouchableOpacity, // 不透明触摸 
} from 'react-native';
import PasswordGesture from 'react-native-gesture-password';
import config from '@const/config';
import topBar from '@style/topBar.style';
var Dimensions = require('Dimensions');
var currentWidth = Dimensions.get('window').width;
var currentHeight = Dimensions.get('window').height;
var vm = currentWidth > currentHeight ? currentHeight : currentWidth;
var Password1 = '';
export default class GestureSettings extends Component {
    constructor() {
        super();
        this.state = {
            message: '请输入手势密码.',
            status: 'normal'
        }
    }
    componentDidMount() {

    }

    static navigationOptions = ({
        navigation,
        screenProps
    }) => {
        return ({
            headerTitle: '手势密码设置',
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
    onEnd = (password) => {
        if (Password1 === '') {
            // The first password
            Password1 = password;
            this.setState({
                status: 'normal',
                message: '请再一次录入密码.'
            });
        } else {
            // The second password
            if (password === Password1) {
                this.setState({
                    status: 'right',
                    message: '你的密码设定为 ' + password
                });

                Password1 = '';
                //两次输入正确返回上一级
                setTimeout(() => {
                    this.props.navigation.goBack();
                }, 1200);
            } else {
                this.setState({
                    status: 'wrong',
                    message: '两次输入密码不匹配,请重新输入'
                });
            }
        }
    }
    onStart = () => {
        if (Password1 === '') {
            this.setState({
                message: '请输入您的密码.'
            });
        } else {
            this.setState({
                message: '请再次输入您的密码.'
            });
        }
    }
    render() {
        return (
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
        );
    }

}