import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Button,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import Line from '@component/line';
import Toast from '@component/toast';
import topBar from '@style/topBar.style';
import config from '@const/config';
var deafaultSelectImage = require('@image/deafaultSelect.png');
var selecetOnImage = require('@image/selectOn.png');
var Dimensions = require('Dimensions');
var currentWidth = Dimensions.get('window').width;
var currentHeight = Dimensions.get('window').height;
var vm = currentWidth > currentHeight ? currentHeight : currentWidth;

export default class PhoneNumStatus extends Component {
    constructor() {
        super();
        this.state = {
            source1: deafaultSelectImage,
            source2: deafaultSelectImage,
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({
            commit: this.commit
        });
        //默认选中公开
        this.setState({
            source1: selecetOnImage
        })
    }
    //提交按钮
    commit = () => {
        setTimeout(() => {
            this.refs.toast.show("保存成功", {
                position: 'center',
                backgroundColor: '#F2F2F2',
                fontSize: 15,
                color: '#494848',
                duration: 500,
                waitting: 500
            });
        }, 1000);

        setTimeout(() => {
            this.props.navigation.goBack();
        }, 1200);

    }
    static navigationOptions = ({
        navigation,
        screenProps
    }) => {
        return ({
            headerTitle: '隐私状态',
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
                <View>
                    <Button title="提交" color="#FBF8FD" onPress={() => { navigation.state.params.commit(); }} />
                </View>
            )
        });
    }
    selectCell1 = () => {
        this.setState({
            source1: selecetOnImage,
            source2: deafaultSelectImage,
        });
    }
    selectCell2 = () => {
        this.setState({
            source2: selecetOnImage,
            source1: deafaultSelectImage,
        });
    }
    render() {
        return (
            <ScrollView scrollEnabled={false} style={styles.container}>
                <View>
                    <TouchableOpacity onPress={this.selectCell1}>
                        <View style={[styles.item, { flexDirection: 'row' }]}>
                            <Image source={require('@image/public.png')} style={styles.icons} />
                            <Text style={[styles.font, { flex: 1 }]}>公开</Text>
                            <Image source={this.state.source1} style={styles.icons2} />
                        </View>
                    </TouchableOpacity>
                </View>
                <Line />
                <View>
                    <TouchableOpacity onPress={this.selectCell2}>
                        <View style={[styles.item, { flexDirection: 'row' }]}>
                            <Image source={require('@image/onlyOne.png')} style={styles.icons} />
                            <Text style={[styles.font, { flex: 1 }]}>仅自己</Text>
                            <Image source={this.state.source2} style={styles.icons2} />
                        </View>
                    </TouchableOpacity>
                </View>
                <Toast ref="toast"></Toast>
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
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
        marginLeft: 5,
        marginRight: 10,
    },
    icons: {
        width: currentHeight * .06 * .4,
        height: currentHeight * .06 * .4,
        marginLeft: currentWidth * .03
    },
    icons2: {
        width: currentHeight * .06 * .4,
        height: currentHeight * .06 * .4,
        marginRight: currentWidth * .03
    }
});