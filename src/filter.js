import Vue from 'vue';
import moment from 'moment';

Vue.filter('formatDate', function(value, format) {
    if (value) {
        return moment(String(value)).format(format || 'YYYY/MM/DD/ hh:mm')
    }
});

export default {

}