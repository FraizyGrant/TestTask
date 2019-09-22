'use strict';

import core from 'core.scss';

let files = require.context('general/svg', true, /^\.\/.*\.svg/);
files.keys().forEach(files);

let images = require.context('general/img', true, /^\.\/.*\.(jpg|png)/);
images.keys().forEach(images);

import Vue from 'vue';
import formCheckbox from 'form-checkbox/main';
import sheduleType from 'shedule-type/main';
import mainNav from 'main-nav/main';
import tabs from 'tabs/main';
import Slider from 'slider/main';
import ResetSliders from 'slider/reset';

/* To avoid disappearing Vue panel in the devtools; */
Vue.config.devtools = true;
Vue.config.debug = true;
Vue.config.silent = false;

Vue.prototype.$eventHub = new Vue();

window.app = new Vue({

    components: (function () {

        let components = {};

        components['sx-tabs'] = tabs;
        components['sx-time-slider'] = Slider;
        components['sx-reset-sliders'] = ResetSliders;
        
        for (let component in components) {
            Vue.component(component, components[component]);
        }

        return components;
    })()
}).$mount('#app');
