export default config = {
	tenantId: 'sxyy',
	appPath: 'http://supervise.eastweb.com.cn/appengine',
	// appPath: 'http://www.east-web.com/appengine',
	appContent: '/appengine',
	// appContent: '',
	// pcloudPath: 'http://www.east-web.com/pcloud',
	pcloudPath: 'http://supervise.eastweb.com.cn/pcloud',
	topicColor: '#2c94ff',
	attendState: {
		'正常': '#55c57f',
		'迟到': "#ff7a00",
		'早退': "#ff7a00",
		'旷工': "#c320e6",
		'外勤': "#55c57f",
		'补卡': "#ff7a00",
		'未打卡': '#bebebe',
		'缺卡': '#c320e6'
	},
	theme: {
		default: {
			backgroundcolor: '#2c94ff'
		},
		blue: {
			backgroundcolor: '#1296db'
		}
	},
	amapKey: [
		'd938b4efd9ec5aef7307b562a521634f',
		'bd6c11e18698c8183ab38f162a386d9f',
		'2c0c3c9ea9554fcc9aeb5ca131cf02b0',
		'a3cc0d2015b1c2352f7e47084d75b292',
		'bdbd8afc181842e929b956f9e174948f',
		'c0cbd59b32093ef91edba0813d379d3c',
		'a37b3208190960ec051fc4b03d5e49ff',
		'3b637d766347f025792fe42b6e7b4697',
		'2472b6d98758f710c9de0f665dcccda5',
	],
	AESKEY: '553246736447566B583139316A52714B',
	respCallback: resp => {
		if (resp.ok) return resp.json();
		if (resp.status == '404') throw new Error('Page not found:' + resp.url);
		if (resp.status == '500') throw new Error(resp.status + ' ' + resp.url);
	},

}