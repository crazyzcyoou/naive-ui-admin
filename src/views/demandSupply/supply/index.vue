<template>
    
  <!-- 上传简历弹窗 -->
  <UploadResumeModal 
    ref="uploadRef" 
    :demand-id="resumeParams.demandId" 
    @success="reloadTable" 
  />
    
  <!-- 编辑需求弹窗
  <EditDemandModal ref="editDemandRef" :demand="currentDemand" @success="loadDemandInfo" /> -->
    

  <n-card :bordered="false" class="proCard">
    <BasicTable
      ref="resumeRef"
      :columns="resumeColumns"
      :request="loadResume"
      :row-key="(row) => row.id"
      :actionColumn="actionColumn"
    >
      <template #tableTitle>
        <n-button type="primary" @click="openUpload">上传简历</n-button>

        <n-button type="primary" @click="backToDemandList">返回需求列表</n-button>

        <div class="demand-info">
          <n-tag type="info">当前需求: </n-tag>
        </div>
      </template>
    </BasicTable>
  </n-card>
  <!-- 编辑简历弹窗 -->
  <EditResumeModal ref="editResumeRef" @success="reloadTable" />
  <AddDemandModal ref="addRef" />
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, h } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { BasicTable, TableAction } from '@/components/Table';
import { NButton, NSpace, NTag, useMessage } from 'naive-ui';
import { getSupplyList, deleteSupply } from '@/api/demandSupply/supply';
import { getDemandList } from '@/api/demandSupply/demand';
import { resumeColumns } from './columns';
import UploadResumeModal from './components/UploadResumeModal.vue';
import EditResumeModal from './components/EditResumeModal.vue';
import EditDemandModal from './components/EditDemandModal.vue';

const route = useRoute();
const router = useRouter();
const message = useMessage();
const resumeRef = ref();
const uploadRef = ref();
const editResumeRef = ref();
const editDemandRef = ref();
const currentDemand = ref(null);

const resumeParams = reactive({ 
  demandId: 0, 
  pageSize: 10 
});



// 操作列定义
const actionColumn = reactive({
  width: 150,
  title: '操作',
  key: 'action',
  fixed: 'right',
  render(record) {
    return h(TableAction, {
      style: 'button',
      actions: [
        {
          label: '编辑',
          onClick: openEditDemand.bind(null, record),
        },
        {
          label: '删除',
          // 可以根据需要添加确认提示
          onClick: handleDelete.bind(null, record),
  
        },
      ],
    });
  },
});

// 加载简历列表
const loadResume = async (res) => {
  const data = await getSupplyList({ ...resumeParams, ...res });
  
  // 解构拿到必要字段，避免 data.xxx 重复书写
  const { items = [], page = 1, total = 0 } = data;

  // 拼装表格所需的数据结构
  return {
    list: items,
    page: page,
    itemCount: total,
    pageCount: Math.ceil(total / resumeParams.pageSize),
    pageSize: resumeParams.pageSize,
  };
};

// 加载需求信息
const loadDemandInfo = async () => {
  if (resumeParams.demandId) {
    try {
      currentDemand.value = await getDemandList(resumeParams.demandId);
    } catch (error) {
      message.error('获取需求信息失败');
    }
  }
};

// 打开上传弹窗
function openUpload() {
  // if (!resumeParams.demandId) {
  //   return message.warning('请先选择一个需求');
  // }
  uploadRef.value.openModal();
}

// 打开编辑需求弹窗
function openEditDemand(record) {
  editResumeRef.value.openModal();
}


// 删除简历
async function handleDelete(record) {
  try {
    await deleteSupply(record.id);
    message.success('删除成功');
    reloadTable();
  } catch (error) {
    message.error('删除失败');
  }
}

// 返回需求列表
function backToDemandList() {
  router.push({ path: '/demand-supply/demand', query: {} });
}

// 重新加载表格
function reloadTable() {
  resumeRef.value?.reload();
}

onMounted(() => {
  // 从URL路径参数获取需求ID
  const demandId = Number(route.query.demandId);
  if (demandId) {
    resumeParams.demandId = demandId;
    loadDemandInfo();
  }
  reloadTable();
});


</script>

<style scoped>
.demand-info {
  display: flex;
  align-items: center;
}
</style>
