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
        
        difficulty: 6,
        threshold: 0,
        botch: 'original',
        tens: 'regular',
        numDice: 3,
        lastResult: null,
        results: [],
        showHistory: false
    },
    methods: {
        rollDie: function(){
            return Math.floor(Math.random() * 10) + 1;
        },
        clampDifficulty: function(){
            if(this.difficulty < this.difficultyMin){
                this.difficulty = this.difficultyMin;
            } else if(this.difficulty > this.difficultyMax){
                this.difficulty = this.difficultyMax;
            }
        },
        clampThreshold: function(){
            if(this.threshold < this.thresholdMin){
                this.threshold = this.thresholdMin;
            } else if(this.threshold > this.thresholdMax){
                this.threshold = this.thresholdMax;
            }
        },
        clampNumDice: function(){
            if(this.numDice < 1){
                this.numDice = 1;
            }
        },
        changeDifficulty: function(amount){
            this.difficulty += amount;
            this.clampDifficulty();
        },
        changeThreshold: function(amount){
            this.threshold += amount;
            this.clampThreshold();
        },
        changeNumDice: function(amount){
            this.numDice += amount;
            this.clampNumDice();
        },
        botchModal: function(cmd){
            console.log('botch')
            $('#botch-picker').modal(cmd);
        },
        setBotch: function (newBotch){
            this.botch = newBotch
            this.botchModal('hide');
        },
        tensModal: function(cmd){
            console.log('tens')
            $('#tens-picker').modal(cmd);
        },
        setTens: function (newTens){
            this.tens = newTens
            this.tensModal('hide');
        },
        doubleTens: function(){
            return this.tens === 'double';
        },
        doRerollTens: function(){
            return this.tens === 'reroll';
        },
        allowBotch: function(){
            return this.botch !== 'none';
        },
        originalBotch: function(){
            return this.botch === 'original';
        },
        revM20Botch: function(){
            return this.botch === 'rev-m20';
        },
        emptyRollsDict: function(){
            return {
                1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
                6: 0, 7: 0, 8: 0, 9: 0, 10: 0
            }
        },
        mergeDiceDicts: function (first, second){
            let final = this.emptyRollsDict();
        
            for(let face = 1; face < 11; face++){
                final[face] = first[face] + second[face];
            }
        
            return final;
        },
        rollSingleOutcome: function(num){
            let dict = this.emptyRollsDict();
            for(let i = 0; i < num; i++){
                let outcome = this.rollDie();
                dict[outcome] = dict[outcome] + 1
            }
            return dict;
        },
        rollTotalOutcome: function(){
            let newRollDict = this.rollSingleOutcome(this.numDice);
            let totalRollDict = this.mergeDiceDicts(this.emptyRollsDict(), newRollDict);
        
            if(this.doRerollTens()){
                while(newRollDict[10] > 0){
                    newRollDict = this.rollSingleOutcome(newRollDict[10]);
                    totalRollDict = this.mergeDiceDicts(totalRollDict, newRollDict);
                }
            }
        
            return totalRollDict;
        },
        resultDictToArray: function(dict){
            let arr = [];
            for(let face = 10; face > 0; face--){
                for(let n = dict[face]; n > 0; n--){
                    arr.push(face);
                }
            }
            return arr;
        },
        getRollResult: function (){
            let rollOutcomes = this.rollTotalOutcome();
            let successes = 0;
            let ones = rollOutcomes[1];
        
            for(let face = this.difficulty; face < 11; face++){
                successes += rollOutcomes[face];
            }
        
            if(this.doubleTens()){
                successes += rollOutcomes[10]
            }
        
            let finalSuccesses = successes;
            let isBotch = false;
            if(this.allowBotch()){
                if(this.originalBotch()){
                    finalSuccesses -= ones;
                    if(finalSuccesses < 0){
                        finalSuccesses = 0;
                    }
                }
        
                if(finalSuccesses <= 0 && ones > 0){
                    isBotch = true;
                }
            }
        
            let outcome = isBotch ? 'Botch' : (finalSuccesses > 0 ? 'Success' : 'Fail');
                
            return {
                numDice: this.numDice,
                rollOutcomes: rollOutcomes,
                rollOutcomesArray: this.resultDictToArray(rollOutcomes),
                outcome: outcome,
                successes: successes,
                ones: ones,
                finalSuccesses: finalSuccesses,
                difficulty : this.difficulty,
                threshold: this.threshold,
                botchType: this.botch,
                tensType: this.tens
            };
        },
        rollDice: function(){
            let result = this.getRollResult();
            this.lastResult = result;
            this.results.splice(0, 0, result);
        },
        toggleHistory: function(){
            this.showHistory = !this.showHistory;
        },
        helpClicked: function(){
            console.log('help')
            $('#help-modal').modal('show');
        }
    }
});
