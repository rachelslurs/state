var shorthandExpression = state({
    greet: function () { return "Hello."; },

    Formal: {
        enter: function () { this.owner().wearTux(); },
        greet: function () { return "How do you do?"; }
    },
    Casual: {
        enter: function () { this.owner().wearJeans(); },
        greet: function () { return "Hi!"; }
    }
});
// >>> StateExpression