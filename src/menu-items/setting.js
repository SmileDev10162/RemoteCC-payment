// assets
import { ChromeOutlined, QuestionOutlined } from '@ant-design/icons'

// icons
const icons = {
  ChromeOutlined,
  QuestionOutlined
}

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const support = {
  id: 'setting',
  title: 'Setting',
  type: 'group',
  children: [
    {
      id: 'setting',
      title: 'Setting',
      type: 'itemWithoutToken',
      url: '/setting',
      icon: icons.ChromeOutlined,
      breadcrumbs: false
    }
  ]
}

export default support
