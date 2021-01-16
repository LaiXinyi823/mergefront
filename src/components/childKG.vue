<template>
  <el-container>
    <el-aside
      width="500px"
      height="100%"
      class="childKG"
    >
      <el-card shadow="always">
        <h5 style="margin:0;display:inline;width:50px;">
          生成子图
        </h5>
        <el-divider
          content-position="left"
          style="margin:15px"
        />
        <div class="block">
          <el-image
            :src="src"
            style="width:40%;margin-left:30%;"
          />
        </div>
        <template>
          <el-table
            :data="tableData"
            height="250"
            font-size="12px"
            border
            style="width: 100%;"
            :row-style="{height: '10px'}"
            :cell-style="{padding: '0'}"
          >
            <el-table-column
              fixed
              prop="order"
              label="序号"
              width="50"
            />
            <el-table-column
              prop="entity1Name"
              label="起点实体"
              width="80"
            />
            <el-table-column
              prop="entity1Type"
              label="起点实体类型"
              width="110"
            />
            <el-table-column
              prop="entity2Name"
              label="终点实体"
              width="80"
            />
            <el-table-column
              prop="entity2Type"
              label="终点实体类型"
              width="110"
            />
            <el-table-column
              prop="relationType"
              label="关系类型"
              width="80"
            />
            <el-table-column
              fixed="right"
              label="操作"
              width="100"
            >
              <template slot-scope="scope">
                <el-button
                  @click="handleClick(scope.row)"
                  type="text"
                  size="small"
                >
                  查看
                </el-button>
                <el-button
                  type="text"
                  size="small"
                >
                  编辑
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-card>
    </el-aside>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
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
  },
  methods: {
    handleClick (row) {
      console.log(row);
    }
  }
};
</script>

<style lang="less" scoped>
.childKG{
  margin-top:15px;
  height:100%;
}

.tableBlock{
  margin-top:5px;
}
</style>
