import React, { Component } from 'react';
import {
    Text,
    View,
    ScrollView,
    Image,
    ImageBackground,
    TouchableOpacity, // 不透明触摸 
    Platform,
    NativeModules,
    DeviceEventEmitter,
    StatusBar,
} from 'react-native';
import moment from 'moment';
import pinyin from 'pinyin';
import styleSheet from '@style/home.style';
import config from '@const/config';
import topBar from '@style/topBar.style';

export default class Home extends Component {

    constructor() {
        super();

        this.state = {
            day: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天']
        };

        this.toClock = this.toClock.bind(this);
        this.toApproval = this.toApproval.bind(this);
        this.toLeave = this.toLeave.bind(this);
        this.toNotice = this.toNotice.bind(this);
        this.toSignIn = this.toSignIn.bind(this);
        this.getWeather = this.getWeather.bind(this);
        this.getLocation = this.getLocation.bind(this);
        this.onScanningResult = this.onScanningResult.bind(this);
    }

    componentDidMount() {
        DeviceEventEmitter.addListener('onScanningResult', this.onScanningResult);
        this._didFocusSubscription = this.props.navigation.addListener('didFocus', payload => {
            // StatusBar.setTranslucent(true);
            // StatusBar.setBackgroundColor('transparent');
        });
        this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload => {
            // StatusBar.setTranslucent(false);
            // StatusBar.setBackgroundColor(config.topicColor);
        });
        this.getWeather();
    }

    componentWillUnmount() {
        this._didFocusSubscription && this._didFocusSubscription.remove();
        this._willBlurSubscription && this._willBlurSubscription.remove();
    }

    static navigationOptions = ({
        navigation,
        screenProps
    }) => {
        return ({
            header: null,
        });
    }

    getLocation() {
        if (Platform.OS == 'android') {
            NativeModules.BaiduMap.getlocation();
        } else {
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
                    this.setState({
                        canClick: false
                    });
                    fetch('http://restapi.amap.com/v3/assistant/coordinate/convert?key=e960acf78a6a4b587a9505abe35823a0&coordsys=gps&locations=' + location.coords.longitude + ',' + location.coords.latitude)
                        .then((response) => response.json())
                        .then((responseBody) => {
                            let locations = responseBody.locations;
                            fetch('http://restapi.amap.com/v3/geocode/regeo?key=' + this.state.amapKey[Math.round(Math.random() * 8)] + '&location=' + locations)
                                .then((response) => response.json())
                                .then((responseBody) => {
                                    let address = responseBody.regeocode.formatted_address;
                                    if (responseBody.status == 1) {
                                        this.setState({
                                            location: address,
                                            longitude: locations.split(",")[0],
                                            latitude: locations.split(",")[1],
                                            addressComponent: JSON.stringify(responseBody.regeocode.addressComponent)
                                        });
                                    } else {
                                        this.setState({
                                            canClick: true
                                        }, () => {
                                            Alert.alert('温馨提示', '定位失败');
                                        });
                                    }
                                })
                                .catch((error) => {
                                    this.setState({
                                        canClick: true
                                    });
                                });
                        })
                        .catch((error) => {
                            this.setState({
                                canClick: true
                            });
                        });
                },
                error => {
                    //Alert.alert('温馨提示',error.message);
                }, {
                    enableHighAccuracy: false,
                    timeout: 45000,
                    maximumAge: 150000
                }
            )
        }
    }

    onScanningResult(e) {
        fetch(`http://restapi.amap.com/v3/assistant/coordinate/convert?key=${config.amapKey[Math.round(Math.random() * 8)]}&coordsys=baidu&locations=` + e.result.split(',')[1] + ',' + e.result.split(',')[0]
        ).then(resp => {
            if (resp.ok) return resp.json();
            if (resp.status == '404') throw new Error('Page not found:' + resp.url);
            if (resp.status == '500') throw new Error(resp.status + ' ' + resp.url);
        }).then(data => {
            let locations = data.locations;
            fetch('http://restapi.amap.com/v3/geocode/regeo?key=' + config.amapKey[Math.round(Math.random() * 8)] + '&location=' + locations
            ).then(resp => {
                if (resp.ok) return resp.json();
                if (resp.status == '404') throw new Error('Page not found:' + resp.url);
                if (resp.status == '500') throw new Error(resp.status + ' ' + resp.url);
            }).then(data => {
                if (data.status != 0) {
                    global.storage.save({
                        key: 'location',
                        data: {
                            city: data.regeocode.addressComponent && data.regeocode.addressComponent.city.length ? data.regeocode.addressComponent.city : data.regeocode.addressComponent.province,
                            adcode: data.regeocode.addressComponent.adcode,
                            district: data.regeocode.addressComponent.district,
                            towncode: data.regeocode.addressComponent.towncode,
                            formattedAddress: data.regeocode.formatted_address,
                            locations: locations,
                            province: data.regeocode.addressComponent.province,
                            time: new Date().getTime(),
                        },
                        expires: null
                    });
                    this.getWeather();
                }
            }).catch((err) => {
                console.error(err.message);
            });
        }).catch(err => {
            console.error(err.message);
        });
    }

    getWeather() {
        global.storage.load({
            key: 'location',
            //autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
            autoSync: false,
            //等待sync方法提供的最新数据
            syncInBackground: false,
        }).then(data => {
            if (data.time && data.time > (new Date().getTime() - 1000 * 60 * 60)) {
                // alert(data.city);
                this.setState({
                    city: data.city,
                });
                fetch(`https://restapi.amap.com/v3/weather/weatherInfo?key=${config.amapKey[Math.round(Math.random() * 8)]}&city=${data.adcode}`, {
                    method: 'get',
                }).then(resp => {
                    if (resp.ok) return resp.json();
                    if (resp.status == '404') throw new Error('Page not found:' + resp.url);
                    if (resp.status == '500') throw new Error(resp.status + ' ' + resp.url);
                }).then(data => {
                    if (data.status == 1) {
                        let city = ['北京', '上海', '天津', '重庆'].indexOf(data.lives[0].province) > -1 ? data.lives[0].province : data.lives[0].city;
                        this.setState({
                            temperature: data.lives[0].temperature,
                            weather: data.lives[0].weather,
                            city: city,
                            pinyin: pinyin(city, {
                                style: pinyin.STYLE_NORMAL,
                            }),
                        });
                    }
                }).catch(err => {
                    console.error(err.message);
                })
            } else {
                this.getLocation();
            }
        }).catch(err => {
            if (err.name = 'NotFoundError') this.getLocation();
            console.warn(err.message);
        });
    }

    toClock() {
        const {
            navigate
        } = this.props.navigation;
        navigate('clock', {});
    }

    toSignIn() {
        const {
            navigate
        } = this.props.navigation;
        navigate('SignIn', {});
    }

    toNotice() {
        const {
            navigate
        } = this.props.navigation;
        navigate('Notices', {});
    }

    toLeave() {
        const {
            navigate
        } = this.props.navigation;
        global.storage.load({
            key: 'userInfo',
            autoSync: false,
            syncInBackground: false,
        }).then(data => {
            this.setState({
                showLoading: true
            });
            setTimeout(() => {
                this.setState({
                    showLoading: false
                })
            }, 1700);
            navigate('webView', {
                resourceLinkUrl: 'http://supervise.eastweb.com.cn/pcloud/leave/apply',
                resourceName: '请假申请',
                username: data.username,
            });
        }).catch(err => {
            console.warn(err.message);
        });
    }

    toApproval() {
        const {
            navigate
        } = this.props.navigation;
        global.storage.load({
            key: 'userInfo',
            autoSync: false,
            syncInBackground: false,
        }).then(data => {
            this.setState({
                showLoading: true
            });
            setTimeout(() => {
                this.setState({
                    showLoading: false
                })
            }, 1700);
            navigate('webView', {
                resourceLinkUrl: 'http://supervise.eastweb.com.cn/pcloud/leave/process',
                resourceName: '流程审批',
                username: data.username,
            });
        }).catch(err => {
            console.warn(err.message);
        });
    }

    render() {
        const { navigate } = this.props.navigation;
        const date = new Date();
        return (
            <View>
                <StatusBar backgroundColor={"transparent"} translucent={true} />
                <View>
                    <ImageBackground
                        source={require('@image/home/bgnew.png')}
                        style={styleSheet.weather_bg}
                        resizeMode="contain"
                    >
                        <View style={styleSheet.weather_box}>
                            <Text style={styleSheet.weather_text_large}>{this.state.temperature}°C<Text style={styleSheet.weather_text_middle}>{}</Text></Text>
                            <Text style={styleSheet.weather_text_small}>{`${moment(date).format("MM月DD日")} ${this.state.day[date.getDay()]}`}</Text>
                            <Text style={styleSheet.weather_text_small}>{this.state.pinyin}  {this.state.city}</Text>
                        </View>
                    </ImageBackground>
                    <View style={styleSheet.notice}>
                        <View style={styleSheet.notice_textBox}>
                            <Image
                                source={require('@image/home/horn.png')}
                                style={styleSheet.notice_image}
                                resizeMode="contain"
                            />
                            <Text style={styleSheet.notice_text}>新版考勤app即将上线</Text>
                        </View>
                        <Text style={styleSheet.notice_date}>{moment(new Date()).format("YYYY-MM-DD")}</Text>
                    </View>
                    <View style={styleSheet.clock}>
                        <ImageBackground
                            source={require('@image/home/clock.png')}
                            style={styleSheet.clock_bg}
                            resizeMode="contain"
                        >
                            <TouchableOpacity
                                style={styleSheet.clock_touch}
                                onPress={this.toClock}
                            >
                                <Text style={styleSheet.clock_text}>我要打卡</Text>
                            </TouchableOpacity>
                        </ImageBackground>
                    </View>
                </View>
                <View style={styleSheet.option}>
                    <View style={styleSheet.option_title}>
                        <Text style={styleSheet.option_title_text}>常用功能</Text>
                    </View>
                    <ScrollView style={styleSheet.option_scroll} >
                        <View style={styleSheet.option_list}>
                            <TouchableOpacity
                                style={[styleSheet.option_item, {
                                    borderBottomColor: '#eeeeee',
                                    borderBottomWidth: 1,
                                }]}
                                onPress={this.toSignIn}
                            >
                                <Image
                                    source={require('@image/home/clock_icon.png')}
                                    style={styleSheet.option_item_icon}
                                    resizeMode="contain"
                                />
                                <View style={styleSheet.option_text1}>
                                    <Text style={styleSheet.option_name}>签到</Text>
                                    <Text style={styleSheet.option_intro}>让签到更方便</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styleSheet.option_item, {
                                    borderBottomColor: '#eeeeee',
                                    borderBottomWidth: 1,
                                }]}
                                onPress={this.toNotice}
                            >
                                <Image
                                    source={require('@image/home/notice_icon.png')}
                                    style={[styleSheet.option_item_icon, { marginLeft: 15, }]}
                                    resizeMode="contain"
                                />
                                <View style={styleSheet.option_text2}>
                                    <Text style={styleSheet.option_name}>公告</Text>
                                    <Text style={styleSheet.option_intro}>快捷查阅通知</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styleSheet.option_item}
                                onPress={this.toLeave}
                            >
                                <Image
                                    source={require('@image/home/leave_icon.png')}
                                    style={styleSheet.option_item_icon}
                                    resizeMode="contain"
                                />
                                <View style={styleSheet.option_text1}>
                                    <Text style={styleSheet.option_name}>请假</Text>
                                    <Text style={styleSheet.option_intro}>请假一键直达</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styleSheet.option_item}
                                onPress={this.toApproval}
                            >
                                <Image
                                    source={require('@image/home/approve_icon.png')}
                                    style={[styleSheet.option_item_icon, { marginLeft: 15, }]}
                                    resizeMode="contain"
                                />
                                <View style={styleSheet.option_text2}>
                                    <Text style={styleSheet.option_name}>审批</Text>
                                    <Text style={styleSheet.option_intro}>流程审批更加快</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }

}