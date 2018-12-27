import React, {
    Component
} from 'react';
import {
    Text,
    Image,
    View,
    TouchableOpacity,
    NativeModules,
    Modal,
    ScrollView,
    Alert,
    TextInput,
    ActivityIndicator,
    DeviceEventEmitter,
    Platform,
} from 'react-native';
import topBar from '@style/topBar.style';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import styleSheet from '@style/clock.style';
import CodePush from 'react-native-code-push';
import DeviceInfo from 'react-native-device-info';
import Orientation from 'react-native-orientation';
import ImagePicker from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import Toast from '@component/toast';
import config from '@const/config';
var Geolocation = require('Geolocation');
var Dimensions = require('Dimensions');
var currentWidth = Dimensions.get('window').width;
var currentHeight = Dimensions.get('window').height;
var vm = currentWidth > currentHeight ? currentHeight : currentWidth;
let now = new Date();
let timeoutId = '';

export default class Clock extends Component {
    constructor(props) {
        super(props);

        this.state = {
            clockText: '上班打卡', //按钮文字
            appPath: '', //请求地址
            time: new Date().toTimeString().substring(0, 8),
            location: '', //定位信息
            longitude: '', //经度
            latitude: '', //纬度
            USERID: '', //用户id
            userName: '', //用户名
            groupName: '', //考勤组
            groupId: '', //考勤组id
            today: now, //当天日期
            date: now, //初始化日期显示
            isDateTimePickerVisible: false, //日历显示状态.
            isOrgManager: '', //是否为机构管理者
            manageOrgId: '', //机构id
            tenantId: '', //租户id
            wqflag: '', //外勤打卡1允许
            isAttendanceGroupManager: '', //是否考勤组负责人
            scheduling_type: '', //班次类型
            scheduling: '', //班次
            schedulings: [], //所有班次
            scheduling_modal: false, //班次弹出框显示状态
            schedulings_chosen: -1, //选择的班次编号
            schedulings_canChange: true,
            recordList: [],
            yesterdayRecordList: [],
            showFlag: true,
            clocked: 0,
            statusBar_color: config.topicColor,
            wqVisible: false, //外勤原因输入框显示状态
            wqParams: null,
            wqReason: '', //外勤打卡原因
            signFlag: false, //签到标志
            belongOrgIds: '',
            manageOrgIds: '',
            attendOrgId: '',
            canClick: false,
            canClock: false,
            belongOrgNames: '',
            headImgUrl: {
                uri: ''
            },
            needUploadPhoto: false, //上传底片标志
            //chkFlag: false, //拍照标志
            underlay: ['#33ccff', '#2c94ff'],
            date_linear: ['#38cdff', '#2c94ff'],
            clockSuccess: false,
            location_type: '',
            location_params: '',
            addressComponent: '',
            amapKey: [
                'd938b4efd9ec5aef7307b562a521634f',
                'bd6c11e18698c8183ab38f162a386d9f',
                '2c0c3c9ea9554fcc9aeb5ca131cf02b0',
                'a3cc0d2015b1c2352f7e47084d75b292',
                'bdbd8afc181842e929b956f9e174948f',
                'c0cbd59b32093ef91edba0813d379d3c',
                'a37b3208190960ec051fc4b03d5e49ff',
                '3b637d766347f025792fe42b6e7b4697',
                '2472b6d98758f710c9de0f665dcccda5',
            ]
        };

        this.queryUserInfo = this.queryUserInfo.bind(this);
        this.getLocation = this.getLocation.bind(this);
        this.showDateTimePicker = this.showDateTimePicker.bind(this);
        this.handleDatePicked = this.handleDatePicked.bind(this);
        this.hideDateTimePicker = this.hideDateTimePicker.bind(this);
        this.selectScheduling = this.selectScheduling.bind(this);
        this.chooseScheduling = this.chooseScheduling.bind(this);
        this.confirmSchedulings = this.confirmSchedulings.bind(this);
        this.cancelSchedulings = this.cancelSchedulings.bind(this);
        this.toReclock = this.toReclock.bind(this);
        this.clock = this.clock.bind(this);
        this.checkTime = this.checkTime.bind(this);
        this.checkAddress = this.checkAddress.bind(this);
        this.cancelWq = this.cancelWq.bind(this);
        this.confirmWq = this.confirmWq.bind(this);
        this.refreshRecord = this.refreshRecord.bind(this);
        this.initClock = this.initClock.bind(this);
        this.toSettings = this.toSettings.bind(this);
        this.getServerTime = this.getServerTime.bind(this);
        this.onScanningResult = this.onScanningResult.bind(this);
        this.toCount = this.toCount.bind(this);
    }

    componentWillMount() {
        Orientation.lockToPortrait();
    }

    componentWillUnmount() {
        clearInterval(timeoutId);
        this.setState({
            location_type: '',
            location_params: ''
        });
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

        DeviceEventEmitter.addListener('onScanningResult', this.onScanningResult);

        timeoutId = setInterval(() => {
            this.setState({
                time: new Date().toTimeString().substring(0, 8)
            });
        }, 1000);

        this.getLocation();

        const {
            params
        } = this.props.navigation.state;


        global.storage.load({
            key: 'userInfo',
            autoSync: false,
            syncInBackground: false,
        }).then(data => {
            this.setState({
                USERID: data.username,
                appPath: config.pcloudPath,
                headImgUrl: data.headImgUrl ? (data.headImgUrl.indexOf('null') < 0 ? {
                    uri: data.headImgUrl
                } : require('@image/clock/man.png')) : require('@image/clock/man.png')
            }, () => {
                //获取用户考勤权限信息
                this.setState({
                    canClick: false
                });
                fetch(this.state.appPath + '/base/authority?loginId=' + data.username, {
                    method: 'get'
                }).then(resp => {
                    if (resp.ok) return resp.json();
                    if (resp.status == '404') throw new Error('Page not found:' + resp.url);
                    if (resp.status == '500') throw new Error(resp.status + ' ' + resp.url);
                }).then((data) => {
                    this.setState({
                        canClick: true,
                        userName: data.userName,
                        isOrgManager: data.isOrgManager,
                        manageOrgId: data.manageOrgId,
                        isAttendanceGroupManager: data.isAttendanceGroupManager,
                        belongOrgIds: data.belongOrgIds,
                        manageOrgIds: data.manageOrgIds,
                        attendOrgId: data.attendOrgId,
                        belongOrgNames: data.belongOrgNames,
                        tenantId: config.tenantId //data.tenantId
                    }, () => {
                        this.props.navigation.setParams({
                            belongOrgNames: data.belongOrgNames,
                            isAttendanceGroupManager: data.isAttendanceGroupManager,
                            isOrgManager: data.isOrgManager,
                            navigatePress: this.toSettings,
                            toCount: this.toCount
                        });
                    });
                    //获取用户信息
                    this.queryUserInfo();
                }).catch((error) => {
                    this.setState({
                        canClick: true
                    }, () => {
                        setTimeout(() => {
                            Alert.alert('温馨提示', '获取租户信息失败');
                        }, 1800)
                    });
                });
            });
        }).catch(err => {
            console.warn(err.message);
        });
    }

    clock(params) {
        let clazzId = '';
        let clazzTimeId = '';
        let recordId = null;
        let url = this.state.appPath;
        let attendMustTime = '';
        let todayClazzTime = '';
        let isHoliday = '';
        let attendType = '';
        let clazzTimeSortId = '';
        let needPhoto = false;
        if (null != params) {
            clazzId = params.clazzId;
            clazzTimeId = params.clazzTimeId;
            recordId = params.recordId;
            attendMustTime = params.attendMustTime;
            todayClazzTime = params.todayClazzTime;
            isHoliday = params.isHoliday;
            url += '/clock/modify';
            attendType = params.attendType;
            clazzTimeSortId = params.clazzTimeSortId;
            needPhoto = params.needPhoto;
        } else {
            url += '/clock/add';
            clazzId = this.state.recordList[this.state.clocked].clazzId;
            clazzTimeId = this.state.recordList[this.state.clocked].clazzTimeId;
            attendMustTime = this.state.recordList[this.state.clocked].attendMustTime;
            todayClazzTime = this.state.recordList[this.state.clocked].todayClazzTime;
            isHoliday = this.state.recordList[this.state.clocked].isHoliday;
            attendType = this.state.recordList[this.state.clocked].attendType;
            clazzTimeSortId = this.state.recordList[this.state.clocked].clazzTimeSortId;
            needPhoto = this.state.recordList[this.state.clocked].needPhoto;
        }

        if (needPhoto) {
            var photoOptions = {
                //底部弹出框选项
                title: '请选择',
                cancelButtonTitle: '取消',
                takePhotoButtonTitle: '拍照',
                chooseFromLibraryButtonTitle: null,
                quality: 0.5,
                allowsEditing: true,
                noData: false,
                cameraType: 'front',
                maxWidth: 864,
                maxHeight: 1152
                // storageOptions: {
                //     skipBackup: true,
                //     path:'images'
                // }
            };
            ImagePicker.showImagePicker(photoOptions, (response) => {
                if (response.didCancel) {
                    this.setState({
                        canClick: true
                    });
                } else if (response.error) {
                    this.setState({
                        canClick: true
                    }, () => {
                        Alert.alert("提示", "打开失败");
                    });
                } else {
                    // 创建form表单
                    let formData = new FormData();
                    let file = {
                        uri: response.uri,
                        type: 'multipart/form-data',
                        name: 'image.jpg'
                    };
                    formData.append("picture", file);
                    url += '?employeeNo=' + this.state.USERID +
                        '&userName=' + this.state.userName +
                        '&groupId=' + this.state.groupId +
                        '&groupName=' + this.state.groupName +
                        (clazzId ? ('&clazzId=' + clazzId) : '') +
                        (clazzTimeId ? ('&clazzTimeId=' + clazzTimeId) : '') +
                        '&attendAddress=' + this.state.location +
                        '&attendLng=' + this.state.longitude +
                        '&attendLat=' + this.state.latitude +
                        '&attendType=' + attendType +
                        '&tenantId=' + this.state.tenantId +
                        '&recordId=' + recordId +
                        '&isTodayClazzTime=' + todayClazzTime +
                        (attendMustTime ? ('&attendMustTime=' + attendMustTime) : '') +
                        '&attendMemo=' + this.state.wqReason +
                        '&isHoliday=' + isHoliday +
                        '&clazzTimeSortId=' + clazzTimeSortId +
                        '&deptId=' + (this.state.belongOrgIds ? this.state.belongOrgIds.split(',')[0] : '') +
                        '&addressComponent=' + this.state.addressComponent +
                        '&deviceSerial=' + DeviceInfo.getDeviceId() + //设备串号
                        '&deviceType=' + DeviceInfo.getSystemName() + //设备类型
                        '&deviceModel=' + DeviceInfo.getModel() + //设备型号
                        '&systemVersion=' + DeviceInfo.getSystemVersion(); //系统版本
                    fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        body: formData
                    }).then(resp => {
                        if (resp.ok) return resp.json();
                        if (resp.status == '404') throw new Error('Page not found:' + resp.url);
                        if (resp.status == '500') throw new Error(resp.status + ' ' + resp.url);
                    }).then((data) => {
                        if (data.success) {
                            this.setState({
                                clockSuccess: true,
                                clockSuccessText: '打卡成功'
                            }, () => {
                                this.queryUserInfo();
                                setTimeout(() => {
                                    this.queryUserInfo();
                                }, 10000);
                            });
                        } else {
                            this.setState({
                                canClick: true
                            }, () => {
                                Alert.alert('温馨提示', data.error);
                            });
                        }
                    }).catch((error) => {
                        this.setState({
                            canClick: true
                        });
                    });
                }
            });
        } else {
            fetch(url, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: 'employeeNo=' + this.state.USERID +
                    '&userName=' + this.state.userName +
                    '&groupId=' + this.state.groupId +
                    '&groupName=' + this.state.groupName +
                    (clazzId ? ('&clazzId=' + clazzId) : '') +
                    (clazzTimeId ? ('&clazzTimeId=' + clazzTimeId) : '') +
                    '&attendAddress=' + this.state.location +
                    '&attendLng=' + this.state.longitude +
                    '&attendLat=' + this.state.latitude +
                    '&attendType=' + attendType +
                    '&tenantId=' + this.state.tenantId +
                    '&recordId=' + recordId +
                    '&isTodayClazzTime=' + todayClazzTime +
                    (attendMustTime ? ('&attendMustTime=' + attendMustTime) : '') +
                    '&attendMemo=' + this.state.wqReason +
                    '&isHoliday=' + isHoliday +
                    '&clazzTimeSortId=' + clazzTimeSortId +
                    '&deptId=' + (this.state.belongOrgIds ? this.state.belongOrgIds.split(',')[0] : '') +
                    '&addressComponent=' + this.state.addressComponent +
                    '&deviceSerial=' + DeviceInfo.getDeviceId() + //设备串号
                    '&deviceType=' + DeviceInfo.getSystemName() + //设备类型
                    '&deviceModel=' + DeviceInfo.getModel() + //设备型号
                    '&systemVersion=' + DeviceInfo.getSystemVersion() //系统版本
            }).then(resp => {
                if (resp.ok) return resp.json();
                if (resp.status == '404') throw new Error('Page not found:' + resp.url);
                if (resp.status == '500') throw new Error(resp.status + ' ' + resp.url);
            }).then((data) => {
                if (data.success) {
                    this.setState({
                        clockSuccess: true,
                        clockSuccessText: '打卡成功'
                    }, () => {
                        this.queryUserInfo();
                        setTimeout(() => {
                            this.queryUserInfo();
                        }, 10000);
                    });
                } else {
                    this.setState({
                        canClick: true
                    }, () => {
                        Alert.alert('温馨提示', data.error);
                    });
                }
            }).catch((error) => {
                this.setState({
                    canClick: true
                });
            });
        }
    }

    checkTime(location, params) {
        let attendType;
        let clazzId = '';
        let clazzTimeId = '';
        let todayClazzTime = '';
        if (null != params) {
            clazzId = params.clazzId;
            clazzTimeId = params.clazzTimeId;
            attendType = params.attendType;
            todayClazzTime = params.todayClazzTime;
        } else {
            clazzId = this.state.recordList[this.state.clocked].clazzId;
            clazzTimeId = this.state.recordList[this.state.clocked].clazzTimeId;
            attendType = this.state.recordList[this.state.clocked].attendType;
            todayClazzTime = this.state.recordList[this.state.clocked].todayClazzTime;
        }
        if (clazzTimeId) {
            //校验服务器时间
            fetch(this.state.appPath + '/clock/validate/time', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: 'clazzId=' + clazzId +
                    '&userId=' + this.state.USERID +
                    '&groupId=' + this.state.groupId +
                    '&clazzTimeId=' + clazzTimeId +
                    '&attendType=' + attendType + //1上班2下班
                    '&isTodayClazzTime=' + todayClazzTime +
                    '&tenantId=' + this.state.tenantId
            }).then(resp => {
                if (resp.ok) return resp.json();
                if (resp.status == '404') throw new Error('Page not found:' + resp.url);
                if (resp.status == '500') throw new Error(resp.status + ' ' + resp.url);
            }).then((data) => {
                if (data.success) {
                    if (data.status == 'NORMAL') {
                        this.checkAddress(location, params);
                    } else if (data.status == 'COME_LATE') {
                        this.setState({
                            canClick: true
                        }, () => {
                            Alert.alert('温馨提示', '您确定要打迟到卡吗?', [{
                                text: '取消',
                                onPress: () => {
                                    this.setState({
                                        canClick: true
                                    });
                                }
                            }, {
                                text: '确定',
                                onPress: () => {
                                    this.checkAddress(location, params);
                                }
                            }]);
                        });
                    } else if (data.status == 'LEAVE_EARLY') {
                        this.setState({
                            canClick: true
                        }, () => {
                            Alert.alert('温馨提示', '您确定要打早退卡吗?', [{
                                text: '取消',
                                onPress: () => {
                                    this.setState({
                                        canClick: true
                                    });
                                }
                            }, {
                                text: '确定',
                                onPress: () => {
                                    this.checkAddress(location, params);
                                }
                            }]);
                        });
                    } else if (data.status == 'TOO_EARLY') {
                        this.setState({
                            canClick: true
                        }, () => {
                            Alert.alert('温馨提示', '还未到打卡时间');
                        });
                    } else if (data.status == 'TOO_LATE') {
                        this.setState({
                            canClick: true
                        }, () => {
                            Alert.alert('温馨提示', '打卡时间已过');
                        });
                    } else if (data.status == 'NONE') {
                        this.setState({
                            canClick: true
                        }, () => {
                            Alert.alert('温馨提示', '不允许打卡');
                        });
                    }
                } else {
                    this.setState({
                        canClick: true
                    }, () => {
                        Alert.alert('温馨提示', '打卡时间校验失败');
                    });
                }
            }).catch((error) => {
                this.setState({
                    canClick: true
                });
            });
        } else {
            this.checkAddress(location, params);
        }
    }

    checkAddress(location, params) {
        fetch(this.state.appPath + '/clock/validate/address', {
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'attendLng=' + location.split(",")[0] +
                '&attendLat=' + location.split(",")[1] +
                '&groupId=' + this.state.groupId +
                '&tenantId=' + this.state.tenantId
        }).then(resp => {
            if (resp.ok) return resp.json();
            if (resp.status == '404') throw new Error('Page not found:' + resp.url);
            if (resp.status == '500') throw new Error(resp.status + ' ' + resp.url);
        }).then((data) => {
            if (data.success) {
                if (data.status == 'NORMAL') {
                    if (this.state.pbtype == '0') { //固定
                        this.clock(params);
                    } else {
                        this.clock(params);
                    }
                } else {
                    if (this.state.wqflag == 1) {
                        this.setState({
                            wqVisible: true,
                            wqParams: params,
                        });
                    } else {
                        this.setState({
                            canClick: true
                        }, () => {
                            Alert.alert('温馨提示', '不在打卡范围内');
                        });
                    }
                }
            } else {
                this.setState({
                    canClick: true
                }, () => {
                    Alert.alert('温馨提示', '地址校验失败');
                });
            }
        }).catch((error) => {
            this.setState({
                canClick: true
            });
        });
    }

    getLocation(type, params) {
        this.setState({
            wqReason: ''
        });
        Platform.OS == 'android' ? (
            this.setState({
                location_type: type,
                location_params: params
            }, () => {
                NativeModules.BaiduMap.getlocation(); //百度定位
                //NativeModules.JumpFromReactToNative.getLocationByAMap();//高德定位
            })
        ) : (
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
                        fetch('http://restapi.amap.com/v3/assistant/coordinate/convert?key=e960acf78a6a4b587a9505abe35823a0&coordsys=gps&locations=' + location.coords.longitude + ',' + location.coords.latitude
                        ).then(resp => {
                            if (resp.ok) return resp.json();
                            if (resp.status == '404') throw new Error('Page not found:' + resp.url);
                            if (resp.status == '500') throw new Error(resp.status + ' ' + resp.url);
                        }).then((data) => {
                            let locations = data.locations;
                            fetch('http://restapi.amap.com/v3/geocode/regeo?key=' + this.state.amapKey[Math.round(Math.random() * 8)] + '&location=' + locations
                            ).then(resp => {
                                if (resp.ok) return resp.json();
                                if (resp.status == '404') throw new Error('Page not found:' + resp.url);
                                if (resp.status == '500') throw new Error(resp.status + ' ' + resp.url);
                            }).then((data) => {
                                let address = data.regeocode.formatted_address;
                                if (data.status == 1) {
                                    this.setState({
                                        location: address,
                                        longitude: locations.split(",")[0],
                                        latitude: locations.split(",")[1],
                                        addressComponent: JSON.stringify(data.regeocode.addressComponent)
                                    });
                                    if (type == 1) {
                                        if (this.state.recordList[this.state.clocked].outWorkNotClock == 1) {
                                            this.setState({
                                                canClick: true
                                            }, () => {
                                                Alert.alert('温馨提示', '下班不用打卡');
                                            });
                                        } else {
                                            this.checkTime(locations);
                                        }
                                    } else if (type == 2) {
                                        this.checkTime(locations, params);
                                    } else {
                                        this.setState({
                                            canClick: true
                                        });
                                    }
                                } else {
                                    this.setState({
                                        canClick: true
                                    }, () => {
                                        Alert.alert('温馨提示', '定位失败');
                                    });
                                }
                            }).catch((error) => {
                                this.setState({
                                    canClick: true
                                });
                            });
                        }).catch((error) => {
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
            );
    }

    onScanningResult(e) {
        let type = this.state.location_type;
        let params = this.state.location_params;
        this.setState({
            canClick: false
        });
        fetch('http://restapi.amap.com/v3/assistant/coordinate/convert?key=e960acf78a6a4b587a9505abe35823a0&coordsys=baidu&locations=' + e.result.split(',')[1] + ',' + e.result.split(',')[0]
        ).then(resp => {
            if (resp.ok) return resp.json();
            if (resp.status == '404') throw new Error('Page not found:' + resp.url);
            if (resp.status == '500') throw new Error(resp.status + ' ' + resp.url);
        }).then((data) => {
            let locations = data.locations;
            fetch('http://restapi.amap.com/v3/geocode/regeo?key=' + this.state.amapKey[Math.round(Math.random() * 8)] + '&location=' + locations
            ).then(resp => {
                if (resp.ok) return resp.json();
                if (resp.status == '404') throw new Error('Page not found:' + resp.url);
                if (resp.status == '500') throw new Error(resp.status + ' ' + resp.url);
            }).then((data) => {
                let address = data.regeocode.formatted_address;
                if (data.status == 1) {
                    this.setState({
                        location: address,
                        longitude: locations.split(",")[0],
                        latitude: locations.split(",")[1],
                        addressComponent: JSON.stringify(data.regeocode.addressComponent)
                    });
                    if (type == 1) {
                        if (this.state.recordList[this.state.clocked].outWorkNotClock == 1) {
                            this.setState({
                                canClick: true
                            }, () => {
                                Alert.alert('温馨提示', '下班不用打卡');
                            });
                        } else {
                            this.checkTime(locations);
                        }
                    } else if (type == 2) {
                        this.checkTime(locations, params);
                    } else {
                        this.setState({
                            canClick: true
                        });
                    }
                } else {
                    this.setState({
                        canClick: true
                    }, () => {
                        Alert.alert('温馨提示', '定位失败');
                    });
                }
            }).catch((error) => {
                this.setState({
                    canClick: true
                });
            });
        }).catch((error) => {
            this.setState({
                canClick: true
            });
        });
    }

    //时间选择器
    showDateTimePicker() {
        this.setState({
            isDateTimePickerVisible: true
        });
    }

    hideDateTimePicker() {
        this.setState({
            isDateTimePickerVisible: false
        })
    }

    handleDatePicked(date) {
        this.hideDateTimePicker();
        this.setState({
            date: date,
            schedulings_canChange: true
        });
        this.queryUserInfo();
    }

    //班次选择
    selectScheduling() {
        if (this.state.schedulings_canChange) {
            this.setState({
                scheduling_modal: true,
                statusBar_color: '#7F2800'
            });
        }
    }

    chooseScheduling(index) {
        this.setState({
            schedulings_chosen: index
        });
    }

    confirmSchedulings() {
        let newList = [];
        if (this.state.yesterdayRecordList && this.state.yesterdayRecordList.length > 0) {
            newList = this.state.yesterdayRecordList.concat(this.state.schedulings[this.state.schedulings_chosen].pageRecords);
        } else {
            newList = this.state.schedulings[this.state.schedulings_chosen].pageRecords;
        }
        this.setState({
            scheduling_type: this.state.schedulings[this.state.schedulings_chosen].clazzName,
            scheduling: this.state.schedulings[this.state.schedulings_chosen].pageRecords.map((item, index) => {
                if (item.ktFlag == 1) {
                    if (index % 2 == 0) {
                        return item.mustTime;
                    } else {
                        return '-' + item.mustTime;
                    }
                } else {
                    if (index % 2 == 0) {
                        return ' ' + item.mustTime;
                    } else {
                        return '-' + item.mustTime;
                    }
                }
            }),
            scheduling_modal: false,
            statusBar_color: config.topicColor,
            recordList: newList,
            // recordList: this.state.schedulings[this.state.schedulings_chosen].pageRecords,
            //ndkFlag:this.state.schedulings[this.state.schedulings_chosen].ndkFlag,
            showFlag: true
        }, this.initClock);
    }

    cancelSchedulings() {
        this.setState({
            scheduling_modal: false,
            statusBar_color: config.topicColor
        });
    }

    cancelWq() {
        this.setState({
            wqVisible: false,
            statusBar_color: config.topicColor,
            canClick: true
        });
    }

    confirmWq() {
        if (this.state.wqReason == '') {
            Alert.alert('温馨提示', '外勤原因不能为空');
        } else {
            let params = this.state.wqParams;
            this.setState({
                wqParams: null,
                wqVisible: false,
                statusBar_color: config.topicColor,
            }, () => {
                setTimeout(() => {
                    this.clock(params);
                }, 800);
            });
        }
    }

    //获取用户信息
    queryUserInfo() {
        this.setState({
            canClick: false
        });
        fetch(this.state.appPath + '/clock/query/config', {
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'userId=' + this.state.USERID +
                '&date=' + moment(this.state.date).format("YYYY-MM-DD") +
                '&tenantId=' + this.state.tenantId +
                '&attendOrgId=' + this.state.attendOrgId +
                '&deptId=' + (this.state.belongOrgIds ? this.state.belongOrgIds.split(',')[0] : '')
        }).then(resp => {
            if (resp.ok) return resp.json();
            if (resp.status == '404') throw new Error('Page not found:' + resp.url);
            if (resp.status == '500') throw new Error(resp.status + ' ' + resp.url);
        }).then((data) => {
            this.setState({
                canClick: true,
                groupId: data.data.attendGroup ? data.data.attendGroup.groupId : '',
                groupName: data.data.attendGroup ? data.data.attendGroup.groupName : '',
                schedulings: data.data.clazzList ? data.data.clazzList : [],
                recordList: data.data.recordList ? data.data.recordList : [],
                wqflag: data.data.attendGroup ? data.data.attendGroup.wqflag : '',
                needUploadPhoto: data.data.needUploadPhoto ? data.data.needUploadPhoto : false, //上传底片标志
                //chkFlag: data.data.attendGroup ? data.data.attendGroup.chkFlag : false, //拍照标志
                clockSuccess: false,
            });
            if (data.data.recordList && data.data.recordList.length > 0) {
                this.setState({
                    schedulings_canChange: false,
                    showFlag: true
                });
                if (data.data.clazzList && data.data.clazzList.length > 0) {
                    this.setState({
                        schedulings_canChange: true,
                        yesterdayRecordList: data.data.recordList
                    });
                    this.chooseScheduling(0);
                    this.confirmSchedulings();
                } else {
                    this.initClock();
                }
            } else if (data.data.clazzList && data.data.clazzList.length > 0) {
                this.setState({
                    showFlag: true
                });
                this.chooseScheduling(0);
                this.confirmSchedulings();
            } else {
                this.setState({
                    showFlag: false
                });
            }
        }).catch((error) => {
            this.setState({
                canClick: true,
                clockSuccess: false
            });
        });
    }

    initClock() {
        let clocked = 0;
        let canClock = false;
        for (let i = 0; i < this.state.recordList.length; i++) {
            if (this.state.recordList[i].currClazzTime) {
                clocked = i;
                canClock = true;
                break;
            }
        }
        this.setState({
            clocked: clocked,
            canClock: canClock
        });
    }

    getServerTime() {
        fetch(this.state.appPath + '/clock/currentTimeMillis', {
            type: 'get'
        }).then(resp => {
            if (resp.ok) return resp.json();
            if (resp.status == '404') throw new Error('Page not found:' + resp.url);
            if (resp.status == '500') throw new Error(resp.status + ' ' + resp.url);
        }).then((data) => {
            this.setState({
                today: new Date(data)
            });
        }).catch((error) => {

        });
    }

    toReclock(clazzTimeId, ruleTime, clazzId, attendType, mustTime, todayClazzTime, isHoliday, clazzTimeSortId) {
        const {
            navigate
        } = this.props.navigation;
        navigate('reclock', {
            USERID: this.state.USERID,
            userName: this.state.userName,
            groupId: this.state.groupId,
            groupName: this.state.groupName,
            tenantId: this.state.tenantId,
            reclockDate: this.state.date,
            clazzTimeId: clazzTimeId,
            clazzId: clazzId,
            ruleTime: ruleTime,
            appPath: this.state.appPath,
            attendType: attendType,
            mustTime: mustTime,
            todayClazzTime: todayClazzTime,
            isHoliday: isHoliday,
            clazzTimeSortId: clazzTimeSortId,
            onGoBack: this.queryUserInfo,
            deptId: (this.state.belongOrgIds ? this.state.belongOrgIds.split(',')[0] : '')
        });
    }

    toSettings() {
        Geolocation.stopObserving();
        const {
            navigate
        } = this.props.navigation;
        navigate('settings', {
            appPath: this.state.appPath,
            userId: this.state.USERID,
            groupId: this.state.groupId,
            isAttendanceGroupManager: this.state.isAttendanceGroupManager,
            isOrgManager: this.state.isOrgManager,
            tenantId: this.state.tenantId,
            belongOrgIds: this.state.belongOrgIds,
            manageOrgIds: this.state.manageOrgIds,
            attendOrgId: this.state.attendOrgId,
        });
    }

    refreshRecord(clazzTimeId, clazzId, recordId, attendType, attendMustTime, todayClazzTime, isHoliday, clazzTimeSortId, needPhoto) {
        Alert.alert('温馨提示', '您确定要更新打卡数据吗?', [{
            text: '取消',
            onPress: () => {
                this.setState({
                    canClick: true
                });
            }
        }, {
            text: '确定',
            onPress: () => {
                let params = {
                    clazzTimeId: clazzTimeId,
                    clazzId: clazzId,
                    recordId: recordId,
                    attendType: attendType,
                    attendMustTime: attendMustTime,
                    todayClazzTime: todayClazzTime,
                    isHoliday: isHoliday,
                    clazzTimeSortId: clazzTimeSortId,
                    needPhoto: needPhoto
                }
                this.getLocation(2, params);
            }
        }]);
    }

    toCount() {
        Geolocation.stopObserving();
        const {
            navigate
        } = this.props.navigation;
        navigate('Count', {
            userId: this.state.USERID,
            tenantId: this.state.tenantId
        });
    }

    static navigationOptions = ({
        navigation,
        screenProps
    }) => {
        let isAttendanceGroupManager = navigation.state.params.isAttendanceGroupManager;
        let isOrgManager = navigation.state.params.isOrgManager;
        let belongOrgNames = navigation.state.params.belongOrgNames;
        return ({
            headerTitle:
                <View style={[topBar.title, { width: (isAttendanceGroupManager || isOrgManager) ? currentWidth * .55 : currentWidth * .7 }]}>
                    <Text style={[topBar.title_text, { marginLeft: (isAttendanceGroupManager || isOrgManager) ? currentWidth * .15 : 0 }]}>考勤打卡</Text>
                </View>,
            headerStyle: topBar.header,
            headerLeft: (
                <TouchableOpacity
                    onPress={() => {
                        clearInterval(timeoutId);
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
                    {
                        <TouchableOpacity onPress={() => navigation.state.params.toCount()} style={topBar.right}>
                            <Text style={topBar.right_text}>统计</Text>
                        </TouchableOpacity>
                    }
                    {
                        (isAttendanceGroupManager || isOrgManager) ? (
                            <TouchableOpacity onPress={() => navigation.state.params.navigatePress()} style={topBar.right}>
                                {
                                    //<Image source={require('@image/topBar/edit.png')} style={{ width: currentHeight * .06 * .7, height: currentHeight * .06 * .7 }} />
                                }
                                <Text style={topBar.right_text}>设置</Text>
                            </TouchableOpacity>
                        ) : null
                    }
                </View>
            ),
            gesturesEnabled: true
        });
    }

    render() {
        return (
            <View style={styleSheet.body}>

                <View style={styleSheet.top}>
                    <View style={styleSheet.user}>
                        <Image
                            source={global.headUrl || require('@image/userSettings/default_head1.png')}
                            style={styleSheet.man}
                        />
                        <View style={styleSheet.userInfo}>
                            <Text style={styleSheet.userName}>{this.state.userName}</Text>
                            <Text style={styleSheet.groupName}>考勤组:{this.state.groupName}</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={this.showDateTimePicker}
                        activeOpacity={1}
                    >
                        <LinearGradient
                            colors={this.state.date_linear}
                            style={styleSheet.top_date}
                            start={{ x: 0, y: 0 }}
                            start={{ x: 1, y: 0 }}
                        >
                            <Text style={styleSheet.top_date_text}>
                                {
                                    moment(this.state.date).format("YYYY.MM.DD")
                                }
                            </Text>
                            <Image
                                source={require('@image/clock/arrow_down_white.png')}
                                resizeMode="contain"
                                style={styleSheet.top_date_arrow}
                            />
                        </LinearGradient>
                    </TouchableOpacity>
                    <DateTimePicker
                        isVisible={this.state.isDateTimePickerVisible}
                        onConfirm={this.handleDatePicked}
                        onCancel={this.hideDateTimePicker}
                        cancelTextIOS={'取消'}
                        confirmTextIOS={'确定'}
                    />
                </View>
                {
                    (this.state.showFlag) ? (
                        <View>
                            {
                                (this.state.schedulings.length > 0) ? (
                                    <View>
                                        <View style={styleSheet.scheduling}>
                                            <Text style={styleSheet.scheduling_text1}>可选班次：</Text>
                                            <Text style={styleSheet.scheduling_text2} onPress={this.selectScheduling} numberOfLines={1}>
                                                {this.state.scheduling_type} {this.state.scheduling} >
                                            </Text>
                                        </View>
                                        <Modal
                                            animationType={'none'}
                                            transparent={true}
                                            onRequestClose={() => { }}
                                            visible={this.state.scheduling_modal}
                                        >
                                            <View style={styleSheet.modal_bg}>
                                                <View style={styleSheet.modal_box}>
                                                    <View style={styleSheet.scheduling_title}>
                                                        <Text style={styleSheet.scheduling_title_text}>
                                                            请选择班次
                                                        </Text>
                                                    </View>
                                                    <ScrollView>
                                                        <View>
                                                            {
                                                                this.state.schedulings.map((item, index) => {
                                                                    return (
                                                                        <TouchableOpacity
                                                                            key={index}
                                                                            style={styleSheet.scheduling_option}
                                                                            activeOpacity={1}
                                                                            onPress={() => { this.chooseScheduling(index) }}>
                                                                            <Image
                                                                                source={
                                                                                    this.state.schedulings_chosen == index ?
                                                                                        require('@image/clock/scheduling_check.png') :
                                                                                        require('@image/clock/scheduling_uncheck.png')
                                                                                }
                                                                                style={styleSheet.scheduling_icon}
                                                                            />
                                                                            <Text style={styleSheet.scheduling_option_text}>{item.clazzName} {item.value}</Text>
                                                                        </TouchableOpacity>
                                                                    );
                                                                })
                                                            }
                                                        </View>
                                                    </ScrollView>
                                                    <View style={styleSheet.modal_button}>
                                                        <TouchableOpacity style={styleSheet.modal_confirm} onPress={this.cancelSchedulings}>
                                                            <Text style={styleSheet.modal_confirm_text}>
                                                                取消
                                                            </Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={styleSheet.modal_cancel} onPress={this.confirmSchedulings}>
                                                            <Text style={styleSheet.modal_confirm_text}>
                                                                确认
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>
                                        </Modal>
                                    </View>
                                ) : (
                                        <View></View>
                                    )
                            }
                            <View style={styleSheet.whisper}>
                                <Text style={styleSheet.whispe_text}>
                                    新的一天，从良好的工作习惯开始
                                </Text>
                            </View>
                            <ScrollView scrollEnabled={true} style={styleSheet.clock_scroll} contentContainerStyle={styleSheet.clock_scroll_content}>
                                {
                                    this.state.recordList.map((item, index) => {
                                        if (this.state.clocked >= index) {
                                            return (
                                                <ClockInfo
                                                    key={index}
                                                    attendState={item.attendState}
                                                    attendStateDesc={item.attendStateDesc ? item.attendStateDesc : '未打卡'}
                                                    attendTypeDesc={item.attendTypeDesc ? item.attendTypeDesc : ''}
                                                    text1='打卡时间'
                                                    text2={item.attendTime ? item.attendTime : '尚未打卡'}
                                                    location={item.attendAddress ? item.attendAddress : '无数据'}
                                                    change={() => this.toReclock(item.clazzTimeId, item.mustTime, item.clazzId, item.attendType, item.attendMustTime, item.todayClazzTime, item.isHoliday, item.clazzTimeSortId)}
                                                    ruleTime={item.mustTime}
                                                    outWorkNotClock={item.outWorkNotClock}
                                                    refreshFlag={item.update}
                                                    attendType={item.attendType}
                                                    isNeedCheck={item.isNeedCheck}
                                                    checkState={item.checkState}
                                                    attendFaceContrast={item.attendFaceContrast}
                                                    refreshRecord={() => this.refreshRecord(item.clazzTimeId, item.clazzId, item.recordId, item.attendType, item.attendMustTime, item.todayClazzTime, item.isHoliday, item.clazzTimeSortId, item.needPhoto)}
                                                >
                                                </ClockInfo>
                                            )
                                        }
                                    })
                                }
                                {
                                    (moment(this.state.today).format('YYYYMMDD') == moment(this.state.date).format('YYYYMMDD') &&
                                        this.state.clocked <= (this.state.recordList.length - 1) && this.state.canClock) ? (
                                            <View style={styleSheet.clock_box}>
                                                <TouchableOpacity
                                                    style={styleSheet.clock}
                                                    onPress={
                                                        this.state.canClick ? (
                                                            () => this.getLocation(1)
                                                        ) : (
                                                                () => { }
                                                            )
                                                    }
                                                >
                                                    <LinearGradient colors={this.state.underlay} style={styleSheet.clock_linearGradient}>
                                                        {
                                                            <Text style={styleSheet.clock_text}>
                                                                {this.state.recordList[this.state.clocked].attendTypeDesc}打卡
                                                            </Text>
                                                        }
                                                        <Text style={styleSheet.clock_time}>
                                                            {this.state.time}
                                                        </Text>
                                                    </LinearGradient>
                                                </TouchableOpacity>
                                                <View style={styleSheet.location}>
                                                    <Text onPress={this.getLocation} style={styleSheet.location_text}>
                                                        {this.state.location}
                                                    </Text>
                                                    <Text
                                                        style={styleSheet.location_reload_text}
                                                        onPress={this.getLocation}
                                                    >
                                                        {' 重新定位'}
                                                    </Text>
                                                </View>
                                            </View>
                                        ) : (
                                            <View></View>
                                        )
                                }
                                {
                                    this.state.recordList.map((item, index) => {
                                        if (this.state.clocked < index) {
                                            return (
                                                <ClockInfo
                                                    key={index}
                                                    attendState={item.attendState}
                                                    attendStateDesc={item.attendStateDesc ? item.attendStateDesc : '未打卡'}
                                                    attendTypeDesc={item.attendTypeDesc ? item.attendTypeDesc : ''}
                                                    text1='打卡时间'
                                                    text2={item.attendTime ? item.attendTime : '尚未打卡'}
                                                    location={item.attendAddress ? item.attendAddress : '无数据'}
                                                    change={() => this.toReclock(item.clazzTimeId, item.mustTime, item.clazzId, item.attendType, item.attendMustTime, item.todayClazzTime, item.isHoliday, item.clazzTimeSortId)}
                                                    ruleTime={item.mustTime}
                                                    outWorkNotClock={item.outWorkNotClock}
                                                    refreshFlag={item.update}
                                                    attendType={item.attendType}
                                                    isNeedCheck={item.isNeedCheck}
                                                    checkState={item.checkState}
                                                    attendFaceContrast={item.attendFaceContrast}
                                                    refreshRecord={() => this.refreshRecord(item.clazzTimeId, item.clazzId, item.recordId, item.attendType, item.attendMustTime, item.todayClazzTime, item.isHoliday, item.clazzTimeSortId, item.needPhoto)}
                                                >
                                                </ClockInfo>
                                            )
                                        }
                                    })
                                }
                                {
                                    this.state.wqVisible ? (
                                        <Modal
                                            animationType={'none'}
                                            transparent={true}
                                            onRequestClose={() => { }}
                                            visible={this.state.wqVisible}
                                        >
                                            <View style={styleSheet.modal_bg}>
                                                <View style={styleSheet.modal_box}>
                                                    <View style={styleSheet.scheduling_title}>
                                                        <Text style={styleSheet.scheduling_title_text}>
                                                            请输入外勤原因
                                                        </Text>
                                                    </View>
                                                    <TextInput
                                                        style={styleSheet.modal_textInput}
                                                        underlineColorAndroid="transparent"
                                                        maxLength={100}
                                                        multiline={true}
                                                        onChangeText={
                                                            (text) => this.setState({
                                                                wqReason: text
                                                            })
                                                        }
                                                    />
                                                    <View style={styleSheet.modal_button}>
                                                        <TouchableOpacity style={styleSheet.modal_confirm} onPress={this.cancelWq}>
                                                            <Text style={styleSheet.modal_cancel_text}>
                                                                取消
                                                            </Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={styleSheet.modal_cancel} onPress={this.confirmWq}>
                                                            <Text style={styleSheet.modal_confirm_text}>
                                                                确认
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>
                                        </Modal>
                                    ) : (
                                            <View></View>
                                        )
                                }
                            </ScrollView>
                        </View>
                    ) : (
                            <View style={styleSheet.cannotClock}>
                                <Image
                                    source={require('@image/clock/forbid.png')}
                                    style={styleSheet.cannotClock_image}
                                />
                                <Text style={styleSheet.cannotClock_text}>今天不用打卡</Text>
                            </View>
                        )
                }
                {
                    this.state.canClick ? (
                        <View></View>
                    ) : (
                            <ActivityIndicator
                                animating={!this.state.canClick}
                                style={[
                                    styleSheet.loading,
                                    {
                                        width: currentWidth,
                                        height: currentHeight * .78,
                                        marginTop: currentHeight * .105,
                                        position: 'absolute',
                                    }
                                ]}
                                color={'yellowgreen'}
                                size="large"
                            />
                        )
                }
                <Toast text={this.state.clockSuccessText} show={this.state.clockSuccess}></Toast>
            </View>
        );
    }
}

class ClockInfo extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let attendStateDesc = this.props.attendStateDesc;
        let attendState = this.props.attendState;
        let text = [];
        let reclockFlag = false;
        let showDetail = true;
        attendStateDesc = attendStateDesc.split(',');
        attendStateDesc.map((item, index) => {
            text.push(
                <View key={index} style={[styleSheet.clockInfo_status_box, { backgroundColor: config.attendState[item] || '#55c57f' }]}>
                    <Text style={styleSheet.clockInfo_status_text}>{item}</Text>
                </View>
            );
        });
        if (!attendState && attendStateDesc == '未打卡') {
            showDetail = false;
        }
        if (!attendState && attendStateDesc != '未打卡') {
            reclockFlag = true;
        }
        if (attendState == 1 || attendState == 2 || attendState == 3) {
            reclockFlag = true;
        }
        if (this.props.isNeedCheck == 1) {
            if (this.props.checkState == 0) {
                text.push(
                    <View key={text.length + 1} style={[styleSheet.clockInfo_status_box, { backgroundColor: '#ffae00' }]}>
                        <Text style={styleSheet.clockInfo_status_text}>{'待审批'}</Text>
                    </View>
                );
                reclockFlag = false;
            }
            if (this.props.checkState == 1) {
                text.push(
                    <View key={text.length + 1} style={[styleSheet.clockInfo_status_box, { backgroundColor: '#45b7ff' }]}>
                        <Text style={styleSheet.clockInfo_status_text}>{'已通过'}</Text>
                    </View>
                );
                reclockFlag = false;
            }
            if (this.props.checkState == 2) {
                text.push(
                    <View key={text.length + 1} style={[styleSheet.clockInfo_status_box, { backgroundColor: '#f52800' }]}>
                        <Text style={styleSheet.clockInfo_status_text}>{'未通过'}</Text>
                    </View>
                );
                reclockFlag = true;
            }
        }
        return (
            <View style={styleSheet.clockInfo}>
                <View style={styleSheet.clockInfo_info_head}>
                    <View style={styleSheet.clockInfo_circle}></View>
                    <Text style={styleSheet.clockInfo_info_time_text1}>{this.props.attendTypeDesc}时间 {this.props.ruleTime}</Text>
                    {
                        showDetail ? null :
                            <View style={styleSheet.clockInfo_status}>
                                {
                                    text.map((item) => {
                                        return item
                                    })
                                }
                            </View>
                    }
                </View>
                {
                    showDetail ? (
                        <View>
                            <View style={styleSheet.clockInfo_info_body}>
                                <Text style={styleSheet.clockInfo_info_time_text2}>{this.props.text1} {this.props.text2}</Text>
                                <View style={styleSheet.clockInfo_status}>
                                    {
                                        text.map((item) => {
                                            return item
                                        })
                                    }
                                </View>
                            </View>
                            {
                                this.props.attendFaceContrast ? (
                                    <View style={styleSheet.clockInfo_info_body}>
                                        <Text style={styleSheet.clockInfo_info_time_text2}>
                                            {'脸部对比结果:'}
                                        </Text>
                                        <Text style={this.props.attendFaceContrast == '成功' ? styleSheet.clockInfo_info_time_text4 : styleSheet.clockInfo_info_time_text2}>
                                            {this.props.attendFaceContrast}
                                        </Text>
                                    </View>
                                ) : null
                            }
                            <View style={styleSheet.clockInfo_info_body}>
                                <Image
                                    source={require('@image/clock/location.png')}
                                    style={styleSheet.clockInfo_icon}
                                    resizeMode="contain"
                                />
                                <Text style={styleSheet.clockInfo_info_time_text3}>{`[ ${this.props.location} ]`}</Text>
                            </View>
                            {
                                <View style={styleSheet.clockInfo_info_body}>
                                    <View style={styleSheet.clockInfo_status}>
                                        {
                                            this.props.refreshFlag ? (
                                                <TouchableOpacity
                                                    style={styleSheet.clockButton}
                                                    onPress={
                                                        this.props.refreshRecord
                                                    }
                                                    activeOpacity={1}
                                                >
                                                    <Text style={styleSheet.clockButton_text}>
                                                        {
                                                            '更新打卡'
                                                        }
                                                    </Text>
                                                </TouchableOpacity>
                                            ) : (
                                                    <View></View>
                                                )
                                        }
                                        {
                                            reclockFlag ? (
                                                <TouchableOpacity
                                                    style={styleSheet.clockButton}
                                                    onPress={
                                                        this.props.change
                                                    }
                                                    activeOpacity={1}
                                                >
                                                    <Text style={styleSheet.clockButton_text}>
                                                        {
                                                            '申请补卡'
                                                        }
                                                    </Text>
                                                </TouchableOpacity>
                                            ) : (
                                                    <View></View>
                                                )
                                        }
                                    </View>
                                </View>
                            }
                        </View>
                    ) : null
                }
                <View style={[styleSheet.clockInfo_info_body, { height: currentWidth * 32 / 750 }]}></View>
            </View>
        );
    }
}