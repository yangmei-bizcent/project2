<template>
    <div 
        :class="hasBottomLine?'bottom-line':''"
        class="page-title-noleftmenu bgcolor-white fontsize10 color-333 bold paddingtop30 marginX40 flex-alignstart-justifystart">
        {{ pageTitle }}
    </div>
</template>

<script>
export default {
    props: ['pageTitle', 'hasBottomLine'],
}
</script>

<style lang="scss">
.page-title-noleftmenu {
    .bottom-line {
        border-bottom: 1px solid #e6e6e6;
        padding-bottom: 14px;
    }
}
</style>
