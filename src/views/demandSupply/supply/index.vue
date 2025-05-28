<template>

  <!-- 上传简历弹窗 -->
  <UploadResumeModal
    ref="uploadRef"
    :demand-id="resumeParams.demandId"
    @success="reloadTable"
  />

  <n-card :bordered="false" class="proCard">
    <BasicTable
      ref="resumeRef"
      :striped="true"
      :request="loadResume"
      :columns="resumeColumns"
      :row-key="(row) => row.id"
      :actionColumn="actionColumn"
    >
      <template #tableTitle>
        <n-space>
          <n-button type="primary" @click="openUpload">
            <template #icon>
              <n-icon>
                <PlusOutlined />
              </n-icon>
            </template>
            新建
          </n-button>
          <n-button type="primary" @click="backToDemandList">返回需求列表</n-button>
        </n-space>
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
import { NButton, NSpace, useMessage, useDialog } from 'naive-ui';
import { getSupplyList, deleteSupply } from '@/api/demandSupply/supply';
import { getDemandInfo } from '@/api/demandSupply/demand';
import { PlusOutlined } from '@vicons/antd';
import { resumeColumns } from './columns';
import UploadResumeModal from './components/UploadResumeModal.vue';
import EditResumeModal from './components/EditResumeModal.vue';
import { DeleteOutlined, EditOutlined } from '@vicons/antd';
const route = useRoute();
const router = useRouter();
const message = useMessage();
const resumeRef = ref();
const uploadRef = ref();
const editResumeRef = ref();
const currentDemand = ref(null);

const resumeParams = reactive({
  demandId: 0,
  pageSize: 10
});

// 操作列定义
const actionColumn = reactive({
  width: 180,
  title: '操作',
  key: 'action',
  fixed: 'right',
  render(record) {
    return h(TableAction, {
      style: 'button',
      actions: [
        {
          label: '编辑',
          icon: EditOutlined,
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
  const { items = [], page = 1, total = 0 } = data;
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
      currentDemand.value = await getDemandInfo(resumeParams.demandId);
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
async function openEditDemand(record) {
  editResumeRef.value.openModal();
}


// 删除简历
async function handleDelete(record) {
  try {
    dialog.info({
      title: '提示',
      content: `您想删除${record.name}`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        message.success('删除成功');
        reloadTable();
      },
      onNegativeClick: () => {},
    });
    await deleteSupply(record.id);
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
  const demandId = Number(route.query.demandId);
  if (demandId) {
    resumeParams.demandId = demandId;
    loadDemandInfo();
  }
  reloadTable();
});
</script>

<style scoped src="./demand-supply.css"></style>
