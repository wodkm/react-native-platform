import React, { Component } from 'react';
import { MapView } from 'react-native-amap3d'
import {
    StyleSheet,
    Text,
    Image,
    View,
    FlatList,
    TouchableOpacity,
    Animated,
    Alert,
    ToastAndroid,
    Platform,
} from 'react-native';
import moment from 'moment';
import config from '@const/config';
import topBar from '@style/topBar.style';

var Geolocation = require('Geolocation');

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
// const REQUEST_URL = "http://qixin.concher.cn/guoxin//logic/adaptor.do?json&IFCODE=getSignInRecord";
var ATOK = 'edc46d8ef8693de34fc161ff1550b8cf';
const REQUEST_URL = 'http://qixin.concher.cn/guoxin//entity/adaptor.do?json&IFCODE=app_noticeList&ATOK=' + ATOK;
var Dimensions = require('Dimensions');
var ScreenWidth = Dimensions.get('window').width;
var ScreenHeight = Dimensions.get('window').height;
var ScreenScale = Dimensions.get('window').scale;
var vm = ScreenWidth > ScreenHeight ? ScreenHeight : ScreenWidth;
var ITEM_HEIGHT = 50;
var RedPointWidth = ITEM_HEIGHT / 2;
var textPadding = 20;
var topViewHeight = ScreenHeight * 0.05;
let now = new Date();
let SHOWINGDATE = moment(now).format("YYYY年MM月");
//签到Btn宽和高
singInBtnWidth = ScreenWidth / 4;
var flcnum = 1;

export default class FLCSingInView extends Component {
    static navigationOptions = ({
        navigation,
        screenProps
    }) => {
        // let dateStr = navigation.state.params.chosedDate;
        const { params } = navigation.state;

        return ({
            headerTitle:
                <View style={topBar.title}>
                    <Text style={topBar.title_text}>签到</Text>
                </View>,
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
            headerRight: (
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => navigation.state.params.ToSingInDetailView()} style={topBar.right}>
                        <Text style={topBar.right_text}>详情</Text>
                    </TouchableOpacity>
                </View>
            ),
            gesturesEnabled: true
        });
    };

    constructor(props) {
        super(props);
        this.state = {
            city: 'city',
            district: 'district',
            township: 'township',
            address: '北京市海淀区鲅鱼圈',
        }
        this.ToSingInDetailView = this.ToSingInDetailView.bind(this);
        // this.onScanningResult = this.onScanningResult.bind(this);
    }

    componentDidMount() {
        this.props.navigation.setParams({
            disabled: true,
            ToSingInDetailView: this.ToSingInDetailView,

        });
    }

    ToSingInDetailView() {
        //跳转到详情页面；
        this.props.navigation.navigate('SingInDetail');
    }

    reLocation() {
        // alert('重新定位');
        // NativeModules.BaiduMap.getlocation();
        this.getLocationDes();
        this.mapView.animateTo({
            tilt: 0,
            rotation: 0,
            zoomLevel: 16,
            coordinate: {
                latitude: this.state.latitude,
                longitude: this.state.longitude,
            },
        });
        // this.getLocation();
    }

    getLocation() {
        Geolocation.getCurrentPosition(
            location => {
                var result = "速度：" + location.coords.speed +
                    "\n经度：" + location.coords.longitude +
                    "\n纬度：" + location.coords.latitude +
                    "\n准确度：" + location.coords.accuracy +
                    "\n行进方向：" + location.coords.heading +
                    "\n海拔：" + location.coords.altitude +
                    "\n海拔准确度：" + location.coords.altitudeAccuracy +
                    "\n时间戳：" + location.timestamp;
                alert(result);
            },
            error => {
                alert("获取位置失败：" + error)
            }
        );
    }

    topHaningView() {
        return (
            <View style={styles.topHaningView}>
                <Image
                    style={[{
                        marginLeft: 0,
                        height: topViewHeight,
                        width: topViewHeight,
                        marginTop: 0
                    }]}
                    source={require('@image/clock/icon_time.png')}
                />
                <Text style={styles.txt}
                    numberOfLines={1}
                >{'当前位置-' + this.state.address}</Text>
                <TouchableOpacity onPress={this.reLocation.bind(this, 1)}>
                    <View style={[styles.datePickBtn2]}>
                        <Text style={{ fontSize: 13 }}>{"重新定位"}</Text>
                    </View>
                </TouchableOpacity>

            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>

                <MapView
                    ref={ref => this.mapView = ref}
                    style={StyleSheet.absoluteFill}
                    coordinate={{
                        latitude: this.state.latitude ? this.state.latitude : 40.03640543619792,
                        longitude: this.state.longitude ? this.state.longitude : 116.30731499565972,
                    }}
                    locationEnabled
                    locationInterval={5000}
                    onLocation={({ nativeEvent }) => {
                        // NativeModules.BaiduMap.getlocation();
                        // console.log(`${nativeEvent.latitude}, ${nativeEvent.longitude}`);
                        // alert(JSON.stringify(nativeEvent));
                        this.setState({
                            latitude: nativeEvent.latitude * 1000000 / 1000000,
                            longitude: nativeEvent.longitude * 1000000 / 1000000,
                        }, () => {
                            this.getLocationDes();
                        })
                    }
                    }
                    zoomLevel={16}
                    showsCompass={false}
                >
                </MapView>
                {this.topHaningView()}
                <TouchableOpacity
                    style={{
                        height: singInBtnWidth,
                        width: singInBtnWidth,
                        backgroundColor: 'coral',
                        marginTop: ScreenHeight - singInBtnWidth - ScreenHeight * .2,
                        // marginLeft:0.375*ScreenWidth,
                        borderRadius: 0.125 * ScreenWidth,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onPress={this.singInBtnClick.bind(this)}
                >
                    <Text>{'立即签到'}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    singInBtnClick() {
        // 点击了签到按钮,
        //   alert('点击签到按钮');
        this.getLocationDes(true);

    }

    getLocationDes(type) {
        // var locat = '116.307314,40.036405';
        // locationDesUrl = 'http://restapi.amap.com/v3/geocode/regeo?key=7c6515fe161f7faada16de3c88c4b97e&location=' + locat;
        fetch('http://restapi.amap.com/v3/geocode/regeo?key=7c6515fe161f7faada16de3c88c4b97e&location=' + this.state.longitude + ',' + this.state.latitude + '')
            .then((response) => response.json())
            .then((responseBody) => {
                console.log(responseBody);
                console.log(responseBody.regeocode.addressComponent.province);
                let city = responseBody.regeocode.addressComponent.province;
                let district = responseBody.regeocode.addressComponent.district;
                let township = responseBody.regeocode.addressComponent.township;
                let address = responseBody.regeocode.formatted_address;

                if (responseBody.status == 1) {
                    this.setState({
                        city: city,
                        district: district,
                        township: township,
                        address: address,
                    }, () => {
                        // alert(address);
                        type ? this.addSinginRecord() : null;
                    })
                } else {
                    ToastAndroid.show('定位失败', ToastAndroid.LONG)
                }
            }).catch((error) => {
                console.log(error);
            })
    }

    addSinginRecord() {
        //读取
        global.storage.load({
            key: 'userInfo',
            //autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
            autoSync: true,
            //等待sync方法提供的最新数据
            syncInBackground: true,
        }).then(data => {
            if (data.loginId && data.tenantId) {
                let formData = new FormData();
                formData.append('employeeNo', data.loginId);
                formData.append('tenantId', data.tenantId);
                formData.append('signLat', this.state.latitude);
                formData.append('signLng', this.state.longitude);
                formData.append('attendAddress', this.state.address);
                //这个是js的访问网络的方法
                fetch(config.pcloudPath + '/sign/add', {
                    method: 'POST',
                    body: formData
                })
                    .then((response) => response.json())
                    .then((responseData) => {
                        if (responseData.success) {
                            if (Platform.OS === 'android') {
                                ToastAndroid.show('签到成功', ToastAndroid.SHORT);
                            } else {
                                Alert.alert('提示', '签到成功');
                            }
                        }
                    })
                    .catch((error) => {

                    })
                    .done();
            }
        }).catch(err => {
            console.log(err);
        });

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'blue',
        width: ScreenWidth,
    },
    datePickBtn2: {
        // textAlign: 'center',
        marginLeft: 13,
        // textAlignVertical: 'center',
        width: ScreenWidth * 0.2,
        // marginRight:13,
        height: topViewHeight - 8,
        marginTop: 4,
        // color: 'black',
        backgroundColor: 'white',
        borderColor: 'red',
        borderRadius: 6,
        borderWidth: 1,
        // fontSize: 17,
        alignItems: 'center',
        justifyContent: 'center',
    },

    topHaningView: {
        marginTop: 0,
        backgroundColor: 'white',
        height: topViewHeight,
        width: ScreenWidth,
        flexDirection: 'row',
        //   alignItems:'center',
        //   justifyContent: 'center',

    },
    txt: {
        textAlign: 'left',
        paddingLeft: 13,
        // textAlignVertical: 'center',
        marginTop: 10,
        color: 'black',
        fontSize: 13,
        // backgroundColor:'blue',
        width: 0.8 * ScreenWidth - 26 - topViewHeight,
    },

    txtContent: {
        textAlign: 'left',
        paddingLeft: 13,
        // textAlignVertical: 'center',
        marginTop: 5,
        color: '#595757',
        fontSize: 13,

    },

    rightArrow: {
        // paddingRight:10,
        marginTop: ITEM_HEIGHT / 4,
        marginLeft: 0,
        // marginRight:20,
        height: ITEM_HEIGHT / 2,
        width: 7,
    },
});