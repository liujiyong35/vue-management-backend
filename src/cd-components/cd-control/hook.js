import { reactive } from 'vue'
export function controlHook(props) {
  const control_init = reactive({
    placeholder: props.data.placeholder || props.placeholder,
    width: props?.data?.width || '100%',
    size: props?.data?.size || '',
    multiple: props?.data?.multiple || false,
    radio: props?.data?.radio || false,
    maxlength: props?.data?.maxlength || 128,
    max: props?.data?.max || 1000000000000000,
    value_type: props?.data?.value_type,
    disabled: props.data.disabled || props.disabled,
    limit: props.data.limit,
  })

  return {
    control_init,
  }
}
