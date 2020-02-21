Vue.component('botch-and-tens', {
    props: {
        botchOptions: Array,
        botch: String,
        tensOptions: Array,
        tens: String
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
    
    '<div class="row mt-2 mb-2" v-show="!hideBotchAndTensButtons"> ' +
        '<div class="col"> ' +
            '<button class="btn btn-block btn-mage-inv font-weight-bold" v-on:click="botchModal(\'show\')" v-bind:disabled="hideBotchAndTensButtons == true">Botch: {{botchText}}</button> ' +
        '</div> ' +
        '<div class="col"> ' +
            '<button class="btn btn-block btn-mage-inv font-weight-bold" v-on:click="tensModal(\'show\')" v-bind:disabled="hideBotchAndTensButtons == true">10s: {{tensText}}</button> ' +
        '</div> ' +
    '</div> ' +

'<div class="row"> ' +
    '<div class="col"> ' +
        '<div class="btn-group d-flex"> ' +
            '<button class="btn font-weight-bold w-100" ' +
                'v-bind:class="{ \'btn-mage-inv\': appState == appStates.single, \'btn-outline-mage-inv\': appState == appStates.extended }" ' +
                'v-on:click="goToSingleState"> ' +
                '<span v-show="appState == appStates.single"><i class="fas fa-check"></i></span> Single Action ' +
            '</button> ' +
            '<button class="btn font-weight-bold w-100" ' +
                'v-bind:class="{ \'btn-mage-inv\': appState == appStates.extended, \'btn-outline-mage-inv\': appState == appStates.single }" ' +
                'v-on:click="goToExtendedState"> ' +
                '<span v-show="appState == appStates.extended"><i class="fas fa-check"></i></span> Extended Action ' +
            '</button> ' +
        '</div> ' +
    '</div> ' +
'</div> ' +

    '</div>'
  })