<template>
<div id="profile_nodes">
    <div class="treenode_wrapper" >
        <treenode class="treenode" :node="object" :root="object"></treenode>
    </div>
    <div class="popup_container" v-if="targetNode">
        <popup name="targetNode">
            <template slot="content">
                <nodeitor :node="targetNode">
                    <template slot="header">
                        <span class="nodeditor_close" @click="targetNode = false">
                            <div class="show"><i class="fa fa-window-close-o"></i></div>
                            <div class="hover"><i class="fa fa-window-close"></i></div>
                        </span>
                    </template>
                </nodeitor>
            </template>
        </popup>
    </div>
</div>
</template>

<script>
module.exports = {
    components: {
        treenode: require('./TreeNode.vue'),
        nodeitor: require('./Nodeitor.vue')
    },
    props: {
        object: { type: Object, required: true }
    },
    data() {
        var $this = this;

        return {
            targetNode: false,
            node: {
                get id() { return $this.object.id; },
                get title() { return $this.object.title; },
                get summary() { return $this.object.summary; },
                get type() { return $this.object.type; },
                get model() { return $this.object.model; },
                get spec() { return $this.object.spec; },
            }
        };
    },
    mounted() {
        this.$bus.$on('click.node.title', (node) => {
            this.targetNode = node;
        });
    }
}
</script>


<style lang="sass">
#profile_nodes
    max-width: 500px
    min-width: 300px
    width: 50vw

    .nodeditor_close
        cursor: pointer


        .hover,
        &:hover .show
            display: none

        .show
        &:hover .hover
            display: inline-block
</style>