// project import
import Routes from './routes'
import ThemeCustomization from './themes'
import ScrollTop from './components/ScrollTop'
import { useDispatch, useSelector } from 'react-redux'
import { reRegisterSnapshot } from './store/actions/authActions'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './style.css'

// Load react-flow style
import 'reactflow/dist/style.css'
import 'dockview/dist/styles/dockview.css'

import { HTML5Backend } from 'react-dnd-html5-backend';


// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

function App () {
  const dispatch = useDispatch()
  let { uid } = useSelector(state => state.auth)
  const navigate = useNavigate()

  const currentURL = window.location.href

  useEffect(() => {
    
    if (window.__isReactDndBackendSetUp) {
      window.__isReactDndBackendSetUp = false;
    }

    if (!currentURL.includes('invite')) {
      if (uid) {
        dispatch(reRegisterSnapshot(uid))
      } else {
        navigate(`/login`)
      }
    }
  }, [])

  return (
    
    <ThemeCustomization>
      <ScrollTop>
        <Routes />
      </ScrollTop>
    </ThemeCustomization>
    // </DndProvider>
  )
}

export default App
