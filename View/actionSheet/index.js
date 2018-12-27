import { Platform } from 'react-native'
import _ActionSheetIOS from './ActionSheetIOS'
import _ActionSheetCustom from './ActionSheetCustom'

let ActionSheet;

if (Platform.OS === 'ios') {
	ActionSheet = _ActionSheetCustom
} else {
	ActionSheet = _ActionSheetCustom
}

export default ActionSheet
