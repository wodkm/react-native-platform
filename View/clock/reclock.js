import React, { Component } from 'react';
import {
    Text,
    TextInput,
    Image,
    View,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import topBar from '@style/topBar.style';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import ImagePicker from 'react-native-image-picker';
import styleSheet from '@style/reclock.style';
import config from '@const/config';
import LinearGradient from 'react-native-linear-gradient';
var Dimensions = require('Dimensions');
var currentWidth = Dimensions.get('window').width;
var currentHeight = Dimensions.get('window').height;
var vm = currentWidth > currentHeight ? currentHeight : currentWidth;

export default class Reclock extends Component {
    constructor(props) {
        super(props);

        this.state = {
            time: moment(new Date()).format("HH:mm:ss"),
            isDateTimePickerVisible: false,
            attendMemo: '',
            canClick: true,
            linear: ['#3de2ff', '#3497fc'],
        };
        this.showDateTimePicker = this.showDateTimePicker.bind(this);
        this.hideDateTimePicker = this.hideDateTimePicker.bind(this);
        this.handleDatePicked = this.handleDatePicked.bind(this);
        this.chooseImg = this.chooseImg.bind(this);
        this.correct = this.correct.bind(this);
    }

    componentDidMount() {
        this.props.navigation.setParams({ navigatePress: this.clickFinishButton })
    }

    static navigationOptions = ({ navigation, screenProps }) => {
        return ({
            headerTitle:
                <View style={topBar.title}>
                    <Text style={topBar.title_text}>补卡申请</Text>
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
    }

    showDateTimePicker() {
        this.setState({
            isDateTimePickerVisible: true
        });
    }

    hideDateTimePicker() {
        this.setState({
            isDateTimePickerVisible: false
        });
    }

    handleDatePicked(date) {
        this.hideDateTimePicker();
        var DateFormat = moment(date).format("HH:mm:ss");
        this.setState({
            time: DateFormat
        });
    }

    chooseImg() {
        var photoOptions = {
            //底部弹出框选项
            title: '请选择',
            cancelButtonTitle: '取消',
            takePhotoButtonTitle: '拍照',
            chooseFromLibraryButtonTitle: '选择相册',
            quality: 0.75,
            allowsEditing: true,
            noData: false,
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        }
        ImagePicker.showImagePicker(photoOptions, (response) => {
            console.log('response' + response);
            if (response.didCancel) {
                return
            }
        });
    }

    correct() {
        this.setState({
            canClick: false
        });
        if (this.state.attendMemo == '') {
            this.setState({
                canClick: true
            }, () => {
                Alert.alert('温馨提示', '补卡原因不能为空');
            });
        } else {
            const { params } = this.props.navigation.state;
            let todayClazzTime = params.todayClazzTime;
            let reclockDate = params.reclockDate;
            if (!todayClazzTime) {
                reclockDate = new Date(reclockDate.getTime() - 1000 * 60 * 60 * 24);
            }
            fetch(params.appPath + '/clock/correct', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: 'employeeNo=' + params.USERID +
                    '&groupId=' + params.groupId +
                    '&tenantId=' + params.tenantId +
                    '&groupName=' + params.groupName +
                    '&clazzId=' + params.clazzId +
                    '&attendType=' + params.attendType +
                    '&clazzTimeId=' + params.clazzTimeId +
                    '&workDate=' + moment(params.reclockDate).format('YYYY-MM-DD 00:00:00') +
                    '&workDateTime=' + moment(params.reclockDate).format('YYYY-MM-DD') + ' ' + this.state.time +
                    '&userName=' + params.userName +
                    '&attendMemo=' + this.state.attendMemo +
                    '&mustTime=' + params.mustTime +
                    '&isHoliday=' + params.isHoliday +
                    '&clazzTimeSortId=' + params.clazzTimeSortId +
                    '&deptId=' + params.deptId
            }).then(resp => {
                if (resp.ok) return resp.json();
                if (resp.status == '404') throw new Error('Page not found:' + resp.url);
                if (resp.status == '500') throw new Error(resp.status + ' ' + resp.url);
            }).then((data) => {
                if (data.success) {
                    this.props.navigation.state.params.onGoBack();
                    this.props.navigation.goBack();
                    const { navigate } = this.props.navigation;
                    // navigate('Clock', {
                    //     USERID:params.USERID,
                    //     tenantId:params.tenantId,
                    // });
                } else {
                    this.setState({
                        canClick: true
                    }, () => {
                        Alert.alert('温馨提示', data.error);
                    });
                }
            }).catch((error) => {
                this.setState({
                    canClick: true
                }, () => {
                    Alert.alert('温馨提示', '补卡失败');
                });
            });
        }
    }

    render() {
        const { params } = this.props.navigation.state;
        return (
            <View style={styleSheet.reclock}>

                <View style={styleSheet.reclockScheduling}>
                    <Text style={styleSheet.reclockScheduling_text1}>
                        补卡日期 {moment(params.reclockDate).format('YYYY-MM-DD')},打卡时间 {params.ruleTime}
                    </Text>
                </View>
                <View style={styleSheet.reclockSchedulingTime}>
                    <Text style={styleSheet.reclockSchedulingTime_text1}>
                        补卡时间点
                    </Text>
                    <TouchableOpacity
                        style={styleSheet.reclockSchedulingTime_choose}
                        onPress={this.state.canClick ? this.showDateTimePicker : null}
                    >
                        <Text style={styleSheet.reclockSchedulingTime_text2}>
                            {this.state.time} >
                        </Text>
                    </TouchableOpacity>
                    <DateTimePicker
                        mode={'time'}
                        isVisible={this.state.isDateTimePickerVisible}
                        onConfirm={this.handleDatePicked}
                        onCancel={this.hideDateTimePicker}
                        cancelTextIOS={'取消'}
                        confirmTextIOS={'确定'}
                    />
                </View>
                <View style={styleSheet.reclockReason}>
                    <View style={styleSheet.reclockReason_textBox}>
                        <Text style={styleSheet.reclockReason_text_icon}>*</Text>
                        <Text style={styleSheet.reclockReason_text}>
                            缺卡原因
                        </Text>
                    </View>
                    <TextInput
                        placeholder="请输入"
                        style={styleSheet.reclockReason_input}
                        underlineColorAndroid="transparent"
                        maxLength={100}
                        multiline={true}
                        onChangeText={(text) => this.setState({
                            attendMemo: text
                        })}
                    />
                </View>
                <TouchableOpacity onPress={this.correct}>
                    <LinearGradient
                        colors={this.state.linear}
                        style={styleSheet.commitButton}
                        start={{ x: 0, y: 0 }}
                        start={{ x: 1, y: 0 }}
                    >
                        <Text style={styleSheet.commitButton_text}>提  交</Text>
                    </LinearGradient>
                </TouchableOpacity>
                {
                    // <TouchableOpacity onPress={this.chooseImg}>
                    //     <Text style={styleSheet.reclockReason_text}>
                    //         图片
                    //     </Text>
                    // </TouchableOpacity>
                }
                {
                    this.state.canClick ? null : (
                        <ActivityIndicator
                            animating={!this.state.canClick}
                            style={[
                                styleSheet.loading
                            ]}
                            color={'yellowgreen'}
                            size="large"
                        />
                    )
                }
            </View>
        );
    }
}