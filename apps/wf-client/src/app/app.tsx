import { Route, Routes, Link } from 'react-router-dom';
import { WorkflowList } from './components/workflow-list/workflow-list';
import { WorkflowUpdate } from './components/workflow-update/workflow-update';
import { WorkflowCreate } from './components/workflow-create/workflow-create';

/**
 * Navigation Menu visual component
 */
function NavigationMenu() {
    return (
      <div role="navigation">
        <hr/>
        <div className='navigation'>
          <button>
            <Link to="/">Workflows List</Link>
          </button>
          <button>
            <Link to="/create">Create Workflow</Link>
          </button>
        </div>
        <hr/>
      </div>
    )
}

/**
 * Function to define routes inside the application
 **/
function AppRoutes() {
    return (
        <Routes>
            <Route
            path="/"
            element={
                <WorkflowList />
            }
            />
            <Route
            path="/create"
            element={
                <WorkflowCreate />
            }
            />
            <Route
            path="/update/:workflowId"
            element={
                <WorkflowUpdate />
            }
            />
        </Routes>
    )
}

/**
 * Function to put together navigation menu and routes
 */
function Router() {
  return (
    <>
      <NavigationMenu />
      <AppRoutes />
    </>
  );
}

/**
 * Main application entrypoint
 */
export function App() {
  return (
    <>
      <h1>Workflower</h1>
      <Router />
    </>
  );
}

export default App;
