//ListView 九宫格
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    Image,
    TouchableOpacity, // 不透明触摸
} from 'react-native';
import topBar from '@style/topBar.style';
import config from '@const/config';
import Loading from '@component/Loading';
import encryption from '@component/Encryption';

// 获取屏幕宽度 
var Dimensions = require('Dimensions');
const screenW = Dimensions.get('window').width;
var currentWidth = Dimensions.get('window').width;
var currentHeight = Dimensions.get('window').height;
var vm = currentWidth > currentHeight ? currentHeight : currentWidth;

// 常量
const cols = 3;
const cellWH = 100;
const vMargin = (screenW - cellWH * cols) / (cols + 1);
const hMargin = 25;
let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

export default class Work extends Component {
    _didFocusSubscription;
    _willBlurSubscription;
    lastBackPressed;


    constructor() {
        super();
        this.state = {
            dataSource: ds.cloneWithRows([]),
            showLoading: false,
        };

        this.renderRow = this.renderRow.bind(this);
        this.toPage = this.toPage.bind(this);
    }

    componentWillMount() {
        global.canBack = true;
        this._didFocusSubscription = this.props.navigation.addListener('didFocus', payload => {
            setTimeout(() => (global.canBack = true) && (this.lastBackPressed = null), 200);
        });
        this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
            global.canBack = false
        );
    }

    componentWillUnmount() {
        this._didFocusSubscription && this._didFocusSubscription.remove();
        this._willBlurSubscription && this._willBlurSubscription.remove();
    }

    componentDidMount() {
        let menuId = this.props.navigation.state.routeName;
        // alert(menuId);
        global.storage.load({
            key: 'userInfo',
            autoSync: false,
            syncInBackground: false,
        }).then(data => {
            let encryptResult = encryption.encrypt(data.authKey, 'POST', '/mp/menu/get');
            fetch(`${config.appPath}/mp/menu/get?loginId=${data.username}&tenantId=${config.tenantId}&menuId=${menuId}`, {
                method: 'post',
                headers: {
                    Date: encryptResult.time.toUTCString(),
                    Authorization: encryptResult.authorization
                }
            }).then((response) => {
                return response.json();
            }).then((responseBody) => {
                if (responseBody.status == '0') {
                    let allData = {};
                    let data = responseBody.data.map((item, index) => {
                        return {
                            title: item.resourceName,
                            icon: item.resourceImage1,
                            resourceCode: item.resourceCode,
                            resourceLinkUrl: item.resourceLinkUrl,
                        };
                    });
                    this.setState({
                        dataSource: ds.cloneWithRows(data)
                    });
                }
            }).catch((error) => {
                // alert(error);
            });
        }).catch(err => {
            console.warn(err.message);
        });

    }
    //组件将被卸载  
    componentWillUnmount() {
        //重写组件的setState方法，直接返回空
        this.setState = (state, callback) => {
            return;
        };
    }

    static navigationOptions = ({
        navigation,
        screenProps
    }) => {
        return ({
            headerTitle:
                <View style={topBar.title}>
                    <Text style={topBar.title_text}>工作</Text>
                </View>,
            headerStyle: topBar.header,
            gesturesEnabled: true,
            headerLeft: (
                <TouchableOpacity
                    onPress={() => { }}
                    style={topBar.left}
                >
                    <Image source={navigation.state.params && navigation.state.params.headUrl ? navigation.state.params.headUrl : global.headUrl} style={topBar.back} />
                </TouchableOpacity>
            ),
            headerRight: <View />
        });
    }

    render() {
        return (
            <View>
                <ListView
                    scrollEnabled={false}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    contentContainerStyle={styles.listViewStyle}
                    enableEmptySections={true}
                />
                <Loading showLoading={this.state.showLoading} />
            </View>
        );
    }

    toPage(rowData) {
        const { navigate } = this.props.navigation;
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
            navigate(rowData.resourceCode, {
                resourceLinkUrl: rowData.resourceLinkUrl,
                resourceName: rowData.title,
                username: data.username,
            });
        }).catch(err => {
            console.warn(err.message);
        });
    }

    renderRow(rowData) {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                    this.toPage(rowData);
                }}
                style={{
                    width: cellWH,
                    height: cellWH,
                    marginLeft: vMargin,
                    marginTop: hMargin,
                }}
            >
                <View style={styles.innerViewStyle}>
                    <Image source={{ uri: rowData.icon }} style={styles.iconStyle} />
                    <Text>{rowData.title}</Text>
                </View>
            </TouchableOpacity>
        );
    }

}

const styles = StyleSheet.create({
    listViewStyle: {
        // 主轴方向 
        flexDirection: 'row',
        // 一行显示不下,换一行 
        flexWrap: 'wrap',
        height: currentHeight,
    },

    innerViewStyle: {
        width: cellWH,
        height: cellWH,
        // 文字内容居中对齐 
        alignItems: 'center',
    },

    iconStyle: {
        width: 60,
        height: 60,
    },

}); 
