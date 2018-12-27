import React, { Component } from 'react';
import {
    Text,
    Image,
    View,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Animated,
    TextInput,
    Alert,
} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import config from '@const/config';
import topBar from '@style/topBar.style';
import styleSheet from '@style/notice/notice.style';
import d from './mockNoticesData';
const AnimatedView = Animated.createAnimatedComponent(View);

var ATOK = 'edc46d8ef8693de34fc161ff1550b8cf';
const REQUEST_URL = config.pcloudPath + '/appnotice/appnoticepublishlist';
var Dimensions = require('Dimensions');
var ScreenWidth = Dimensions.get('window').width;
var ScreenHeight = Dimensions.get('window').height;
var vm = ScreenWidth > ScreenHeight ? ScreenHeight : ScreenWidth;
var ITEM_HEIGHT = 60;
var RedPointWidth = 10;
let now = new Date();

export default class NoticesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            //网络请求状态
            error: false,
            errorInfo: "",
            showingArray: [],
            dateStr: '',
            queryStr: '',
            today: now, //当天日期
            date: now, //初始化日期显示
            isDateTimePickerVisible: false, //日历显示状态.
            selectedDatePickerIndex: 0,
            DTBtnArray: [now, 0],
            menuShowing: false,
            notices: [],
        }
        this.showDateTimePicker = this.showDateTimePicker.bind(this);
        this.handleDatePicked = this.handleDatePicked.bind(this);
        this.hideDateTimePicker = this.hideDateTimePicker.bind(this);
    }

    componentDidMount() {
        global.storage.load({
            key: 'userInfo',
            //autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
            autoSync: true,
            //等待sync方法提供的最新数据
            syncInBackground: true,
        }).then(data => {
            if (data.loginId && data.tenantId) {
                this.fetchData(data.loginId, data.tenantId);
            }
        }).catch(err => {
            console.log(err);
        });
    }

    componentWillMount() {
        console.log('组件即将显示：++++');
    }

    _renderItem = (item) => {
        var txt = item.item.value.appNoticeTitle;
        var txtContent = item.item.value.appNoticeDesc;
        var bgColor = '#f2f2f2';
        var isUnread = this.state.dataArray[item.index].value.isRead == 0;
        var dateStr = moment(item.item.value.sendTime).format("YYYY.MM.DD");
        return (
            <TouchableOpacity key={item.index} activeOpacity={1}
                onPress={this.clickItem.bind(this, item, item.index)}>

                <View style={[{
                    flex: 1,
                    height: ITEM_HEIGHT,
                    backgroundColor: bgColor,
                    flexDirection: 'row'
                }]}>
                    {<View style={[{
                        backgroundColor: isUnread ? 'red' : null,
                        height: RedPointWidth,
                        width: RedPointWidth
                    }]}></View>
                    }
                    <View style={[{ width: ScreenWidth - 5 - 80 }]}>
                        <Text style={[styleSheet.txt]}>{txt}</Text>
                        <Text numberOfLines={1} style={[styleSheet.txtContent]}>{txtContent}</Text>
                    </View>
                    <View style={[{ flex: 1, width: 80, }]}>
                        <Text style={[styleSheet.dateTxtContent]}>{dateStr}</Text>
                        <Image
                            style={[styleSheet.rightArrow]}
                            source={require('@image/topBar/right_arrow.png')}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    _header = () => {
        //   return <Text style={[styleSheet.txt,{backgroundColor:'white'}]}>TODO:日期选择+搜索</Text>;
        return <View style={{ height: 1, backgroundColor: '#c9c9c9' }} />;
    }

    _footer = () => {
        //   return <Text style={[styleSheet.txt,{backgroundColor:'green'}]}>这是尾部</Text>;
        return <View style={{ height: 1, backgroundColor: '#c9c9c9' }} />;
    }

    _separator = () => {
        return <View style={{ height: 1, backgroundColor: '#c9c9c9' }} />;
    }

    //点击列表点击每一行
    clickItem(item, index) {
        var passIsRead;
        if (this.state.showingArray.length == 0) {
            var replaceArray = this.state.dataArray;
            passIsRead = replaceArray[index].value.isRead;
            replaceArray[index].value.isRead = 1;
            this.setState({
                dataArray: replaceArray
            });
            this.props.navigation.navigate('NoticeDetail', {
                info: this.state.dataArray[index],
                ATOK: ATOK,
                isRead: passIsRead
            });
        } else {
            var replaceArray = this.state.showingArray;
            passIsRead = replaceArray[index].value.isRead;
            replaceArray[index].value.isRead = 1;
            this.setState({
                showingArray: replaceArray
            }, function () {
                this.forceUpdate()
            });
            this.props.navigation.navigate('NoticeDetail', {
                info: this.state.showingArray[index],
                ATOK: ATOK,
                isRead: passIsRead
            });
        }
    }

    fetchMockData() {
        var responseData = require('./mockNoticesData');
        let data = responseData.DATA;
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
        data = null;
        dataBlob = null;
    }

    fetchData(loginId, tenantId) {
        //这个是js的访问网络的方法
        var URL = REQUEST_URL + '?' + 'userLoginId=' + loginId + '&tenantId=' + tenantId;
        fetch(URL
        ).then(resp => {
            if (resp.ok) return resp.json();
            if (resp.status == '404') throw new Error('Page not found:' + resp.url);
            if (resp.status == '500') throw new Error(resp.status + ' ' + resp.url);
        }).then((responseData) => {
            let data = d.DATA;//responseData.record;
            let dataBlob = [];
            let i = 0;
            data.forEach((item, index) => {
                dataBlob.push({
                    key: index,
                    value: item,
                })
            });
            this.setState({
                //复制数据源
                notices: dataBlob,
                showingArray: dataBlob,
                isLoading: false,
            });
        }).catch((error) => {
            this.setState({
                error: true,
                errorInfo: error
            })
        }).done();
    }

    //加载等待的view
    renderLoadingView() {
        return (
            <View style={styleSheet.container}>
                <ActivityIndicator
                    animating={true}
                    style={[styleSheet.gray, { height: 80 }]}
                    color='red'
                    size="large"
                />
            </View>
        );
    }

    //加载失败view
    renderErrorView(error) {
        return (
            <View style={styleSheet.container}>
                <Text>
                    Fail: {error}
                </Text>
            </View>
        );
    }

    //顶部菜单显示与隐藏
    showSelectMenu() {
        var c = this.state.menuShowing;
        var b = this.state.menuShowing;
        if (this.state.menuShowing) {
            this.setState({
                menuShowing: !b,
                DTBtnArray: [now, 0],
                queryStr: '',
            }, () => {
                this.searchDataWithDateAndQueryStr();
            });
        } else {
            this.setState({
                menuShowing: !b
            });
        }
    }

    //时间选择器
    showDTPicker(index) {
        console.log('点击了' + index + '个时间选择按钮');
        var b2 = this.state.menuShowing;
        this.setState({
            isDateTimePickerVisible: true,
            selectedDatePickerIndex: index,
        });

    }

    //时间选择器
    showDateTimePicker() {
        var b2 = this.state.menuShowing;
        this.setState({
            isDateTimePickerVisible: true
        });
    }

    hideDateTimePicker() {
        this.setState({
            isDateTimePickerVisible: false
        });
    }

    handleDatePicked(date) {
        this.hideDateTimePicker();
        var newDTArray = this.state.DTBtnArray;
        newDTArray[this.state.selectedDatePickerIndex] = date;
        this.setState({
            date: date,
            dateStr: moment(date).format("YYYYMMDD"),
            DTBtnArray: newDTArray,
        });
        this.scrollToDate(moment(date).format("YYYYMMDD"));
    }

    resetDateBtnClick() {
        this.setState({
            DTBtnArray: [now, 0],
        }, () => {

            this.searchDataWithDateAndQueryStr();

        });
    }

    scrollToDate(dateStr) {
        var sourceArray = this.state.showingArray.length == 0 ? this.state.dataArray : this.state.showingArray;
        for (i = 0; i < sourceArray.length; i++) {
            var object = sourceArray[i];
            var dateStrNew = object.value.LASTUPDATETIME;
            if (dateStr == dateStrNew) {
                this.refs._flatlist.scrollToIndex({ viewPosition: 0, index: i });
                return;
            }
        }
    }

    //顶部菜单
    renderTopView() {
        if (this.state.menuShowing) {
            return (
                <AnimatedView style={{ width: ScreenWidth, height: 150, }}>
                    <View style={{ flex: 1, flexDirection: 'row', width: ScreenWidth, }}>
                        <TouchableOpacity onPress={this.showDTPicker.bind(this, 0)}>
                            <View style={[styleSheet.datePickBtn]}>
                                <Text>{moment(this.state.DTBtnArray[0]).format("YYYY.MM.DD")}</Text>
                            </View>
                        </TouchableOpacity>
                        <Text style={{
                            justifyContent: 'center',
                            marginLeft: 13,
                            height: 30,
                            marginTop: 10,
                            fontSize: 20
                        }}>{'~'}</Text>
                        <TouchableOpacity onPress={this.showDTPicker.bind(this, 1)}>
                            <View style={[styleSheet.datePickBtn2]}>
                                <Text>{this.state.DTBtnArray[1] == 0 ? '请选择日期' : moment(this.state.DTBtnArray[1]).format("YYYY.MM.DD")}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.resetDateBtnClick.bind(this)}>
                            <View style={[styleSheet.dateResetBtn]}>
                                <Text>{'重置'}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.searchDataWithDateAndQueryStr.bind(this)}>
                            <View style={[styleSheet.dateResetBtn]}>
                                <Text>{'查找'}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        style={[styleSheet.searchInput]}
                        placeholder="  请按标题关键字搜索......"// = android　EditText hint
                        placeholderTextColor="#595757"// = hint color
                        returnKeyType='search'
                        onChangeText={(query) => {
                            this.setState({
                                queryStr: query,
                            });// 当内容改变时执行该方法
                        }}
                        onSubmitEditing={this.searchDataWithDateAndQueryStr.bind(this)}
                    />
                    <TouchableOpacity onPress={this.showSelectMenu.bind(this)}>
                        <View style={[styleSheet.upArrow]}>
                            <Text style={{ textAlign: 'center', }}>{'△'}</Text>
                        </View>
                    </TouchableOpacity>
                </AnimatedView>)
        } else {
            return (
                <AnimatedView style={{ width: ScreenWidth, height: 50, }}>
                    <TouchableOpacity onPress={this.showSelectMenu.bind(this)}>
                        <View style={[styleSheet.guideView]}>
                            <Text
                                style={{ textAlign: 'center', }}>{this.state.menuShowing ? '收起搜索菜单' : '搜索 \r\n▽'}</Text>
                        </View>
                    </TouchableOpacity>
                </AnimatedView>
            )
        }
    }

    searchDataWithDateAndQueryStr() {
        let tempArray = [];
        var startDate = Number(moment(this.state.DTBtnArray[0]).format("YYYYMMDD"));//第一个按钮选择的时间
        var endDate = Number(moment(this.state.DTBtnArray[1]).format("YYYYMMDD"));//第二个按钮选择的时间
        if (startDate <= endDate) {
            var tempDate = startDate;
            startDate = endDate;
            endDate = tempDate;
        }
        var queryStr = this.state.queryStr;//标题关键字
        for (i = 0; i < this.state.dataArray.length; i++) {
            var object = this.state.dataArray[i];
            var title = object.value.appNoticeTitle;
            var dateStr = Number(moment(object.value.LASTUPDATETIME).format("YYYYMMDD"));
            if (title.indexOf(this.state.queryStr) != -1 & dateStr <= startDate & dateStr >= endDate) {
                tempArray.push(object);
            }
        }
        if (tempArray.length == 0) {
            Alert.alert(
                '提示',
                '未找到符合条件的公告',
                [
                    { text: '确定', onPress: () => console.log('OK Pressed') },
                ],
            )
        } else {
            this.setState({
                showingArray: tempArray,
            })
        }
    }

    static navigationOptions = ({
        navigation,
        screenProps
    }) => {
        return ({
            headerTitle:
                <View style={topBar.title}>
                    <Text style={topBar.title_text}>公告</Text>
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
            headerRight: <View />,
            gesturesEnabled: true,
        });
    };

    renderData() {
        return (
            <View style={{ flex: 1, backgroundColor: '#f0f8ff' }}>

                <ScrollView
                    scrollEnabled={true}
                    style={styleSheet.scroll}
                    contentContainerStyle={styleSheet.container}
                >
                    {
                        this.state.notices && this.state.notices.length ? this.state.notices.map((item, index) => {
                            return (
                                <View key={index} style={styleSheet.notice}>
                                    <View style={styleSheet.notice_icon_box}>
                                        <Image
                                            source={require('@image/horn.png')}
                                            style={styleSheet.notice_icon}
                                            resizeMode="contain"
                                        />
                                    </View>
                                    <View>
                                        <Text style={styleSheet.notice_title}>
                                            {
                                                item.value.NOTICETITLE && item.value.NOTICETITLE.length > 30 ? (
                                                    `${item.value.NOTICETITLE.substring(0, 30)}...`
                                                ) : (item.value.NOTICETITLE || '无标题')
                                            }
                                        </Text>
                                        <View style={styleSheet.notice_date}>
                                            <Text style={styleSheet.notice_date_text}>
                                                {
                                                    moment(item.value.LASTUPDATETIME).format("YYYY-MM-DD")
                                                }
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            )
                        }) : null
                    }
                </ScrollView>
                {
                    //         { this.renderTopView() }
                    //         < View style={{ flex: 1 }}>
                    //         <FlatList
                    //         ref="_flatlist"
                    //         data={this.state.showingArray.length ? this.state.showingArray : this.state.dataArray}
                    //         ListHeaderComponent={this._header}
                    //         ListFooterComponent={this._footer}
                    //         ItemSeparatorComponent={this._separator}
                    //         renderItem={this._renderItem}
                    //         keyExtractor={this._keyExtractor}
                    //         extraData={this.state}
                    //     >
                    //     </FlatList>
                    // </View>
                    // <DateTimePicker
                    //     isVisible={this.state.isDateTimePickerVisible}
                    //     onConfirm={this.handleDatePicked}
                    //     onCancel={this.hideDateTimePicker}
                    //     titleIOS={'选择日期'}
                    //     cancelTextIOS={'取消'}
                    //     confirmTextIOS={'确定'}
                    //     mode={'date'}
                    //     datePickerModeAndroid={'calendar'}
                    // />
                }
            </View>
        );
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
}