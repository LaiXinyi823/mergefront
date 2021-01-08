<template>
    <el-container>
      <el-aside width="95%" height="100%" class="originKG">
        <el-card shadow="always">
          <h4 style="margin:0;display:inline;width:50px;">关联图谱如下：</h4>
          <el-divider content-position="left" style="margin:10px"></el-divider>
          <h4 style="float:left;margin-top:5px;">筛选实体间的关系:</h4>
          <el-select v-model="value" placeholder="请选择" style="margin-left:10px;width:150px;font-size:20px;">
            <el-option
            v-for="item in options"
            height="10"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
          </el-select>
          <el-button type="primary" icon="el-icon-check" size="mini" style="margin-left:10px;margin-top:5px;" circle></el-button>
          <div style="margin-left:30%;">
            <el-button type="primary" style="margin-left:10px;margin-top:20px;" round>添加新节点</el-button>
            <el-button type="primary" round>添加源节点</el-button>
            <el-button type="primary" round>添加终节点</el-button>
          </div>
          <div class="block">
            <el-image :src="src"></el-image>
          </div>
          <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
              fixed
              prop="order"
              label="序号"
              width="110">
            </el-table-column>
            <el-table-column
              prop="entity1Name"
              label="起点实体"
              width="130">
            </el-table-column>
            <el-table-column
              prop="entity1Type"
              label="起点实体类型"
              width="120">
            </el-table-column>
            <el-table-column
              prop="entity2Name"
              label="终点实体"
              width="130">
            </el-table-column>
            <el-table-column
              prop="entity2Type"
              label="终点实体类型"
              width="120">
            </el-table-column>
            <el-table-column
              prop="relationType"
              label="关系类型"
              width="120">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="100">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="medium"><i class="el-icon-edit"></i></el-button>
                <el-button type="text" size="medium"><i class="el-icon-delete"></i></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-aside>
    </el-container>
</template>

<script>
export default {
  methods: {
    handleClick (row) {
      console.log(row);
    }
  },
  data () {
    return {
      src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      options: [{
        value: '选项1',
        label: '同指关系'
      }, {
        value: '选项2',
        label: '应用关系'
      }, {
        value: '选项3',
        label: '对比关系'
      }],
      value: '',
      tableData: [{
        order: '1',
        entity1Name: 'BILSTM-CRF',
        entity1Type: '处理',
        entity2Name: 'CRF',
        entity2Type: '处理任务',
        relationType: '对比关系'
      }, {
        order: '2',
        entity1Name: '数据集',
        entity1Type: '处理方法',
        entity2Name: '双向',
        entity2Type: '处理任务',
        relationType: '应用关系'
      }, {
        order: '3',
        entity1Name: '双向',
        entity1Type: '处理任务',
        entity2Name: 'BILSTM-CRF',
        entity2Type: '处理',
        relationType: '同指关系'
      }, {
        order: '4',
        entity1Name: '双向',
        entity1Type: '处理任务',
        entity2Name: 'BILSTM-CRF',
        entity2Type: '处理',
        relationType: '同指关系'
      }, {
        order: '5',
        entity1Name: '双向',
        entity1Type: '处理任务',
        entity2Name: 'BILSTM-CRF',
        entity2Type: '处理',
        relationType: '同指关系'
      }
      ]
    };
  }
};
</script>

<style lang="less" scoped>
.originKG{
  margin-top:0px;
  height:100%;
}
// el-button 按钮样式
.el-button--primary {
  font-size: 12px;
  margin-left: 80%;
  margin-top: 10px;
}

.block{
  height:50%;
  width:50%;
  margin-top:10px;
  margin-left:25%;
}

.el-icon-delete {
  color: #ff1e1e;
  font-size: 20px;
}

.el-icon-edit {
  color: #1e2dff;
  font-size: 20px;
}
</style>
