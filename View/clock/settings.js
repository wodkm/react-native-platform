import React, {
    Component
} from 'react';
import {
    Image,
    View,
    StatusBar,
    TouchableOpacity,
    WebView,
    Platform
} from 'react-native';
import topBar from '@style/topBar.style';
import Orientation from 'react-native-orientation';
import DeviceInfo from 'react-native-device-info';
import config from '@const/config';
import Loading from '@component/Loading';
import X5WebView from '@component/X5WebView';
var Dimensions = require('Dimensions');
var currentWidth = Dimensions.get('window').width;
var currentHeight = Dimensions.get('window').height;
var vm = currentWidth > currentHeight ? currentHeight : currentWidth;

export default class Settings extends Component {
    constructor(props) {
        super(props);

        const {
            params
        } = this.props.navigation.state;

        this.state = {
            url: '/group/list',
            scalesPageToFit: true,
            appPath: params.appPath,
            statusBar_color: config.topicColor,
            userId: params.userId,
            tenantId: params.tenantId,
            groupId: params.groupId,
            isAttendanceGroupManager: params.isAttendanceGroupManager,
            isOrgManager: params.isOrgManager,
            belongOrgIds: params.belongOrgIds,
            manageOrgIds: params.manageOrgIds,
            attendOrgId: params.attendOrgId,
            backButtonEnabled: false,
            showLoading: false,
        };

        this.onNavigationStateChange = this.onNavigationStateChange.bind(this);
        this.historyBack = this.historyBack.bind(this);
        this.onMessage = this.onMessage.bind(this);
    }

    componentWillMount() {
        //Orientation.unlockAllOrientations();
    }

    componentDidMount() {
        this.props.navigation.setParams({
            backButtonEnabled: this.state.backButtonEnabled,
            historyBack: this.historyBack
        });
    }

    static navigationOptions = ({
        navigation,
        screenProps
    }) => {
        return ({
            header: null,
            headerTitle: '设置',
            headerStyle: {
                height: currentHeight * .06,
                elevation: 0,
                shadowOpacity: 0,
                backgroundColor: config.topicColor
            },
            headerTitleStyle: {
                color: 'white',
                alignSelf: 'center',
                fontSize: vm * .0368
            },
            headerLeft: (
                <TouchableOpacity
                    onPress={
                        // backButtonEnabled?(
                        //     ()=>navigation.state.params.historyBack()
                        // ):(
                        () => {
                            navigation.goBack();
                            Orientation.lockToPortrait();
                        }
                        // )
                    }
                    style={topBar.left}
                >
                    <Image source={require('@image/topBar/arrow_left_white.png')} style={topBar.back} />
                </TouchableOpacity>
            ),
            headerRight: (
                <View style={topBar.right}>
                </View>
            ),
            gesturesEnabled: true
        });
    }

    onNavigationStateChange(navState) {
        this.props.navigation.setParams({
            backButtonEnabled: navState.canGoBack,
            url: navState.url
        });
        this.setState({
            showLoading: true
        });
        setTimeout(() => {
            this.setState({
                showLoading: false
            })
        }, 3000);
    }

    onMessage(e) {
        if (e.nativeEvent.data == -1) {
            this.props.navigation.goBack();
            Orientation.lockToPortrait();
        }

    }

    historyBack() {
        this.refs['webview'].goBack();
    }

    render() {
        return (
            <View style={{
                width: currentWidth,
                height: Platform.OS == 'android' ? (currentHeight - StatusBar.currentHeight) : currentHeight,
                backgroundColor: '#ff6600'
            }}>
                <Loading showLoading={this.state.showLoading} />
                
                {
                    Platform.OS == 'android' ?
                        (
                            <X5WebView
                                ref={'webview'}
                                automaticallyAdjustContentInsets={true}
                                style={{
                                    width: currentWidth,
                                    height: Platform.OS == 'android' ? (currentHeight - StatusBar.currentHeight) : (DeviceInfo.getSystemVersion().indexOf('10.1') < 0 ? currentHeight : (currentHeight - StatusBar.currentHeight)),
                                    marginTop: Platform.OS == 'android' ? 0 : (DeviceInfo.getSystemVersion().indexOf('10.1') < 0 ? StatusBar.currentHeight : 10),
                                    backgroundColor: '#ff6600'
                                }}
                                source={{
                                    uri: this.state.appPath + this.state.url +
                                        '?userId=' + this.state.userId +
                                        '&tenantId=' + this.state.tenantId +
                                        '&groupId=' + this.state.groupId +
                                        '&isAttendanceGroupManager=' + this.state.isAttendanceGroupManager +
                                        '&isOrgManager=' + this.state.isOrgManager +
                                        '&belongOrgIds=' + this.state.belongOrgIds +
                                        '&manageOrgIds=' + this.state.manageOrgIds +
                                        '&attendOrgId=' + this.state.attendOrgId
                                }}
                                javaScriptEnabled={true}
                                domStorageEnabled={true}
                                decelerationRate="normal"
                                startInLoadingState={true}
                                scalesPageToFit={false}
                                onNavigationStateChange={
                                    this.onNavigationStateChange
                                }
                                onMessage={
                                    (e) => this.onMessage(e)
                                }
                                bounces={false}
                                renderToHardwareTextureAndroid={false}
                                messagingEnabled={true}
                            />
                        ) : (
                            <WebView
                                ref={'webview'}
                                automaticallyAdjustContentInsets={true}
                                style={{
                                    width: currentWidth,
                                    height: Platform.OS == 'android' ? (currentHeight - StatusBar.currentHeight) : (DeviceInfo.getSystemVersion().indexOf('10.1') < 0 ? currentHeight : (currentHeight - StatusBar.currentHeight)),
                                    marginTop: Platform.OS == 'android' ? 0 : (DeviceInfo.getSystemVersion().indexOf('10.1') < 0 ? StatusBar.currentHeight : 10),
                                    backgroundColor: '#ff6600'
                                }}
                                source={{
                                    uri: this.state.appPath + this.state.url +
                                        '?userId=' + this.state.userId +
                                        '&tenantId=' + this.state.tenantId +
                                        '&groupId=' + this.state.groupId +
                                        '&isAttendanceGroupManager=' + this.state.isAttendanceGroupManager +
                                        '&isOrgManager=' + this.state.isOrgManager +
                                        '&belongOrgIds=' + this.state.belongOrgIds +
                                        '&manageOrgIds=' + this.state.manageOrgIds +
                                        '&attendOrgId=' + this.state.attendOrgId
                                }}
                                javaScriptEnabled={true}
                                domStorageEnabled={true}
                                decelerationRate="normal"
                                startInLoadingState={true}
                                scalesPageToFit={false}
                                onNavigationStateChange={
                                    this.onNavigationStateChange
                                }
                                injectedJavaScript={`(function() {
                                    var originalPostMessage = window.postMessage;
                                  
                                    var patchedPostMessage = function(message, targetOrigin, transfer) { 
                                      originalPostMessage(message, targetOrigin, transfer);
                                    };
                                  
                                    patchedPostMessage.toString = function() { 
                                      return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage'); 
                                    };
                                  
                                    window.postMessage = patchedPostMessage;
                                  })();`}
                                onMessage={
                                    (e) => this.onMessage(e)
                                }
                                bounces={false}
                                renderToHardwareTextureAndroid={false}
                                messagingEnabled={true}
                            />
                        )
                }
            </View>
        );
    }
}