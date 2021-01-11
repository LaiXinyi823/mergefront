<template>
  <div style="margin-top:0;">
  <h4 style="margin-top:5px;margin-bottom:10px;">请输入您想搜索的实体:</h4>
  <el-input placeholder="请输入内容" v-model="entity.entity_name" class="input-with-select">
    <el-button slot="append" icon="el-icon-search" @click="getEntity"></el-button>
  </el-input>
  </div>
</template>

<style>
  .el-input {
    width: 120px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
<script>
export default {
  data () {
    return {
      entity: {
        entity_name: '深度学习'
      }
    };
  },
  created () {
    this.getEntity();
  },
  methods: {
    // search entity and get all related nodes
    getEntity () {
      const result = this.$http.post('get_entity', this.entity);
      console.log(result);
    }
  }

};
</script>
