<template>
    <a href="#" @click="onClick" class="reset-link"><slot></slot></a>
</template>

<script>
    import Styles from './sass/core.scss';
    module.exports = {
        name: 'my-reset-sliders',

        methods: {
            onClick(e) {
                e.preventDefault();
                this.$eventHub.$emit('slider:reset');
            }
        }
    }
</script>
