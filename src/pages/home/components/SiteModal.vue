<script setup lang="ts">
const modalStore = useModalStore()
const errorInput = ref(false)

function handleAllCommit(e: Event) {
  if (modalStore.inputValues.name.length <= 0 ||
      ('site' === modalStore.target && modalStore.inputValues.url.length <= 0)) {
    errorInput.value = true
    setTimeout(() => errorInput.value = false, 1000)
    return
  }
  modalStore.handleCommit()
  setTimeout(() => errorInput.value = false, 1000)
}
</script>

<template>
  <n-modal
    v-model:show="modalStore.modalVisible"
    preset="dialog"
    title="Dialog"
    :show-icon="false"
    :closable="false"
    :auto-focus="true"
    :on-after-leave="modalStore.clearInput"
  >
    <template #header>
      <div>{{ modalStore.title }}</div>
    </template>
    <div>
      <n-input 
        :status="errorInput && modalStore.inputValues.name.length <= 0 ? 'error' : 'success'" 
        v-model:value="modalStore.inputValues.name" 
        placeholder="名称" 
        my-8
        @keydown.enter="handleAllCommit" 
      />
      <n-input
        v-if="modalStore.target === 'site'"
        v-model:value="modalStore.inputValues.url"
        placeholder="链接"
        my-8
        @keydown.enter="handleAllCommit"
        :status="errorInput && modalStore.inputValues.url.length <= 0 ? 'error' : 'success'"
      />
      <n-input
        v-if="modalStore.target === 'site'"
        v-model:value="modalStore.inputValues.favicon"
        placeholder="图标链接（选填）"
        my-8
        @keydown.enter="handleAllCommit"
      />
    </div>
    <template #action>
      <div flex gap-x-12>
        <n-button @click="modalStore.handleCancel">
          取消
        </n-button>
        <n-button v-if="modalStore.action === 'update'" type="error" @click="modalStore.handleDelete">
          删除
        </n-button>
        <n-button type="primary" text-color='#ffffff' @click="handleAllCommit">
          确认
        </n-button>
      </div>
    </template>
  </n-modal>
</template>
