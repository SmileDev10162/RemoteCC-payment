import { StrictMode, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'


// scroll bar
import 'simplebar/src/simplebar.css'

// third-party
import { Provider } from 'react-redux'

// apex-chart
import './assets/third-party/apex-chart.css'

// project import
import App from './App'
import store from './store/index'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import reportWebVitals from './reportWebVitals'
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider, DndContext  } from 'react-dnd';
import { createDropManager, createDragDropManager } from 'dnd-core'
const RNDContext = createDragDropManager(HTML5Backend);
const Root = () => {

  const manager = useRef(RNDContext);

  // ...

  return (
    <StrictMode>
      <Provider store={store}>
        <DndProvider backend={HTML5Backend} key={1}>
          <BrowserRouter basename="/">
            <ToastContainer style={{ fontFamily: 'Poppins' }} />
            <App />
          </BrowserRouter>
        </DndProvider>
      </Provider>
    </StrictMode>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Root />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
