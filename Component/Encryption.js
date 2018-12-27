import config from '../Const/config';
let forge = require('node-forge');

export default encrypt = {
    encrypt: (authKey, method, url) => {
        let md = forge.md.md5.create();
        let time = new Date(new Date().getTime() - 1 * 60 * 1000);
        md.update(authKey + method + new Date(time.toUTCString()).getTime() + config.appContent + url + "APPENGINE");
        let authorization = md.digest().toHex();
        return {
            authorization: authorization,
            time: time
        }
    },
    encryptPwdByMD5: (pwd) => {
        let md = forge.md.md5.create();
        md.update(pwd);
        return md.digest().toHex();
    }
}