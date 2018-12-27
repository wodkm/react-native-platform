import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Button,
    TouchableOpacity, // 不透明触摸 
    TextInput,
} from 'react-native';
import topBar from '@style/topBar.style';
import config from '@const/config';
import Toast from '@component/toast';
var Dimensions = require('Dimensions');
var currentWidth = Dimensions.get('window').width;
var currentHeight = Dimensions.get('window').height;
var vm = currentWidth > currentHeight ? currentHeight : currentWidth;

export default class Feedback extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.commit = this.commit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        this.props.navigation.setParams({
            disabled: true,
            commit: this.commit
        });

    }

    //提交反馈
    commit() {
        //Alert.alert('提交成功');
        setTimeout(() => {
            this.refs.toast.show("提交成功", {
                position: 'center',
                backgroundColor: '#F2F2F2',
                fontSize: 15,
                color: '#494848',
                duration: 800,
                waitting: 500
            });
        }, 1000);
        setTimeout(() => {
            this.props.navigation.goBack();
        }, 1500);
    }
    //文本内容发生改变
    onChange(value) {

        if (value.match(/^[ ]+$/)) {
            //alert("有空格");
            this.props.navigation.setParams({
                disabled: true
            })
        } else if (value.match(/^[ ]*$/)) {
            //alert("有空格或者字符串为空");
            this.props.navigation.setParams({
                disabled: true
            })
        } else {
            this.props.navigation.setParams({
                disabled: false
            });
        }
    }

    static navigationOptions = ({
        navigation,
        screenProps
    }) => {
        let disabled = navigation.state.params ? navigation.state.params.disabled : true;
        return ({
            headerTitle: '意见反馈',
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
            headerRight: (
                <View style={{ marginRight: 5 }}>
                    <Button title="提交" color="#FBF8FD" disabled={disabled} onPress={() => { navigation.state.params.commit(); }} />
                </View>
            ),
            gesturesEnabled: true
        });
    }
    render() {
        return (
            <View>
                <TextInput
                    style={styles.edit}
                    multiline={true}
                    placeholder="为快速定位问题,请将您发生问题的操作步骤和现象简单的描述给我们,点击这里开始输入..."
                    placeholderTextColor="#c4c4c4"
                    underlineColorAndroid={'transparent'}
                    onChangeText={this.onChange}
                />
                <Toast ref="toast"></Toast>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    edit: {
        height: currentHeight,
        fontSize: 15,
        backgroundColor: '#fff',
        paddingLeft: currentWidth * .05,
        paddingRight: currentWidth * .05,
    },
});