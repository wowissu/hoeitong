<template src="./templates/tabpanel.html"></template>
<style lang="scss" src="./scss/_tabpanel.scss" scoped></style>

<script>

export default {
    props: {
        tabs: {
            type: Array,
            required: true
        }
    },
    data: () => {
        var $this = this;

        return {
            tabsLength: false,
            search: {
                text: '',
                tabs: [],
                focusIndex: -1
            },
        };
    },
    methods: {
        clearSearch: () => {
            this.search.text = '';
            this.search.tabs = [];
            this.search.focusIndex = -1;
        },
        addTab: (tab) => {
            this.tabs.push(tab);
            this.clearSearch();
            this.$emit('change', this.tabs);
        },
        searchResultKeyDown: (event) => {
            this.search.focusIndex = Math.min(this.search.focusIndex + 1, this.search.tabs.length - 1);
            this.search.text = this.search.tabs[this.search.focusIndex].title;
        },
        searchResultKeyUp: (event) => {
            this.search.focusIndex = Math.max(this.search.focusIndex - 1, 0);
            this.search.text = this.search.tabs[this.search.focusIndex].title;
        },
        deleteTabByIndex: (index) => {
            if (index in this.tabs) {
                this.tabs.splice(index, 1);
                this.clearSearch();
                this.$emit('change', this.tabs);
            }
        },
        searchInputOnEnter: () => {
            if (this.search.focusIndex in this.search.tabs) {
                this.addTab(this.search.tabs[this.search.focusIndex]);
            } else if (this.search.text) {
                this.addTab({
                    title: this.search.text
                });
            }
        },
        searchInputOnDelete: () => {
            if (!this.search.text) {
                this.tabs.pop();
            }
        },
        updateSearchResult: () => {
            var $this = this;

            $this.search.tabs = [];
            $this.focusIndex = -1;

            if ($this.search.text) {
                $.get('api/tab/search/' + $this.search.text)
                    .done((result) => {
                        if (result.success) {
                            $this.search.tabs = result.data;
                        }
                    });
            }
        },
        filterResult: (result) => {
            return result;
        }
    }
}

</script>