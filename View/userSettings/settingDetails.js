import React, {
    Component
} from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity, // 不透明触摸 
    ScrollView,
    Alert,
} from 'react-native';
import topBar from '@style/topBar.style';
import config from '@const/config';
import ImagePicker from 'react-native-image-picker';
import encryption from '@component/Encryption';
import LinearGradient from 'react-native-linear-gradient';
import styleSheet from '@style/userSettings/settingDetails.style';
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
export default class SettingDetails extends Component {
    constructor() {
        super();
        this.state = {
            mobileNo1: '',
            underlay: ['#3de2ff', '#3497fc'],
            username: '',
        }
        this.loadPhoneNum = this.loadPhoneNum.bind(this);
        this.loadPassManager = this.loadPassManager.bind(this);
        this.loadGesturePass = this.loadGesturePass.bind(this);
        this.loadFingerPrint = this.loadFingerPrint.bind(this);
        this.cameraAction = this.cameraAction.bind(this);
        this.exitLogin = this.exitLogin.bind(this);
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
                mobileNo1: data.mobileNo1,
                username: data.name
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
                    <Text style={topBar.title_text}>设置详情</Text>
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
            headerRight: <View />
        });
    }

    //更换手机号
    loadPhoneNum() {
        const {
            navigate
        } = this.props.navigation;
        navigate('PhoneNum');
    }

    //密码管理
    loadPassManager() {
        const {
            navigate
        } = this.props.navigation;
        navigate('PassManager');
    }

    //手势密码
    loadGesturePass() {
        const {
            navigate
        } = this.props.navigation;
        navigate('GesturePass');
    }

    //指纹密码
    loadFingerPrint() {
        const {
            navigate
        } = this.props.navigation;
        navigate('FingerPrint');
    }

    //更换头像
    cameraAction() {
        ImagePicker.showImagePicker(photoOptions, (response) => {
            console.log('response' + response);
            if (response.didCancel) {
                return;
            } else if (response.error) {
                Alert.alert("提示", "打开失败");
            } else {
                //图片上传
                let formData = new FormData();
                let file = {
                    uri: response.uri,
                    type: 'multipart/form-data',
                    name: 'image.jpg',
                };
                formData.append("image", file);
                global.storage.load({
                    key: 'userInfo',
                    autoSync: false,
                    syncInBackground: false,
                }).then(data => {
                    let encryptResult = encryption.encrypt(data.authKey, 'POST', '/mp/user/updateUserHead');
                    fetch(`${config.appPath}/mp/user/updateUserHead?loginId=${data.username}&tenantId=${config.tenantId}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Date: encryptResult.time.toUTCString(),
                            Authorization: encryptResult.authorization
                        },
                        body: formData,
                    }).then((response) => response.json())
                        .then((responseData) => {
                            if (responseData.status == 0) {
                                //上传图片到服务器
                                global.headUrl = { uri: file.uri };
                                this.setState({

                                });
                            }
                        })
                        .catch((error) => {
                            alert('error:', error);
                        });
                }).catch(err => {
                    console.warn(err.message);
                });
            }
        });
    }

    //退出登录
    exitLogin() {
        const {
            navigate
        } = this.props.navigation;
        Alert.alert(
            '退出确认',
            '退出当前登录账号', [{
                text: '确认',
                onPress: () => {
                    global.storage.load({
                        key: 'userInfo',
                        autoSync: false,
                        syncInBackground: false,
                    }).then(data => {
                        let encryptResult = encryption.encrypt(data.authKey, 'GET', '/mp/user/logout');
                        fetch(`${config.appPath}/mp/user/logout?loginId=${data.username}&tenantId=${config.tenantId}`, {
                            method: 'get',
                            headers: {
                                Date: encryptResult.time.toUTCString(),
                                Authorization: encryptResult.authorization
                            }
                        }).then(res => {
                            return res;
                        }).then(resp => {
                            global.storage.remove({
                                key: 'userInfo',
                                // autoSync: false,
                                // syncInBackground: false,
                            });
                            this.props.screenProps.toLogin();
                        }).catch(err => {
                            console.log(err.message);
                        });
                    }).catch(err => {
                        console.warn(err.message);
                    });
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

    render() {
        return (
            <View>

                <ScrollView style={styleSheet.container}>
                    <View style={styleSheet.wrapper}>
                        <TouchableOpacity onPress={this.cameraAction}>
                            <View style={[styleSheet.item, { height: currentWidth * 4 / 25 }]}>
                                <Text style={styleSheet.font}>头像</Text>
                                <Image source={global.headUrl || require('@image/userSettings/default_head1.png')} style={styleSheet.userIcon} />
                            </View>
                        </TouchableOpacity>
                        <View style={styleSheet.item}>
                            <Text style={styleSheet.font}>用户名</Text>
                            <Text style={{ marginRight: currentWidth / 25 }}>{this.state.username}</Text>
                        </View>
                    </View>
                    <View style={styleSheet.wrapper}>
                        <TouchableOpacity onPress={this.loadPassManager}>
                            <View style={styleSheet.item}>
                                <Text style={styleSheet.font}>修改密码</Text>
                                <Image source={require('@image/userSettings/arrow_right_grey.png')} style={styleSheet.arrow} resizeMode="contain" />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.loadPhoneNum}>
                            <View style={styleSheet.item}>
                                <Text style={styleSheet.font}>绑定手机</Text>
                                <Text style={[styleSheet.font, { marginRight: currentWidth * .01 }]}>{this.state.mobileNo1}</Text>
                                <Image source={require('@image/userSettings/arrow_right_grey.png')} style={styleSheet.arrow} resizeMode="contain" />
                            </View>
                        </TouchableOpacity>
                        {/*
                        <TouchableOpacity onPress={this.loadGesturePass}>
                            <View style={styleSheet.item}>
                                <Image source={require('@image/gesture.png')} style={styleSheet.icons} />
                                <Text style={styleSheet.font}>手势密码</Text>
                                <Image source={require('@image/userSettings/arrow_right_grey.png')} style={styleSheet.arrow} resizeMode="contain" />
                            </View>
                        </TouchableOpacity>
                         <TouchableOpacity onPress={this.loadFingerPrint}>
                        <View style={styleSheet.item}>
                            <Image source={require('@image/finger.png')} style={styleSheet.icons} />
                            <Text style={styleSheet.font}>指纹</Text>
                            <Image source={require('@image/userSettings/arrow_right_grey.png')} style={styleSheet.arrow} resizeMode="contain" />
                        </View>
                    </TouchableOpacity> */}
                    </View>
                </ScrollView>
                <TouchableOpacity style={styleSheet.exit} onPress={this.exitLogin}>
                    <LinearGradient
                        colors={this.state.underlay}
                        style={styleSheet.exit_linearGradient}
                        start={{ x: 0, y: 0 }}
                        start={{ x: 1, y: 0 }}
                    >
                        <Text style={styleSheet.exit_text}>退出账号</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        );
    }
}