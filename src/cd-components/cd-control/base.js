export const props = {
  data: {
    type: Object,
    default: () => ({}),
  },
  value: {
    type: [Number, String, Array, Date, Object],
    default: '',
  },
  header: {
    type: Object,
    default: () => ({}),
  },
  searchKeyword: {
    type: String,
    default: '',
  },
  disabled: {
    // vue3差别，不加获取不到false默认值
    type: Boolean,
    default: false,
  },
  selectValue: {
    type: [Number, String, Array, Date, Object],
    default: '',
  },
  secondValue: {
    type: String,
    default: '',
  },
  fieldData: {
    type: Object,
    default: () => ({}),
  },
  placeholder: {
    type: String,
    default: '',
  },
  clearable: {
    type: Boolean,
    default: true,
  },
  params: {
    type: Object,
    default: () => ({}),
  },
  options: {
    type: Array,
    default: () => [],
  },
  size: {
    type: String,
    default: '',
  },
  showIcon: Boolean,
  isSlot: Boolean,
}
