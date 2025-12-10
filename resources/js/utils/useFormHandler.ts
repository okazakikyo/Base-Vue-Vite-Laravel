import { InvalidSubmissionContext } from "vee-validate";

export const useFormErrorHandler = () => {
    const onInvalidSubmitError = ({ errors }: InvalidSubmissionContext): void => {
        const firstErrorFieldName = Object.keys(errors)[0];
        const el = document.querySelector(`[name="${firstErrorFieldName}"]`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return {
        onInvalidSubmitError,
    };
};
