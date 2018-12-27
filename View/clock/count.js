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
import config from '@const/config';
//import X5WebView from './X5WebView';
var Dimensions = require('Dimensions');
var currentWidth = Dimensions.get('window').width;
var currentHeight = Dimensions.get('window').height;
var vm = currentWidth > currentHeight ? currentHeight : currentWidth;

export default class Count extends Component {
    constructor(props) {
        super(props);

        const {
            params
        } = this.props.navigation.state;

        this.state = {
            url: '/total/view',
            scalesPageToFit: true,
            statusBar_color: config.topicColor,
            userId: params.userId,
            tenantId: params.tenantId,
            backButtonEnabled: false,
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
            headerStyle: {
                height: StatusBar.currentHeight,
                backgroundColor: config.topicColor,
            },
            headerLeft: null,
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
                height: Platform.OS == 'android' ? (currentHeight - StatusBar.currentHeight) : currentHeight,
            }}>

                <WebView
                    ref={'webview'}
                    automaticallyAdjustContentInsets={true}
                    style={{
                        width: currentWidth,
                        height: Platform.OS == 'android' ? (currentHeight - StatusBar.currentHeight) : currentHeight,
                        backgroundColor: '#ff6600'
                    }}
                    source={{
                        uri: config.pcloudPath + this.state.url +
                            '?userId=' + this.state.userId +
                            '&tenantId=' + this.state.tenantId
                    }}
                    javaScriptEnabled={true}
                    // domStorageEnabled={true}
                    // decelerationRate="normal"
                    // startInLoadingState={true}
                    // scalesPageToFit={false}
                    onNavigationStateChange={
                        this.onNavigationStateChange
                    }
                    onMessage={
                        (e) => this.onMessage(e)
                    }
                // bounces={false}
                // renderToHardwareTextureAndroid={true}
                // messagingEnabled={true}
                />
            </View>
        );
    }
}