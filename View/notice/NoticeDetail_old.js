
import React, { Component } from 'react';
import {
    Text,
    Image,
    View,
    Button,
    TouchableOpacity,
    ScrollView,
    WebView,
} from 'react-native';
import ActionSheet from '@view/actionSheet/ActionSheetCustom';
import config from '@const/config';
import topBar from '@style/topBar.style';
import styleSheet from '@style/notice/noticeDetail.style';

var Dimensions = require('Dimensions');
var ScreenWidth = Dimensions.get('window').width;
var ScreenHeight = Dimensions.get('window').height;
var ScreenScale = Dimensions.get('window').scale;
var vm = ScreenWidth > ScreenHeight ? ScreenHeight : ScreenWidth;

var ITEM_HEIGHT = 60;
var RedPointWidth = 10;
var textPadding = 20;
// var REQUEST_URL = 'http://qixin.concher.cn/guoxin//logic/adaptor.do?json&IFCODE=ifFetchAndUpNotice&ATOK=fdbb5388cc747a34e87e824ba31bda18&NOTICEID=170';
var publisher = 'fenglc';
var titleContent = '这是一条公告的标题';
var testURl = 'http://qixin.concher.cn/data01/qixin/RSF//app/images/b18ba45c815143e4848b248bbf995fa9.jpg';
var testText = '区块链诞生自中本聪的比特币，自2009年以来，都是基于公有区块链的。';
var testHtml = '<p style=\"text-align: center; \"><span style=\"background-color: rgb(255, 0, 0);\">公告</span></p><p style=\"text-align: left;\"><span style=\"background-color: rgb(255, 0, 0);\">大家注意该公告它是有附件的。</span><span style=\"color: rgb(156, 198, 239);\">四大</span><span style=\"color: rgb(255, 0, 0);\">哈哈哈哈大<span style=\"font-style: italic; font-weight: bold;\">舒服撒。</span></span></p>';
export default class NoticeDetail extends Component {
    static navigationOptions = ({
        navigation,
        screenProps
    }) => {
        return ({
            headerTitle: '公告详情',
            headerBackTitle: null,
            gesturesEnabled: true,
            headerStyle: {
                height: ScreenHeight * .06,
                elevation: 0,
                shadowOpacity: 0,
                backgroundColor: global.themeColor ? global.themeColor : config.theme.default.backgroundcolor,
            },
            headerTitleStyle: {
                color: 'white',
                alignSelf: 'center',
                fontSize: vm * .044
            },
            headerLeft: (
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                    }}
                    style={topBar.left}
                >
                    <Image
                        source={require('@image/topBar/arrow_left_white.png')}
                        style={{
                            width: ScreenHeight * .06 * .5 * .59,
                            height: ScreenHeight * .06 * .5,
                            marginLeft: ScreenWidth * .06
                        }}
                    />
                </TouchableOpacity>
            ),
            headerRight: <View />,
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
            title: '',
            content: '',
            publisher: '',
        }
    }
    renderTopOpenAttachmentBtn() {
        if (this.state.dataArray.length) {
            return (<TouchableOpacity onPress={this.showFujianList.bind(this)}>
                <View style={styles.topbg}>
                    <Text style={styles.openAddText} >{'查看附件'}</Text>
                </View>
            </TouchableOpacity>)
        } else {
            return null;
        }
    }


    render() {
        var dataModel = this.props.navigation.state.params.info.value;
        var pages = [];
        var attachments = [];
        for (var i = 0; i < this.state.dataArray.length; i++) {
            attachments.push(
                <Button key={i} onPress={this.openFujian.bind(this, i)} title={'打开附件' + (i + 1)} style={styles.openButton}></Button>
            );
        }
        var options = [];
        for (var i = 0; i < this.state.dataArray.length; i++) {
            options.push('附件' + ':' + this.state.dataArray[i].value.fileName);
        }

        return (
            <View style={styles.bottomView}>
                <ActionSheet
                    tintColor="#333333"
                    ref={o => (this.actionSheet = o)}
                    options={options}
                    onPress={this.onActionSheetClick}
                    cancelButtonIndex={10086}
                />


                <ScrollView contentContainerStyle={styles.contentContainer}>
                    {/* <View > */}

                    {this.renderTopOpenAttachmentBtn()}

                    <Text style={styles.txtTitle}> {this.state.title} </Text>

                    <WebView
                        // ref={WEBVIEW_REF}
                        automaticallyAdjustContentInsets={false}
                        style={styles.txtContent}
                        source={{ html: this.state.content, baseUrl: 'http://www.baidu.com' }}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        decelerationRate="normal"
                        onNavigationStateChange={this.onNavigationStateChange}
                        onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
                        startInLoadingState={true}
                    // scalesPageToFit={this.state.scalesPageToFit}
                    />
                    {/* <Text  style = {styles.txtContent}> {this.state.content} </Text> */}
                    {/* <Text  style = {styles.publisher}>{this.state.publisher}</Text>
               <View  style = {styles.fengeXian}/>  */}

                    {/* </View> */}
                </ScrollView>
            </View>
        );
    }
    onActionSheetClick = value => {
        // console.log('打印一下选择了'+value);
        if (value == 10086) {
            return;
        }
        this.openFujian(value);
    }
    showFujianList() {
        this.actionSheet.show();
    }
    openFujian(i) {
        console.log('跳转到附件详情页' + i);
        this.props.navigation.navigate('Attach', { info: 'http:' + this.state.dataArray[i].value.filePath });
    }
    fetchData(loginId, tenantId) {
        //这个是js的访问网络的方法

        ATOK = this.props.navigation.state.params.ATOK;
        var isRead = this.props.navigation.state.params.isRead;
        var dataModel = this.props.navigation.state.params.info.value;
        // REQUEST_URL = "http://qixin.concher.cn/guoxin//logic/adaptor.do?json&IFCODE=ifFetchAndUpNotice&ATOK="+ ATOK+"&NOTICEID=" + this.props.navigation.state.params.info.value.NOTICEID;
        REQUEST_URL = config.pcloudPath + '/appnotice/appnoticedetail' + '?' + 'userLoginId=' + loginId + '&tenantId=' + tenantId + '&appNoticeId=' + dataModel.appNoticeId + '&isRead=' + isRead;
        console.log(REQUEST_URL);
        fetch(REQUEST_URL)
            .then((response) => response.json())
            .then((responseData) => {

                var code = responseData.success;
                if (code) {
                    let data = responseData.attchfiles;
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
                        isLoading: false,
                        title: responseData.noticedetail.noticeTitle,
                        content: responseData.noticedetail.noticeContent,
                        publisher: responseData.noticedetail.tenantId,
                    });
                    // console.log(this.state.dataArray);
                    data = null;
                    dataBlob = null;
                }

            })
            .catch((error) => {
                this.setState({
                    error: true,
                    errorInfo: error
                })
            })
            .done();

    }
    componentDidMount() {
        //组件加载完成，开始加载网络数据
        //读取
        global.storage.load({
            key: 'userInfo',
            //autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
            autoSync: false,
            //等待sync方法提供的最新数据
            syncInBackground: false,
        }).then(data => {
            if (data.loginId && data.tenantId) {
                this.fetchData(data.loginId, data.tenantId);
            }
        }).catch(err => {

        });
    }

}