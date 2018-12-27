import React, {
    Component
} from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity, // 不透明触摸 
    ScrollView,
    TextInput,
    Alert,
    ToastAndroid,
    Platform,
} from 'react-native';
import topBar from '@style/topBar.style';
import config from '@const/config';
import Line from '@component/line';
import CountDownButton from 'react-native-smscode-count-down';
import styleSheet from '@style/login/forgetPassword.style';
var Dimensions = require('Dimensions');
var currentWidth = Dimensions.get('window').width;
var currentHeight = Dimensions.get('window').height;
var vm = currentWidth > currentHeight ? currentHeight : currentWidth;

var photoOptions = {
    //底部弹出框选项
    title: '请选择',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '选择相册',
    quality: 0.75,
    allowsEditing: true,
    noData: false,
    cameraType: 'front',
    maxWidth: 864,
    maxHeight: 1152,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }

}
export default class ForgetPassword extends Component {
    constructor() {
        super();
        this.state = {
            phoneNumber: '',

        }

        this.resetPassword = this.resetPassword.bind(this);
        this.checkPhoneNumber = this.checkPhoneNumber.bind(this);
        this.requestVerifyCode = this.requestVerifyCode.bind(this);
    }
    componentDidMount() {

    }
    static navigationOptions = ({
        navigation,
        screenProps
    }) => {
        return ({
            headerTitle:
                <View style={topBar.title}>
                    <Text style={topBar.title_text}>忘记密码</Text>
                </View>,
            gesturesEnabled: true,
            headerStyle: topBar.header,
            headerLeft: (
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                    }}
                    style={topBar.left}
                >
                    <Image
                        source={require('@image/topBar/arrow_left_white.png')}
                        style={topBar.left_arrow}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            ),
            headerRight: <View />,
        });
    }

    resetPassword() {
        let formData = new FormData();
        formData.append('phone', this.state.phoneNumber);
        formData.append('password', this.state.newPassword);
        formData.append('code', this.state.verifyCode);
        //这个是js的访问网络的方法
        fetch(config.appPath + '/mp/messageFindPassword/updatePassword', {
            method: 'POST',
            body: formData
        })
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.success) {
                    if (Platform.OS === 'android') {
                        ToastAndroid.show('密码修改成功', ToastAndroid.SHORT);
                    } else {
                        Alert.alert('提示', '密码修改成功');
                    }
                    this.props.navigation.goBack();
                } else {
                    if (Platform.OS === 'android') {
                        ToastAndroid.show('密码修改失败:' + responseData.error, ToastAndroid.SHORT);
                    } else {
                        Alert.alert('提示', '密码修改失败' + responseData.error);
                    }
                }
            })
            .catch((error) => {

            })
            .done();

    }
    checkPhoneNumber(phoneNumber) {

    }
    requestVerifyCode() {
        let formData = new FormData();
        formData.append('phone', this.state.phoneNumber);
        //这个是js的访问网络的方法
        fetch(config.appPath + '/mp/messageFindPassword/sendMessage', {
            method: 'POST',
            body: formData
        })
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.success) {
                    if (Platform.OS === 'android') {
                        ToastAndroid.show('获取成功' + responseData.code, ToastAndroid.SHORT);
                    } else {
                        Alert.alert('提示', '验证码获取成功' + responseData.code);
                    }
                }
            })
            .catch((error) => {

            })
            .done();
    }




    render() {
        return (
            <ScrollView style={styleSheet.container}>

                <View style={styleSheet.wrapper}>
                    <TouchableOpacity onPress={this.loadPhoneNum}>
                        <View style={[styleSheet.item, { flexDirection: 'row' }]}>
                            <Image source={require('@image/phonenum.png')} style={styleSheet.icons} />
                            <Text style={[styleSheet.font, { flex: 1, }]}>手机号</Text>
                            <TextInput
                                style={styleSheet.phoneInput}
                                placeholder="请输入手机号"
                                placeholderTextColor="#c4c4c4"
                                underlineColorAndroid={'transparent'}
                                onEndEditing={(phoneNumber) => this.checkPhoneNumber(phoneNumber)}
                                onChangeText={(phoneNumber) => this.setState({ phoneNumber: phoneNumber })}
                            />
                            <View style={styleSheet.countBtn}>
                                <CountDownButton
                                    style={{ marginRight: 10 }}

                                    textStyle={{ color: 'blue', fontSize: 14 }}
                                    timerCount={60}
                                    timerTitle={'获取验证码'}
                                    enable={this.state.phoneNumber.length == 11 && this.state.phoneNumber.match(/^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/)}
                                    // enable  = {false}
                                    onClick={(shouldStartCounting) => {
                                        this.requestVerifyCode();
                                        //随机模拟发送验证码成功或失败
                                        const requestSucc = Math.random() + 0.5 > 1;
                                        shouldStartCounting(requestSucc)
                                    }}
                                    timerEnd={() => {
                                        this.setState({
                                            state: '倒计时结束'
                                        })
                                    }} />
                            </View>
                        </View>
                    </TouchableOpacity>
                    <Line />

                    <TouchableOpacity onPress={this.loadPassManager}>
                        <View style={[styleSheet.item, { flexDirection: 'row' }]}>
                            <Image source={require('@image/passmanager.png')} style={styleSheet.icons} />
                            <Text style={[styleSheet.font, { flex: 1, width: 45 }]}>动态码</Text>
                            <TextInput
                                style={styleSheet.edit}
                                placeholder="请输入动态码"
                                placeholderTextColor="#c4c4c4"
                                underlineColorAndroid={'transparent'}
                                onChangeText={(verifyCode) => this.setState({ verifyCode: verifyCode })}
                            />


                        </View>
                    </TouchableOpacity>
                    <Line />
                    <TouchableOpacity onPress={this.loadGesturePass}>
                        <View style={[styleSheet.item, { flexDirection: 'row' }]}>
                            <Image source={require('@image/passmanager.png')} style={styleSheet.icons} />
                            <Text style={[styleSheet.font, { flex: 1, width: 30 }]}>新密码</Text>
                            <TextInput
                                style={styleSheet.edit}
                                placeholder="新密码6-20位必须包含字母和数字"
                                placeholderTextColor="#c4c4c4"
                                underlineColorAndroid={'transparent'}
                                onChangeText={(newPassword) => this.setState({ newPassword: newPassword })}
                            />

                        </View>
                    </TouchableOpacity>
                    <Line />

                </View>
                <TouchableOpacity activeOpacity={0.9} onPress={this.resetPassword}>
                    <View style={[styleSheet.content, { backgroundColor: global.themeColor ? global.themeColor : config.theme.default.backgroundcolor }]}>
                        <Text style={styleSheet.text}>重置密码</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>


        );
    }
}