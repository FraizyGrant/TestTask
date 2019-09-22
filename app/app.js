'use strict';

import core from 'core.scss';

let files = require.context('general/svg', true, /^\.\/.*\.svg/);
files.keys().forEach(files);

let images = require.context('general/img', true, /^\.\/.*\.(jpg|png)/);
images.keys().forEach(images);

import Vue from 'vue';
import formCheckbox from 'form-checkbox/main';
import mainNav from 'main-nav/main';
import Tabs from 'tabs/main';
import SheduleType from 'shedule-type/main';
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

        components['my-tabs'] = Tabs;
        components['my-time-slider'] = Slider;
        components['my-reset-sliders'] = ResetSliders;
        components['my-shedule-type'] = SheduleType;
        
        for (let component in components) {
            Vue.component(component, components[component]);
        }

        return components;
    })()
}).$mount('#app');
