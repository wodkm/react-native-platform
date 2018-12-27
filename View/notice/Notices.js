import React, { Component } from 'react';
import {
    Text,
    Image,
    View,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import moment from 'moment';
import config from '@const/config';
import topBar from '@style/topBar.style';
import styleSheet from '@style/notice/notice.style';
import d from './mockNoticesData';

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
            isRefreshing: true,
        }

        this.fetchData = this.fetchData.bind(this);
        this.clickItem = this.clickItem.bind(this);
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

    //点击列表点击每一行
    clickItem(item) {
        this.props.navigation.navigate('NoticeDetail', {
            info: item,
        });
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
                Math.random() > 0.5 ?
                    dataBlob.push({
                        key: index,
                        value: item,
                    }) : null;
            });
            this.setState({
                //复制数据源
                notices: dataBlob,
                showingArray: dataBlob,
                isRefreshing: false,
            });
        }).catch((error) => {
            this.setState({
                error: true,
                errorInfo: error
            })
        }).done();
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

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#f0f8ff' }}>

                <ScrollView
                    scrollEnabled={true}
                    style={styleSheet.scroll}
                    contentContainerStyle={styleSheet.container}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this.fetchData}
                            tintColor="#ff0000"
                            title="Loading..."
                            titleColor="#00ff00"
                            colors={['#2c94ff']}
                            progressBackgroundColor="#ffffff"
                        />
                    }
                >
                    {
                        this.state.notices && this.state.notices.length ? this.state.notices.map((item, index) => {
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={styleSheet.notice}
                                    activeOpacity={1}
                                    onPress={this.clickItem.bind(this, item)}
                                >
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
                                </TouchableOpacity>
                            )
                        }) : null
                    }
                </ScrollView>
            </View>
        );
    }
}