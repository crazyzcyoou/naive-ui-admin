<template>
  <!-- 上传简历弹窗 -->
  <UploadResumeModal
    ref="uploadRef"
    :demandId="resumeParams.demandId"
    @success="reloadTable"
  />

  <!-- 横向排列的两张卡片 -->
  <n-grid :x-gap="24">
    <n-grid-item span="6">
        <n-card :bordered="false" size="small" >
          <DemandInfo />
        </n-card>
    </n-grid-item>
    <n-grid-item span="18">
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
    </n-grid-item>
  </n-grid>

  <!-- 编辑简历弹窗 -->
  <EditResumeModal
    ref="editResumeRef"
    @success="reloadTable"
    :params="supplyData"
  />
  <AddDemandModal ref="addRef" />
</template>


<script lang="ts" setup>
import { FormSchema, useForm } from '@/components/Form';
import { basicModal, useModal } from '@/components/Modal';
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
import DemandInfo from './components/DemandInfo.vue';
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
  pageSize: 20
});

const supplyData = ref({
});

const schemas: FormSchema[] = [
    {
      field: 'proposal_document',
      component: 'NInput',
      label: '联络文',
      componentProps: {
        type: 'textarea',
        placeholder: '请输入联络文......',
      },
    },
    {
      field: 'role',
      component: 'NInput',
      label: '角色',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
      rules: [{ required: false, message: '', trigger: ['blur'] }],
    },
    {
      field: 'specialty',
      component: 'NInput',
      label: '得意分野',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
      rules: [{ required: false, message: '', trigger: ['blur'] }],
    },
    {
      field: 'citizenship',
      component: 'NInput',
      label: '国籍',
      componentProps: {
        placeholder: '',
      },
      rules: [{ required: false, message: '', trigger: ['blur'] }],
    },
    {
      field: 'price',
      component: 'NInput',
      label: '单价/万円',
      componentProps: {
        placeholder: '',
      },
      rules: [{ required: false, message: '', trigger: ['blur'] }],
    },
    {
      field: 'nearest_station',
      component: 'NInput',
      label: '最近车站',
      componentProps: {
        placeholder: '',
      },
      rules: [{ required: false, message: '', trigger: ['blur'] }],
    },
    {
      field: 'work_percent',
      component: 'NInput',
      label: '工作占比',
      componentProps: {
        placeholder: '',
      },
      rules: [{ required: false, message: '', trigger: ['blur'] }],
    },
    {
      field: 'japanese_level',
      component: 'NInput',
      label: '日语等级',
      componentProps: {
        placeholder: '',
      },
      rules: [{ required: false, message: '', trigger: ['blur'] }],
    },
    {
      field: 'english_level',
      component: 'NInput',
      label: '英语等级',
      componentProps: {
        placeholder: '',
      },
      rules: [{ required: false, message: '', trigger: ['blur'] }],
    },
    {
      field: 'belonging_suppliers',
      component: 'NInput',
      label: '所属供应商',
      componentProps: {
        placeholder: '',
      },
      rules: [{ required: false, message: '', trigger: ['blur'] }],
    },
  ];
  const [registerForm, {  }] = useForm({
    gridProps: { cols: 1 },
    collapsedRows: 3,
    labelWidth: 80,
    layout: 'horizontal',
    submitButtonText: '保存',
    showActionButtonGroup: false,
    schemas,
  });

  const [modalRegister, {  }] = useModal({
    title: '编辑',
    subBtuText: '保存',
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
  supplyData.value = record;
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

<style scoped src="../demand-supply.css">
.proCard {
  flex: 1;
  min-width: 0;
}
</style>

