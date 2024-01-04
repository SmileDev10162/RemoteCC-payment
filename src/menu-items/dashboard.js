// assets
import { DashboardOutlined, GlobalOutlined, ContainerOutlined, ApiOutlined, AppstoreOutlined, CodeSandboxOutlined } from '@ant-design/icons'

// icons
const icons = {
  DashboardOutlined,
  GlobalOutlined,
  ContainerOutlined,
  ApiOutlined,
  AppstoreOutlined,
  CodeSandboxOutlined
}

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Menu',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    // {
    //   id: 'devices',
    //   title: 'Devices',
    //   type: 'item',
    //   url: '/devices',
    //   icon: icons.GlobalOutlined,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'configurations',
    //   title: 'Configurations',
    //   type: 'item',
    //   url: '/configurations',
    //   icon: icons.ContainerOutlined,
    //   breadcrumbs: false
    // },
    {
      id: 'apiAccess',
      title: 'API Access',
      type: 'item',
      url: '/api-access',
      icon: icons.ApiOutlined,
      breadcrumbs: false
    },
    {
      id: 'apps',
      title: 'Applications',
      type: 'item',
      url: '/applications',
      icon: icons.AppstoreOutlined,
      breadcrumbs: false
    },
    {
      id: 'storage',
      title: 'Storage',
      type: 'item',
      url: '/storage',
      icon: icons.CodeSandboxOutlined,
      breadcrumbs: false
    },
    {
      id: 'database',
      title: 'database',
      type: 'item',
      url: '/database',
      icon: icons.CodeSandboxOutlined,
      breadcrumbs: false
    },

  ]
}

export default dashboard
