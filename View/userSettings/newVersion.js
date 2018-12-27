import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    Image,
    TouchableOpacity, // 不透明触摸 
} from 'react-native';
import topBar from '@style/topBar.style';
import config from '@const/config';
var Dimensions = require('Dimensions');
var currentWidth = Dimensions.get('window').width;
var currentHeight = Dimensions.get('window').height;
var ds = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 != row2,
});
var vm = currentWidth > currentHeight ? currentHeight : currentWidth;

var dataArray = ["page one", "page two", "page three", "page four", "page five", "page six", "page seven", "page eight", "page nine", "page ten", "page eleven", "page twelve"];

export default class NewVersion extends Component {
    constructor(props) {
        super(props);
        this.toPage = this.toPage.bind(this);

        this.state = {
            dataArray2: [],
            dataSource1: ds.cloneWithRows([]),
            dataSource2: ds.cloneWithRows([]),
            index: 0,
            height: currentHeight * .06,
            // isReading: false
        };

    }
    static navigationOptions = ({
        navigation,
        screenProps
    }) => {
        return ({
            headerTitle: '公告',
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

    componentDidMount() {
        var colorArr = ["0066FF", "CC00FF", "FFA07A", "A52A2A", "FF4500", "556B2F", "8B008B"];
        this.setState({
            dataArray2: [{
                value: '1',
                height: currentHeight * .07,
                backgroundColor: '#0066FF'
            }, {
                value: '2',
                backgroundColor: '#' + colorArr[Math.floor(Math.random() * colorArr.length)],
            }, {
                value: '3',
                backgroundColor: '#' + colorArr[Math.floor(Math.random() * colorArr.length)],
            }, {
                value: '4',
                backgroundColor: '#' + colorArr[Math.floor(Math.random() * colorArr.length)],
            }, {
                value: '5',
                backgroundColor: '#' + colorArr[Math.floor(Math.random() * colorArr.length)],
            }, {
                value: '6',
                backgroundColor: '#' + colorArr[Math.floor(Math.random() * colorArr.length)],
            }, {
                value: '7',
                backgroundColor: '#' + colorArr[Math.floor(Math.random() * colorArr.length)],
            }, {
                value: '8',
                backgroundColor: '#' + colorArr[Math.floor(Math.random() * colorArr.length)],
            }, {
                value: '9',
                backgroundColor: '#' + colorArr[Math.floor(Math.random() * colorArr.length)],
            }, {
                value: '10',
                backgroundColor: '#' + colorArr[Math.floor(Math.random() * colorArr.length)],
            }, {
                value: '11',
                backgroundColor: '#' + colorArr[Math.floor(Math.random() * colorArr.length)],
            }, {
                value: '12',
                backgroundColor: '#' + colorArr[Math.floor(Math.random() * colorArr.length)],
            }]
        }, () => {
            this.setState({
                dataSource1: ds.cloneWithRows(dataArray),
                dataSource2: ds.cloneWithRows(this.state.dataArray2),
            })
        });
    }
    //公告详情页面
    toPage(rowData) {
        const {
            navigate
        } = this.props.navigation;
        navigate('NoticeDetails');
        // this.setState({
        //   isReading: true
        // })
    }
    render() {
        return (
            <View style={styles.page}>
                <View style={styles.container}>
                    <ListView
                        ref="listView1"
                        dataSource={this.state.dataSource1}
                        renderRow={this._renderRow.bind(this)}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        pagingEnabled={true}
                        scrollEventThrottle={200}
                        onScrollEndDrag={(event) => {
                            this._scroll(event);
                        }}
                    >
                    </ListView>
                </View>
                <View style={styles.container1}>
                    <ListView
                        ref="listView2"
                        dataSource={this.state.dataSource2}
                        renderRow={this._renderRow2.bind(this)}
                        horizontal={true}
                        scrollEnabled={false}
                        showsHorizontalScrollIndicator={false}
                        pagingEnabled={true}
                        onScroll={(event) => {
                            this._scroll2(event);
                        }}
                    >
                    </ListView>
                </View>
            </View>
        );
    }

    _renderRow(rowData, sectionId, rowId) {
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => { this.toPage(rowData) }}>
                <View style={styles.cellStyle} >
                    <Text style={styles.textStyle} >
                        {rowData}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
    _renderRow2(rowData, sectionId, rowId) {
        return (
            <View style={[styles.cellStyle1, {
                height: rowData.height ? rowData.height : currentHeight * .06,
                marginTop: rowData.height ? 0 : currentHeight * .01,
                backgroundColor: rowData.backgroundColor ? rowData.backgroundColor : 'red'
            }]}>
                <Text style={styles.textStyle1}>
                    {rowData.value}
                </Text>
            </View>
        );
    }
    _scroll(event) {
        var scrollView = event.nativeEvent;
        var x = +(scrollView.targetContentOffset.x / (currentWidth * .9)).toFixed(0);
        //动画效果
        // LayoutAnimation.configureNext({
        //   duration: 300, //持续时间
        //   create: { // 视图创建
        //     type: LayoutAnimation.Types.spring,
        //     property: LayoutAnimation.Properties.scaleXY,// opacity、scaleXY
        //   },
        //   update: { // 视图更新
        //     type: LayoutAnimation.Types.spring,
        //   },
        // });
        this.setState({
            index: x,
        }, () => {
            this.refs.listView2.scrollTo({ animated: true, x: this.state.index < 4 ? 0 : (this.state.index - 3) * currentWidth * .1225, y: 0 })

        });
        this.state.dataArray2.map((item, index) => {
            index == x ? (item.height = currentHeight * .07) : (item.height = null);
        });
        this.setState({
            dataSource2: ds.cloneWithRows(this.state.dataArray2),
        });
    }
    _scroll2(event) {
        var scrollView = event.nativeEvent;
        var x = scrollView.contentOffset.x;
        console.log(x);
        // DeviceEventEmitter.emit('bottom');//发监听
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        width: currentWidth,
        height: currentHeight,
    },
    container: {
        marginLeft: currentWidth * .05,
        marginRight: currentWidth * .05,
        marginTop: currentHeight * .02,
        marginBottom: currentHeight * .1,
        backgroundColor: 'grey',
    },
    cellStyle: {
        width: currentWidth * .9,
        height: currentHeight * .7,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textStyle: {
        fontSize: 25,
        color: 'white',
    },
    container1: {
        marginLeft: currentWidth * .01,
        marginRight: currentWidth * .01,
        marginTop: currentHeight * .03,
        marginBottom: currentHeight * .01,
        backgroundColor: 'white',
    },
    cellStyle1: {
        width: currentWidth * .1225,
        justifyContent: 'center',
        borderRadius: 12,
        alignItems: 'center',
        //随机色
        //backgroundColor: '#' + Math.floor(Math.random() * 0xffffff).toString(16),
        borderRightWidth: 1,
        borderRightColor: 'white',
    },
    textStyle1: {
        fontSize: 25,
        color: 'white',
    },
});