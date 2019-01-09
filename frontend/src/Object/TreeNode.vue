<template>
<div class="node" :class="{
    node__haschild: has_child,
    node__unfold: is_unfold
}">
    <div class="node_header"
        :type="node.type"
        :id="node.id"
        :class="{ root_node: is_root }"
        @click="Mfocus(node)"
    >
        <div class="node_header_inner"
            :class="{
                node_focus: is_focus,
                node_deleted: Boolean(node.deleted_at)
            }"
        >
            <div class="node_header_bar" :class="{ no_id: !node.id }">
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
                    <!-- Deleted Toolbar -->
                    <template v-if="is_root">

                    </template>
                    <template v-else>
                        <template v-if="Boolean(node.deleted_at)">
                            <!-- Recover Node -->
                            <span class="node_tool" v-show="!is_root">
                                <span @click.stop="MRecover"><i class="fa fa-undo"></i></span>
                            </span>
                        </template>
                        <!-- Dir Toolbar -->
                        <template v-else-if="node.type == 3">
                            <!-- Create Folder -->
                            <span class="node_tool">
                                <span @click.stop="MAddFolder" title="新增資料夾"><i class="fa fa-folder"></i></span>
                            </span>
                            <!-- Create Link -->
                            <span class="node_tool">
                                <span @click.stop="MAddLink" title="新增連結"><i class="fa fa-link"></i></span>
                            </span>
                            <!-- Remove Node -->
                            <span class="node_tool" v-show="!is_root">
                                <span @click.stop="MRemove"><i class="fa fa-trash-o"></i></span>
                            </span>
                            <!-- <span class="node_tool">
                                <dropdown>
                                    <template slot="list">
                                        <div class="list_content">
                                            list content
                                        </div>
                                    </template>
                                </dropdown>
                            </span> -->
                        </template>
                        <!-- Link Toolbar -->
                        <template v-else-if="node.type == 4">
                            <template v-if="search.showing">
                                <span class="node_tool" @click="search.showing = false">
                                    <i class="fa fa-close" aria-hidden="true"></i>
                                </span>
                            </template>
                            <template v-else>
                                <!-- Search Material -->
                                <span class="node_tool" @click="search.showing = true">
                                    <i class="fa fa-search"></i>
                                </span>
                                <!-- Remove Node -->
                                <span class="node_tool" v-if="!is_root" @click.stop="MRemove">
                                    <i class="fa fa-trash-o"></i>
                                </span>
                            </template>
                        </template>
                    </template>
                </span>
            </div>
            <template v-if="node.type == 4">
                <div class="link_material_panel" v-if="search.showing && is_focus">
                <!--  -->
                    <div class="search_wrapper">
                        <searchbar v-model="search.text" @change="MSearchMaterialChange" @clean="MSearchMaterialChange" ref="searchbar"></searchbar>
                    </div>
                    <ul class="link_material_list">
                        <template v-if="search.loading">
                            <li>搜尋中...</li>
                        </template>
                        <template v-else-if="search.result.length">
                            <li v-for="(material, index) in search.result" :key="index">
                                <div class="link_material_item_inner">
                                    <span class="item_icon">
                                        <i class="fa fa-gear" v-if="material.type == 1"></i>
                                        <i class="fa fa-link" v-if="material.type == 4"></i>
                                    </span>
                                    <span class="item_title">{{ material.title }}</span>
                                    <span class="item_model" v-show="material.model">({{ material.model }})</span>
                                    <small class="item_spec">{{ material.spec }}</small>
                                    <span class="item_copy" style="float:right;" title="複製資訊" @click="MlinkThisMaterial(material)">
                                        <i class="fa fa-copy"></i> 套用
                                    </span>
                                </div>
                            </li>
                        </template>
                        <template v-else>
                            <li>無搜尋結果</li>
                        </template>
                    </ul>
                </div>
            </template>
        </div>
    </div>
    <ul class="node_ul" v-show="is_unfold">
        <li class="node_li" v-for="(child, index) in children" :key="index">
            <treenode :node="child" :parent="node"></treenode>
        </li>
    </ul>
</div>
</template>

<script>
import $ from 'jquery';
import searchbar from '../Searchbar.vue';
import dropdown from '../Dropdown.vue';

var showing;

function SearchControl (NodeComponent) {
    var $this = this;

    Object.defineProperty($this, 'showing', {
        set: function (val) {
            if (val) {
                if (showing !== NodeComponent._uid) {
                    $this.clean();
                }

                showing = NodeComponent._uid;
            } else {
                showing = false;
            }

            NodeComponent.$forceUpdate();
        },
        get: function () {
            return showing === NodeComponent._uid;
        }
    });

    this.clean();
}

SearchControl.prototype.clean = function () {
    this.text = '';
    this.result = [];
    this.loading = false;
    return this;
};

export default {
    name: 'treenode',
    components: {
        searchbar,
        dropdown
    },
    props: {
        parent: {type: Object},
        node: {type: Object, reuqired: true},
        childnode: {type: String, default: 'children'}
    },
    data () {
        return {
            origin: {},
            is_unfold: true,
            nodeFocus: false,
            search: new SearchControl(this)
        };
    },
    mounted () {
        this.node[this.childnode] = [];
    },
    // created () {
    //     this.$on('treenode.unfold.all', () => {
    //         this.is_unfold = true;
    //     });

    //     this.$on('treenode.fold.all', () => {
    //         this.is_unfold = false;
    //     });
    // },
    computed: {
        nodeRootComponent () {
            if (this.$parent.$options._componentTag === 'treenode') {
                return this.$parent.nodeRootComponent;
            } else {
                return this;
            }
        },
        is_root () {
            return this.node === this.nodeRootComponent.node;
        },
        is_focus () {
            return this.nodeRootComponent.nodeFocus === this.node;
        },
        has_child () {
            if (this.childnode in this.node && this.children instanceof Array) {
                if (this.children.length) {
                    return true;
                }
            }

            return false;
        },
        children () {
            return this.node[this.childnode];
        }
    },
    methods: {
        Mfocus (node) {
            this.nodeRootComponent.nodeFocus = node;
        },
        MRemove () {
            this.node.deleted_at = new Date();
            this.is_unfold = false;
        },
        MRecover () {
            this.node.deleted_at = null;
            this.is_unfold = true;
        },
        MTriggerTitleClick (evt) {
            this.$bus.$emit('click.node.title', this.node);
        },
        MAddFolder () {
            this.children.unshift({
                title: '新資料夾',
                amount: 1,
                type: 3,
                parent_id: this.node.id
            });

            this.$forceUpdate();
        },
        MAddLink () {
            this.children.unshift({
                title: '新連結',
                amount: 1,
                type: 4,
                parent_id: this.node.id
            });

            this.$forceUpdate();
        },
        MSearchMaterialChange () {
            if (!this.search.text) {
                this.search.clean();
            } else {
                var url = 'api/object/search?text={text}'.replace('{text}', this.search.text);

                this.search.loading = true;

                $.get(encodeURI(url))
                    .done((res) => {
                        if (res.success) {
                            this.search.result = res.data;
                        }
                    })
                    .always(() => {
                        setTimeout(() => {
                            this.search.loading = false;
                        }, 200);
                    });
            }
        },
        MlinkThisMaterial (material) {
            this.node.relate_id = material.type === 4 ? material.relate_id : material.id;
            this.node.title = material.title;
            this.node.model = material.model;
            this.node.spec = material.spec;
            this.node.summary = material.summary;
            this.node.type = 4;
            this.search.showing = false;
        }
    }
}
</script>

<style lang="scss" src="./scss/treenode.scss"></style>