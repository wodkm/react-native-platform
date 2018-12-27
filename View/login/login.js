import React, {
    Component
} from 'react';
import {
    View,
    Text,
    TextInput,
    Image,
    PixelRatio,
    TouchableHighlight,
    Alert,
    ActivityIndicator,
    ScrollView,
    StatusBar,
    AsyncStorage,
    Platform,
    TouchableOpacity,
} from 'react-native';
import CodePush from 'react-native-code-push';
import Toast from '@component/toast';
import config from '@const/config';
import topBar from '@style/topBar.style';
import tabPages from '@const/tabPages';
import Storage from 'react-native-storage';
import encryption from '@component/Encryption';
import SplashScreen from 'react-native-splash-screen';
import DeviceInfo from 'react-native-device-info';
import LinearGradient from 'react-native-linear-gradient';
import styleSheet from '@style/login/login.style';

let Dimensions = require('Dimensions');
let currentWidth = Dimensions.get('window').width;
let currentHeight = Dimensions.get('window').height;
let vm = currentWidth > currentHeight ? currentHeight : currentWidth;
var storage = new Storage({
    //最大容量,默认1000条数据循环存储
    size: 1000,
    //存储引擎
    storageBackend: AsyncStorage,
    //数据过期时间 默认一天,null为永不过期
    defaultExpires: 3 * 24 * 60 * 60 * 1000,
    //读写时在内存中缓存数据。默认启用
    enableCache: true,
    sync: () => { }
});
//全局范围内创建(且只有一个）storage实例
global.storage = storage;

export default class extends Component {
    constructor(props) {
        super(props);
        const {
            params
        } = this.props.navigation.state;
        this.state = {
            username: '',
            password: '',
            showIndex: {
                height: 0,
                opacity: 0
            },
            showLogin: {
                flex: 1,
                opacity: 1
            },
            isLoadingShow: false,
            autoLogin: true,
            underlay: ['#3de2ff', '#3497fc'],
        };
        this.toWork = this.toWork.bind(this);
        this.login = this.login.bind(this);
    }

    componentDidMount() {
        CodePush.sync({
            installMode: CodePush.InstallMode.IMMEDIATE,
            // updateDialog:{
            //     appendReleaseDescription:true,
            //     title:'更新提示',
            //     descriptionPrefix:'  ',
            //     mandatoryContinueButtonLabel:'立即更新',
            //     mandatoryUpdateMessage:'更新说明:\n'
            // }
        });
        //处理app版本更新
        let oldAppVersionStr = DeviceInfo.getVersion();
        let deviceType = Platform.OS == "ios" ? 1 : 0;
        fetch(config.appPath + `/mp/version/check?appVersionStr=${oldAppVersionStr}&deviceType=${deviceType}`, {
            method: 'post',
        }).then(response => {
            return response.json();
        }).then(response => {
            if (response.status == '0') {
                for (const item of response.data) {
                    if (item.needUpdate == '1') {
                        Alert.alert(
                            '发现新版本',
                            '请更新版本', [{
                                text: '立即更新',
                                onPress: () => {
                                    Platform.OS == "ios" ? NativeModules.AppVersionUpdate.update(item.plistFile) : NativeModules.AppVersionUpdate.updateWithNotification(item.fileUrl);
                                }
                            },
                            ], {
                                cancelable: false
                            }
                        )
                        return;
                    }
                }
                if (response.data.length > 0) {
                    let item = response.data[0];
                    Alert.alert(
                        '发现新版本',
                        '有新版本需要更新', [{
                            text: '确认',
                            onPress: () => {
                                Platform.OS == "ios" ? NativeModules.AppVersionUpdate.update(item.plistFile) : NativeModules.AppVersionUpdate.updateWithNotification(item.fileUrl);
                            }
                        }, {
                            text: '取消',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel'
                        },

                        ], {
                            cancelable: false
                        }
                    )
                }
            }
        }).catch(error => {
            // alert(error);
        })

        Platform.OS == "ios" ? (SplashScreen.hide()) : null;//取消白屏

        const willBlurSubscription = this.props.navigation.addListener('willFocus',
            () => {
                //读取
                global.storage.load({
                    key: 'userInfo',
                    //autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
                    autoSync: false,
                    //等待sync方法提供的最新数据
                    syncInBackground: false,
                }).then(data => {
                    if (data.username && data.password) {
                        this.login(data.username, data.password);
                    } else {
                        this.setState({
                            autoLogin: false
                        });
                    }
                }).catch(err => {
                    this.setState({
                        autoLogin: false
                    });
                    console.warn(err.message);
                });
            }
        );
    }

    componentWillUnmount() {
        willBlurSubscription.remove();
        this._didFocusSubscription && this._didFocusSubscription.remove();
    }

    static navigationOptions = ({
        navigation,
        screenProps
    }) => {
        return ({
            header: null,
            gesturesEnabled: false,
            headerStyle: {
                backgroundColor: global.themeColor ? global.themeColor : config.theme.default.backgroundcolor
            },
        });
    }

    render() {
        return (!this.state.autoLogin ?
            (
                <View style={{ flex: 1 }}>
                    <StatusBar backgroundColor={"transparent"} translucent={true} />
                    {this.state.isLoadingShow ?
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size="small" color="#268DFF"></ActivityIndicator>
                        </View> : null
                    }
                    {!this.state.isLoadingShow ?
                        <View style={this.state.showIndex}>
                        </View> : null
                    }
                    <ScrollView scrollEnabled={false} style={[this.state.showLogin]}>
                        <View style={styleSheet.view}>
                            <View style={{ alignItems: 'center', marginTop: 100 }}>
                                <Image style={styleSheet.icon} source={global.headUrl || require('@image/userSettings/default_head1.png')}></Image>
                            </View>
                            <View style={styleSheet.editGroup}>
                                <View style={styleSheet.username}>
                                    <Image source={require('@image/username.png')} style={[styleSheet.icons]} />
                                    <TextInput
                                        style={styleSheet.edit}
                                        placeholder="用户名"
                                        placeholderTextColor="#c4c4c4"
                                        underlineColorAndroid={'transparent'}
                                        onChangeText={(username) => this.setState({ username: username })}
                                    />
                                </View>
                                <View style={{ height: 1 / PixelRatio.get(), backgroundColor: '#c4c4c4' }} />
                                <View style={[styleSheet.username, { marginTop: 0 }]}>
                                    <Image source={require('@image/password.png')} style={styleSheet.icons} />
                                    <TextInput
                                        style={styleSheet.edit}
                                        placeholder="密码"
                                        placeholderTextColor="#c4c4c4"
                                        secureTextEntry={true}
                                        underlineColorAndroid={'transparent'}
                                        onChangeText={(password) => this.setState({ password: password })}
                                    />
                                </View>
                                <TouchableHighlight activeOpacity={1} onPress={this.forgetPass.bind(this)}>
                                    <View style={{ backgroundColor: '#fff' }}>
                                        <Text style={styleSheet.text}>忘记密码?</Text>
                                    </View>
                                </TouchableHighlight>
                                <TouchableOpacity
                                    style={styleSheet.login}
                                    onPress={this.handleClick.bind(this)}
                                >
                                    <LinearGradient
                                        colors={this.state.underlay}
                                        start={{ x: 0, y: 0 }}
                                        start={{ x: 1, y: 0 }}
                                        style={styleSheet.login_line}
                                    >
                                        <Text style={styleSheet.login_text}>登  录</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                            <Toast ref="toast"></Toast>
                        </View>
                    </ScrollView>
                </View>
            ) : (
                <View style={{ flex: 1 }}>
                    <StatusBar backgroundColor={"transparent"} translucent={true} />
                    <Toast ref="toast"></Toast>
                </View>
            )
        );
    }

    //忘记密码方法
    forgetPass() {
        this.refs.toast.show("忘记密码");
        const {
            navigate,
        } = this.props.navigation;
        navigate('ForgetPassword', {

        });
    }

    //登录方法
    handleClick() {
        //判空校验
        if (!this.state.username) {
            this.refs.toast.show('用户名不能为空');
            return;
        }
        if (!this.state.password) {
            this.refs.toast.show('密码不能为空');
            return;
        }
        this.login();
    }

    login(username = this.state.username, password = this.state.password) {
        var testURL = config.appPath + '/mp/user/login?loginId=' + username + '&password=' + password;
        fetch(testURL, {
            method: 'POST',
        }).then((response) => {
            return response.json();
        }).then((responseBody) => {
            if (responseBody.status == '1') {
                global.storage.save({
                    key: 'userInfo',
                    data: {
                        authKey: responseBody.data.authKey,
                        username: username,
                        password: password,
                        name: responseBody.data.userName,
                        loginId: responseBody.data.loginId,
                        tenantId: responseBody.data.tenantId,
                        mobileNo1: responseBody.data.mobileNo1,
                    },
                    expires: null
                });
                this.refs.toast.show("登录成功");
                global.headUrl = responseBody.data.userHead1Url ? {
                    uri: responseBody.data.userHead1Url
                } : require('../../assets/img/clock/man.png');
                let encryptResult = encryption.encrypt(responseBody.data.authKey, 'POST', '/mp/menu/get');
                fetch(`${config.appPath}/mp/menu/get?loginId=${username}&tenantId=${config.tenantId}`, {
                    method: 'POST',
                    headers: {
                        Date: encryptResult.time.toUTCString(),
                        Authorization: encryptResult.authorization
                    }
                }).then((response) => {
                    return response.json();
                }).then((responseBody) => {
                    if (responseBody.status == '0') {
                        let tabs = {};
                        tabs['0'] = {
                            screen: tabPages['home'],
                            navigationOptions: {
                                title: '首页',
                                tabBarIcon: ({
                                    tintColor,
                                    focused
                                }) => (
                                        <Image resizeMode='contain'
                                            source={focused ? require('@image/tab/home_on.png') : require('@image/tab/home_off.png')}
                                            style={{ width: 24, height: 24 }}
                                        />
                                    ),
                                headerRight: (
                                    <View></View>
                                )
                            },
                        }
                        tabs['1'] = {
                            screen: tabPages['work'],
                            navigationOptions: {
                                title: '工作',
                                tabBarIcon: ({
                                    tintColor,
                                    focused
                                }) => (
                                        <Image resizeMode='contain'
                                            source={focused ? require('@image/tab/work_on.png') : require('@image/tab/work_off.png')}
                                            style={{ width: 24, height: 24 }}
                                        />
                                    ),
                                headerRight: (
                                    <View></View>
                                )
                            },
                        }
                        tabs['2'] = {
                            screen: tabPages['attendance'],
                            navigationOptions: {
                                title: '考勤',
                                tabBarIcon: ({
                                    tintColor,
                                    focused
                                }) => (
                                        <Image resizeMode='contain'
                                            source={focused ? require('@image/tab/attendance_on.png') : require('@image/tab/attendance_off.png')}
                                            style={{ width: 24, height: 24 }}
                                        />
                                    ),
                                headerRight: (
                                    <View></View>
                                )
                            },
                        }
                        tabs['3'] = {
                            screen: tabPages['userSettings'],
                            navigationOptions: {
                                title: '设置',
                                tabBarIcon: ({
                                    tintColor,
                                    focused
                                }) => (
                                        <Image resizeMode='contain'
                                            source={focused ? require('@image/tab/userSetting_on.png') : require('@image/tab/userSetting_off.png')}
                                            style={{ width: 24, height: 24 }}
                                        />
                                    ),
                                headerRight: (
                                    <View></View>
                                )
                            },
                        }
                        // responseBody.data ? responseBody.data.map((item, index) => {
                        //     let page = tabPages[item.resourceCode];
                        //     if (page && item.parentId == '0') {
                        //         tabs[item.id] = {
                        //             screen: page,
                        //             navigationOptions: {
                        //                 title: item.resourceName,
                        //                 tabBarIcon: ({
                        //                     tintColor,
                        //                     focused
                        //                 }) => (
                        //                         <Image resizeMode='contain'
                        //                             source={focused ? { uri: item.resourceImage1 } : { uri: item.resourceImage3 }}
                        //                             style={{ width: 24, height: 24 }}
                        //                         />
                        //                     ),
                        //                 headerRight: (
                        //                     <View></View>
                        //                 )
                        //             },
                        //         }
                        //     }
                        // }) : (
                        //         (() => {
                        //             let page = tabPages['work'];
                        //             tabs['1'] = {
                        //                 screen: page,
                        //                 navigationOptions: {
                        //                     title: '123',
                        //                     tabBarIcon: ({
                        //                         tintColor,
                        //                         focused
                        //                     }) => (
                        //                             <Image resizeMode='contain'
                        //                                 source={focused ? require('@image/tab/work_on.png') : require('@image/tab/work_off.png')}
                        //                                 style={{ width: 24, height: 24 }}
                        //                             />
                        //                         ),
                        //                     headerLeft: (
                        //                         <View
                        //                             onPress={() => {
                        //                             }}
                        //                             style={topBar.left}
                        //                         >
                        //                             <Image source={global.headUrl} style={topBar.back} />
                        //                         </View>
                        //                     ),
                        //                     headerRight: (
                        //                         <View></View>
                        //                     ),
                        //                 },
                        //             };
                        //             tabs['2'] = {
                        //                 screen: page,
                        //                 navigationOptions: {
                        //                     title: '1234',
                        //                     tabBarIcon: ({
                        //                         tintColor,
                        //                         focused
                        //                     }) => (
                        //                             <Image resizeMode='contain'
                        //                                 source={focused ? require('@image/tab/work_on.png') : require('@image/tab/work_off.png')}
                        //                                 style={{ width: 24, height: 24 }}
                        //                             />
                        //                         ),
                        //                     headerLeft: (
                        //                         <View
                        //                             onPress={() => {
                        //                             }}
                        //                             style={topBar.left}
                        //                         >
                        //                             <Image source={global.headUrl} style={topBar.back} />
                        //                         </View>
                        //                     ),
                        //                     headerRight: (
                        //                         <View></View>
                        //                     ),
                        //                 },
                        //             };
                        //         })()
                        //     );
                        this.toWork(tabs);
                    }
                }).catch((error) => {
                    Alert.alert('温馨提示', error.message);
                });
            } else {
                this.refs.toast.show("登录失败", {
                });
                this.setState({
                    autoLogin: false
                });
            }
        }).catch((error) => {
            Alert.alert('温馨提示', error.message);
        });
    }

    //跳转
    toWork(tabs) {
        const {
            navigate,
        } = this.props.navigation;
        navigate('Stack', {
            tabs: tabs,
        });
    }


    //设备绑定
    bindDevice() {
        let encryptResult = encryption.encrypt(responseBody.data.authKey, 'POST', '/mp/menu/bind');
        fetch(`${config.appPath}/mp/menu/bind?loginId=${this.state.username}&tenantId=${config.tenantId}&imei=${DeviceInfo.getDeviceId()}`, {
            method: 'post',
            headers: {
                Date: encryptResult.time.toUTCString(),
                Authorization: encryptResult.authorization
            }
        }).then(resp => {
            return resp.json();
        }).then(data => {

        }).catch(err => {
            // console.error()
        })
    }
}