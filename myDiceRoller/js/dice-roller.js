function DiceRoller(){

    this.botch = 'original';
    this.tens = 'regular';

    this.setBotch = function (botch) {
        this.botch = botch;
    }

    this.setTens = function (tens) {
        this.tens = tens;
    }

    this.doubleTens = function(){
        return this.tens === 'double';
    }

    this.doRerollTens = function(){
        return this.tens === 'reroll';
    }

    this.allowBotch = function(){
        return this.botch !== 'none';
    }

    this.originalBotch = function(){
        return this.botch === 'original';
    }

    this.revM20Botch = function(){
        return this.botch === 'rev-m20';
    }

    this.emptyRollsDict = function(){
        return {
            1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
            6: 0, 7: 0, 8: 0, 9: 0, 10: 0
        }
    }

    this.mergeDiceDicts = function (first, second){
        let final = this.emptyRollsDict();
    
        for(let face = 1; face < 11; face++){
            final[face] = first[face] + second[face];
        }
    
        return final;
    }

    this.rollDie = function(){
        return Math.floor(Math.random() * 10) + 1;
    }

    this.rollSingleOutcome = function(num){
        let dict = this.emptyRollsDict();
        for(let i = 0; i < num; i++){
            let outcome = this.rollDie();
            dict[outcome] = dict[outcome] + 1
        }
        return dict;
    }

    this.rollTotalOutcome = function(numDice){
        let newRollDict = this.rollSingleOutcome(numDice);
        let totalRollDict = this.mergeDiceDicts(this.emptyRollsDict(), newRollDict);
    
        if(this.doRerollTens()){
            while(newRollDict[10] > 0){
                newRollDict = this.rollSingleOutcome(newRollDict[10]);
                totalRollDict = this.mergeDiceDicts(totalRollDict, newRollDict);
            }
        }
    
        return totalRollDict;
    }

    this.resultDictToArray = function(dict){
        let arr = [];
        for(let face = 10; face > 0; face--){
            for(let n = dict[face]; n > 0; n--){
                arr.push(face);
            }
        }
        return arr;
    }

    this.getRollResult = function (numDice, difficulty, threshold){
        let rollOutcomes = this.rollTotalOutcome(numDice);
        let successes = 0;
        let ones = rollOutcomes[1];
    
        for(let face = difficulty; face < 11; face++){
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

        let minSuccesses = threshold > 0 ? threshold : 1;
        let outcome = isBotch ? 'Botch' : (finalSuccesses >= minSuccesses ? 'Success' : 'Fail');
            
        return {
            numDice: numDice,
            rollOutcomes: rollOutcomes,
            rollOutcomesArray: this.resultDictToArray(rollOutcomes),
            outcome: outcome,
            successes: successes,
            ones: ones,
            finalSuccesses: finalSuccesses,
            difficulty : difficulty,
            threshold: threshold,
            botchType: this.botch,
            tensType: this.tens
        };
    }
}