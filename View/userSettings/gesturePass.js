import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity, // 不透明触摸 
    ScrollView,
    Switch,
} from 'react-native';
import topBar from '@style/topBar.style';
import config from '@const/config';
import Toast from '@component/toast';
var Dimensions = require('Dimensions');
var currentWidth = Dimensions.get('window').width;
var currentHeight = Dimensions.get('window').height;
var vm = currentWidth > currentHeight ? currentHeight : currentWidth;

export default class GesturePass extends Component {
    constructor() {
        super();
        this.state = {
            value: false
        };
        this.loadGestureSettings = this.loadGestureSettings.bind(this);
    }

    componentDidMount() {
    }

    static navigationOptions = ({
        navigation,
        screenProps
    }) => {
        return ({
            headerTitle: '手势密码',
            headerBackTitle: null,
            gesturesEnabled: true,
            headerStyle: {
                height: currentHeight * .06,
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
                            width: currentHeight * .06 * .5 * .59,
                            height: currentHeight * .06 * .5,
                            marginLeft: currentWidth * .06
                        }}
                    />
                </TouchableOpacity>
            ),
            headerRight: <View />,
        });
    }
    loadGestureSettings() {
        if (this.state.value == false) {
            const { navigate } = this.props.navigation;
            navigate('GestureSettings');
        } else {
            const { navigate } = this.props.navigation;
            navigate('CloseGestureSettings');
            //   setTimeout(() => {
            //     this.refs.toast.show("您已经关闭手势密码", {
            //         position: 'center',
            //         backgroundColor: '#F2F2F2',
            //         fontSize: 15,
            //         color: '#494848',
            //         duration: 800,
            //         waitting: 500
            //     });
            // }, 1000);

        }
    }
    render() {
        return (
            <ScrollView scrollEnabled={false} style={styles.container}>
                <View style={{ marginTop: 40 }}>
                    <View style={[styles.item, { flexDirection: 'row' }]}>
                        <Text style={[styles.font, { flex: 1, marginLeft: currentWidth * .05 }]}>手势密码</Text>
                        <Switch style={styles.switch} value={this.state.value} onTintColor={global.themeColor ? global.themeColor : config.theme.default.backgroundcolor} onValueChange={(value) => {
                            this.loadGestureSettings(),
                                this.setState({ value: value })
                        }} />
                    </View>
                </View>
                <Toast ref="toast"></Toast>
            </ScrollView>
        );
    }
}
var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    userIcon: {
        width: currentHeight * .06 * .7,
        height: currentHeight * .06 * .7,
        marginLeft: currentWidth * .03,
        marginRight: currentWidth * .05
    },
    item: {
        height: 40,
        justifyContent: 'center',
        //borderTopWidth: Util.pixel,
        borderTopColor: '#ddd',
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    font: {
        fontSize: 15,
        marginLeft: 10,
        marginRight: 10,
    },
    wrapper: {
        marginTop: 30,
    },
    tag: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 'bold'
    },
    switch: {
        marginRight: currentWidth * .02
    },
    exit: {
        marginTop: 55,
        marginLeft: 20,
        marginRight: 20
    }
});