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
                        <input type="text" class="vf-control" v-model.trim="avatars.title" required name="title" placeholder="*必填">
                        <field-messages name="title" show="$dirty && $touched" class="vf-after-field">未儲存</field-messages>
                    </div>
                </validate>

                <validate tag="div" class="vf-group">
                    <label class="vf-label" for="title">型號：</label>
                    <div class="vf-field">
                        <input type="text" class="vf-control" v-model.trim="avatars.model" name="model">
                        <field-messages name="model" show="$dirty && $touched" class="vf-after-field">未儲存</field-messages>
                    </div>
                </validate>

                <validate tag="div" class="vf-group">
                    <label class="vf-label" for="title">規格：</label>
                    <div class="vf-field">
                        <input type="text" class="vf-control" v-model.trim="avatars.spec" name="spec">
                        <field-messages name="spec" show="$dirty && $touched" class="vf-after-field">未儲存</field-messages>
                    </div>
                </validate>

                <validate tag="div" class="vf-group">
                    <label class="vf-label" for="summary">備註：</label>
                    <div class="vf-field">
                        <textarea type="text" class="vf-control" v-model="avatars.summary" name="summary" style="height: 150px"></textarea>
                        <field-messages name="summary" show="$dirty && $touched" class="vf-after-field">未儲存</field-messages>
                    </div>
                </validate>

                <!-- <div class="vf-group" v-if="avatars.tabs">
                    <label class="vf-label">標籤：</label>
                    <div class="vf-field">
                        <tabpanel :tabs="avatars.tabs" @change="tabchanged = true"></tabpanel>
                        <div v-show="tabchanged" class="vf-after-field">未儲存</div>
                    </div>
                </div> -->

                <div class="vf-footer">
                    <button class="vf-submit" type="submit">儲存</button>
                </div>
            </vue-form>
        </div>
    </div>
</div>
</template>

<script>

export default {
    name: 'nodeditor',
    props: {
        node: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            formstate: {},
            avatars: Object.assign({}, this.node)
        }
    },
    mounted() {},
    methods: {
        submit() {
            if (this.formstate.$valid && this.avatars) {
                $.put('api/object/{id}'.replce('{id}', this.avatars.id), {
                    id      : avatars.id,
                    title   : avatars.title,
                    summary : avatars.summary,
                    model   : avatars.model,
                    spec    : avatars.spec,
                    images  : avatars.images
                    // tabs    : avatars.tabs
                })
                    .done((res) => {
                        if (res.success) {
                            this.node.id      = res.data.id;
                            this.node.title   = res.data.title;
                            this.node.spec    = res.data.spec;
                            this.node.model   = res.data.model;
                            this.node.summary = res.data.summary;
                            this.node.images  = res.data.images;
                        }
                    })
                    .fail(() => {

                    });
            }
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

.nodeditor_close
    ursor: pointer
</style>