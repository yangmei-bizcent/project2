<template>
  <div class="dep-selector">
    <el-button class="btn-4-letters" @click="triggerCheckboxPanel">选择科室</el-button>
    <div class="checkbox-panel" :class="{ 'show-anime': showPanel }" v-show="showPanel">
      <p class="panel-title">选择科室</p>
      <div class="checkbox-wrap">
        <el-scrollbar class="scrollbar">
          <el-checkbox-group v-model="currentModel" class="checkbox-group">
            <el-checkbox v-for="(item, index) of list" :key="index" :label="item.officeId">
              {{ item.officeName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-scrollbar>
      </div>
      <div class="panel-footer">
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </div>
    <div class="tags-wrap">
      <label v-for="(item, index) of tagList" :key="index" class="tag-items">
        <span>{{ item.name }}</span><span class="close-icon" @click="deleteItem(index)"></span>
      </label>
    </div>
  </div>
</template>

<script>
  const mapping = {};
  export default {
    props: {
      model: Array,
      list: Array
    },
    data() {
      return {
        showPanel: false,
        currentModel: [],
        tagList: [],
      }
    },
    created() {
      this.initModel();
    },
    mounted() {
      document.querySelector('.page-layout').addEventListener('click', e => {
        this.isIncludesEle(e.target);
      });
    },
    methods: {
      //初始化model
      initModel() {
        this.currentModel = Object.assign([], this.model);
        this.generateMapping(this.list);
        this.tagList = this.updateTagList();
      },
      //更新tag
      updateTagList() {
        let temp = [];
        this.tagList = [];
        for (let item of this.currentModel) {
          temp.push({
            name: mapping[item],
            id: item,
          });
        }
        return temp;
      },
      //更新currentModel
      updateCurrentModel() {
        let temp = []
        for (let item of this.tagList) {
          temp.push(item.id);
        }
        return temp;
      },
      //生成id-name映射表
      generateMapping(list) {
        for (let item of list) {
          mapping[item.officeId] = item.officeName;
        }
      },
      //点击选择科室按钮
      triggerCheckboxPanel() {
        if (!this.showPanel) {
          this.currentModel = Object.assign([], this.model);
        }
        this.showPanel = !this.showPanel;
      },
      //点击确认
      confirm() {
        this.tagList = this.updateTagList();
        this.showPanel = false;
        this.$emit('change', this.currentModel);
      },
      //删除标签
      deleteItem(index) {
        this.tagList.splice(index, 1);
        this.currentModel = this.updateCurrentModel();
        this.$emit('change', this.currentModel);
      },
      //查找元素是否在该组件内
      isIncludesEle(element) {
        if (element.className === 'dep-selector') {
          return;
        }
        if (element === document) {
          this.showPanel = false;
          return;
        }
        this.isIncludesEle(element.parentNode);
      }
    },
    watch: {
      model(val) {
        this.currentModel = Object.assign([], val);
        this.tagList = this.updateTagList();
      },
      list(val) {
        this.generateMapping(val);
        this.tagList = this.updateTagList();
      }
    }
  }

</script>

<style lang="scss" scoped>
  .dep-selector {
    position: relative;
  }

  .dep-selector /deep/ .el-checkbox {
    margin-left: 30px;
  }

  .checkbox-panel {
    background: #FFFFFF;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.14);
    width: 430px;
    height: 370px;
    overflow: hidden;
    position: absolute;
    top: -375px;
    left: 0;
    z-index: 1;
  }

  .panel-title {
    line-height: 18px;
    font-size: 16px;
    color: #1B223B;
    letter-spacing: -0.98px;
    padding: 16px 32px;
    border-bottom: 1px solid #E7E7E7;
  }

  .scrollbar {
    height: 100%;
  }

  .scrollbar /deep/ .el-scrollbar__wrap {
    overflow-x: hidden;
  }

  .checkbox-wrap {
    height: 250px;
  }

  .checkbox-group {
    padding: 16px 0;
  }

  .panel-footer {
    padding: 18px 32px;
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid #E7E7E7;
  }

  .tags-wrap {
    margin-top: 13px;
    line-height: 34px;
  }

  .tag-items {
    line-height: 18px;
    font-size: 12px;
    border: 1px solid #CCC;
    border-radius: 12px;
    margin-right: 10px;
    display: inline-block;
    padding: 2px 0;

    span {
      padding: 4px 11px;
    }
  }

  .close-icon {
    border-left: 1px solid #CCC;
    cursor: pointer;
    background: url('~@/assets/img/numberSourceSetting/icon_close.png') no-repeat center;
    background-size: 15px 15px;
  }

  .show-anime {
    animation: heightChange .2s;
  }

  @keyframes heightChange {
    from {
      height: 0;
    }

    to {
      height: 370px;
    }
  }

</style>

<style lang="scss">
  @import '~@/assets/css/general';

</style>
