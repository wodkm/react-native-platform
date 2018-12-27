import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity, // 不透明触摸 
    Alert,
    ScrollView,
    TextInput,
} from 'react-native';
import topBar from '@style/topBar.style';
import config from '@const/config';
import Line from '@component/line';
import Toast from '@component/toast';
import Loading from '@component/Loading';
import encryption from '@component/Encryption';
var Dimensions = require('Dimensions');
var currentWidth = Dimensions.get('window').width;
var currentHeight = Dimensions.get('window').height;
var vm = currentWidth > currentHeight ? currentHeight : currentWidth;
export default class PassManager extends Component {
    constructor() {
        super();
        this.state = {
            showLoading: false,
            oldPassword: '',
            newPassword: '',
            newPasswordTwice: ''
        }
    }

    static navigationOptions = ({
        navigation,
        screenProps
    }) => {
        return ({
            headerTitle:
                <View style={topBar.title}>
                    <Text style={topBar.title_text}>修改密码</Text>
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

    //原始密码
    getOldPass = (e) => {
        this.setState({
            oldPassword: e
        });
    }
    //获取第一次的新密码
    getNewPass = (e) => {
        this.setState({
            newPassword: e
        });
    }
    //获取第二次的新密码
    getNewPassTwice = (e) => {
        this.setState({
            newPasswordTwice: e
        })
    }
    //修改密码
    resetPass = () => {
        this.checkPass();
        //alert(this.state.newPassword);
    }
    //校验服务器密码并修改
    checkServivePass = (oldPassword = this.state.oldPassword, newPassword = this.state.newPassword) => {
        global.storage.load({
            key: 'userInfo',
            autoSync: false,
            syncInBackground: false,
        }).then(data => {
            let encryptResult = encryption.encrypt(data.authKey, 'POST', '/mp/user/updatePassword');
            fetch(`${config.appPath}/mp/user/updatePassword?loginId=${data.username}&tenantId=${config.tenantId}&oldPass=${oldPassword}&newPass=${newPassword}`, {
                method: 'post',
                headers: {
                    Date: encryptResult.time.toUTCString(),
                    Authorization: encryptResult.authorization
                }
            }).then((response) => {
                return response.json();
            }).then((responseBody) => {
                if (responseBody.status == '0') {
                    this.setState({
                        showLoading: true
                    });
                    setTimeout(() => {
                        this.setState({
                            showLoading: false
                        })
                    }, 2000);
                    setTimeout(() => {
                        this.refs.toast.show("修改成功", {
                            position: 'center',
                            backgroundColor: '#F2F2F2',
                            fontSize: 15,
                            color: '#494848',
                            duration: 500,
                            waitting: 500
                        });
                    }, 2200);
                    setTimeout(() => {
                        this.props.navigation.goBack();
                    }, 2400);
                    //alert('修改成功');
                    data.password = newPassword;
                    global.storage.save({
                        key: 'userInfo',
                        data: data,
                        expires: null
                    });
                } else {
                    Alert.alert('您的原始密码错误,请重新输入');
                }
            }).catch((error) => {
                Alert.alert('温馨提示', error.message);
            });
        }).catch(err => {
            console.warn(err.message);
        });

    }
    //校验密码
    checkPass = () => {
        if (!this.state.oldPassword || !this.state.newPassword || !this.state.newPasswordTwice) {
            this.refs.toast.show("请填写完整", {
                position: 'center',
                backgroundColor: '#F2F2F2',
                fontSize: 15,
                color: '#494848',
                duration: 500,
                waitting: 500
            });
        } else if (this.state.oldPassword.length < 6 || this.state.newPassword.length < 6 || this.state.newPasswordTwice.length < 6) {
            this.refs.toast.show("密码长度不能少于6位", {
                position: 'center',
                backgroundColor: '#F2F2F2',
                fontSize: 15,
                color: '#494848',
                duration: 500,
                waitting: 500
            });
        } else if (this.state.oldPassword == this.state.newPassword) {
            this.refs.toast.show("新密码不能与旧密码相同", {
                position: 'center',
                backgroundColor: '#F2F2F2',
                fontSize: 15,
                color: '#494848',
                duration: 500,
                waitting: 500
            });
        } else if (this.state.newPassword != this.state.newPasswordTwice) {
            this.refs.toast.show("两次输入的密码不同,请重新输入", {
                position: 'center',
                backgroundColor: '#F2F2F2',
                fontSize: 15,
                color: '#494848',
                duration: 500,
                waitting: 500
            });
        }
        else if (!this.state.newPassword.match(/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{6,20}$/)) {
            this.refs.toast.show("密码必须包括含字母和数字", {
                position: 'center',
                backgroundColor: '#F2F2F2',
                fontSize: 15,
                color: '#494848',
                duration: 500,
                waitting: 500
            });
        }
        else {
            this.checkServivePass();
        }

    }

    render() {
        return (
            <ScrollView scrollEnabled={false} style={styles.container}>

                <View style={[styles.item, { flexDirection: 'row' }]}>
                    <Text style={[styles.worningFont, { flex: 1, textAlign: 'center' }]}>*密码长度大于6位小于20位,必须包括含字母和数字</Text>
                </View>
                <View style={[styles.item, { flexDirection: 'row' }]}>
                    <Text style={[styles.font, { flex: 0 }]}>旧密码</Text>
                    <TextInput
                        style={styles.edit}
                        secureTextEntry={true}
                        maxLength={30}
                        placeholder="请输入旧密码..."
                        clearButtonMode={'while-editing'}
                        placeholderTextColor="#c4c4c4"
                        underlineColorAndroid={'transparent'}
                        onChangeText={this.getOldPass}
                    />
                </View>
                <Line />
                <View style={[styles.item, { flexDirection: 'row' }]}>
                    <Text style={[styles.font, { flex: 0 }]}>新密码</Text>
                    <TextInput
                        style={styles.edit}
                        secureTextEntry={true}
                        maxLength={30}
                        clearButtonMode={'while-editing'}
                        placeholder="请输入新密码..."
                        placeholderTextColor="#c4c4c4"
                        underlineColorAndroid={'transparent'}
                        onChangeText={this.getNewPass}
                    />
                </View>
                <Line />
                <View style={[styles.item, { flexDirection: 'row' }]}>
                    <Text style={[styles.font, { flex: 0 }]}>确认密码</Text>
                    <TextInput
                        style={styles.edit}
                        secureTextEntry={true}
                        maxLength={30}
                        clearButtonMode={'while-editing'}
                        placeholder="请输入新密码..."
                        placeholderTextColor="#c4c4c4"
                        underlineColorAndroid={'transparent'}
                        onChangeText={this.getNewPassTwice}
                    />
                </View>
                <TouchableOpacity activeOpacity={0.9} onPress={this.resetPass}>
                    <View style={[styles.resetBtn, { backgroundColor: global.themeColor ? global.themeColor : config.theme.default.backgroundcolor }]}>
                        <Text style={styles.text}>修改密码</Text>
                    </View>
                </TouchableOpacity>
                <Loading showLoading={this.state.showLoading} />
                <Toast ref="toast"></Toast>
            </ScrollView>


        );
    }
}
var styles = StyleSheet.create({
    text: {
        color: 'white',
        fontSize: 13,
    },
    resetBtn: {
        marginTop: 30,
        marginLeft: currentWidth * .12,
        marginRight: currentWidth * .12,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3
    },
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
    item: {
        height: 40,
        //justifyContent: 'center',
        //borderTopWidth: Util.pixel,
        borderTopColor: '#ddd',
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    font: {
        fontSize: 15,
        marginLeft: 20,
        marginRight: 10,
        width: currentWidth * .15,
        textAlign: 'right',
    },
    worningFont: {
        fontSize: 12,
        color: 'red'
    },
    wrapper: {
        marginTop: 30,
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
        height: 40,
        width: (currentWidth - 45) * .7,
        fontSize: 13,
        backgroundColor: '#fff',
        // paddingLeft: 15,
        //  paddingRight: 15,
        marginRight: 10
    },
});