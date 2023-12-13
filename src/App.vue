<script setup lang="ts">
import { ref } from "vue";
import { Editor } from "../lib/index";

const editorData = ref([]);
</script>

<template>
  <Editor :data-list="editorData" />
</template>

<style scoped></style>
