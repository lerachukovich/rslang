const Storage = {
    team: 'team44',
    getToday: function() {
        return new Date().toJSON().slice(0,10).replace(/-/g,'/');
    },
    setStorage: function(name, value) {
        localStorage.setItem(`${this.team}-${this.getToday()}-${name}`, JSON.stringify(value))
    },
    getStorage: function(name, def = []) {
        return JSON.parse(localStorage.getItem(`${this.team}-${this.getToday()}-${name}`)) || def;
    },
    unique: function(arr, obj) {
        for (let i of arr) {
            if (i.word === obj.word) return arr;
        }
        return [...arr, obj];
    },
    setSettingStorage(obj) {
        this.setStorage('statistic', this.unique(this.getStorage('statistic'), obj));
    }
}

export default Storage;
