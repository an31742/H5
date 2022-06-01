/**
 * 该文件是为了按需加载，剔除掉了一些不需要的框架组件。
 * 减少了编译支持库包大小
 */
import Vue from 'vue'
import {
  CountDown, NavBar, Sticky, Button, Cell, CellGroup, Icon, Row, Col, Field, Dialog, DropdownMenu, DropdownItem, Loading, Notify, PullRefresh,
  SwipeCell, Toast, Divider, ImagePreview, Lazyload, List, NoticeBar, Skeleton, Swipe, SwipeItem, Tag, Grid, GridItem, IndexBar, IndexAnchor, Tab,
  Tabs, Tabbar, TabbarItem, Panel, Image, Picker, Popup, Uploader, Step, Steps, Overlay, Form, Rate, RadioGroup, Radio, Search, Stepper, Calendar,
  DatetimePicker, ActionSheet, CheckboxGroup, Checkbox, Popover, Empty, Circle, Progress, Cascader
} from 'vant'

Vue.use(CountDown)
Vue.use(NavBar)
Vue.use(Sticky)
Vue.use(Button)
Vue.use(Cell).use(CellGroup)
Vue.use(Icon)
Vue.use(Row).use(Col)
Vue.use(Field)
Vue.use(Dialog)
Vue.use(DropdownMenu).use(DropdownItem)
Vue.use(Loading)
Vue.use(Notify)
Vue.use(PullRefresh)
Vue.use(SwipeCell)
Vue.use(Toast)
Vue.use(Divider)
Vue.use(ImagePreview)
Vue.use(Lazyload)
Vue.use(List)
Vue.use(NoticeBar)
Vue.use(Skeleton)
Vue.use(Swipe).use(SwipeItem)
Vue.use(Tag)
Vue.use(Grid).use(GridItem)
Vue.use(IndexBar).use(IndexAnchor)
Vue.use(Tab).use(Tabs)
Vue.use(Tabbar).use(TabbarItem)
Vue.use(Panel)
Vue.use(Image)
Vue.use(Picker)
Vue.use(Popup)
Vue.use(Uploader)
Vue.use(Step).use(Steps)
Vue.use(Overlay)
Vue.use(Form)
Vue.use(Rate)
Vue.use(RadioGroup).use(Radio)
Vue.use(CheckboxGroup).use(Checkbox)
Vue.use(Search)
Vue.use(Stepper)
Vue.use(Calendar)
Vue.use(DatetimePicker)
Vue.use(ActionSheet)
Vue.use(Popover)
Vue.use(Empty)
Vue.use(Circle)
Vue.use(Progress)
Vue.use(Cascader)

Vue.prototype.$notify = Notify
Vue.prototype.$toast = Toast
Vue.prototype.$confirm = Dialog.confirm
Vue.prototype.$alert = Dialog.alert
