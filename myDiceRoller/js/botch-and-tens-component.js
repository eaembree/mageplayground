Vue.component('botch-and-tens', {
    props: {
        canChange: Boolean,
        botchText: String,
        tensText: String,
        lockButtons: Boolean
    },
    template: '<div> ' +
    
    '<div v-if="canChange">'+
        '<div class="row"> ' +
            '<div class="col"> ' +
                '<button class="btn btn-block btn-mage-inv font-weight-bold" v-on:click="$emit(\'botch-modal-show\')" v-bind:disabled="lockButtons == true">Botch: {{botchText}}</button> ' +
            '</div> ' +
            '<div class="col"> ' +
                '<button class="btn btn-block btn-mage-inv font-weight-bold" v-on:click="$emit(\'tens-modal-show\')" v-bind:disabled="lockButtons == true">10s: {{tensText}}</button> ' +
            '</div> ' +
        '</div> ' +
    '</div>' +

    '<div v-else>' +
        '<div class="card border-mage">'+
            '<div class="card-body bg-mage p-1">'+
                '<div class="d-flex justify-content-center">'+
                    '<div>'+
                        '<span class="text-mage font-weight-bold">Botch: {{botchText}}, 10s: {{tensText}}</span>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'+
    '</div>' +

    '</div>'
  })