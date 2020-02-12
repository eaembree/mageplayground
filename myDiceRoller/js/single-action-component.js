Vue.component('single-action', {
    props: {
        difficultyMin: Number,
        difficultyMax: Number,
        thresholdMin: Number,
        thresholdMax: Number,
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
        threshold: 0,
        numDice: 3,
        lastResult: null,
        results: [],
        showHistory: false
      }
    },
    methods: {
        changeDifficulty: function(amount){
            this.difficulty += amount;
            this.difficulty = this.clamp(this.difficulty, this.difficultyMin, this.difficultyMax);
        },
        changeThreshold: function(amount){
            this.threshold += amount;
            this.threshold = this.clamp(this.threshold, this.thresholdMin, this.thresholdMax);
        },
        changeNumDice: function(amount){
            this.numDice += amount;
            this.numDice = this.clamp(this.numDice, 1, 500);
        },
        rollDice: function(){
            console.log(this.numDice + ' ' + this.difficulty + ' ' + this.threshold)
            let result = this.diceRoller.getSingleActionResult(this.numDice, this.difficulty, this.threshold, false);
            this.lastResult = result;
            this.results.splice(0, 0, result);
        },
        toggleHistory: function(){
            this.showHistory = !this.showHistory;
        },
        clearHistory: function(){
            this.results.splice(0, this.results.length);
        }
    },
    template: '<div> ' +
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
                                '<span class="d-none d-sm-inline-block">Threshold:</span> ' +
                                '<div class="d-flex justify-content-center d-sm-none">Threshold:</div> ' +
                            '</span> ' +
                            '<button class="btn btn-mage font-weight-bold" v-on:click="changeThreshold(-1)">-1</button> ' +
                            '<span class="text-mage font-weight-bold ml-1 mr-1">{{threshold}}</span> ' +
                            '<button class="btn btn-mage font-weight-bold" v-on:click="changeThreshold(1)">+1</button> ' +
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

    '<div v-if="lastResult"> ' +
        '<h5 class="text-center mt-1 text-mage font-weight-bold">{{lastResult.outcome}}</h5> ' +
        '<div class="row"> ' +
            '<div class="col-md"> ' +
                '<div class="row"> ' +
                    '<div class="col"> ' +
                        '<div class="card border-mage"> ' +
                            '<div class="card-body bg-mage p-1 text-mage"> ' +
                                '<span class="text-mage font-weight-bold"> ' +
                                    '<span v-if="lastResult.botchType == \'original\'">Outcome:</span> ' +
                                    '<span v-else>Successes:</span> ' +
                                '</span> {{lastResult.finalSuccesses}} ' +
                            '</div> ' +
                        '</div> ' +
                    '</div> ' +
                    '<div class="col" v-if="lastResult.botchType == \'original\'"> ' +
                        '<div class="card border-mage"> ' +
                            '<div class="card-body bg-mage p-1 text-mage"> ' +
                                '<span class="text-mage font-weight-bold"> ' +
                                    'Successes: ' +
                                '</span> {{lastResult.successes}} ' +
                            '</div> ' +
                        '</div> ' +
                    '</div> ' +
                '</div> ' +
            '</div> ' +
            '<div class="col-md mt-1 mt-md-0"> ' +
                '<div class="row"> ' +
                    '<div class="col"> ' +
                        '<div class="card border-mage"> ' +
                            '<div class="card-body bg-mage p-1 text-mage"> ' +
                                '<span class="text-mage font-weight-bold">Ones:</span> {{lastResult.ones}} ' +
                            '</div> ' +
                        '</div> ' +
                    '</div> ' +
                    '<div class="col"> ' +
                        '<div class="card border-mage"> ' +
                            '<div class="card-body bg-mage p-1 text-mage"> ' +
                                '<span class="text-mage font-weight-bold">Dice:</span> ' +
                                '<span v-for="f in lastResult.rollOutcomesArray"> ' +
                                    '<span class="die-success" v-if="f >= lastResult.difficulty">{{f + \' \'}}</span> ' +
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

    '<div class="d-flex justify-content-around"> ' +
        '<div v-show="results.length > 0"> ' +
            '<button class="btn btn-mage-inv mt-1 pt-0 pb-0 font-weight-bold" type="button" v-on:click="toggleHistory"> ' +
                'History ' +
                '<span v-show="!showHistory"><i class="fas fa-chevron-right"></i></span> ' +
                '<span v-show="showHistory"><i class="fas fa-chevron-down"></i></span> ' +
            '</button> ' +
            '<button type="button" class="btn btn-mage-inv mt-1 pt-0 pb-0" v-on:click="clearHistory">Clear History</button> ' +
        '</div> ' +
    '</div> ' +

    '<div v-show="showHistory && results.length > 0" class="card border-mage mt-1"> ' +
        '<div class="card-body bg-mage p-1 text-mage"> ' +
            '<div class="history-holder"> ' +
                '<table class="table table-sm history-table mb-0"> ' +
                    '<thead class="thead-mage-inv"> ' +
                        '<tr> ' +
                            '<th class="bt-0">Result</th> ' +
                            '<th class="bt-0 text-center">Outcome</th> ' +
                            '<th class="bt-0 text-center">Successes</th> ' +
                            '<th class="bt-0 text-center">Ones</th> ' +
                            '<th class="bt-0 text-center"># Dice</th> ' +
                        '</tr> ' +
                    '</thead> ' +
                    '<tbody> ' +
                        '<tr v-for="r in results" class="text-mage"> ' +
                            '<td>{{r.outcome}}</td> ' +
                            '<td class="text-center"><span v-if="r.botchType == \'original\'">{{r.finalSuccesses}}</span><span v-else>N/A</span></td> ' +
                            '<td class="text-center">{{r.successes}}</td> ' +
                            '<td class="text-center">{{r.ones}}</td> ' +
                            '<td class="text-center">{{r.numDice}}</td> ' +
                        '</tr> ' +
                    '</tbody> ' +
                '</table> ' +
            '</div> ' +
        '</div> ' +
    '</div> ' +

    '</div>'
  })