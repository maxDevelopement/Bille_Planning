<script>
  import { RouterView } from 'vue-router'

  export default{
    name: 'App',
    components: {
      RouterView
    }
  }
</script>
<template>
  <RouterView />
</template>
<style>
    html, body{
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        background-color: #39393b;
        color: white;
    }
    #app{
      display: block;
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
    }
</style>