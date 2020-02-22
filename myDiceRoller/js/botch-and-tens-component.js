Vue.component('botch-and-tens', {
    props: {
        hideBotchAndTensButtons: Boolean,
        botchText: String,
        tensText: String
    },
    data: function () {
      return {
        
      }
    },
    created: function (){
        //this.$emit('show-botch-and-tens');
        console.log('botch-and-tens created');
    },
    methods: {
        
    },
    template: '<div> ' +
    
    '<div class="row" v-show="!hideBotchAndTensButtons"> ' +
        '<div class="col"> ' +
            '<button class="btn btn-block btn-mage-inv font-weight-bold" v-on:click="$emit(\'botch-modal-show\')">Botch: {{botchText}}</button> ' +
        '</div> ' +
        '<div class="col"> ' +
            '<button class="btn btn-block btn-mage-inv font-weight-bold" v-on:click="$emit(\'tens-modal-show\')">10s: {{tensText}}</button> ' +
        '</div> ' +
    '</div> ' +

    '</div>'
  })