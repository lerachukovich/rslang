const Storage = {
    team: 'team44',
    getToday: function() {
        return new Date().toJSON().slice(0,10).replace(/-/g,'/');
    },
    setStorage: function(name, value) {
        localStorage.setItem(`${this.team}-${this.getToday()}-${name}`, JSON.stringify(value))
    },
    getStorage: function(name) {
        return JSON.parse(localStorage.getItem(`${this.team}-${this.getToday()}-${name}`)) || [];
    }
}

export default Storage;
