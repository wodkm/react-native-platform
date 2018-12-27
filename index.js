import {
    AppRegistry
} from 'react-native';
import {
    StackNavigator,
} from 'react-navigation';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import CodePush from 'react-native-code-push';
import LoginView from '@view/login/login';
import ForgetPassword from '@view/login/forgetPassword';
import Stack from '@view/stack';
import Dev from '@view/vibrate';

let codePushOptions = {
    checkFrequency: CodePush.CheckFrequency.ON_APP_MANUAL,
    installMode: CodePush.InstallMode.IMMEDIATE
};

const MyApp = StackNavigator({
    LoginView: {
        screen: LoginView
    },
    Stack: {
        screen: Stack
    },
    ForgetPassword: { screen: ForgetPassword },
    Dev: { screen: Dev },
}, {
        initialRouteName: 'LoginView',
        initialRouteParams: {
            isAttendanceGroupManager: false
        },
        transitionConfig: () => ({
            screenInterpolator: CardStackStyleInterpolator.forHorizontal,
        }),
        navigationOptions: {
            cardStack: {
                gesturesEnabled: true
            }
        },
        headerStyle: {
            elevation: 0,
            shadowOpacity: 0
        }
    }
);

App = CodePush(codePushOptions)(MyApp);
AppRegistry.registerComponent('MyApp', () => App);