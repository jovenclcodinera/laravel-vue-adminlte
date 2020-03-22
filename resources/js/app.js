/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */
import Dashboard from "./components/Dashboard";

require('./bootstrap');

window.Vue = require('vue');

// Form
import { Form, HasError, AlertError } from 'vform'

window.form = Form;
Vue.component(HasError.name, HasError);
Vue.component(AlertError.name, AlertError);

// Router
import VueRouter from 'vue-router'

Vue.use(VueRouter);
let routes = [
    { path: '/dashboard', component: require('./components/Dashboard.vue').default },
    { path: '/developer', component: require('./components/Developer.vue').default },
    { path: '/profile', component: require('./components/Profile.vue').default },
    { path: '/users', component: require('./components/Users.vue').default },
    { path: '/invoice', component: require('./components/Invoice.vue').default },
    { path: '/not-found', component: require('./components/NotFound.vue').default },
    { path: '*', component: require('./components/NotFound.vue').default },
];

const router = new VueRouter({
    mode: 'history',
    routes // short for `routes: routes`
});

// Filters
import moment from 'moment'

Vue.filter("upText", text => {
    return text[0].toUpperCase() + text.slice(1);
});
Vue.filter("dateDisplay", date => {
    return moment(date).format('MMMM Do YYYY');
});

// Progress Bar
import VueProgressBar from 'vue-progressbar'

Vue.use(VueProgressBar, {
    color: 'rgb(143, 255, 199)',
    failedColor: 'red',
    height: '10px'
})

// Sweet Alert 2
import swal from 'sweetalert2'

window.swal = swal;

const toast = swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
        toast.addEventListener('mouseenter', swal.stopTimer)
        toast.addEventListener('mouseleave', swal.resumeTimer)
    }
});

window.toast = toast;

//Custom Events
window.Fire = new Vue();

// Gates
import Gate from "./Gate";
Vue.prototype.$gate = new Gate(window.user);

// Pagination
Vue.component('pagination', require('laravel-vue-pagination'));

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

Vue.component('example-component', require('./components/ExampleComponent.vue').default);
Vue.component(
    'passport-clients',
    require('./components/passport/Clients.vue').default
);

Vue.component(
    'passport-authorized-clients',
    require('./components/passport/AuthorizedClients.vue').default
);

Vue.component(
    'passport-personal-access-tokens',
    require('./components/passport/PersonalAccessTokens.vue').default
);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    el: '#app',
    router,
    data: {
        search: ""
    },
    methods: {
        searchIt: _.debounce(() => {
            Fire.$emit("searching");
        }, 1000)
    }
});
