// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.scss';

import { Route, Routes, Link } from 'react-router-dom';
import { WorkflowList } from './components/workflow-list/workflow-list';
import { WorkflowUpdate } from './components/workflow-update/workflow-update';
import { WorkflowCreate } from './components/workflow-create/workflow-create';

function NavigationMenu() {
    return (
      <div role="navigation">
        <hr/>
        <ul>
          <button>
            <Link to="/">Workflows List</Link>
          </button>
          <button>
            <Link to="/create">Create Workflow</Link>
          </button>
        </ul>
        <hr/>
      </div>
    )
}

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

function Router() {
  return (
    <>
      <NavigationMenu />
      <AppRoutes />
    </>
  );
}

export function App() {
  return (
    <>
      <h1>Workflower</h1>
      <Router />
    </>
  );
}

export default App;
