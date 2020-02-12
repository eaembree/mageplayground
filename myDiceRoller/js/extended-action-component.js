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
        tensOptions: Array,
        tens: String,
        diceRoller: Object
    },
    data: function () {
      return {
        difficulty: 6,
        numRolls: 2,
        successesNeeded: 1,
        numDice: 3,
        lastResult: null,
        results: [],
        showHistory: false,
        state: 'setup',
        states: {
            setup: 'setup',
            rolling: 'rolling',
        },
        success: false,
        failure: false
      }
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
        changeSuccessesNeeded(amount){
            this.successesNeeded += amount;
            this.successesNeeded = this.clamp(this.successesNeeded, this.successesNeededMin, this.successesNeededMax);
        },
        removeLastResult: function(){
            this.results.splice(0, 1);
        },
        start: function(){
            if(this.state == this.states.setup){
                this.results.splice(0, this.results.length);
                this.state = this.states.rolling;
            }
        },
        reset: function(){
            if(this.state == this.states.rolling){
                this.success = false;
                this.failure = false;
                this.state = this.states.setup;
                this.results.splice(0, this.results.length);
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
            thisResult.rollNumber = this.results.length + 1;

            thisResult.runningSuccesses = this.getLastRunningSuccesses() + thisResult.finalSuccesses;
            thisResult.runningWillpowerSpent = this.getLastRunningWillpowerSpent() + (applyWillpower ? 1 : 0);
            this.results.splice(0, 0, thisResult);

            this.trySuccessFailure();
        },
        getLastRunningWillpowerSpent: function() {
            if(this.results.length === 0) return 0;
            return this.results[0].runningWillpowerSpent;
        },
        getLastRunningSuccesses: function() {
            if(this.results.length === 0) return 0;
            return this.results[0].runningSuccesses;
        },
        trySuccessFailure: function() {
            if(this.results.length === 0) return;
            
            // TODO - Check botch

            if(this.success || this.failure) return;

            if(this.results.length >= this.numRolls) {
                // Probably failure but check successes
                if(this.results[0].runningSuccesses >= this.successesNeeded) {
                    this.success = true;
                } else {
                    this.failure = true;
                }
            } else {
                // Might have succeeded already
                if(this.results[0].runningSuccesses >= this.successesNeeded) {
                    this.success = true;
                }
            }
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
                                    '<span class="d-none d-sm-inline-block">Difficulty:</span> ' +
                                    '<div class="d-flex justify-content-center d-sm-none">Difficulty:</div> ' +
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
                                    '<span class="d-none d-sm-inline-block"># Rolls:</span> ' +
                                    '<div class="d-flex justify-content-center d-sm-none"># Rolls:</div> ' +
                                '</span> ' +
                                '<button class="btn btn-mage font-weight-bold" v-on:click="changeNumRolls(-1)">-1</button> ' +
                                '<span class="text-mage font-weight-bold ml-1 mr-1">{{numRolls}}</span> ' +
                                '<button class="btn btn-mage font-weight-bold" v-on:click="changeNumRolls(1)">+1</button> ' +
                            '</div> ' +
                        '</div> ' +
                    '</div> ' +
                '</div> ' +
            '</div> ' +
        '</div> ' +

        '<div class="row mt-2"> ' +
            '<div class="col"> ' +
                '<div class="d-flex justify-content-center"> ' +
                    '<div class="card border-mage"> ' +
                        '<div class="card-body bg-mage p-1"> ' +
                            '<button type="button" class="btn btn-mage-inv font-weight-bold" v-on:click="changeNumDice(-5)">-5</button type="button"> ' +
                            '<button type="button" class="btn btn-mage-inv font-weight-bold" v-on:click="changeNumDice(-1)">-1</button type="button"> ' +
                            '<button type="button" class="btn btn-mage font-weight-bold ml-2 mr-2" v-on:click="rollDice()">{{numDice}} <i class="fas fa-dice-d20"></i></button> ' +
                            '<button type="button" class="btn btn-mage-inv font-weight-bold" v-on:click="changeNumDice(1)">+1</button type="button"> ' +
                            '<button type="button" class="btn btn-mage-inv font-weight-bold" v-on:click="changeNumDice(5)">+5</button type="button"> ' +
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
                                '<button class="btn btn-mage font-weight-bold" v-on:click="changeSuccessesNeeded(-1)">-1</button> ' +
                                '<span class="text-mage font-weight-bold ml-1 mr-1">{{successesNeeded}}</span> ' +
                                '<button class="btn btn-mage font-weight-bold" v-on:click="changeSuccessesNeeded(1)">+1</button> ' +
                            '</div> ' +
                            '<div class="d-sm-none"> ' +
                                '<div class="d-flex justify-content-center text-mage font-weight-bold">Successes Needed:</div> ' +
                                '<div class="d-flex justify-content-center"> ' +
                                    '<div> '+
                                        '<button class="btn btn-mage font-weight-bold" v-on:click="changeSuccessesNeeded(-1)">-1</button> ' +
                                        '<span class="text-mage font-weight-bold ml-1 mr-1">{{successesNeeded}}</span> ' +
                                        '<button class="btn btn-mage font-weight-bold" v-on:click="changeSuccessesNeeded(1)">+1</button> ' +
                                    '</div>' +
                                '</div> ' +
                            '</div>' +
                        '</div> ' +
                    '</div> ' +
                '</div> ' +
            '</div>' +
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
                        '<div class="d-flex justify-content-center text-mage">'+
                            '<span><span class="font-weight-bold">Rolling {{numDice}}</span> <i class="fas fa-dice-d20"></i></span>'+
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="row">' +
                    '<div class="col">' +
                        '<div class="d-flex justify-content-center text-mage font-weight-bold"> ' +
                            '<div>' +
                                'Successes Needed: <span class="ml-1 mr-1">{{successesNeeded}}</span> ' +
                                '<button class="btn btn-sm pt-0 pt-md-1 pb-0 pb-md-1 btn-mage-inv font-weight-bold mt-2 mb-2" v-show="state == states.rolling" v-on:click="reset">Reset</button>' +
                            '</div>' +
                        '</div> ' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
    '</div> ' +

    '<div class="row"> ' +
        '<div class="col-10 offset-1"> '+
            '<button class="btn btn-block btn-mage-inv font-weight-bold mt-2" v-show="state == states.setup" v-on:click="start">Start</button>' +
        '</div>' +
    '</div>' +

    '<div v-show="state == states.rolling"> ' +
        '<hr class="mb-2 mt-2"/>' +
        '<div v-show="failure">' +
            '<div class="alert alert-danger">FAILED</div>' +
        '</div>' +
        '<div v-show="!failure && this.results.length < numRolls">' +
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
        '<div v-show="success">' +
            '<div class="alert alert-success">SUCCESS</div>' +
        '</div>' +
        

        '<div v-show="results.length > 0"> '+
            '<div class="card text-white mb-3" v-for="(r, idx) in results"> ' +
                '<div class="card-header bg-mage text-mage font-weight-bold pt-1 pb-1 d-flex justify-content-between"> ' +
                    '<span>Roll {{r.rollNumber}}</span> ' +
                    '<button v-if="idx == 0" class="btn btn-sm btn-mage-inv pt-0 pt-0" v-on:click="removeLastResult">remove</button> ' +
                '</div> ' +
                '<div class="card-body pt-1 pb-1"> ' +
                    '<div class="row" v-show="r.finalSuccesses == 0 && r.ones == 0"><div class="col text-center text-mage"><span class="h5">Fail</span></div></div>' +
                    '<div class="row" v-show="r.finalSuccesses > 0">' +
                        '<div class="col text-center text-mage">' +
                            '<span class="h5">' +
                                '<span v-show="r.finalSuccesses == 1">{{r.finalSuccesses}} Success</span>' +
                                '<span v-show="r.finalSuccesses > 1">{{r.finalSuccesses}} Successes</span>' +
                            '</span>' +
                        '</div>' +
                    '</div>' +
                    '<div class="row" v-show="r.finalSuccesses == 0 && r.ones > 0">' +
                        '<div class="col text-center text-mage">' +
                            '<span class="h5">' +
                                '<span v-show="r.botchType == \'none\'">Fail</span>' +
                                '<span v-show="r.botchType != \'none\'">Botch</span>' +
                            '</span>' +
                        '</div>' +
                    '</div>' +
                    '<div class="row">' +
                        '<div class="col-sm">' +
                            '<div class="card border-mage mb-1">' +
                                '<div class="card-body bg-mage p-1 text-mage">' +
                                    '<span class="font-weight-bold">Total Successes:</span> {{r.runningSuccesses}}' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
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
                        //'<p class="text-mage">{{r}}</p>' +
                    '</div> ' +
                '</div> ' +
            '</div> ' +
        '</div>'+
    '</div>' +

    '</div>'
  })