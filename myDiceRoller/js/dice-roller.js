function SingleActionResult(numDice, rollOutcomes, rollOutcomesArray, outcome, successes, ones, finalSuccesses,
                            difficulty, threshold, botchType, tensType, usedWillpower, isFixedWithWill) {
    this.numDice = numDice;
    this.rollOutcomes = rollOutcomes;
    this.rollOutcomesArray = rollOutcomesArray;
    this.outcome = outcome;
    this.successes = successes;
    this.ones = ones;
    this.finalSuccesses = finalSuccesses;
    this.difficulty = difficulty;
    this.threshold = threshold;
    this.botchType = botchType;
    this.tensType = tensType;
    this.usedWillpower = usedWillpower;
    this.isFixedWithWill = isFixedWithWill;

    this.isBotch = function() {
        return this.outcome === 'Botch';
    };

    this.fixWithWill = function() {
        if(this.outcome === 'Success') return;
        if(this.outcome === 'Botch') {
            this.isFixedWithWill = true;
            this.outcome = 'Failure'
            // TODO Count Willpower
        } else if(this.outcome === 'Failure') {
            this.isFixedWithWill = true;
            this.outcome = 'Success'
            // TODO Count Willpower
            if(this.finalSuccesses < 0) {
                this.finalSuccesses = 0;
            }

            this.finalSuccesses++;
        }
    }
}

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

    this.getSingleActionResult = function (numDice, difficulty, threshold, applyWillpower) {
        let rollOutcomes = this.rollTotalOutcome(numDice);
        let rolledSuccesses = 0;
        let ones = rollOutcomes[1];
    
        for(let face = difficulty; face < 11; face++){
            rolledSuccesses += rollOutcomes[face];
        }
    
        if(this.doubleTens()){
            rolledSuccesses += rollOutcomes[10]
        }
    
        let finalSuccesses = rolledSuccesses - ones;

        if(finalSuccesses < 0){
            finalSuccesses = 0;
        }

        let isBotch = false;

        if(applyWillpower) {
            finalSuccesses += 1;
        }

        if(finalSuccesses <= 0){
            if(this.originalBotch()){
                if(ones > rolledSuccesses) {
                    isBotch = true;
                }
            } else if(this.revM20Botch()){
                if(rolledSuccesses <= 0 && ones > 0){
                    isBotch = true;
                }
            }
        }

        let minSuccesses = threshold > 0 ? threshold : 1;
        let outcome = isBotch ? 'Botch' : (finalSuccesses >= minSuccesses ? 'Success' : 'Failure');

        return new SingleActionResult(
            numDice,
            rollOutcomes,
            this.resultDictToArray(rollOutcomes),
            outcome,
            rolledSuccesses,
            ones,
            finalSuccesses,
            difficulty,
            threshold,
            this.botch,
            this.tens,
            applyWillpower,
            false
       );
    }

    this.cloneActionResult = function(singleOutcome) {
        let clonedRollOutcomes = this.mergeDiceDicts(this.emptyRollsDict(), singleOutcome.rollOutcomes);
        let clonedRollOutcomesArray = this.resultDictToArray(clonedRollOutcomes);

        return new SingleActionResult(
            singleOutcome.numDice,
            clonedRollOutcomes,
            clonedRollOutcomesArray,
            singleOutcome.outcome,
            singleOutcome.rolledSuccesses,
            singleOutcome.ones,
            singleOutcome.finalSuccesses,
            singleOutcome.difficulty,
            singleOutcome.threshold,
            singleOutcome.botch,
            singleOutcome.tens,
            singleOutcome.applyWillpower,
            singleOutcome.isFixedWithWill
       );
    }
}