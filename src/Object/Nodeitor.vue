<template>
<div class="nodeditor_wrapper">
    <div class="nodeditor_header">
        <slot name="header"></slot>
    </div>
    <div class="nodeditor">
        <div class="nodeditor_inner">
            <vue-form id="objectProfile" :state="formstate" class="vf-form profile_form" @submit.prevent="submit">

                <validate tag="div" class="vf-group">
                    <label class="vf-label" for="title">名稱：</label>
                    <div class="vf-field">
                        <input type="text" class="vf-control" v-model.trim="node.title" required name="title" placeholder="*必填">
                        <field-messages name="title" show="$dirty && $touched" class="vf-after-field">未儲存</field-messages>
                    </div>
                </validate>

                <validate tag="div" class="vf-group">
                    <label class="vf-label" for="title">數量：</label>
                    <div class="vf-field">
                        <input type="number" class="vf-control" v-model.number="node.amount" name="amount" min="0">
                        <field-messages name="amount" show="$dirty && $touched" class="vf-after-field">未儲存</field-messages>
                    </div>
                </validate>

                <validate tag="div" class="vf-group">
                    <label class="vf-label" for="title">型號：</label>
                    <div class="vf-field">
                        <input type="text" class="vf-control" v-model.trim="node.model" name="model">
                        <field-messages name="model" show="$dirty && $touched" class="vf-after-field">未儲存</field-messages>
                    </div>
                </validate>

                <validate tag="div" class="vf-group">
                    <label class="vf-label" for="title">規格：</label>
                    <div class="vf-field">
                        <input type="text" class="vf-control" v-model.trim="node.spec" name="spec">
                        <field-messages name="spec" show="$dirty && $touched" class="vf-after-field">未儲存</field-messages>
                    </div>
                </validate>

                <validate tag="div" class="vf-group">
                    <label class="vf-label" for="summary">備註：</label>
                    <div class="vf-field">
                        <textarea type="text" class="vf-control" v-model="node.summary" name="summary" style="height: 150px"></textarea>
                        <field-messages name="summary" show="$dirty && $touched" class="vf-after-field">未儲存</field-messages>
                    </div>
                </validate>

                <div class="vf-group" v-if="node.tabs">
                    <label class="vf-label">標籤：</label>
                    <div class="vf-field">
                        <tabpanel :tabs="node.tabs" @change="tabchanged = true"></tabpanel>
                        <div v-show="tabchanged" class="vf-after-field">未儲存</div>
                    </div>
                </div>

                <div class="vf-footer">
                    <button class="vf-submit" type="button" @click="undo"><i class="fa fa-undo"></i> 復原</button>
                </div>
            </vue-form>
        </div>
    </div>
</div>
</template>

<script>

export default {
    components: {
        tabpanel: require('../Tab/TabPanel.vue')
    },
    name: 'nodeditor',
    props: {
        node: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            tabchanged: false,
            formstate: {},
            origin: Object.assign({}, this.node)
        }
    },
    mounted() {},
    methods: {
        undo() {
            for (var key in this.node) {
                if (key in this.origin) {
                    this.node[key] = this.origin[key];
                } else {
                    delete this.node[key];
                }
            }

            this.formstate._reset();
            this.$emit('undo', this.node);
        }
    }
}
</script>

<style lang="sass" scoped>
@import "~styles/mixins/flex"

.nodeditor_wrapper
    width: 80vw
    max-width: 500px
    background-color: #fff
    box-shadow: 0px 0px 10px #777
    border-radius: 4px

.nodeditor
    position: relative
    left: 0
    top: 0
    width: 100%
    padding: 10px 70px 10px 30px

.nodeditor_inner
    position: relative
    width: 100%
    height: 100%

.nodeditor_header
    @include flexbox()
    @include flex-just(flex-end)
    position: relative
    padding: 10px
    background-color: #2e88d0
    color: #fff
</style>