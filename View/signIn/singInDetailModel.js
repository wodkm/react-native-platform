import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Animated,
} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import config from '@const/config';
import topBar from '@style/topBar.style';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
// var  ATOK = 'edc46d8ef8693de34fc161ff1550b8cf';
const REQUEST_URL = config.pcloudPath + '/sign/signlist';
var Dimensions = require('Dimensions');
var ScreenWidth = Dimensions.get('window').width;
var ScreenHeight = Dimensions.get('window').height;
var ScreenScale = Dimensions.get('window').scale;
var vm = ScreenWidth > ScreenHeight ? ScreenHeight : ScreenWidth;
var ITEM_HEIGHT = 50;
var RedPointWidth = ITEM_HEIGHT / 2;
var textPadding = 20;
let now = new Date();
let SHOWINGDATE = moment(now).format("YYYY.MM");
var LOGINID = '';
var TENANTID = '';

export default class SingInDetailView extends Component {
    static navigationOptions = ({
        navigation,
        screenProps
    }) => {
        // let dateStr = navigation.state.params.chosedDate;
        const { params } = navigation.state;

        return ({
            headerTitle:
                <View style={topBar.title}>
                    <Text style={topBar.title_text}>签到详情</Text>
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
                    <TouchableOpacity onPress={() => navigation.state.params.ToChooseDate()} style={topBar.right}>
                        <Text style={topBar.right_text}>{params ? params.defaultDate : SHOWINGDATE}</Text>
                    </TouchableOpacity>
                </View>
            ),
            gesturesEnabled: true
        });
    };
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            //网络请求状态
            error: false,
            errorInfo: "",
            dataArray: [],
            showingArray: [],
            date: now, //初始化日期显示
            isDateTimePickerVisible: false, //日历显示状态.
        }
        this.ToChooseDate = this.ToChooseDate.bind(this);
        this.showDateTimePicker = this.showDateTimePicker.bind(this);
        this.handleDatePicked = this.handleDatePicked.bind(this);
        this.hideDateTimePicker = this.hideDateTimePicker.bind(this);
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
        this.props.navigation.setParams({
            defaultDate: moment(date).format("YYYY.MM"),
        });
        SHOWINGDATE = moment(date).format("YYYY.MM");
        this.setState({
            date: date,
        }, () => {
            global.storage.load({
                key: 'userInfo',
                //autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
                autoSync: true,
                //等待sync方法提供的最新数据
                syncInBackground: true,
            }).then(data => {
                if (data.loginId && data.tenantId) {
                    LOGINID = data.loginId;
                    TENANTID = data.tenantId;
                    this.fetchData(data.loginId, data.tenantId, moment(date).format("YYYYMM"));
                }
            }).catch(err => {
                console.log(err);
            });
            // this.fetchData(LOGINID.TENANTID,moment(date).format("YYYYMM"));
        });

    }
    componentDidMount() {
        this.props.navigation.setParams({
            disabled: true,
            ToChooseDate: this.ToChooseDate,
            defaultDate: SHOWINGDATE,
        });
        //组件加载完成，开始加载网络数据
        // this.fetchMockData();
        //   this.fetchData();
        global.storage.load({
            key: 'userInfo',
            //autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
            autoSync: true,
            //等待sync方法提供的最新数据
            syncInBackground: true,
        }).then(data => {
            if (data.loginId && data.tenantId) {
                LOGINID = data.loginId;
                TENANTID = data.tenantId;
                this.fetchData(data.loginId, data.tenantId, moment(this.state.date).format("YYYYMM"));
            }
        }).catch(err => {
            console.log(err);
        });
    }
    ToChooseDate() {
        this.showDateTimePicker();
    }

    render() {
        //第一次加载等待的view
        if (this.state.isLoading && !this.state.error) {
            return this.renderLoadingView();
        } else if (this.state.error) {
            //请求失败view
            return this.renderErrorView(this.state.errorInfo);
        }
        //加载数据
        return this.renderData();
    }
    fetchMockData() {
        var responseData = require('./mockSingInListData');
        let data = responseData.record;

        let dataBlob = [];
        let i = 0;
        data.map(function (item) {
            dataBlob.push({
                key: i,
                value: item,
            })
            i++;
        });
        this.setState({
            //复制数据源
            dataArray: dataBlob,
            showingArray: dataBlob,
            isLoading: false,
        });
        // console.log(this.state.dataArray);
        data = null;
        dataBlob = null;
    }
    fetchData(loginId, tenantId, timeStr) {
        let formData = new FormData();

        formData.append('employeeNo', loginId);
        formData.append('tenantId', tenantId);
        formData.append('signMonth', timeStr);

        //这个是js的访问网络的方法
        fetch(REQUEST_URL, {
            method: 'POST',
            // headers: {
            //      'Accept': 'application/json',
            //     'Content-Type': 'application/json',
            //      },
            body: formData
        })
            // fetch('http://192.168.1.91:8080/pcloud/sign/signlist?employeeNo=14062309501017&tenantId=sxyy&signMonth=201805')
            .then((response) => response.json())
            .then((responseData) => {
                // console.log(responseData);
                // responseData = require('./mockSingInListData');
                let data = responseData.record;

                let dataBlob = [];
                let i = 0;
                data.map(function (item) {
                    dataBlob.push({
                        key: i,
                        value: item,
                    })
                    i++;
                });
                this.setState({
                    //复制数据源
                    dataArray: dataBlob,
                    showingArray: dataBlob,
                    isLoading: false,
                });
                // console.log(this.state.dataArray);
                data = null;
                dataBlob = null;
            })
            .catch((error) => {
                this.setState({
                    error: true,
                    errorInfo: error
                })
            })
            .done();
    }
    //加载等待的view
    renderLoadingView() {
        return (
            <View style={styles.container}>
                <ActivityIndicator
                    animating={true}
                    style={[styles.gray, { height: 80 }]}
                    color='red'
                    size="large"
                />
            </View>
        );
    }
    //加载失败view
    renderErrorView(error) {
        return (
            <View style={styles.container}>
                <Text>
                    Fail: {error}
                </Text>
            </View>
        );
    }
    _header = () => {
        return <View style={{ height: 1, backgroundColor: '#c9c9c9' }} />;
    }

    _footer = () => {
        return <View style={{ height: 1, backgroundColor: '#c9c9c9' }} />;
    }

    _separator = () => {
        return <View style={{ height: 1, backgroundColor: '#c9c9c9' }} />;
    }
    renderData() {
        return (
            <View style={{ flex: 1, backgroundColor: '#f0f8ff' }}>

                <View style={{ flex: 1 }}>
                    <FlatList
                        ref="_flatlist"
                        data={this.state.dataArray}
                        ListHeaderComponent={this._header}
                        ListFooterComponent={this._footer}
                        ItemSeparatorComponent={this._separator}
                        renderItem={this._renderItem}
                        keyExtractor={this._keyExtractor}
                        extraData={this.state}
                    >
                    </FlatList>
                </View>
                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this.handleDatePicked}
                    onCancel={this.hideDateTimePicker}
                    titleIOS={'选择日期'}
                    cancelTextIOS={'取消'}
                    confirmTextIOS={'确定'}
                    mode={'date'}
                // datePickerModeAndroid = {'calendar'}
                />
            </View>
        );
    }
    _renderItem = (item) => {
        var txt = item.item.value.signTime;
        var txtContent = item.item.value.attendAddress;
        var bgColor = 'white';
        return (
            <TouchableOpacity key={item.index} activeOpacity={1}
                onPress={this.clickItem.bind(this, item, item.index)
                }>
                <View style={[{ flex: 1, height: ITEM_HEIGHT, backgroundColor: bgColor, flexDirection: 'row' }]}>
                    <Image
                        style={[{ marginLeft: 13, height: RedPointWidth, width: RedPointWidth, marginTop: ITEM_HEIGHT / 2 - RedPointWidth / 2 }]}
                        source={require('@image/clock/icon_time.png')}
                    />

                    <View style={[{ width: ScreenWidth - RedPointWidth - 40 }]}>
                        <Text style={[styles.txt]}>{txt}</Text>
                        <Text numberOfLines={1} style={[styles.txtContent]} >{txtContent}</Text>
                    </View>
                    <View style={[{ flex: 1, width: 40, }]}>
                        <Image
                            style={[styles.rightArrow]}
                            source={require('@image/topBar/right_arrow.png')}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    clickItem(item, index) {
        //  alert(index);
        this.props.navigation.navigate('SingInRecordView', { info: this.state.dataArray[index].value, Month: SHOWINGDATE });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    txt: {
        textAlign: 'left',
        paddingLeft: 13,
        // textAlignVertical: 'center',
        marginTop: 5,
        color: 'black',
        fontSize: 17,
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