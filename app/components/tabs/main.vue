<template>
<div class="tabs"><slot></slot></div>
</template>

<script>
    import Styles from './sass/core.scss';

    module.exports = {
        name: 'sx-tabs',

        data() {
            return {
                tabs: '',
                panels: '',
                currentTab: '',
                activeClass: 'is-active',
                activeTabHash: ''
            };
        },

        props: {
            defaultActive: {
                type: Number,
                required: false,
                default: 0
            }
        },

        methods: {
            setTab(e) {
                if (e.target) {
                    this.currentTab = e.target.getAttribute('href').substr(1);
                    this.setActiveClass();
                } else if (typeof e === 'number') {
                    this.currentTab = this.tabs[e].getAttribute('href').substr(1);
                    this.setActiveClass();
                } else if (typeof e === 'string') {
                    for (let tab of this.tabs) {
                        if (tab.hash === this.activeTabHash) {
                            this.currentTab = tab.hash.substring(1);
                            this.setActiveClass();
                        }
                    }
                }
                if (e && e.preventDefault) e.preventDefault();
            },
            setActiveClass(e) {
                for (let i = 0; i < this.panels.length; i++) {
                    let panelId = this.panels[i].getAttribute('data-id');

                    if (panelId === this.currentTab) {
                        this.panels[i].classList.add(this.activeClass);
                        this.tabs[i].classList.add(this.activeClass);
                        this.panels[i].style.display = 'block';
                    } else {
                        this.panels[i].classList.remove(this.activeClass);
                        this.tabs[i].classList.remove(this.activeClass);
                        this.panels[i].style.display = 'none';
                    }
                }
            }
        },
        mounted() {
            this.tabs = this.$el.querySelectorAll('.js-button');
            this.panels = this.$el.querySelectorAll('.js-panel');
            this.activeTabHash = window.location.hash;

            Array.prototype.forEach.call(
                this.tabs,
                tab => {
                    tab.addEventListener('click', this.setTab);
                },
                this
            );

            if (this.activeTabHash !== '') {
                this.setTab(this.activeTabHash);
            } else {
                let activeItemExists = false;
                for (let i = 0; i < this.tabs.length; i++) {
                    if (this.tabs[i].classList.contains('is-active')) {
                        activeItemExists = true;
                        this.setTab(i);
                    }
                }
                if (!activeItemExists) {
                    this.setTab(this.defaultActive);
                }
            }
        },
        destroyed() {
            Array.prototype.forEach.call(this.tabs, tab => {
                tab.removeEventListener('click', this.setTab);
            });
        }
    }
</script>
