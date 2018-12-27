import React, {
    Component
} from 'react';
import {
    Image,
    View,
    StatusBar,
    TouchableOpacity,
    WebView,
    Platform,
    Text,
} from 'react-native';
import topBar from '@style/topBar.style';
import Orientation from 'react-native-orientation';
import DeviceInfo from 'react-native-device-info';
import config from '@const/config';
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
            uri: params.resourceLinkUrl,
            title: params.resourceName,
            username: params.username,
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
            headerTitle:
                <View style={topBar.title}>
                    <Text style={topBar.title_text}>{navigation.state.params.resourceName ? navigation.state.params.resourceName : '设置'}</Text>
                </View>,
            headerStyle: topBar.header,
            headerLeft: (
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                        Orientation.lockToPortrait();
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
            gesturesEnabled: true
        });
    }

    onNavigationStateChange(navState) {
        this.props.navigation.setParams({
            backButtonEnabled: navState.canGoBack,
            url: navState.url
        });
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
                height: Platform.OS == 'android' ? (currentHeight - currentWidth * 84 / 750 - StatusBar.currentHeight) : currentHeight - currentWidth * 84 / 750,
                backgroundColor: config.topicColor,
            }}>
                {
                    Platform.OS == 'android' ?
                        (
                            <X5WebView
                                ref={'webview'}
                                automaticallyAdjustContentInsets={true}
                                style={{
                                    width: currentWidth,
                                    height: currentHeight - currentWidth * 84 / 750 - StatusBar.currentHeight,
                                    backgroundColor: config.topicColor,
                                }}
                                source={{
                                    uri: this.state.uri + '?USERID=' + this.state.username
                                }}
                                javaScriptEnabled={true}
                                domStorageEnabled={true}
                                decelerationRate="normal"
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
                                    height: DeviceInfo.getSystemVersion().indexOf('10.1') < 0 ? (currentHeight - currentWidth * 84 / 750) : (currentHeight - currentWidth * 84 / 750 - StatusBar.currentHeight),
                                    marginTop: DeviceInfo.getSystemVersion().indexOf('10.1') < 0 ? StatusBar.currentHeight : 10,
                                    backgroundColor: '#ff6600'
                                }}
                                source={{
                                    uri: this.state.uri + '?USERID=' + this.state.username
                                }}
                                javaScriptEnabled={true}
                                domStorageEnabled={true}
                                decelerationRate="normal"
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