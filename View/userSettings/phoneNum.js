import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity, // 不透明触摸 
    ScrollView,
    Alert,
    Platform,
    ToastAndroid,
    TextInput,
} from 'react-native';
import topBar from '@style/topBar.style';
import config from '@const/config';
import Line from '@component/line';
import CountDownButton from 'react-native-smscode-count-down';

var Dimensions = require('Dimensions');
var currentWidth = Dimensions.get('window').width;
var currentHeight = Dimensions.get('window').height;
var vm = currentWidth > currentHeight ? currentHeight : currentWidth;


export default class PhoneNum extends Component {
    constructor() {
        super();
        this.state = {
            phoneNumber: '',
            mobileNo1: '',

        }
        this.resetPassword = this.resetPassword.bind(this);
        this.checkPhoneNumber = this.checkPhoneNumber.bind(this);
        this.requestVerifyCode = this.requestVerifyCode.bind(this);
        this.bindPhone = this.bindPhone.bind(this);

    }

    componentDidMount() {
        global.storage.load({
            key: 'userInfo',
            //autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
            autoSync: true,
            //等待sync方法提供的最新数据
            syncInBackground: true,
        }).then(data => {
            this.setState({
                loginId: data.loginId,
                tenantId: data.tenantId,
                mobileNo1: data.mobileNo1,
                globalData: data,
            })
        }).catch(err => {
            console.log(err);
        });
    }

    static navigationOptions = ({
        navigation,
        screenProps
    }) => {
        return ({
            headerTitle:
                <View style={topBar.title}>
                    <Text style={topBar.title_text}>绑定手机</Text>
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
    setPhoneNumStatus = () => {
        const { navigate } = this.props.navigation;
        navigate('PhoneNumStatus');
    }

    resetPassword() {

    }

    checkPhoneNumber() {

    }

    bindPhone() {
        let formData = new FormData();
        formData.append('phone', this.state.phoneNumber);
        formData.append('code', this.state.verifyCode);
        formData.append('loginId', this.state.loginId);
        formData.append('tenantId', this.state.tenantId);
        //这个是js的访问网络的方法
        fetch(config.appPath + '/mp/messageFindPassword/updateMobileNo', {
            method: 'POST',
            body: formData
        })
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.success) {
                    if (Platform.OS === 'android') {
                        ToastAndroid.show('绑定手机成功', ToastAndroid.SHORT);
                    } else {
                        Alert.alert('提示', '绑定手机成功');
                    }

                    global.storage.save({
                        key: 'userInfo',
                        data: {
                            authKey: this.state.globalData.authKey,
                            username: this.state.globalData.username,
                            password: this.state.globalData.password,
                            name: this.state.globalData.userName,
                            loginId: this.state.globalData.loginId,
                            tenantId: this.state.globalData.tenantId,
                            mobileNo1: this.state.phoneNumber,
                        },
                        expires: null
                    }).then(() => {
                        this.props.navigation.goBack();
                    });

                } else {
                    if (Platform.OS === 'android') {
                        ToastAndroid.show('绑定手机号失败:' + responseData.error, ToastAndroid.SHORT);
                    } else {
                        Alert.alert('提示', '绑定手机号失败' + responseData.error);
                    }
                }
            })
            .catch((error) => {

            })
            .done();
    }
    requestVerifyCode() {
        let formData = new FormData();
        formData.append('phone', this.state.phoneNumber);
        //这个是js的访问网络的方法
        fetch(config.appPath + '/mp/messageFindPassword/sendMessageForBindPhone', {
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
        var NoLength = this.state.mobileNo1.length;
        return (
            // <ScrollView scrollEnabled={false} style={styles.container}>
            //   <View style={{ marginTop: 30 }}>
            //     <TouchableOpacity onPress={this.setPhoneNumStatus}>
            //       <View style={[styles.item, { flexDirection: 'row' }]}>
            //         <Image source={require('@image/phonenum.png')} style={styles.icons} />
            //         <Text style={[styles.font, { flex: 1 }]}>更换手机号</Text>
            //         <Text style={[styles.font, { marginRight: currentWidth * .005 }]}>135******76</Text>
            //         <Image source={require('@image/topBar/right_arrow.png')} style={styles.arrow} />
            //       </View>
            //     </TouchableOpacity>
            //   </View>
            //   <Line />
            //   {/* <View>
            //   <TouchableOpacity onPress={this.setPhoneNumStatus}>
            //     <View style={[styles.item, {flexDirection:'row'}]}>
            //       <Image source={require('@image/private.png')} style={styles.icons} />
            //       <Text style={[styles.font,{flex:1}]}>设置手机号隐私状态</Text>
            //       <Image source={require('@image/topBar/right_arrow.png')} style={styles.arrow} />
            //     </View>
            //   </TouchableOpacity>
            // </View> */}

            // </ScrollView>
            NoLength != 11 ? <ScrollView style={styles.container}>
                <View style={styles.wrapper}>
                    <TouchableOpacity onPress={this.loadPhoneNum}>
                        <View style={[styles.item, { flexDirection: 'row' }]}>
                            <Image source={require('@image/phonenum.png')} style={styles.icons} />
                            <Text style={[styles.font, { flex: 1, }]}>手机号</Text>
                            <TextInput
                                style={styles.phoneInput}
                                placeholder="请输入手机号"
                                placeholderTextColor="#c4c4c4"
                                underlineColorAndroid={'transparent'}
                                onEndEditing={(phoneNumber) => this.checkPhoneNumber(phoneNumber)}
                                onChangeText={(phoneNumber) => this.setState({ phoneNumber: phoneNumber })}
                            />
                            <View style={styles.countBtn}>
                                <CountDownButton
                                    style={{ marginRight: 10 }}

                                    textStyle={{ color: 'blue', fontSize: 14 }}
                                    timerCount={60}
                                    timerTitle={'获取验证码'}
                                    enable={this.state.phoneNumber.length == 11 && this.state.phoneNumber.match(/^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/)}
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
                        <View style={[styles.item, { flexDirection: 'row' }]}>
                            <Image source={require('@image/passmanager.png')} style={styles.icons} />
                            <Text style={[styles.font, { flex: 1, width: 45 }]}>动态码</Text>
                            <TextInput
                                style={styles.edit}
                                placeholder="请输入动态码"
                                placeholderTextColor="#c4c4c4"
                                underlineColorAndroid={'transparent'}
                                onChangeText={(verifyCode) => this.setState({ verifyCode: verifyCode })}
                            />


                        </View>
                    </TouchableOpacity>
                    <Line />

                </View>
                <TouchableOpacity activeOpacity={0.9} onPress={this.bindPhone}>
                    <View style={[styles.content, { backgroundColor: global.themeColor ? global.themeColor : config.theme.default.backgroundcolor }]}>
                        <Text style={styles.text}>绑定手机号</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView> : <ScrollView style={styles.container}>

                    <View style={styles.wrapper}>
                        <TouchableOpacity onPress={this.loadGesturePass}>
                            <View style={[styles.item, { flexDirection: 'row' }]}>
                                <Image source={require('@image/passmanager.png')} style={styles.icons} />
                                <Text style={[styles.font, { flex: 1, width: 45 }]}>原手机号</Text>
                                <Text style={[styles.fontPhone, { flex: 1, }]}>{this.state.mobileNo1}</Text>
                            </View>
                        </TouchableOpacity>
                        <Line />
                        <TouchableOpacity onPress={this.loadPhoneNum}>
                            <View style={[styles.item, { flexDirection: 'row' }]}>
                                <Image source={require('@image/phonenum.png')} style={styles.icons} />
                                <Text style={[styles.font, { flex: 1, }]}>新手机号</Text>
                                <TextInput
                                    style={styles.phoneInput}
                                    placeholder="请输入手机号"
                                    placeholderTextColor="#c4c4c4"
                                    underlineColorAndroid={'transparent'}
                                    onEndEditing={(phoneNumber) => this.checkPhoneNumber(phoneNumber)}
                                    onChangeText={(phoneNumber) => this.setState({ phoneNumber: phoneNumber })}
                                />
                                <View style={styles.countBtn}>
                                    <CountDownButton
                                        style={{ marginRight: 10 }}

                                        textStyle={{ color: 'blue', fontSize: 14 }}
                                        timerCount={60}
                                        timerTitle={'获取验证码'}
                                        enable={this.state.phoneNumber.length = 11}
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
                            <View style={[styles.item, { flexDirection: 'row' }]}>
                                <Image source={require('@image/passmanager.png')} style={styles.icons} />
                                <Text style={[styles.font, { flex: 1, width: 45 }]}>动态码</Text>
                                <TextInput
                                    style={styles.edit}
                                    placeholder="请输入动态码"
                                    placeholderTextColor="#c4c4c4"
                                    underlineColorAndroid={'transparent'}
                                    onChangeText={(verifyCode) => this.setState({ verifyCode: verifyCode })}
                                />


                            </View>
                        </TouchableOpacity>
                        <Line />


                    </View>
                    <TouchableOpacity activeOpacity={0.9} onPress={this.bindPhone}>
                        <View style={[styles.content, { backgroundColor: global.themeColor ? global.themeColor : config.theme.default.backgroundcolor }]}>
                            <Text style={styles.text}>更改手机号码</Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
        );
    }
}
var styles = StyleSheet.create({
    //flc
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    userIcon: {
        width: currentHeight * .06 * .7,
        height: currentHeight * .06 * .7,
        marginLeft: currentWidth * .03,
        marginRight: currentWidth * .05
    },
    arrow: {
        width: currentHeight * .06 * .4,
        height: currentHeight * .06 * .4,
        marginLeft: currentWidth * .03,
        marginRight: currentWidth * .02
    },
    icons: {
        width: currentHeight * .06 * .4,
        height: currentHeight * .06 * .4,
        marginLeft: currentWidth * .03
    },
    item: {
        height: 40,
        // justifyContent: 'center',
        justifyContent: 'flex-start',
        //borderTopWidth: Util.pixel,
        borderTopColor: '#ddd',
        backgroundColor: '#fff',
        alignItems: 'center',
        flex: 1,
    },
    font: {
        fontSize: 15,
        marginLeft: 5,
        marginRight: 10,
        // backgroundColor:'blue',

    },
    fontPhone: {
        fontSize: 15,
        marginLeft: 5,
        marginRight: 10,
        textAlign: 'right',
        // backgroundColor:'blue',

    },
    wrapper: {
        marginTop: 0,
    },
    tag: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 'bold'
    },
    exit: {
        marginTop: 55,
        marginLeft: 20,
        marginRight: 20
    },
    edit: {
        width: currentWidth - currentHeight * .06 * .4 - 60 - 15 - 15,
        fontSize: 13,
        // backgroundColor: 'green',
        paddingRight: 15,
        height: 40,
        marginLeft: 0
    },
    phoneInput: {
        width: currentWidth - currentHeight * .06 * .4 - 60 - 15 - 100 - 15,
        fontSize: 13,
        // backgroundColor: 'green',
        paddingRight: 15,
        height: 40,
        marginLeft: 0,
    },
    countBtn: {
        // backgroundColor:'red',
        marginLeft: 0,
        width: 100,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3
    },
});