import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    DeviceEventEmitter,
} from 'react-native';
import config from '@const/config'
import topBar from '@style/topBar.style';
import Toast from '@component/toast';
// 获取屏幕宽度 
var Dimensions = require('Dimensions');
const screenW = Dimensions.get('window').width;
var currentWidth = Dimensions.get('window').width;
var currentHeight = Dimensions.get('window').height;
var vm = currentWidth > currentHeight ? currentHeight : currentWidth;
// 常量
const cols = 2;
const cellWH = 120;
const vMargin = (screenW - cellWH * cols) / (cols + 1);
const hMargin = 25;
var backgroundIcon1 = require('@image/theme_default.png');
var backgroundIcon2 = require('@image/blueTheme.png');
export default class ThemePackage extends Component {
    constructor() {
        super();

        this.state = {
            settingStatus1: '设置',
            settingStatus2: '设置',
        }

    }

    componentDidMount() {

    }

    static navigationOptions = ({
        navigation,
        screenProps
    }) => {
        return ({
            headerTitle:
                <View style={topBar.title}>
                    <Text style={topBar.title_text}>主题列表</Text>
                </View>,
            gesturesEnabled: true,
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
        });
    }
    selectCell1 = () => {
        //   setTimeout(()=>{
        //     this.setState({
        //         settingStatus1:'已设置',
        //         settingStatus2:'设置'
        //     })
        //   },1200);
        global.themeColor = config.theme.default.backgroundcolor;
        this.props.navigation.setParams({
            themeColor: global.themeColor,
        });
        DeviceEventEmitter.emit('orangeColor', '橘色主题');
        // setTimeout(() => {
        this.refs.toast.show("保存成功", {
            position: 'center',
            backgroundColor: '#F2F2F2',
            fontSize: 15,
            color: '#494848',
            duration: 500,
            waitting: 500
        });
        // }, 1400);

    }

    selectCell2 = () => {
        //   setTimeout(()=>{
        //     this.setState({
        //         settingStatus1:'设置',
        //         settingStatus2:'已设置',
        //         // themeColor:'#1296db'

        //     })
        //   },1200);
        global.themeColor = config.theme.blue.backgroundcolor;
        this.props.navigation.setParams({
            themeColor: global.themeColor,
        });
        DeviceEventEmitter.emit('blueColor', '蓝色主题');
        //   setTimeout(()=>{
        this.refs.toast.show("保存成功", {
            position: 'center',
            backgroundColor: '#F2F2F2',
            fontSize: 15,
            color: '#494848',
            duration: 500,
            waitting: 500
        });
        //   },1400);
    }

    render() {
        return (
            <View style={styles.listViewStyle}>

                <View style={styles.innerViewStyle}>
                    <Image source={backgroundIcon1} style={styles.iconStyle} />
                    <TouchableOpacity activeOpacity={0.8} onPress={this.selectCell1}>
                        <View style={styles.shadowView}>
                            <Text style={styles.text1}>{this.state.settingStatus1}</Text>
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.text2}>默认主题</Text>
                </View>
                <View style={styles.innerViewStyle}>
                    <Image source={backgroundIcon2} style={styles.iconStyle} />
                    <TouchableOpacity activeOpacity={0.8} onPress={this.selectCell2}>
                        <View style={styles.shadowView}>
                            <Text style={styles.text1}>{this.state.settingStatus2}</Text>
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.text2}>清透蔚蓝</Text>
                </View>
                <Toast ref="toast"></Toast>
            </View>
        );

    }
}
const styles = StyleSheet.create({
    shadowView: {
        backgroundColor: 'grey',
        marginTop: 6,
        width: 66,
        height: currentHeight * .04
    },
    listViewStyle: {
        // 主轴方向 
        flexDirection: 'row',
        // 一行显示不下,换一行 
        flexWrap: 'wrap',
        height: currentHeight,

    },
    text1: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
    },
    text2: {
        fontSize: 14,
        marginTop: 15,

    },
    innerViewStyle: {
        width: 120,
        height: 120,
        // 文字内容居中对齐 
        alignItems: 'center',
        marginLeft: vMargin,
        marginTop: hMargin,
    },

    iconStyle: {
        width: 120,
        height: 100,
    },

}); 
