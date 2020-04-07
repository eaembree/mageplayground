Vue.component('extended-action', {
    props: {
        difficultyMin: Number,
        difficultyMax: Number,
        numRollsMin: Number,
        numRollsMax: Number,
        successesNeededMin: Number,
        successesNeededMax: Number,
        clamp: Function,
        botchOptions: Array,
        botch: String,
        botchText: String,
        tensOptions: Array,
        tens: String,
        tensText: String,
        diceRoller: Object,
        allowBotchFix: Boolean,
        allowFailureFix: Boolean
    },
    data: function () {
      return {
        difficulty: 6,
        numRolls: 2,
        noMaxRolls: false,
        successesNeeded: 1,
        numDice: 3,
        lastResult: null,
        results: [],
        showHistory: false,
        state: 'setup',
        states: {
            setup: 'setup',
            rolling: 'rolling',
        }
      }
    },
    created: function (){
        this.$emit('show-botch-and-tens');
    },
    methods: {
        changeDifficulty: function(amount){
            this.difficulty += amount;
            this.difficulty = this.clamp(this.difficulty, this.difficultyMin, this.difficultyMax);
        },
        changeNumRolls: function(amount){
            this.numRolls += amount;
            this.numRolls = this.clamp(this.numRolls, this.numRollsMin, this.numRollsMax);
        },
        changeNumDice: function(amount){
            this.numDice += amount;
            this.numDice = this.clamp(this.numDice, 1, 500);
        },
        toggleMaxRolls: function(){
            this.noMaxRolls = !this.noMaxRolls;
        },
        changeSuccessesNeeded(amount){
            this.successesNeeded += amount;
            this.successesNeeded = this.clamp(this.successesNeeded, this.successesNeededMin, this.successesNeededMax);
        },
        removeLastResult: function(){
            this.results.splice(0, 1);
            if(this.results.length > 0){
                this.lastResult = this.results[0];
            } else {
                this.lastResult = null;
                this.reset();
            }
        },
        start: function(){
            if(this.state == this.states.setup){
                this.results.splice(0, this.results.length);
                this.state = this.states.rolling;
                this.$emit('hide-botch-and-tens');
            }
        },
        reset: function(){
            if(this.state == this.states.rolling){
                this.state = this.states.setup;
                this.results.splice(0, this.results.length);
                this.lastResult = null;
                this.$emit('show-botch-and-tens');
            }
        },
        rollNormal: function(){
            this.rollActual(false);
        },
        rollWithWillpower: function(){
            this.rollActual(true);
        },
        rollActual: function(applyWillpower) {
            let thisResult = this.diceRoller.getSingleActionResult(this.numDice, this.difficulty, 0, applyWillpower);
            thisResult.runningStatus = '';
            thisResult.rollNumber = this.results.length + 1;

            let runningSuccesses = this.getLastRunningSuccesses() + thisResult.finalSuccesses;
            let runningWillpowerSpent = this.getLastRunningWillpowerSpent() + (applyWillpower ? 1 : 0);
            this.results.splice(0, 0, thisResult);
            this.lastResult = thisResult;

            this.updateRunningState(thisResult, runningSuccesses,runningWillpowerSpent);
        },
        updateRunningState: function(newResult, runningSuccesses, runningWillpowerSpent) {
            newResult.runningSuccesses = runningSuccesses;
            newResult.runningWillpowerSpent = runningWillpowerSpent;

            if(newResult.isBotch()) {
                newResult.runningStatus = 'botch';
            }
            else if(newResult.runningSuccesses >= this.successesNeeded) {
                newResult.runningStatus = 'success';
            }
            else if(this.results.length >= this.numRolls) {
                newResult.runningStatus = 'failure';
            } else {
                newResult.runningStatus = '';
            }
        },
        getLastRunningWillpowerSpent: function() {
            if(this.results.length === 0) return 0;
            return this.results[0].runningWillpowerSpent;
        },
        getLastRunningSuccesses: function() {
            if(this.results.length === 0) return 0;
            return this.results[0].runningSuccesses;
        },
        tryFixBotch: function(){
            if(!this.allowBotchFix) return;

            if(this.lastResult === null) {
                return;
            }
            if(this.lastResult.outcome !== 'Botch') {
                return;
            }

            this.lastResult.fixWithWill();

            this.updateRunningState(this.lastResult, this.lastResult.runningSuccesses, this.lastResult.runningWillpowerSpent + 1);
        },
        tryFixFailure: function(){
            if(!this.allowFailureFix) return;

            if(this.lastResult === null) {
                return;
            }
            if(this.lastResult.outcome !== 'Failure') {
                return;
            }

            this.lastResult.fixWithWill();

            this.updateRunningState(this.lastResult, this.lastResult.runningSuccesses + 1, this.lastResult.runningWillpowerSpent + 1);
        }
    },
    template: '<div> ' +

    '<div v-show="state == states.setup"> ' +
        '<div class="row mt-2"> ' +
            '<div class="col"> ' +
                '<div class="card border-mage"> ' +
                    '<div class="card-body bg-mage p-1"> ' +
                        '<div class="d-flex justify-content-center"> ' +
                            '<div> ' +
                                '<span class="text-mage font-weight-bold"> ' +
                                    '<span class="d-none d-sm-inline-block">Difficulty</span> ' +
                                    '<div class="d-flex justify-content-center d-sm-none mb-1" style="border: 1px solid transparent">Difficulty</div> ' +
                                '</span> ' +
                                '<button class="btn btn-mage font-weight-bold" v-on:click="changeDifficulty(-1)">-1</button> ' +
                                '<span class="text-mage font-weight-bold ml-1 mr-1">{{difficulty}}</span> ' +
                                '<button class="btn btn-mage font-weight-bold" v-on:click="changeDifficulty(1)">+1</button> ' +
                            '</div> ' +
                        '</div> ' +
                    '</div> ' +
                '</div> ' +
            '</div> ' +
            '<div class="col"> ' +
                '<div class="card border-mage"> ' +
                    '<div class="card-body bg-mage p-1"> ' +
                        '<div class="d-flex justify-content-center"> ' +
                            '<div> ' +
                                '<span class="text-mage font-weight-bold"> ' +
                                    '<span class="d-none d-sm-inline-block">' +
                                    '<button class="btn btn-mage-inv font-weight-bold" v-on:click="toggleMaxRolls"># Rolls</button>' +
                                    '</span> ' +
                                    '<div class="d-flex justify-content-center d-sm-none">' +
                                        '<button class="btn btn-mage-inv font-weight-bold pb-0 pt-0 mb-1" v-on:click="toggleMaxRolls"># Rolls</button>' +
                                    '</div> ' +
                                '</span> ' +
                                '<span v-if="noMaxRolls" class="text-mage font-weight-bold">' +
                                    '<span class="d-none d-sm-inline-block">' +
                                        // EAE - This is the twitchy one on sm+ sizes    
                                        '<span style="padding: 6px 12px; margin-top: 2px border: 2px solid transparent; font-size: 1.1rem"><i class="fas fa-infinity"></i></span>' +
                                    '</span>' +
                                    '<span class="d-sm-none d-flex justify-content-center">' +
                                        '<span style="padding: 5px 12px; border: 2px solid transparent; font-size: 1.1rem"><i class="fas fa-infinity"></i></span>' +
                                    '</span>' +
                                '</span>' +
                                '<span v-else>' +
                                    '<button class="btn btn-mage font-weight-bold" v-on:click="changeNumRolls(-1)">-1</button> ' +
                                    '<span class="text-mage font-weight-bold ml-1 mr-1">{{numRolls}}</span> ' +
                                    '<button class="btn btn-mage font-weight-bold" v-on:click="changeNumRolls(1)">+1</button> ' +
                                '</span>' +
                            '</div> ' +
                        '</div> ' +
                    '</div> ' +
                '</div> ' +
            '</div> ' +
        '</div> ' +

        '<div class="row mt-2"> '+
            '<div class="col"> ' +
                '<div class="card border-mage"> ' +
                    '<div class="card-body bg-mage p-1"> ' +
                        '<div class="d-flex justify-content-center"> ' +
                            '<div class="d-none d-sm-inline-block"> ' +
                                '<span class="text-mage font-weight-bold">Successes Needed:</span> ' +
                                '<button class="btn btn-mage font-weight-bold" v-on:click="changeSuccessesNeeded(-5)">-5</button> ' +
                                '<button class="btn btn-mage font-weight-bold" v-on:click="changeSuccessesNeeded(-1)">-1</button> ' +
                                '<span class="text-mage font-weight-bold ml-1 mr-1">{{successesNeeded}}</span> ' +
                                '<button class="btn btn-mage font-weight-bold" v-on:click="changeSuccessesNeeded(1)">+1</button> ' +
                                '<button class="btn btn-mage font-weight-bold" v-on:click="changeSuccessesNeeded(5)">+5</button> ' +
                            '</div> ' +
                            '<div class="d-sm-none"> ' +
                                '<div class="d-flex justify-content-center text-mage font-weight-bold">Successes Needed:</div> ' +
                                '<div class="d-flex justify-content-center"> ' +
                                    '<div> '+
                                        '<button class="btn btn-mage font-weight-bold" v-on:click="changeSuccessesNeeded(-1)">-1</button> ' +
                                        '<button class="btn btn-mage font-weight-bold" v-on:click="changeSuccessesNeeded(-5)">-5</button> ' +
                                        '<span class="text-mage font-weight-bold ml-1 mr-1">{{successesNeeded}}</span> ' +
                                        '<button class="btn btn-mage font-weight-bold" v-on:click="changeSuccessesNeeded(1)">+1</button> ' +
                                        '<button class="btn btn-mage font-weight-bold" v-on:click="changeSuccessesNeeded(5)">+5</button> ' +
                                    '</div>' +
                                '</div> ' +
                            '</div>' +
                        '</div> ' +
                    '</div> ' +
                '</div> ' +
            '</div>' +
        '</div> ' +

        '<div class="row mt-2"> ' +
            '<div class="col"> ' +
                '<div class="d-flex justify-content-center"> ' +
                    '<div class="card border-mage"> ' +
                        '<div class="card-body bg-mage p-1"> ' +
                            '<button type="button" class="btn btn-mage-inv font-weight-bold" v-on:click="changeNumDice(-5)">-5</button type="button"> ' +
                            '<button type="button" class="btn btn-mage-inv font-weight-bold" v-on:click="changeNumDice(-1)">-1</button type="button"> ' +
                            '<button type="button" class="btn btn-mage font-weight-bold ml-2 mr-2" v-on:click="start">{{numDice}} <i class="fas fa-dice-d20"></i></button> ' +
                            '<button type="button" class="btn btn-mage-inv font-weight-bold" v-on:click="changeNumDice(1)">+1</button type="button"> ' +
                            '<button type="button" class="btn btn-mage-inv font-weight-bold" v-on:click="changeNumDice(5)">+5</button type="button"> ' +
                        '</div> ' +
                    '</div> ' +
                '</div> ' +
            '</div> ' +
        '</div> ' +

        

    '</div> ' +

    '<div v-show="state == states.rolling"> '+
        '<div class="card border-mage mt-2">' +
            '<div class="card-body bg-mage p-1">'+
                '<div class="row">' +
                    '<div class="col">' +
                        '<div class="d-flex justify-content-center text-mage font-weight-bold"> ' +
                            'Difficulty: <span class="ml-1 mr-1">{{difficulty}}</span> ' +
                        '</div> ' +
                    '</div>' +
                    '<div class="col">' +
                        '<div class="d-flex justify-content-center text-mage font-weight-bold"> ' +
                            '# Rolls: <span class="ml-1 mr-1">{{numRolls}}</span> ' +
                        '</div> ' +
                    '</div>' +
                '</div>' +

                '<div class="row">' +
                    '<div class="col">' +
                        '<div class="d-flex justify-content-center text-mage font-weight-bold"> ' +
                            '<div>' +
                                'Successes Needed: <span class="ml-1 mr-1">{{successesNeeded}}</span> ' +
                                '<button class="btn btn-sm pt-0 pt-md-1 pb-0 pb-md-1 btn-mage-inv font-weight-bold " v-show="state == states.rolling" v-on:click="reset">Reset</button>' +
                            '</div>' +
                        '</div> ' +
                    '</div>' +
                '</div>' +

                '<div class="row">' +
                    '<div class="col">' +
                        '<div class="d-flex justify-content-center text-mage">'+
                            '<span><span class="font-weight-bold">Rolling {{numDice}}</span> <i class="fas fa-dice-d20"></i></span>'+
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
    '</div> ' +

    '<div v-show="state == states.rolling"> ' +   
        '<hr class="mb-2 mt-2"/>' +
        '<div v-show="(lastResult == null || lastResult.runningStatus != \'botch\') && results.length < numRolls">' +
            '<p class="h5 text-center mb-1 mt-0 text-mage font-weight-bold"><u>Roll</u></p>' +
            '<div class="row mb-2">' +
                '<div class="col"> ' +
                    '<button class="btn btn-block btn-mage-inv font-weight-bold" v-on:click="rollNormal">Normal</button>' +
                '</div>' +
                '<div class="col"> ' +
                    '<button class="btn btn-block btn-mage-inv font-weight-bold" v-on:click="rollWithWillpower">With Willpower</button>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<div v-show="(lastResult != null && lastResult.runningStatus == \'success\')">' +
            '<div class="alert alert-success text-center font-weight-bold">SUCCESS</div>' +
        '</div>' +
        '<div v-show="(lastResult != null && lastResult.runningStatus == \'botch\')">' +
            '<div class="alert alert-danger text-center font-weight-bold">BOTCH</div>' +
        '</div>' +
        '<div v-show="(lastResult != null && lastResult.runningStatus == \'failure\')">' +
            '<div class="alert alert-danger text-center font-weight-bold">FAILURE</div>' +
        '</div>' +

        '<div v-show="results.length > 0"> '+
            '<div class="card text-white mb-3" v-for="(r, idx) in results"> ' +
                '<div class="card-header bg-mage text-mage font-weight-bold pt-1 pb-1 d-flex justify-content-between"> ' +
                    '<span><span v-show="r.isFixedWithWill" class="text-danger"><i class="fas fa-hammer"></i></span> Roll {{r.rollNumber}}</span> ' +
                    '<button v-if="idx == 0" class="btn btn-sm btn-mage-inv pt-0 pt-0" v-on:click="removeLastResult">remove</button> ' +
                '</div> ' +
                '<div class="card-body pt-1 pb-1"> ' +
                    '<div class="row">' +
                        '<div class="col text-center text-mage">' +
                            '<span class="h5">' +
                                '<span v-show="r.finalSuccesses == 0">' +
                                    '<div v-show="r.outcome == \'Botch\'">' +
                                        '<span>Botch | {{r.runningSuccesses}} Total Successes</span>'+
                                        '<div class="row mb-1" v-if="idx == 0 && allowBotchFix">' +
                                            '<div class="col-10 offset-1">'+
                                                '<button type="button" class="btn btn-block btn-sm btn-mage-inv pt-0 pt-0 mt-1" v-on:click=tryFixBotch>Spend Willpower</button>' +
                                            '</div>'+
                                        '</div>' +
                                    '</div>' +
                                    '<div v-show="r.outcome == \'Failure\'">' +
                                        '<span>Failure | {{r.runningSuccesses}} Total Successes</span>' +
                                        '<div class="row mb-1" v-if="idx == 0 && allowFailureFix">' +
                                            '<div class="col-10 offset-1">'+
                                                '<button type="button" class="btn btn-block btn-sm btn-mage-inv pt-0 pt-0 mt-1" v-on:click=tryFixFailure>Spend Willpower</button>' +
                                            '</div>'+
                                        '</div>' +
                                    '</div>' +
                                '</span>' +    
                                '<span v-show="r.finalSuccesses == 1">{{r.finalSuccesses}} Success | {{r.runningSuccesses}} Total</span>' +
                                '<span v-show="r.finalSuccesses > 1">{{r.finalSuccesses}} Successes | {{r.runningSuccesses}} Total</span>' +
                            '</span>' +
                        '</div>' +
                    '</div>' +
                    //'<div class="text-mage">{{r}}</div>'+
                    '<div class="row">' +
                        '<div class="col-sm">' +
                            '<div class="card border-mage mb-1">' +
                                '<div class="card-body bg-mage p-1 text-mage">' +
                                    '<span class="font-weight-bold">Willpower Spent:</span> {{r.runningWillpowerSpent}}' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +    
                    '<div class="row"> ' +
                        '<div class="col-md"> ' +
                            '<div class="row"> ' +
                                '<div class="col"> ' +
                                    '<div class="card border-mage mb-1"> ' +
                                        '<div class="card-body bg-mage p-1 text-mage"> ' +
                                            '<span class="text-mage font-weight-bold"> ' +
                                                '<span v-if="r.botchType == \'original\'">Outcome:</span> ' +
                                                '<span v-else>Successes:</span> ' +
                                            '</span> {{r.finalSuccesses}} ' +
                                        '</div> ' +
                                    '</div> ' +
                                '</div> ' +
                                '<div class="col" v-if="r.botchType == \'original\'"> ' +
                                    '<div class="card border-mage mb-1"> ' +
                                        '<div class="card-body bg-mage p-1 text-mage"> ' +
                                            '<span class="text-mage font-weight-bold"> ' +
                                                'Successes: ' +
                                            '</span> {{r.successes}} ' +
                                        '</div> ' +
                                    '</div> ' +
                                '</div> ' +
                            '</div> ' +
                        '</div> ' +
                        '<div class="col-md"> ' +
                            '<div class="row"> ' +
                                '<div class="col"> ' +
                                    '<div class="card border-mage mb-1"> ' +
                                        '<div class="card-body bg-mage p-1 text-mage"> ' +
                                            '<span class="text-mage font-weight-bold">Ones:</span> {{r.ones}} ' +
                                        '</div> ' +
                                    '</div> ' +
                                '</div> ' +
                                '<div class="col"> ' +
                                    '<div class="card border-mage mb-1"> ' +
                                        '<div class="card-body bg-mage p-1 text-mage"> ' +
                                            '<span class="text-mage font-weight-bold">Dice:</span> ' +
                                            '<span v-for="f in r.rollOutcomesArray"> ' +
                                                '<span class="die-success" v-if="f >= r.difficulty">{{f + \' \'}}</span> ' +
                                                '<span class="die-one" v-else-if="f == 1">{{f + \' \'}}</span> ' +
                                                '<span v-else>{{f + \' \'}}</span> ' +
                                            '</span> ' +
                                        '</div> ' +
                                    '</div> ' +
                                '</div> ' +
                            '</div> ' +
                        '</div> ' +
                    '</div> ' +
                '</div> ' +
            '</div> ' +
        '</div>'+
    '</div>' +

    '</div>'
  })