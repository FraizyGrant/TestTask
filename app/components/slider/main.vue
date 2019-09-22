<template>
    <div class="time-slider">
        <div v-if="isGeneral" class="time-slider__text">Working hours</div>
        <div v-else class="time-slider__text form-checkbox">
            <input type="checkbox" :id="id" v-model="isVisible" class="form-checkbox__checkbox"/>
            <label :for="id" class="form-checkbox__label">{{dayTitle}}</label>
        </div>
        <div class="time-slider__controls">
            <div class="time-slider__inputs" v-if="isVisible">
                <input type="text" v-model="time[0]" @input="onInput"/> - <input type="text" v-model="time[1]" @input="onInput"/>
                <span class="time-slider__error-message" role="alert">{{ errorMsg }}</span>
            </div>
            <vue-slider
                v-if="isVisible"
                v-model="value"
                :min="min"
                :max="max"
				:interval="10"
                :tooltip="none"
                :enable-cross="false"
				:dotSize="20"
				:height="8"
                @error="error"
                @change="onSliderChange"
            ></vue-slider>
        </div>
    </div>
</template>

<script>
    import Styles from './sass/core.scss';
    import VueSlider from 'vue-slider-component';

    const ERROR_TYPE = {
        VALUE: 1,
        INTERVAL: 2,
        MIN: 3,
        MAX: 4,
        ORDER: 5
    };

    module.exports = {
        name: 'my-time-slider',
        components: {
            VueSlider
        },
        props: {
            dayTitle: {
                type: String,
                required: true,
                default: ''
            },
            isDisabled: {
                type: Boolean,
                required: false,
                default: false
            },
            startTime: {
                type: String,
                required: false,
                default: '08:00',
                validator: function (value) {
                    return /^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]/g.test(value)
                }
            },
            endTime: {
                type: String,
                required: false,
                default: '17:00',
                validator: function (value) {
                    return /^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]/g.test(value)
                }
            },
            isGeneral: {
                type: Boolean,
                required: false,
                default: false
            }
        },
        data: function () {
            return {
                id: null,
                value: [this.toMinutes(this.startTime), this.toMinutes(this.endTime)],
                time: [this.startTime, this.endTime],
                isVisible: !this.isDisabled || this.isGeneral === true,
                min: 0,
                max: 1440,
                errorMsg: ''
            }
        },
        methods: {
            error(type, msg) {
                switch (type) {
                    case ERROR_TYPE.MIN:
                        break;
                    case ERROR_TYPE.MAX:
                        break;
                    case ERROR_TYPE.VALUE:
                        break;
                }
                this.errorMsg = msg;
            },
            onSliderChange() {
                this.time = this.value.map(val => this.toHHMM(val));
                this.clearErrorMsg();
                if( this.isGeneral ) {
                    this.$eventHub.$emit('slider:update', this.value);
                }
            },
            onInput(e) {
                if( !(/^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]/g.test(e.srcElement.value))) {
                    this.errorMsg = 'Wrong format! Please use HH:MM format.';
                    return;
                }
                let newValue = this.time.map(val => this.toMinutes(val));
                if(newValue[0] > newValue[1]){
                    this.errorMsg = "Start time can't exceed end time.";
                    return;
                }
                this.value = newValue;
                this.clearErrorMsg();
                if( this.isGeneral ) {
                    this.$eventHub.$emit('slider:update', this.value);
                }
            },
            clearErrorMsg() {
                this.errorMsg = ''
            },
            reset() {
                this.value = [this.toMinutes(this.startTime), this.toMinutes(this.endTime)];
                this.time = [this.startTime, this.endTime];
                this.isVisible = !this.isDisabled || this.isGeneral === true;
                this.clearErrorMsg();
            },
            update(newValue) {
                this.value = newValue;
                this.time = newValue.map(val => this.toHHMM(val));
                this.clearErrorMsg();
            },
            toHHMM (minutes) {
                let hh = Math.floor(minutes / 60);
                let mm = Math.floor(minutes - (hh * 60));

                hh = hh < 10 ? "0" + hh : hh;
                mm = mm < 10 ? "0" + mm : mm;
                return hh + ':' + mm;
            },
            toMinutes (hhmm) {
                let time = hhmm.split(':');
                let minutes = (+time[0]) * 60 + (+time[1]);
                return minutes;
            }
        },
        mounted() {
            this.id = this._uid;
            this.$eventHub.$on('slider:reset', () => {
                this.reset();
            });
            this.$eventHub.$on('slider:update', (newValue) => {
                this.update(newValue);
            });
        }
    }
</script>
