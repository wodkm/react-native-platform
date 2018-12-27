import React, { Component } from 'react';
import {
    StatusBar,
    Text,
    View,
    ScrollView,
    Image,
    TouchableOpacity, // 不透明触摸
} from 'react-native';
import topBar from '@style/topBar.style';
import styleSheet from '@style/attendance.style';
import config from '@const/config';

export default class Work extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };

        this.toTask = this.toTask.bind(this);
        this.toMine = this.toMine.bind(this);
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
                    <Text style={topBar.title_text}>考勤</Text>
                </View>,
            gesturesEnabled: true,
            headerStyle: topBar.header,
            headerLeft: (
                <TouchableOpacity
                    onPress={() => { }}
                    style={topBar.left}
                    activeOpacity={1}
                >
                </TouchableOpacity>
            ),
            headerRight: <View />
        });
    }

    toTask() {
        const {
            navigate
        } = this.props.navigation;
        global.storage.load({
            key: 'userInfo',
            autoSync: false,
            syncInBackground: false,
        }).then(data => {
            navigate('webView', {
                resourceLinkUrl: `${config.pcloudPath}/leave/process`,
                resourceName: "考勤审批",
                username: data.username
            });
        }).catch(err => {
            console.warn(err.message);
        });
    }

    toMine() {
        const {
            navigate
        } = this.props.navigation;
        global.storage.load({
            key: 'userInfo',
            autoSync: false,
            syncInBackground: false,
        }).then(data => {
            navigate('webView', {
                resourceLinkUrl: `${config.pcloudPath}/leave/myLeaveList`,
                resourceName: "我的发起",
                username: data.username
            });
        }).catch(err => {
            console.warn(err.message);
        });
    }

    render() {
        return (
            <View>
                <StatusBar backgroundColor={"transparent"} translucent={true} />
                <ScrollView style={styleSheet.option} >
                    <View style={styleSheet.option_list}>
                        <TouchableOpacity
                            style={styleSheet.option_item}
                            onPress={this.toTask}
                        >
                            <Image
                                source={require('@image/home/clock_icon.png')}
                                style={styleSheet.option_item_icon}
                                resizeMode="contain"
                            />
                            <View style={styleSheet.option_text1}>
                                <Text style={styleSheet.option_name}>考勤审批</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styleSheet.option_item}
                            onPress={this.toMine}
                        >
                            <Image
                                source={require('@image/home/clock_icon.png')}
                                style={styleSheet.option_item_icon}
                                resizeMode="contain"
                            />
                            <View style={styleSheet.option_text2}>
                                <Text style={styleSheet.option_name}>我的发起</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        )
    }
}