import React, { Component } from 'react';
import { MapView, Marker } from 'react-native-amap3d'
import {
    StyleSheet,
    FlatList,
    Animated,
    View,
} from 'react-native';
import moment from 'moment';
import topBar from '@style/topBar.style';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
// const REQUEST_URL = "http://qixin.concher.cn/guoxin//logic/adaptor.do?json&IFCODE=getSignInRecord";
var ATOK = 'edc46d8ef8693de34fc161ff1550b8cf';
const REQUEST_URL = 'http://qixin.concher.cn/guoxin//entity/adaptor.do?json&IFCODE=app_noticeList&ATOK=' + ATOK;
var Dimensions = require('Dimensions');
var ScreenWidth = Dimensions.get('window').width;
var ScreenHeight = Dimensions.get('window').height;
var ScreenScale = Dimensions.get('window').scale;
var vm = ScreenWidth > ScreenHeight ? ScreenHeight : ScreenWidth;
var ITEM_HEIGHT = 50;
var RedPointWidth = ITEM_HEIGHT / 2;
var textPadding = 20;
let now = new Date();
let SHOWINGDATE = moment(now).format("YYYY年MM月");
//签到Btn宽和高
singInBtnWidth = ScreenWidth / 4;

export default class singInRecordView extends Component {
    static navigationOptions = ({
        navigation,
        screenProps
    }) => {
        // let dateStr = navigation.state.params.chosedDate;
        const { params } = navigation.state;

        return ({
            headerTitle:
                <View style={topBar.title}>
                    <Text style={topBar.title_text}>{moment(params.info.signTime).format("YYYY年MM月") + '签到记录'}</Text>
                </View>,
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
            gesturesEnabled: true
        });
    };

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
        var dataModel = this.props.navigation.state.params.info;

        this.props.navigation.setParams({


        });
    }

    render() {
        var dataModel = this.props.navigation.state.params.info;
        var la = parseFloat(dataModel.signLat);
        var lo = parseFloat(dataModel.signLng);
        var time = dataModel.signTime;
        var location = dataModel.attendAddress;
        return (

            <MapView
                style={StyleSheet.absoluteFill}
                zoomLevel={16}
                showsCompass={false}
                coordinate={{
                    latitude: la ? la : 40.03640543619792,
                    longitude: lo ? lo : 116.30731499565972,
                }}
            >
                <Marker
                    active
                    title={time}
                    image='flag'
                    description={location}
                    coordinate={{
                        latitude: la ? la : 40.03640543619792,
                        longitude: lo ? lo : 116.30731499565972,
                        // latitude:40.042484,
                        // longitude:116.313837,
                    }}
                />

            </MapView>
        );
    }
    singInBtnClick() {
        // 点击了签到按钮,
        alert('点击签到按钮');
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'blue',
    },
    txt: {
        textAlign: 'left',
        paddingLeft: 13,
        // textAlignVertical: 'center',
        marginTop: 5,
        color: 'black',
        fontSize: 17,
    },

    txtContent: {
        textAlign: 'left',
        paddingLeft: 13,
        // textAlignVertical: 'center',
        marginTop: 5,
        color: '#595757',
        fontSize: 13,

    },

    rightArrow: {
        // paddingRight:10,
        marginTop: ITEM_HEIGHT / 4,
        marginLeft: 0,
        // marginRight:20,
        height: ITEM_HEIGHT / 2,
        width: 7,
    },
});