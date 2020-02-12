/*
Must include dice-roller.js then and single-action-component.js and extended-action-component.js before this file.
*/

let app = null
app = new Vue({
    el: '#app',
    data: {
        botchOptions: [
            { value: 'original', display: 'Original' },
            { value: 'm20', display: 'Rev/M20' },
            { value: 'none', display: 'None' }
        ],
        tensOptions: [
            { value: 'regular', display: 'Regular 10s' },
            { value: 'reroll', display: 'Reroll 10s' },
            { value: 'double', display: '10s Double' }
        ],
        difficultyMin: 2,
        difficultyMax: 10,
        thresholdMin: 0,
        thresholdMax: 6,
        
        botch: 'original',
        tens: 'regular',

        diceRoller: new DiceRoller(),

        appStates: {
            single: 'single',
            extended: 'extended'
        },

        appState: 'single'
    },
    methods: {
        clamp: function(theValue, min, max){
            if(theValue < min){
                return min;
            } else if(theValue > max){
                return max;
            }

            return theValue;
        },
        botchModal: function(cmd){
            $('#botch-picker').modal(cmd);
        },
        setBotch: function (newBotch){
            this.botch = newBotch
            this.botchModal('hide');

            this.diceRoller.setBotch(newBotch);
        },
        tensModal: function(cmd){
            $('#tens-picker').modal(cmd);
        },
        setTens: function (newTens){
            this.tens = newTens
            this.tensModal('hide');

            this.diceRoller.setTens(newTens);
        },
        settings: function(){
            $('#settings-modal').modal('show');
        },
        toggleAppState: function(){
            if(this.appState === this.appStates.single){
                this.goToExtendedState();
            } else {
                this.goToSingleState();
            }
        },
        goToSingleState: function(){
            this.appState = this.appStates.single;
        },
        goToExtendedState: function(){
            this.appState = this.appStates.extended;
        }
    }
});
