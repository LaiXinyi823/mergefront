<template>
    <div style="margin-top: 10px; width:700px; margin-left:10px">
        <el-card>
            <h3>请输入问题：</h3>
            <el-input placeholder="请输入内容" v-model="question" class="input-with-select">
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
        </el-card>
        <el-card style="margin-top:20px;">
            <h3>答案：</h3>
            <el-input placeholder="" v-model="answer" class="input-with-select">
            </el-input>
        </el-card>
        <el-card style="margin-top:20px;">
            <h3>知识图谱子图：</h3>
            <div id="main" ref="graph" style="width: 600px;height:400px;"></div>
                <!-- 图中显示层数 -->
            <div style="position:absolute;margin-left:25%;bottom: 10px;">
                显示层数：
                <el-select v-model="maxDepth" placeholder="2" size="mini" @change="showEditGraph(maxDepth)">
                    <el-option
                    v-for="i in 5"
                    :key="i"
                    :label="i"
                    :value="i">
                    </el-option>
                </el-select>
            </div>
        </el-card>

    </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  created (){},
  data (){
    return {
        question:'',
        answer:'',
        graph_nodes:[],
        graph_links:[]
    }
  methods:{
      // 展示以某实体为中心的图谱
        async showEditGraph(maxDepth){
            this.graph_nodes = []; // 节点数据初始化
            this.graph_links = []; // 关系数据初始化
            const { data:res } = await this.$http.post(this.domain_id+'/graph/'+this.graph_id+'/traverse',
            {
                startVertex:this.vertex._id,
                direction:'any',
                maxDepth:parseInt(maxDepth),
                minDepth:0
            });
            
            var len=res.data.paths.length;
            // 每个path中包括1或2条边edges数组以及涉及到的节点vertices数组
            for(var i=0;i<len;i++){
                var vertices=res.data.paths[i].vertices;
                var links=res.data.paths[i].edges;
                var v_len=vertices.length;
                var l_len=links.length;
                // 获取节点数据
                for(var j=0;j<v_len;j++){
                    vertices[j]['id']=vertices[j]['_id'];
                    delete vertices[j]['_id'];
                    if(JSON.stringify(this.graph_nodes).indexOf(JSON.stringify(vertices[j]))>-1){
                    }
                    else{
                        this.graph_nodes.push(vertices[j]); // 得到与中心实体相关的所有实体
                    }
                }
                // 获取关系数据
                // 关系数据格式
                // { "source": "persons/alice","id": "knows/247922","target": "persons/bob"}
                for(var k=0;k<l_len;k++)
                {
                    var relation={
                        id:links[k]._id,
                        source:links[k]._from,
                        target:links[k]._to
                    }
                    if(links[k].length!=0 && JSON.stringify(this.graph_links).indexOf(JSON.stringify(relation))==-1)
                        this.graph_links.push(relation);
                }
                    
            }
            // 节点数据格式
            // {"id": "persons/alice","_key": "alice","_rev": "_bukg8Sa---","name": "Alice"}
            this.graph_nodes.map(function(item){
                return{
                    id:item._id
                }
            });

    // 使用Echarts展示
    var myChart = echarts.init(this.$refs.graph);
    console.log(this.graph_nodes)
    console.log(this.graph_links)
    var option = {
        title: {
            text: '中心节点: ' + this.vertex.name
        },
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
            {
                type: 'graph',
                layout: 'force',
                symbolSize: 50,
                roam: true,
                force: {
                    repulsion: 2500,
                    edgeLength: [10, 50],
                    draggable:true
                },
                itemStyle: {//配置节点的颜色
                    normal: {
                        color: function (params) {
                            if (params.dataIndex == 0)
                                return 'red'
                            else{
                                var colorList = ['yellow','orange', 'green', 'blue', 'gray'];
                                return colorList[params.dataIndex]
                            }                                        
                        },
                    }
                },
                symbolSize: function (value, params) {//改变节点大小
                    if (params.dataIndex == 0)
                        return 60
                    else
                        return 40
                },
                label: {
                    show: true
                },
                edgeSymbol: ['circle', 'arrow'],
                edgeSymbolSize: [4, 10],
                edgeLabel: {
                    fontSize: 20
                },
                nodes: this.graph_nodes, // 节点数据
                links: this.graph_links, // 关系数据
                edgeLabel: {//边的设置
                    show: true,
                    position: "middle",
                    fontSize: 12,
                    formatter: (params) => {
                        return params.data.id.split('/')[0];
                    },
                },
                lineStyle: {
                    opacity: 0.9,
                    width: 2,
                    curveness: 0
                }
                }
                ]
            };
            myChart.setOption(option);    
            //点击事件
            myChart.on('click', function (params) {
                if (params.dataType == 'node') {
                    console.log(params.name)
                }
                else if (params.dataType == 'edge'){
                    console.log(params)
                }
            });
        },
  }
  }
}
</script>

