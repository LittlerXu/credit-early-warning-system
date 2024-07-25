<template>
  <div class="curriculumPlanning">
    <CreditProfile></CreditProfile>
  </div>
</template>

<script>
import CreditProfile from "./CreditProfile/CreditProfile.vue"; 
export default {
  name: "CurriculumPlanning",
  components:{CreditProfile},
  data(){
    return{

    }
  },


}
</script>

<style lang="scss">
.curriculumPlanning{
  background-color: #fff;
  border-radius: 6px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>