import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    WebView,
    TouchableOpacity,
} from 'react-native';
import config from '@const/config';
import topBar from '@style/topBar.style';

var Dimensions = require('Dimensions');
var ScreenWidth = Dimensions.get('window').width;
var ScreenHeight = Dimensions.get('window').height;
var ScreenScale = Dimensions.get('window').scale;
var vm = ScreenWidth > ScreenHeight ? ScreenHeight : ScreenWidth;
export default class Attachment extends Component {
    static navigationOptions = ({
        navigation,
        screenProps
    }) => {
        return ({
            headerTitle: '附件详情',
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
            headerRight: <View />
        });
    };


    render() {
        var url = this.props.navigation.state.params.info ? this.props.navigation.state.params.info : 'http://qixin.concher.cn:80/data01/qixin/RSF//app/90e080b536904cd78b91bf5b2a925e53.docx';
        // var url = "http://p3a.pstatp.com/weili/l/189528540244607010.jpg";
        return (
            <WebView
                // ref={WEBVIEW_REF}
                automaticallyAdjustContentInsets={false}
                style={styles.webView}
                source={{ uri: url }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                decelerationRate="normal"
                onNavigationStateChange={this.onNavigationStateChange}
                onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
                startInLoadingState={true}
            // injectedJavaScript={'var style = document.createElement("style");style.textContent="img{width:"+window.innerWidth+"px;}";document.getElementsByTagName("head")[0].appendChild(style);'}
            />

        );
    }

}
var styles = StyleSheet.create({

    webView: {
        width: ScreenWidth,
        height: ScreenHeight - 60,
    },
});