import React, {
    Component
} from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity, // 不透明触摸 
    Alert,
    NativeModules,
    ScrollView,
    Platform,
    DeviceEventEmitter,
    ImageBackground,
    BackHandler,
    ToastAndroid,
} from 'react-native';
import config from '@const/config';
import Toast from '@component/toast';
import Loading from '@component/Loading';
import DeviceInfo from 'react-native-device-info';
import styleSheet from '@style/userSettings/userSettings.style';
var Dimensions = require('Dimensions');
var currentWidth = Dimensions.get('window').width;
var currentHeight = Dimensions.get('window').height;
var vm = currentWidth > currentHeight ? currentHeight : currentWidth;

export default class UserSettings extends Component {
    _didFocusSubscription;
    _willBlurSubscription;
    constructor(props) {
        super(props);
        this.state = {
            size: '',
            showLoading: false,
            username: '',

        }
        this.toSettingDetails = this.toSettingDetails.bind(this);
        this.loadTheme = this.loadTheme.bind(this);
        this.loadFeed = this.loadFeed.bind(this);
        this.loadAbout = this.loadAbout.bind(this);
        this.cacheClean = this.cacheClean.bind(this);
        this.checkVersion = this.checkVersion.bind(this);
    }

    componentWillMount() {
        global.canBack = true;
        //添加监听
        this._didFocusSubscription = this.props.navigation.addListener('didFocus', payload => {
            setTimeout(() => (global.canBack = true) && (this.lastBackPressed = null), 200);
            NativeModules.DeleteCacheManager.getCacheSize().then((value) => {
                this.setState({
                    size: value
                });
            }, (error) => { });
        });
        this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload => {
            global.canBack = false;
        });
        BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
    }

    componentWillUnmount() {
        this._didFocusSubscription && this._didFocusSubscription.remove();
        this._willBlurSubscription && this._willBlurSubscription.remove();
        BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
    }

    componentDidMount() {
        //添加监听
        const didBlurSubscription = this.props.navigation.addListener('didFocus',
            () => {
                this.props.navigation.setParams({
                    //backgroundColor: global.themeColor ? global.themeColor : config.theme.default.backgroundcolor,

                });
            }
        );
        DeviceEventEmitter.addListener('orangeColor', () => {
            global.themeColor = '#ff6600';
        });
        DeviceEventEmitter.addListener('blueColor', () => {
            global.themeColor = '#1296db';
        });

        global.storage.load({
            key: 'userInfo',
            autoSync: false,
            syncInBackground: false,
        }).then(data => {
            this.setState({
                username: data.name
            });
        }).catch(error => {
            console.log(error.massage);
        });
    }

    onBackAndroid = () => {
        if (global.canBack) {
            //最近2秒内按过back键，可以退出应用
            this.lastBackPressed && (this.lastBackPressed + 2000 >= Date.now()) ? NativeModules.ExitManager.exit() : ToastAndroid.show("再按一次退出应用", 2000);
        } else {
            return false;
        }
        this.lastBackPressed = Date.now();
        return true;
    }

    //清理缓存
    cacheClean() {
        Alert.alert(
            '清理缓存',
            '清除缓存会增加您再次访问时的流量消耗,确定要清除吗?', [{
                text: '确认',
                onPress: () => {
                    NativeModules.DeleteCacheManager.cleanInternalCache();
                    NativeModules.DeleteCacheManager.getCacheSize().then((value) => {
                        this.setState({
                            size: value
                        });
                    }, (error) => { });
                }
            }, {
                text: '取消',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
            },], {
                cancelable: false
            }
        )

    }

    //加载二级页面
    loadTheme() {
        const {
            navigate
        } = this.props.navigation;
        navigate('ThemePackage');
    }

    //手动检测版本更新
    checkVersion = () => {
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
                } else {
                    Alert.alert("当前已是最新版本，无需更新");
                }
            }
        }).catch(error => {
            // Alert.alert(error);
        });
    }

    //意见反馈
    loadFeed() {
        const {
            navigate
        } = this.props.navigation;
        navigate('Feedback');
    }

    //关于
    loadAbout() {
        const {
            navigate
        } = this.props.navigation;
        navigate('About');
    }

    //加载用户设置详情
    toSettingDetails() {
        const {
            navigate
        } = this.props.navigation;
        navigate('SettingDetails');
        global.canBack = false;
    }

    //flc改动代码s
    loadSingInFunc() {
        const {
            navigate
        } = this.props.navigation;

        navigate('SignIn');
    }

    loadNoticeFunc() {
        const {
            navigate
        } = this.props.navigation;

        navigate('Notices');
    }

    //flc改动代码e
    static navigationOptions = ({
        navigation,
        screenProps
    }) => {
        return ({
            header: null,
        });
    }

    render() {
        return (
            <View>
                <Toast ref="toast"></Toast>
                <ImageBackground
                    source={require('@image/userSettings/userSettings_bg.png')}
                    style={styleSheet.userSettings_bg}
                    resizeMode="contain"
                >
                    <TouchableOpacity style={styleSheet.userSettings_head} onPress={this.toSettingDetails}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <Image source={global.headUrl || require('@image/userSettings/default_head1.png')} style={styleSheet.userIcon} />
                            <View>
                                <Text style={styleSheet.username}>{this.state.username}</Text>
                                <Text style={styleSheet.bind_status_1}>{'未绑定手机号'}</Text>
                            </View>
                        </View>
                        <Image source={require('@image/userSettings/arrow_right_white.png')} style={styleSheet.userSettings_head_arrow} resizeMode="contain" />
                    </TouchableOpacity>
                </ImageBackground>
                <ScrollView scrollEnabled={true} contentContainerStyle={styleSheet.container}>
                    <View style={styleSheet.wrapper}>
                        <TouchableOpacity onPress={this.cacheClean}>
                            <View style={styleSheet.item}>
                                <Image source={require('@image/userSettings/clean.png')} style={styleSheet.icons} />
                                <Text style={[styleSheet.font, { flex: 1 }]}>清理缓存</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text>{this.state.size}</Text>
                                    <Image source={require('@image/userSettings/arrow_right_grey.png')} style={styleSheet.arrow} resizeMode="contain" />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styleSheet.wrapper}>
                        {
                            // <TouchableOpacity onPress={this.loadTheme}>
                            //     <View style={styleSheet.item}>
                            //         <Image source={require('@image/topic.png')} style={styleSheet.icons} />
                            //         <View style={styleSheet.item_text}>
                            //             <Text style={styleSheet.font}>主题包</Text>
                            //             <Image source={require('@image/userSettings/arrow_right_grey.png')} style={styleSheet.arrow} resizeMode="contain" />
                            //         </View>
                            //     </View>
                            // </TouchableOpacity>
                        }
                        <TouchableOpacity onPress={this.checkVersion}>
                            <View style={styleSheet.item}>
                                <Image source={require('@image/version.png')} style={styleSheet.icons} />
                                <View style={styleSheet.item_text}>
                                    <Text style={styleSheet.font}>新版本检测</Text>
                                    <Image source={require('@image/userSettings/arrow_right_grey.png')} style={styleSheet.arrow} resizeMode="contain" />
                                </View>
                            </View>
                        </TouchableOpacity>
                        <Loading showLoading={this.state.showLoading} />
                        {/* <TouchableOpacity onPress={this.checkVersion}>
                        <View style={[styleSheet.item, { flexDirection: 'row' }]}>
                            <Image source={require('@image/version.png')} style={styleSheet.icons} />
                            <Text style={[styleSheet.font, { flex: 1 }]}>flc新版本检测</Text>
                            <Image source={require('@image/userSettings/arrow_right_grey.png')} style={styleSheet.arrow} />
                        </View>
                    </TouchableOpacity>
                    <Loading showLoading={this.state.showLoading} />
                    <Line /> */}
                        {/* <TouchableOpacity onPress={this.loadFeed}>
                        <View style={[styleSheet.item, { flexDirection: 'row' }]}>
                            <Image source={require('@image/feed.png')} style={styleSheet.icons} />
                            <Text style={[styleSheet.font, { flex: 1 }]}>意见反馈</Text>
                            <Image source={require('@image/userSettings/arrow_right_grey.png')} style={styleSheet.arrow} />
                        </View>
                    </TouchableOpacity> */}
                        {/* <Line /> */}
                        <TouchableOpacity onPress={this.loadAbout}>
                            <View style={styleSheet.item}>
                                <Image source={require('@image/userSettings/about.png')} style={styleSheet.icons} />
                                <View style={[styleSheet.item_text, { borderBottomWidth: 0 }]}>
                                    <Text style={styleSheet.font}>关于云考核</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text>版本{DeviceInfo.getVersion()}</Text>
                                        <Image source={require('@image/userSettings/arrow_right_grey.png')} style={styleSheet.arrow} resizeMode="contain" />
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }
}
