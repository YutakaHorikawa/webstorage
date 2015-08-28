export default class WebStorage {
    constructor(type='local', prefix = '') {
        this._prefix = prefix;
        if  (type === 'local') {
            this._storage = localStorage; 
        } else if (type === 'session') {
            this._storage = sessionStorage; 
        } else {
            this._storage = null; 
        }
    }

    _getExpire(expire) {
        return ~~(new Date/1000) + expire;
    }

    _checkExpire(expire) {
        return ~~(new Date/1000) < expire;
    }

    _getKey(key) {
        return (this._prefix) ? this._prefix + key : key;
    }

    setItem(key, value, expire = '') {

        if (!value || !key) return false;

        if (expire && typeof expire !== "number") expire = '';

        // 保存期間を取得
        if (expire) expire = this._getExpire(expire);

        var saveData = {value: value, expire: expire};
        // オブジェクトの場合はJsonに変換
        saveData = JSON.stringify(saveData);
        // expireと一緒に保存
        this._storage.setItem(this._getKey(key), saveData);
        return true;
    }

    getItem(key) {
        if (!key) return null;

        var data = this._storage.getItem(this._getKey(key));
        if (!data) return null;

        try {
            data = JSON.parse(data);
        } catch(e) {
            return null;
        }

        var value = data.value,
            expire = data.expire;

        // expireの設定が存在していたら、現時刻と比較する
        // 保存期間を過ぎている場合はnullを返す
        if (expire && !this._checkExpire(expire)) return null;

        // jsonの場合はobjectに変換
        // 良いやり方ないかな。。。
        try{
            value = JSON.parse(value);
            return value;
        } catch(e) {
            return value;
        }
    }

    removeItem(key) {
        if (!key) return false;

        this._storage.removeItem(this._getKey(key));
    }
}

