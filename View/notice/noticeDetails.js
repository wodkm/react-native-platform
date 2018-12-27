import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity, // 不透明触摸 
    ScrollView,
} from 'react-native';
import topBar from '@style/topBar.style';
import config from '@const/config';
var Dimensions = require('Dimensions');
var currentWidth = Dimensions.get('window').width;
var currentHeight = Dimensions.get('window').height;
var vm = currentWidth > currentHeight ? currentHeight : currentWidth;

export default class NoticeDetails extends Component {
    constructor(props) {
        super(props);
    }
    static navigationOptions = ({
        navigation,
        screenProps
    }) => {
        return ({
            headerTitle: '公告详情',
            headerBackTitle: null,
            gesturesEnabled: true,
            headerStyle: {
                height: currentHeight * .06,
                elevation: 0,
                shadowOpacity: 0,
                backgroundColor: global.themeColor ? global.themeColor : config.theme.default.backgroundcolor
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
    render() {
        return (
            <ScrollView scrollEnabled={false}>
                <View style={{ flex: 1 }}>
                    <Text>
                        公告详情
          </Text>
                </View>
            </ScrollView>
        );
    }
}
