Vue.component('extended-action', {
    props: {
        difficultyMin: Number,
        difficultyMax: Number,
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
        
    },
    template: '<div> ' +
    
    '<p>I\'m an extended action</p> ' + 

    '</div>'
  })