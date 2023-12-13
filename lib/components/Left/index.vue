<template>
  <div class="nav-layout">
    <div class="nav-wrap">
      <div
        @click="handleChange(index)"
        class="nav-item"
        :class="{ active: navActiveIndex === index }"
        v-for="(item, index) in navList"
        :key="index"
      >
        <Icon class="nav-item-icon" :icon="item.icon" size="30" />
        <div class="nav-item-text">{{ item.text }}</div>
      </div>
    </div>
  </div>
  <div class="res-layout">
    <!-- <div class="res-wrap"> -->
    <template v-for="(item, index) in navList">
      <component :is="item.component" v-if="navActiveIndex === index" :key="index" />
    </template>
    <!-- </div> -->
  </div>
</template>

<script lang="ts" setup name="EditorLeft">
  import { ref } from 'vue';
  import { Icon } from '/@/components/Icon';
  import ResPage from './ResPage.vue';
  import ResEle from './ResEle.vue';
  import ResUpload from './ResUpload.vue';
  import ResPic from './ResPic.vue';
  import ResSvg from './ResSvg.vue';

  let navActiveIndex = ref<number>(0);
  let navList = [
    {
      icon: 'ant-design:book-outlined',
      text: '页面',
      component: ResPage,
    },
    {
      icon: 'ant-design:build-outlined',
      text: '组件',
      component: ResEle,
    },
    {
      icon: 'ant-design:picture-outlined',
      text: '照片',
      component: ResPic,
    },
    {
      icon: 'iconoir:svg-format',
      text: '素材',
      component: ResSvg,
    },
    {
      icon: 'ant-design:cloud-upload-outlined',
      text: '上传',
      component: ResUpload,
    },
  ];
  const handleChange = (index: number) => {
    navActiveIndex.value = index;
  };
</script>
<style lang="less" scoped>
  .nav-layout {
    position: absolute;
    left: 0;
    top: 0;
    width: 60px;
    height: 100%;
    text-align: center;
    z-index: 1000;
    .nav-wrap {
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      background-color: #f0f3f3;
    }
    .nav-item {
      position: relative;
      display: inline-block;
      text-align: center;
      width: 60px;
      height: 80px;
      cursor: pointer;
      transition: all 0.25s;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #333;
      &.active,
      &:hover {
        color: #1890ff;
      }
      &.active {
        background: #fff;
      }
      &-icon {
        font-size: 20px;
        display: inline-block;
      }
      &-text {
        font-size: 12px;
        margin-top: 4px;
      }
    }
  }
  .res-layout {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    left: 60px;
    width: 280px;
    background: #fff;
    user-select: none;
    z-index: 99;
  }
  .res-wrap {
    height: 100%;
    padding: 15px;
    overflow-y: auto;
    overflow-x: hidden;
  }
</style>
