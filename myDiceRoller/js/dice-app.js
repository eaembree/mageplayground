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

        lockBotchAndTensButtons: false,
        botch: 'm20',
        botchText: '',
        tens: 'regular',
        tensText: '',

        diceRoller: new DiceRoller(),

        appStates: {
            single: 'single',
            extended: 'extended'
        },

        appSettings: {
            botchAndTensCanChangeOutsideSettings: true
        },

        appState: 'single'
    },
    created: function(){
        this.updateBotchText();
        this.updateTensText();
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
        lockBotchAndTens: function(shouldLock){
            this.lockBotchAndTensButtons = shouldLock;
        },
        botchModal: function(cmd){
            $('#botch-picker').modal(cmd);
        },
        setBotch: function (newBotch){
            this.botch = newBotch;
            this.updateBotchText();
            this.botchModal('hide');

            this.diceRoller.setBotch(newBotch);
        },
        updateBotchText: function(){
            for(let i = 0; i < this.botchOptions.length; i++) {
                if(this.botch === this.botchOptions[i].value){
                    this.botchText = this.botchOptions[i].display;
                    return;
                }
            }

            this.botchText = 'BAD BOTCH TYPE';
        },
        tensModal: function(cmd){
            $('#tens-picker').modal(cmd);
        },
        setTens: function (newTens){
            this.tens = newTens;
            this.updateTensText();
            this.tensModal('hide');

            this.diceRoller.setTens(newTens);
        },
        updateTensText: function(){
            for(let i = 0; i < this.tensOptions.length; i++) {
                if(this.tens === this.tensOptions[i].value){
                    this.tensText = this.tensOptions[i].display;
                    return;
                }
            }

            this.tensText = 'BAD TENS TYPE';
        },
        settings: function(){
            $('#settings-modal').modal('show');
        },
        goToSingleState: function(){
            this.appState = this.appStates.single;
        },
        goToExtendedState: function(){
            this.appState = this.appStates.extended;
        },
        setAppSettings(settingName, newValue){
            if(settingName === 'botchAndTensCanChangeOutsideSettings') {
                if(newValue === true){
                    this.appSettings.botchAndTensCanChangeOutsideSettings = true;
                } else if(newValue === false){
                    this.appSettings.botchAndTensCanChangeOutsideSettings = false;
                }
            }
        }
    }
});
