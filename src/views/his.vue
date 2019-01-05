<template>
  <div class="his">
    <el-tree
      :props="defaultProps"
      :data="data"
      node-key="id"
      :default-expand-all="false"
      :highlight-current="true"
      :expand-on-click-node="false"
      @node-click="nodeClick">
      <span slot-scope="{ node, data }">
        <span>{{ `${ node.label } (type: ${ data.type })` }}</span>
        <span>
          <el-dropdown trigger="click" @command="handleCommand($event, data)">
            <el-button type="text">
              新增子节点<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(item, index) of nodeType"
                :key="index"
                :command="item">
                {{ item }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button type="text" @click="remove(node, data)">删除节点</el-button>
        </span>
      </span>
    </el-tree>

    <el-form :model="configForm" label-width="150px">
      <el-form-item label="key" v-show="typeof configForm.key !== 'undefined'">
        <el-input v-model="configForm.key"></el-input>
      </el-form-item>

      <el-form-item label="value" v-show="typeof configForm.value !== 'undefined'">
        <el-input v-model="configForm.value"></el-input>
      </el-form-item>

      <el-form-item label="valueType" v-show="typeof configForm.valueType !== 'undefined'">
        <el-input v-model="configForm.valueType"></el-input>
      </el-form-item>

      <el-form-item label="srcParamPath" v-show="typeof configForm.srcParamPath !== 'undefined'">
        <el-input v-model="configForm.srcParamPath"></el-input>
      </el-form-item>
    </el-form>

    <el-button type="primary" @click="save">保存</el-button>
  </div>
</template>

<script>
const nodeParams = new Map([
  ['NodeLeafConstant', {
    key: '',
    value: '',
    valueType: ''
  }],
  ['NodeContainer', {
    key: '',
    srcParamPath: ''
  }]
]);

export default {
  data () {
    return {
      defaultProps: {
        children: 'nodeList',
        label: 'key'
      },
      nodeType: ['NodeLeafConstant', 'NodeContainer'],
      configForm: {
        key: '',
        value: '',
        valueType: '',
        srcParamPath: ''
      },
      data: [
        {
          "type": "NodeLeafConstant",
          "key": "app_id",
          "value": "zsyy_android",
          "valueType": "String"
        }, {
          "type": "NodeLeafConstant",
          "key": "app_key",
          "value": "ZW5sNWVWOWhibVJ5YjJsaw==",
          "valueType": "String"
        }, {
          "type": "NodeLeafConstant",
          "key": "coder",
          "value": "enNseVpXNXNOV1ZXT1doaWJWSjVZakpzYXc9PQ",
          "valueType": "String"
        }, {
          "type": "NodeLeafConstant",
          "key": "api_name",
          "value": "api.nuts.invoker",
          "valueType": "String"
        }, {
          "type": "NodeContainer",
          "key": "data",
          "srcParamPath": "",
          "nodeList": [
            {
              "type": "NodeContainer",
              "key": "invoker_content",
              "srcParamPath": "",
              "nodeList": [
                {
                  "type": "NodeLeafConstant",
                  "key": "apiId",
                  "value": "QueryDeptSchema",
                  "valueType": "String"
                }, {
                  "type": "NodeLeafConstant",
                  "key": "UseWay",
                  "value": "卓健",
                  "valueType": "String"
                }, {
                  "type": "NodeLeafConstant",
                  "key": "TransCode",
                  "value": "2004",
                  "valueType": "String"
                }, {
                  "type": "NodeLeafConstant",
                  "key": "UserId",
                  "value": "ZJYY",
                  "valueType": "String"
                }, {
                  "type": "NodeLeafConstant",
                  "key": "DeptCode",
                  "value": "1014",
                  "valueType": "String"
                }, {
                  "type": "NodeLeafConstant",
                  "key": "SeeDate",
                  "value": "2018-7-1",
                  "valueType": "String"
                }, {
                  "type": "NodeLeafConstant",
                  "key": "EndDate",
                  "value": "2018-7-5",
                  "valueType": "String"
                }
              ]
            }
          ]
        }
      ]
    }
  },
  created () {
    this.configForm = this.data[0];
  },
  methods: {
    nodeClick (data, node, component) {
      this.configForm = data;
    },
    handleCommand (command, data) {
      const newChild = Object.assign({ type: command }, nodeParams.get(command));
      if (!data.nodeList) {
        this.$set(data, 'nodeList', []);
      }
      data.nodeList.push(newChild);
    },
    remove (node, data) {
      //console.log(node);
      const parent = node.parent;
      const nodeList = parent.data.nodeList || parent.data;
      const index = nodeList.findIndex(d => d.$treeNodeId === data.$treeNodeId);
      nodeList.splice(index, 1);
    },

    save () {
     // console.log(this.data);
    }
  }
}
</script>

<style lang="scss">

</style>
