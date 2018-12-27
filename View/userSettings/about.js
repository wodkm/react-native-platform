import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity, // 不透明触摸 
} from 'react-native';
import topBar from '@style/topBar.style';
import config from '@const/config';
var Dimensions = require('Dimensions');
var currentWidth = Dimensions.get('window').width;
var currentHeight = Dimensions.get('window').height;
var vm = currentWidth > currentHeight ? currentHeight : currentWidth;

export default class About extends Component {
    constructor() {
        super();
    }

    static navigationOptions = ({
        navigation,
        screenProps
    }) => {
        return ({
            headerTitle:
                <View style={topBar.title}>
                    <Text style={topBar.title_text}>关于</Text>
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
    render() {
        return (
            <View style={{ flex: 1, }}>

                <Text style={styles.txtContent}>
                    {
                        '云考核是一款集考勤打卡、签到、接收公告以及流程审批等功能为一体的一款办公软件，有效的解决了传统考勤统计、审批的繁琐易出错的难题，有效的提升了办公效率。'
                    }
                </Text>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    txtContent: {
        textAlign: 'center',
        marginTop: 5,
        fontSize: 14,

    },


})