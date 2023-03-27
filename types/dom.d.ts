import { BlocksBackTop } from '../src/components/backtop/index.js'
import { BlocksBadge } from '../src/components/badge/index.js'
import { BlocksBreadcrumb } from '../src/components/breadcrumb/index.js'
import { BlocksBreadcrumbItem } from '../src/components/breadcrumb/index.js'
import { BlocksButton } from '../src/components/button/index.js'
import { BlocksButtonGroup } from '../src/components/button-group/index.js'
import { BlocksCalc } from '../src/components/calc/index.js'
import { BlocksCard } from '../src/components/card/index.js'
import { BlocksCheckbox } from '../src/components/checkbox/index.js'
import { BlocksColor } from '../src/components/color/index.js'
import { BlocksColorPicker } from '../src/components/color-picker/index.js'
import { BlocksCountdown } from '../src/components/countdown/index.js'
import { BlocksDate } from '../src/components/date/index.js'
import { BlocksDatePicker } from '../src/components/date-picker/index.js'
import { BlocksDateRangePicker } from '../src/components/date-range-picker/index.js'
import { BlocksDateTimePicker } from '../src/components/datetime-picker/index.js'
import { BlocksDateTimeRangePicker } from '../src/components/datetime-range-picker/index.js'
import { BlocksDialog } from '../src/components/dialog/index.js'
import { BlocksDrawer } from '../src/components/drawer/index.js'
import { BlocksDropdownList } from '../src/components/dropdown-list/index.js'
import { BlocksDropdownTree } from '../src/components/dropdown-tree/index.js'
import { BlocksRow } from '../src/components/grid/index.js'
import { BlocksColumn } from '../src/components/grid/index.js'
import { BlocksIcon } from '../src/components/icon/index.js'
import { BlocksImage } from '../src/components/image/index.js'
import { BlocksImageViewer } from '../src/components/image-viewer/index.js'
import { BlocksInput } from '../src/components/input/index.js'
import { BlocksIntersection } from '../src/components/intersection/index.js'
import { BlocksList } from '../src/components/list/index.js'
import { BlocksLoading } from '../src/components/loading/index.js'
import { BlocksMessage } from '../src/components/message/index.js'
import { BlocksModal } from '../src/components/modal/index.js'
import { BlocksModalMask } from '../src/components/modal-mask/index.js'
import { BlocksNavMenu } from '../src/components/nav-menu/index.js'
import { BlocksNavMenuGroup } from '../src/components/nav-menu/index.js'
import { BlocksNavMenuItem } from '../src/components/nav-menu/index.js'
import { BlocksOptGroup } from '../src/components/select/index.js'
import { BlocksOption } from '../src/components/select/index.js'
import { BlocksPagination } from '../src/components/pagination/index.js'
import { BlocksPairResult } from '../src/components/pair-result/index.js'
import { BlocksPalette } from '../src/components/palette/index.js'
import { BlocksPopup } from '../src/components/popup/index.js'
import { BlocksPopupConfirm } from '../src/components/popup-confirm/index.js'
import { BlocksPopupMenu } from '../src/components/popup-menu/index.js'
import { BlocksPopupMenuGroup } from '../src/components/popup-menu/index.js'
import { BlocksPopupMenuItem } from '../src/components/popup-menu/index.js'
import { BlocksProgress } from '../src/components/progress/index.js'
import { BlocksRadio } from '../src/components/radio/index.js'
import { BlocksRate } from '../src/components/rate/index.js'
import { BlocksSelect } from '../src/components/select/index.js'
import { BlocksSelectResult } from '../src/components/select-result/index.js'
import { BlocksSlider } from '../src/components/slider/index.js'
import { BlocksRangeSlider } from '../src/components/range-slider/index.js'
import { BlocksSplitter } from '../src/components/splitter/index.js'
import { BlocksSplitterPane } from '../src/components/splitter/index.js'
import { BlocksSteps } from '../src/components/stepper/index.js'
import { BlocksStep } from '../src/components/stepper/index.js'
import { BlocksSwitch } from '../src/components/switch/index.js'
import { BlocksTable } from '../src/components/table/index.js'
import { BlocksTag } from '../src/components/tag/index.js'
import { BlocksTime } from '../src/components/time/index.js'
import { BlocksTimePicker } from '../src/components/time-picker/index.js'
import { BlocksTooltip } from '../src/components/tooltip/index.js'
import { BlocksTree } from '../src/components/tree/index.js'
import { BlocksUpload } from '../src/components/upload/index.js'
import { BlocksVList } from '../src/components/vlist/index.js'
import { BlocksWindow } from '../src/components/window/index.js'
import { BlocksNotification } from '../src/components/notification/index.js'

declare global {
  interface HTMLElementTagNameMap {
    'bl-back-top': BlocksBackTop
    'bl-badge': BlocksBadge
    'bl-breadcrumb': BlocksBreadcrumb
    'bl-breadcrumb-item': BlocksBreadcrumbItem
    'bl-button': BlocksButton
    'bl-button-group': BlocksButtonGroup
    'bl-calc': BlocksCalc
    'bl-card': BlocksCard
    'bl-checkbox': BlocksCheckbox
    'bl-color': BlocksColor
    'bl-color-picker': BlocksColorPicker
    'bl-countdown': BlocksCountdown
    'bl-date': BlocksDate
    'bl-date-picker': BlocksDatePicker
    'bl-date-range-picker': BlocksDateRangePicker
    'bl-datetime-picker': BlocksDateTimePicker
    'bl-datetime-range-picker': BlocksDateTimeRangePicker
    'bl-dialog': BlocksDialog
    'bl-drawer': BlocksDrawer
    'bl-dropdown-list': BlocksDropdownList
    'bl-dropdown-tree': BlocksDropdownTree
    'bl-row': BlocksRow
    'bl-column': BlocksColumn
    'bl-icon': BlocksIcon
    'bl-image': BlocksImage
    'bl-image-viewer': BlocksImageViewer
    'bl-input': BlocksInput
    'bl-intersection': BlocksIntersection
    'bl-list': BlocksList
    'bl-loading': BlocksLoading
    'bl-message': BlocksMessage
    'bl-modal': BlocksModal
    'bl-modal-mask': BlocksModalMask
    'bl-nav-menu': BlocksNavMenu
    'bl-nav-menu-group': BlocksNavMenuGroup
    'bl-nav-menu-item': BlocksNavMenuItem
    'bl-notification': BlocksNotification
    'bl-optgroup': BlocksOptGroup
    'bl-option': BlocksOption
    'bl-pagination': BlocksPagination
    'bl-pair-result': BlocksPairResult
    'bl-palette': BlocksPalette
    'bl-popup': BlocksPopup
    'bl-popup-confirm': BlocksPopupConfirm
    'bl-popup-menu': BlocksPopupMenu
    'bl-popup-menu-group': BlocksPopupMenuGroup
    'bl-popup-menu-item': BlocksPopupMenuItem
    'bl-progress': BlocksProgress
    'bl-radio': BlocksRadio
    'bl-rate': BlocksRate
    'bl-select': BlocksSelect
    'bl-select-result': BlocksSelectResult
    'bl-slider': BlocksSlider
    'bl-range-slider': BlocksRangeSlider
    'bl-splitter': BlocksSplitter
    'bl-splitter-pane': BlocksSplitterPane
    'bl-steps': BlocksSteps
    'bl-step': BlocksStep
    'bl-switch': BlocksSwitch
    'bl-table': BlocksTable
    'bl-tag': BlocksTag
    'bl-time': BlocksTime
    'bl-time-picker': BlocksTimePicker
    'bl-tooltip': BlocksTooltip
    'bl-tree': BlocksTree
    'bl-upload': BlocksUpload
    'bl-vlist': BlocksVList
    'bl-window': BlocksWindow
  }
}
