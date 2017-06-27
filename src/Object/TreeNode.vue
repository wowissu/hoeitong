<template>
<div class="node"
    :class="{
        node__haschild: has_child,
        node__unfold: unfold,
        node__recoverable: node.deleted_at
    }"
>
    <div class="node_header" :type="node.type" :id="node.id" v-show="!node.hidden">
        <div class="node_header_inner">
            <span class="node_type">
                <span class="node_type__part" @click="unfold = !unfold">
                    <i class="fa fa-folder-open" v-if="unfold"></i>
                    <i class="fa fa-folder" v-else></i>
                </span>
                <span class="node_type__spec"><i class="fa fa-link"></i></span>
            </span>
            <span class="node_amount" v-if="!is_root">
                <div class="node_amount_input" v-text="node.amount"></div>
            </span>
            <a href="javascript:void(0)" v-text="node.title" class="node_title"></a>
            <span class="node_spec" v-text="node.spec"></span>
            <span class="node_tool_bar" style="float: right;" v-if="!is_root">
                <span class="node_tool" @click="remove" v-show="!node.deleted_at"><i class="fa fa-trash-o"></i></span>
                <span class="node_tool" @click="recover" v-show="node.deleted_at"><i class="fa fa-undo"></i></span>
            </span>
        </div>
    </div>
    <ul class="node_ul" v-show="unfold">
        <li class="node_li" v-for="child in children">
            <treenode :node="child" :parent="node" :root="root"></treenode>
        </li>
    </ul>
</div>
</template>

<script>
export default {
    name: 'treenode',
    props: {
        root      : { type : Object },
        parent    : { type : Object },
        node      : { type : Object, reuqired : true },
        childnode : { type : String, default  : 'children' }
    },
    data() {
        return {
            unfold: true
        };
    },
    computed: {
        is_root(val) {
            return this.node === this.root;
        },
        has_child() {
            if (this.childnode in this.node && this.children instanceof Array) {
                if (this.children.length) {
                    return true;
                }
            }

            return false;
        },
        children() {
            return this.node[this.childnode];
        }
    },
    methods: {
        remove() {
            var $this = this;

            $.delete('api/object/{id}/delete'.replace('{id}', $this.node.id))
                .done((res) => {
                    if (res.success) {
                        $this.node.deleted_at = res.data.deleted_at;
                        $this.unfold = false;
                    }
                })
                .fail((res) => {

                });
        },
        recover() {
            var $this = this;

            $.post('api/object/{id}/recover'.replace('{id}', $this.node.id))
                .done((res) => {
                    if (res.success) {
                        $this.node.deleted_at = null;
                        $this.unfold = true;
                    }
                })
                .fail((res) => {

                });
        },
    }
}
</script>

<style lang="scss" src="./scss/treenode.scss" scoped></style>