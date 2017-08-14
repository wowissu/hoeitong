<template>
    <div id="manual">
        <!-- <froala :tag="'textarea'" :config="froalaConfig" v-model="object.summary"></froala> -->
    </div>
</template>

<script>
// import VueFroala from 'vue-froala-wysiwyg';

export default {
    name: 'objectProfileManual',
    props: ['object'],
    data() {
        return {
            froalaConfig: {
                placeholderText: 'Edit Your Content Here!',
                charCounterCount: false
            }
        };
    }
}
</script>
