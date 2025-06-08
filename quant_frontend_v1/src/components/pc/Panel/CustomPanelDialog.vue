<template>
    <div class="custom-dialog" v-if="dialogVisible" :class="{ fullscreen: props.containerMode === 'fullscreen' }">
        <div class="mask" @click.self="handleClose"></div>
        <div class="dialog-box" :style="{ width: containerMode === 'container' ? '90%' : '500px' }">
            <div class="dialog-header">
                <span>编辑信息</span>
                <button class="close-btn" @click="handleClose">×</button>
            </div>
            <div class="dialog-body">
                <el-form :model="localFormData" :label-width="props.containerMode === 'fullscreen' ? '100px' : '80px'" ref="formRef">
                    <el-form-item v-for="field in formFields" :key="field.key" :label="field.label">
                        <el-input v-if="field.type === 'input'" v-model="localFormData[field.key]"
                            :placeholder="field.placeholder || ''" />
                        <el-input v-else-if="field.type === 'textarea'" v-model="localFormData[field.key]"
                            type="textarea" :rows="3" :placeholder="field.placeholder || ''" />
                    </el-form-item>
                </el-form>
            </div>
            <div class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleSubmit">提交</el-button>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ElMessage } from 'element-plus';
import { ref, watch, defineProps, defineEmits, onMounted } from 'vue';

onMounted(() => {
    console.log(props);
    dialogVisible.value = props.modelValue;
});
const props = defineProps<{
    modelValue: boolean;
    formType: string;
    formData: Record<string, any>;
    formFields: Array<{
        key: string;
        label: string;
        type: 'input' | 'textarea';
        placeholder?: string;
    }>;
    containerMode?: 'fullscreen' | 'container';
}>();

const emit = defineEmits(['update:modelValue', 'submit']);

const dialogVisible = ref(false);
const localFormData = ref<Record<string, any>>({ ...props.formData });

watch(
    () => props.modelValue,
    (val) => {
        dialogVisible.value = val;
    }
);
const formRef = ref();
const handleClose = () => {
    dialogVisible.value = false;
    emit('update:modelValue', false);
};
const handleSubmit = () => {
    formRef.value.validate((valid) => {
        if (valid) {
            emit('submit', {
                formType: props.formType,
                data: localFormData.value,
            });
        } else {
            ElMessage.error('请检查表单输入');
            return false;
        }
    });
};
</script>
<style lang="scss" scoped>
.custom-dialog {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    &.fullscreen {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .mask {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(2px);
    }
    .dialog-box {
        max-width: 100%;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        overflow: hidden;
        animation: fadeIn 0.3s ease-in-out;
        /* container 模式下的样式 */
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%);

        @media (max-width: 600px) {
            width: 90% !important;
        }
    }
    .fullscreen .dialog-box {
        position: relative !important;
        transform: none !important;
        top: auto !important;
        left: auto !important;
        margin: auto !important;
    }
    .dialog-header {
        padding: 16px;
        font-size: 16px;
        font-weight: bold;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .close-btn {
            font-size: 20px;
            background: none;
            border: none;
            cursor: pointer;
        }
    }
    .dialog-body {
        padding: 12px 8px; // 减少左右 padding
    }
    .dialog-footer {
        padding: 12px 16px;
        text-align: right;
        border-top: 1px solid #eee;
    }
}
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translate(-50%, -4%);
    }

    to {
        opacity: 1;
        transform: translate(-50%, -50%);
    }
}
</style>
