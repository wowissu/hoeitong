<template>
<div class="node"
    :class="{
        node__haschild: has_child,
        node__unfold: is_unfold,
        node__recoverable: Boolean(node.deleted_at)
    }"
>
    <div class="node_header"
        :type="node.type"
        :id="node.id"
        :class="{ root_node: is_root }"
        @click="Mfocus(node)"
    >
        <div class="node_header_inner" :class="{ node_focus: is_focus }">
            <span class="node_type">
                <!-- Folder -->
                <span class="node_type__part" @click="is_unfold = !is_unfold">
                    <i class="fa fa-folder-open" v-if="is_unfold"></i>
                    <i class="fa fa-folder" v-else></i>
                </span>
                <!-- Link -->
                <span class="node_type__spec">
                    <i class="fa fa-link"></i>
                </span>
            </span>
            <span class="node_amount" v-if="!is_root">
                <div class="node_amount_input">{{ node.amount }}</div>
            </span>
            <a class="node_title" href="javascript:void(0)" @click="MTriggerTitleClick">{{ node.title }}</a>
            <span class="node_spec">{{ node.spec }}</span>
            <span class="node_tool_bar" style="float: right;">
                <template v-if="Boolean(node.deleted_at)">
                    <!-- Recover Node -->
                    <span class="node_tool" v-show="!is_root">
                        <span @click="MRecover"><i class="fa fa-undo"></i></span>
                    </span>
                </template>
                <template v-else>
                    <!-- Search Material -->
                    <!-- <span class="node_tool add_link" v-if="node.type == 3">
                        <i class="fa fa-folder"></i>
                        <i class="fa fa-plus-circle"></i>
                    </span> -->
                    <!-- Create Folder -->
                    <span class="node_tool create_folder" v-show="node.type == 3" @click="MAddFolder">
                        <i class="fa fa-folder"></i>
                        <i class="fa fa-plus-circle"></i>
                    </span>
                    <!-- Remove Node -->
                    <span class="node_tool" v-show="!is_root">
                        <span @click="MRemove"><i class="fa fa-trash-o"></i></span>
                    </span>
                </template>
            </span>
        </div>
    </div>
    <ul class="node_ul" v-show="is_unfold">
        <li class="node_li" v-for="child in children">
            <treenode :node="child" :parent="node"></treenode>
        </li>
    </ul>
    <template v-if="node.type == 4">
        <div class="link_material_panel">
            <label for="">
                <input type="text" @change="MSearchMaterialChange" v-model.trim="search.text">
            </label>
            <template v-if="search.result.length">
                <ul class="">
                    <li v-for="row in search.result">
                        {{ row.id }}{{ row.title }}
                    </li>
                </ul>
            </template>
        </div>
    </template>
</div>
</template>

<script>

export default {
    name: 'treenode',
    props: {
        parent    : { type : Object },
        node      : { type : Object, reuqired : true },
        childnode : { type : String, default  : 'children' }
    },
    data() {
        return {
            is_unfold: true,
            nodeFocus: false,
            search: {
                text: '',
                result: []
            }
        };
    },
    computed: {
        nodeRootComponent() {
            if (this.$parent.$options._componentTag == 'treenode') {
                return this.$parent.nodeRootComponent;
            } else {
                return this;
            }
        },
        is_root() {
            return this.node === this.nodeRootComponent.node;
        },
        is_focus() {
            return this.nodeRootComponent.nodeFocus === this.node;
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
            return this.node[this.childnode] || (this.node[this.childnode] = []);
        }
    },
    methods: {
        Mfocus(node) {
            this.nodeRootComponent.nodeFocus = node;
        },
        MRemove() {
            this.node.deleted_at = new Date();
            this.is_unfold = false;
        },
        MRecover() {
            console.log('MRecover:', this.node);
            this.node.deleted_at = null;
            this.is_unfold = true;
        },
        MTriggerTitleClick(evt) {
            this.$bus.$emit('click.node.title', this.node);
        },
        MAddFolder() {
            console.log('MAddFolder:', this.node);

            this.$set(this.children, this.children.length, {
                title: '新資料夾',
                amount: 1,
                type: 3,
                parent_id: this.node.id,
            });

            this.$forceUpdate();
        },
        MSearchMaterialChange() {
            if (this.search.text) {

                var url = 'api/object/search?text={text}'.replace('{text}', this.search.text);

                $.get(encodeURI(url))
                    .done((res) => {
                        if (res.success) {
                            this.search.result = res.data;
                        }
                    })
                    .fail(() => {

                    });
            }
        },
    }
}
</script>

<style lang="scss" src="./scss/treenode.scss" scoped></style>