import {
    AppRegistry
} from 'react-native';
import {
    createAppContainer,
    createStackNavigator
} from 'react-navigation';
// import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import CodePush from 'react-native-code-push';
import LoginView from '@view/login/login';
import ForgetPassword from '@view/login/forgetPassword';
import Stack from '@view/stack';
import Home from '@view/home';
let codePushOptions = {
    checkFrequency: CodePush.CheckFrequency.ON_APP_MANUAL,
    installMode: CodePush.InstallMode.IMMEDIATE
};

const MyApp = createStackNavigator({
    LoginView: {
        screen: LoginView
    },
    Stack: {
        screen: Stack
    },
    ForgetPassword: {
        screen: ForgetPassword
    },
    Dev: {
        screen: Home
    }
}, {
        initialRouteName: 'LoginView',
        initialRouteParams: {
            isAttendanceGroupManager: false
        },
        navigationOptions: {
            cardStack: {
                gesturesEnabled: true
            },
        },
        headerStyle: {
            elevation: 0,
            shadowOpacity: 0
        }
    });

App = CodePush(codePushOptions)(createAppContainer(MyApp));
AppRegistry.registerComponent('MyApp', () => App);