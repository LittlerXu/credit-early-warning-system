<template>
    <div>
        <el-empty description="请前往学生列表页面进行选择">
      <el-button type="primary" @click="toList">点击前往</el-button>
    </el-empty>
    </div>
</template>

<script>
    export default {
    methods: {
            toList() {
                this.$router.push("/manager/qualificationlist")
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>