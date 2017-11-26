Object.defineProperty(Array.prototype, 'end', {
    value: function() {
        return this[this.length - 1];
    }
});

Object.defineProperty(Object.prototype, 'end', {
    value: function() {
        return Object.values(this).end();
    }
});
