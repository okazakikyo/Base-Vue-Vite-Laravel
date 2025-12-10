import { toast } from 'vue3-toastify';

import SuccessToast from '@/components/toasts/SuccessToast.vue';

export const useToastMessage = (message: string) => {
    toast(SuccessToast, {
        type: 'success',
        expandCustomProps: true,
        icon: false,
        closeButton: false,
        autoClose: 3000,
        position: 'bottom-center',
        contentProps: {
            message: message,
        },
    });
};
