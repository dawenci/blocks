import { BlBackTop } from '../src/components/backtop/index.js'
import { BlBadge } from '../src/components/badge/index.js'
import { BlBreadcrumb } from '../src/components/breadcrumb/index.js'
import { BlBreadcrumbItem } from '../src/components/breadcrumb/index.js'
import { BlButton } from '../src/components/button/index.js'
import { BlButtonGroup } from '../src/components/button-group/index.js'
import { BlCalc } from '../src/components/calc/index.js'
import { BlCard } from '../src/components/card/index.js'
import { BlCheckbox } from '../src/components/checkbox/index.js'
import { BlCloseButton } from '../src/components/close-button/index.js'
import { BlColor } from '../src/components/color/index.js'
import { BlColorPicker } from '../src/components/color-picker/index.js'
import { BlCountdown } from '../src/components/countdown/index.js'
import { BlDate } from '../src/components/date/index.js'
import { BlDatePicker } from '../src/components/date-picker/index.js'
import { BlDateTime } from '../src/components/datetime/index.js'
import { BlDateRangePicker } from '../src/components/date-range-picker/index.js'
import { BlDateTimePicker } from '../src/components/datetime-picker/index.js'
import { BlDateTimeRangePicker } from '../src/components/datetime-range-picker/index.js'
import { BlDialog } from '../src/components/dialog/index.js'
import { BlDrawer } from '../src/components/drawer/index.js'
import { BlDropdownList } from '../src/components/dropdown-list/index.js'
import { BlDropdownTree } from '../src/components/dropdown-tree/index.js'
import { BlRow } from '../src/components/grid/index.js'
import { BlColumn } from '../src/components/grid/index.js'
import { BlIcon } from '../src/components/icon/index.js'
import { BlImage } from '../src/components/image/index.js'
import { BlImageViewer } from '../src/components/image-viewer/index.js'
import { BlInput } from '../src/components/input/index.js'
import { BlIntersection } from '../src/components/intersection/index.js'
import { BlList } from '../src/components/list/index.js'
import { BlLoading } from '../src/components/loading/index.js'
import { BlMessage } from '../src/components/message/index.js'
import { BlModal } from '../src/components/modal/index.js'
import { BlModalMask } from '../src/components/modal-mask/index.js'
import { BlNavMenu } from '../src/components/nav-menu/index.js'
import { BlNavMenuGroup } from '../src/components/nav-menu/index.js'
import { BlNavMenuItem } from '../src/components/nav-menu/index.js'
import { BlOptGroup } from '../src/components/select/index.js'
import { BlOption } from '../src/components/select/index.js'
import { BlPagination } from '../src/components/pagination/index.js'
import { BlPairResult } from '../src/components/pair-result/index.js'
import { BlPalette } from '../src/components/palette/index.js'
import { BlPopup } from '../src/components/popup/index.js'
import { BlPopupConfirm } from '../src/components/popup-confirm/index.js'
import { BlPopupMenu } from '../src/components/popup-menu/index.js'
import { BlPopupMenuGroup } from '../src/components/popup-menu/index.js'
import { BlPopupMenuItem } from '../src/components/popup-menu/index.js'
import { BlProgress } from '../src/components/progress/index.js'
import { BlRadio } from '../src/components/radio/index.js'
import { BlRate } from '../src/components/rate/index.js'
import { BlSelect } from '../src/components/select/index.js'
import { BlSelectResult } from '../src/components/select-result/index.js'
import { BlSlider } from '../src/components/slider/index.js'
import { BlRangeSlider } from '../src/components/range-slider/index.js'
import { BlSplitter } from '../src/components/splitter/index.js'
import { BlSplitterPane } from '../src/components/splitter/index.js'
import { BlSteps } from '../src/components/stepper/index.js'
import { BlStep } from '../src/components/stepper/index.js'
import { BlSwitch } from '../src/components/switch/index.js'
import { BlTable } from '../src/components/table/index.js'
import { BlTag } from '../src/components/tag/index.js'
import { BlTime } from '../src/components/time/index.js'
import { BlTimePicker } from '../src/components/time-picker/index.js'
import { BlTooltip } from '../src/components/tooltip/index.js'
import { BlTree } from '../src/components/tree/index.js'
import { BlUpload } from '../src/components/upload/index.js'
import { BlVList } from '../src/components/vlist/index.js'
import { BlWindow } from '../src/components/window/index.js'
import { BlNotification } from '../src/components/notification/index.js'

declare global {
  interface HTMLElementTagNameMap {
    'bl-back-top': BlBackTop
    'bl-badge': BlBadge
    'bl-breadcrumb': BlBreadcrumb
    'bl-breadcrumb-item': BlBreadcrumbItem
    'bl-button': BlButton
    'bl-button-group': BlButtonGroup
    'bl-calc': BlCalc
    'bl-card': BlCard
    'bl-checkbox': BlCheckbox
    'bl-close-button': BlCloseButton
    'bl-color': BlColor
    'bl-color-picker': BlColorPicker
    'bl-countdown': BlCountdown
    'bl-date': BlDate
    'bl-date-picker': BlDatePicker
    'bl-datetime': BlDateTime
    'bl-date-range-picker': BlDateRangePicker
    'bl-datetime-picker': BlDateTimePicker
    'bl-datetime-range-picker': BlDateTimeRangePicker
    'bl-dialog': BlDialog
    'bl-drawer': BlDrawer
    'bl-dropdown-list': BlDropdownList
    'bl-dropdown-tree': BlDropdownTree
    'bl-row': BlRow
    'bl-column': BlColumn
    'bl-icon': BlIcon
    'bl-image': BlImage
    'bl-image-viewer': BlImageViewer
    'bl-input': BlInput
    'bl-intersection': BlIntersection
    'bl-list': BlList
    'bl-loading': BlLoading
    'bl-message': BlMessage
    'bl-modal': BlModal
    'bl-modal-mask': BlModalMask
    'bl-nav-menu': BlNavMenu
    'bl-nav-menu-group': BlNavMenuGroup
    'bl-nav-menu-item': BlNavMenuItem
    'bl-notification': BlNotification
    'bl-optgroup': BlOptGroup
    'bl-option': BlOption
    'bl-pagination': BlPagination
    'bl-pair-result': BlPairResult
    'bl-palette': BlPalette
    'bl-popup': BlPopup
    'bl-popup-confirm': BlPopupConfirm
    'bl-popup-menu': BlPopupMenu
    'bl-popup-menu-group': BlPopupMenuGroup
    'bl-popup-menu-item': BlPopupMenuItem
    'bl-progress': BlProgress
    'bl-radio': BlRadio
    'bl-rate': BlRate
    'bl-select': BlSelect
    'bl-select-result': BlSelectResult
    'bl-slider': BlSlider
    'bl-range-slider': BlRangeSlider
    'bl-splitter': BlSplitter
    'bl-splitter-pane': BlSplitterPane
    'bl-steps': BlSteps
    'bl-step': BlStep
    'bl-switch': BlSwitch
    'bl-table': BlTable
    'bl-tag': BlTag
    'bl-time': BlTime
    'bl-time-picker': BlTimePicker
    'bl-tooltip': BlTooltip
    'bl-tree': BlTree
    'bl-upload': BlUpload
    'bl-vlist': BlVList
    'bl-window': BlWindow
  }
}
