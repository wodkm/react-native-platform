import React, {
    Component
} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Animated,
    Easing,
    Platform,
    StatusBar
} from 'react-native';
var Dimensions = require('Dimensions');
var currentWidth = Dimensions.get('window').width;
var currentHeight = Dimensions.get('window').height;
var vm = currentWidth > currentHeight ? currentHeight : currentWidth;

export default class Toast extends Component {
    constructor(props) {
        super(props);

        this.state = {
            text: '',
            show: false,
            opacity: new Animated.Value(0.5),
            fontSize: vm * .027,
            backgroundColor: 'black',
            color: 'white',
            duration: 1200,
            waitting: 1000,
            position: {
                position: 'absolute',
                bottom: vm * .15,
            }
        }

        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
    }

    show(text, options = {}) {
        if (!this.state.show) {
            this.setState({
                text: text,
                show: true,
                fontSize: options.fontSize ? options.fontSize : vm * .027, //字体大小
                backgroundColor: options.backgroundColor ? options.backgroundColor : 'black', //背景颜色
                color: options.color ? options.color : 'white', //字体颜色
            });
            let duration = options.duration ? options.duration : 1200; //渐隐动画时间
            let waitting = options.waitting ? options.waitting : 1000; //停留时间
            switch (options.position) {
                case 'top':
                    this.setState({
                        position: {
                            position: 'absolute',
                            top: vm * .15,
                        }
                    });
                    break;
                case 'center':
                    this.setState({
                        position: {

                        }
                    });
                    break;
                case 'bottom':
                    this.setState({
                        position: {
                            position: 'absolute',
                            bottom: vm * .15,
                        }
                    });
                    break;
                default:
                    this.setState({
                        position: {
                            position: 'absolute',
                            bottom: vm * .15,
                        }
                    });
                    break;
            }
            this.state.opacity.setValue(0.9);
            setTimeout(() => {
                Animated.timing(this.state.opacity, {
                    toValue: 0,
                    duration: duration,
                    easing: Easing.linear, // 线性的渐变函数
                }).start(() => {
                    this.setState({
                        show: false
                    });
                });
            }, waitting);
        }
    }

    hide() {
        this.state.opacity.setValue(0);
        this.setState({
            show: false
        });
    }

    render() {
        return (
            this.state.show ? (
                <View style={styleSheet.toast_bg}>
                    <Animated.View style={[
                        styleSheet.toast,
                        {
                            opacity:this.state.opacity,
                            backgroundColor:this.state.backgroundColor,
                        },
                        this.state.position
                    ]}>
                        <Text style={[
                            styleSheet.toast_text,
                            {
                                color:this.state.color,
                                fontSize:this.state.fontSize,
                            }
                        ]}>
                            {this.state.text}
                        </Text>
                    </Animated.View>
                </View>
            ) : (
                <View></View>
            )
        )
    }
}

const styleSheet = StyleSheet.create({
    toast: {
        padding: vm * .02,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    toast_text: {
        fontWeight: 'bold',
    },
    toast_bg: {
        width: currentWidth,
        height: Platform.OS == 'android' ? currentHeight - StatusBar.currentHeight : currentHeight,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    }
});