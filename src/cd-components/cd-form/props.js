export const props = {
  item: {
    type: Array,
    default: () => [],
  },
  button: {
    type: Array,
    default: () => [],
  },
  labelWidth: {
    type: [String, Number],
    default: "100px",
  },
  field: {
    type: Object,
    default: () => ({}),
  },
  fieldText: {
    type: Object,
    default: () => ({}),
  },
  loading: {
    type: Boolean,
    default: false,
  },
  loadingMask: {
    type: Boolean,
    default: false,
  },
  hidden: {
    type: Object,
    default: () => ({}),
  },
  disabled: {
    type: Object,
    default: () => ({}),
  },
  position: {
    type: String,
    default: "left",
  },
  labelPosition: {
    type: String,
    default: "right",
  },
  gutter: {
    type: Number,
    default: 0,
  },
  beforeChange: Function,
  dialog: Boolean,
  labelGray: Boolean,
  labelBlock: Boolean,
  control: {
    type: Boolean,
    default: true,
  },
  fieldData: {
    type: Object,
    default: () => ({}),
  },
  styleItem: {
    type: Object,
    default: () => ({}),
  },
  hiddenRedDot: {
    type: Boolean,
    default: false,
  },
  isEllipse: {
    type: Boolean,
    default: true,
  },
  buttonPosition: {
    type: String,
    default: "left",
  },
  buttonStyle: {
    type: Object,
    default: () => ({}),
  },
};
