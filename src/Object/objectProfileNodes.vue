<template>
<div id="profile_nodes">
    <div class="treenode_wrapper">
        <treenode class="treenode" :node="node" :root="node"></treenode>
    </div>
    <!-- <div class="popup_wrapper" v-if="nodeRemover">
        <popup name="askNodeRemove" :show="true">
            <template slot="content">
                <div class="node_remover_wrapper">
                    <div class="node_remover">
                        <div class="node_remover_inner">
                            <div class="node_title"><small>是否刪除</small> {{ nodeRemover.node.title }}</div>
                            <div class="node_buttons">
                                <button @click="popupOk"><i class="fa fa-check"></i>確認</button>
                                <button @click="popupNo"><i class="fa fa-remove"></i>取消</button>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </popup>
    </div> -->
</div>
</template>

<script>
module.exports = {
    components: {
        treenode: require('./TreeNode.vue')
    },
    props: {
        object: {
            type: Object,
            required: true
        }
    },
    data() {
        var hoverId = 0;
        var $this = this;

        return {
            nodeRemover: false,
            formstate: {},
            node: {
                get id() { return $this.object.id; },
                get title() { return $this.object.title; },
                get summary() { return $this.object.summary; },
                get type() { return $this.object.type; },
                get model() { return $this.object.model; },
                get spec() { return $this.object.spec; },
                // hidden: true,
                children: []
            }
        };
    },
    mounted() {
        var $this = this, $subtracted;

        $this.$bus.$once('object.change', (obj) => {
            $this.getTree(obj.id);
        });

        if ($this.$route.params.id == $this.object.id) {
            $this.$bus.$emit('object.change', $this.object);
        }

        // node remove event
        this.$bus.on('node.remove', (remover) => {
            this.nodeRemover = remover;
        });
    },
    methods: {
        getTree(id) {
            var $this = this;

            return new Promise((resolve, reject) => {
                $.get('api/object/{id}/nodes'.replace('{id}', id))
                    .done((result) => {
                        if (result.success) {
                            $this.node.children = result.data;
                            resolve(result.data);
                        }
                    })
                    .fail((result) => {
                        console.error(result.message);
                        reject();
                    });
            });
        },
        popupOk() {
            this.nodeRemover();
            this.nodeRemover = false;
        },
        popupNo() {
            this.nodeRemover = false;
        }
    }
}
</script>


<style lang="sass">
#profile_nodes
    max-width: 500px
    min-width: 300px
    width: 50vw

    .node_remover_wrapper
        width: 80vw
        padding-top: 50%
        max-width: 400px

        .node_remover
            position: absolute
            background-color: #fff
            left: 0
            top: 0
            width: 100%
            height: 100%
            padding: 10px 20px
            box-shadow: 0px 0px 10px #777
            border-radius: 4px

        .node_remover_inner
            position: relative
            width: 100%
            height: 100%

        .node_buttons
            position: absolute
            bottom: 0
            right: 0

        .node_title
            font-size: 18px
            font-weight: bold
</style>