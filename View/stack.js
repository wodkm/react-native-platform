import React, {
    Component
} from 'react';
import {
    Image,
} from 'react-native';
import {
    TabBarBottom,
    createBottomTabNavigator,
    createAppContainer,
    createStackNavigator,
} from 'react-navigation';
// import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import Work from '@view/work';
import UserSettings from '@view/userSettings/userSettings';
import SettingDetails from '@view/userSettings/settingDetails';
import ThemePackage from '@view/userSettings/themePackage';
import Feedback from '@view/feedback';
import About from '@view/userSettings/about';
import config from '@const/config';
import PhoneNum from '@view/userSettings/phoneNum';
import PassManager from '@view/userSettings/passManager';
import GesturePass from '@view/userSettings/gesturePass';
import FingerPrint from '@view/userSettings/fingerPrint';
import FingerSettings from '@view/userSettings/fingerSettings';
import GestureSettings from '@view/userSettings/gestureSettings';
import CloseGestureSettings from '@view/closeGestureSettings';
import Clock from '@view/clock/clock';
import Count from '@view/clock/count';
import Settings from '@view/clock/settings';
import Reclock from '@view/clock/reclock';
import LoginView from '@view/login/login';
import WebView from '@view/webView';
import PhoneNumStatus from '@view/userSettings/phoneNumStatus';
import NewVersion from '@view/userSettings/newVersion';
import NoticeDetails from '@view/notice/noticeDetails';
//flc改动
import FLCSingInView from '@view/signIn/signIn';
import SingInDetailView from '@view/signIn/singInDetailModel';
import singInRecordView from '@view/signIn/singInRecordView';
import NoticesList from '@view/notice/Notices';
import NoticeDetail from '@view/notice/NoticeDetail';
import Attachment from '@view/Attach';
//flc改动e
//首页
import Home from '@view/home';
var Dimensions = require('Dimensions');
var currentWidth = Dimensions.get('window').width;
var currentHeight = Dimensions.get('window').height;
var vm = currentWidth > currentHeight ? currentHeight : currentWidth;

export default class Stack extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chosenTab: 'work',
            Tab: createBottomTabNavigator({
                '-1': {
                    screen: Work,
                    navigationOptions: {
                        title: '工作',
                        tabBarIcon: ({
                            tintColor,
                            focused
                        }) => (
                                <Image resizeMode='contain'
                                    source={focused ? require('@image/tab/work_on.png') : require('@image/tab/work_off.png')}
                                    style={{ width: 24, height: 24 }}
                                />
                            ),
                    }
                }
            }, {
                    tabBarPosition: 'bottom',
                    animationEnabled: false,
                    tabBarComponent: TabBarBottom,
                    tabBarOptions: {
                        activeTintColor: config.topicColor,
                        inactiveTintColor: '#cdcdcd',
                        style: {
                            backgroundColor: '#ffffff',
                            height: currentHeight * .1,
                        },
                        labelStyle: {
                            fontSize: 12, // 文字大小  
                        },
                    }
                }),
        }

        this.initTab = this.initTab.bind(this);
    }

    initTab() {
        let Tab = createBottomTabNavigator(this.state.tabs, {
            tabBarPosition: 'bottom',
            animationEnabled: false,
            tabBarOptions: {
                activeTintColor: config.topicColor,
                inactiveTintColor: '#cdcdcd',
                style: {
                    backgroundColor: '#ffffff',
                    height: currentHeight * .1,
                },
                labelStyle: {
                    fontSize: 12, // 文字大小  
                },
            },
        });

        this.setState({
            Tab: Tab
        });
    }

    componentDidMount() {
        const {
            params
        } = this.props.navigation.state;

        this.setState({
            tabs: params.tabs
        }, () => {
            this.initTab();
        });
    }

    static navigationOptions = ({
        navigation,
        screenProps
    }) => {
        return ({
            header: null,
            gesturesEnabled: false,
        });
    }

    render() {
        let Tab = createAppContainer(this.state.Tab);
        class Tabs extends React.Component {
            constructor(props) {
                super(props);
            }

            static navigationOptions = ({
                navigation,
                screenProps
            }) => {
                return ({
                    header: null,
                    gesturesEnabled: false,
                });
            }

            render() {
                return <Tab />;
            }
        }

        let Stack = createAppContainer(createStackNavigator({
            clock: {
                screen: Clock
            },
            Count: {
                screen: Count
            },
            settings: {
                screen: Settings
            },
            reclock: {
                screen: Reclock
            },
            work: {
                screen: Work
            },
            Tab: {
                screen: Tabs
            },
            userSettings: {
                screen: UserSettings
            },
            SettingDetails: {
                screen: SettingDetails
            },
            ThemePackage: {
                screen: ThemePackage
            },
            Feedback: {
                screen: Feedback
            },
            About: {
                screen: About
            },
            PhoneNum: {
                screen: PhoneNum
            },
            PassManager: {
                screen: PassManager
            },
            GesturePass: {
                screen: GesturePass
            },
            GestureSettings: {
                screen: GestureSettings
            },
            CloseGestureSettings: {
                screen: CloseGestureSettings
            },
            FingerPrint: {
                screen: FingerPrint
            },
            FingerSettings: {
                screen: FingerSettings
            },
            LoginView: {
                screen: LoginView
            },
            webView: {
                screen: WebView
            },
            PhoneNumStatus: {
                screen: PhoneNumStatus
            },
            NewVersion: {
                screen: NewVersion
            },
            NoticeDetails: {
                screen: NoticeDetails
            },
            SignIn: {
                screen: FLCSingInView
            },
            SingInDetail: { screen: SingInDetailView },
            SingInRecordView: { screen: singInRecordView },
            Notices: { screen: NoticesList, },
            NoticeDetail: { screen: NoticeDetail, },
            Attach: { screen: Attachment, },
            Home: { screen: Home },
        }, {
                initialRouteName: 'Tab',
                initialRouteParams: {
                    isAttendanceGroupManager: false
                },
                navigationOptions: {
                    header: null,
                }
            }));
        return (
            <Stack screenProps={{ toLogin: this.props.navigation.popToTop }}></Stack>
        );
    }
}