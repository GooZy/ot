<template>
  <div>
    <h2>暂无{{msg}}</h2>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        msg: '',
      };
    },
    created() {
      this.msg = this.$route.params.month;
    }
  }
</script>
