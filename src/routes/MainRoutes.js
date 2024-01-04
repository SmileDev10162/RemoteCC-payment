import { lazy } from 'react'

// project import
import Loadable from '../components/Loadable'
import MainLayout from '../layout/MainLayout'

// render - dashboard
const MainMenu = Loadable(lazy(() => import('../pages/mainmenu')))
const DashboardDefault = Loadable(lazy(() => import('../pages/dashboard')))
const Devices = Loadable(lazy(() => import('../pages/devices')))
const Configurations = Loadable(lazy(() => import('../pages/configurations')))
const CreateConfig = Loadable(lazy(() => import('../pages/configurations/CreateConfig')))
const APIAccess = Loadable(lazy(() => import('../pages/apiaccess')))
const Storage = Loadable(lazy(() => import('../pages/storage')))
const Database = Loadable(lazy(() => import('../pages/database')))
const Applications = Loadable(lazy(() => import('../pages/applications')))
const Application = Loadable(lazy(() => import('../pages/applications/Application')))
const NewEndpoint = Loadable(lazy(() => import('../pages/applications/NewEndpoint')))
const Management = Loadable(lazy(() => import('../pages/management')))
const EditOrganization = Loadable(lazy(() => import('../pages/organization/EditOrganization')))

// render - sample page
const Notification = Loadable(lazy(() => import('../pages/notification')))
const Setting = Loadable(lazy(() => import('../pages/settings/Setting')))

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: 'dashboard/:org_id',
      element: <DashboardDefault />
    },
    {
      path: 'devices/:org_id',
      element: <Devices />
    },
    {
      path: 'configurations/:org_id',
      children: [
        {
          path: '',
          element: <Configurations />
        },
        {
          path: 'create',
          element: <CreateConfig />
        }
      ]
    },
    {
      path: 'api-access/:org_id',
      element: <APIAccess />
    },
    {
      path: 'storage/:org_id',
      element: <Storage />
    },
    {
      path: 'database/:org_id',
      element: <Database />
    },
    {
      path: 'applications/:org_id',
      children: [
        {
          path: '',
          element: <Applications />
        },
        {
          path: 'edit/:id',
          children: [
            {
              path: '',
              element: <NewEndpoint />
            },
            {
              path: 'screens/:screen_id',
              element: <Application />
            }
          ]
        }
      ]
    },
    {
      path: 'management/:org_id',
      element: <Management />
    },
    {
      path: 'edit-organization/:org_id',
      element: <EditOrganization />
    },
    {
      path: 'setting',
      element: <Setting />
    },
    {
      path: 'notifications',
      element: <Notification />
    }
  ]
}

export default MainRoutes
