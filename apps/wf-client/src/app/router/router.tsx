import { Route, Routes, Link } from 'react-router-dom';

function NavigationMenu() {
    return (
        <div role="navigation">
        <ul>
          <button>
            <Link to="/">Workflows List</Link>
          </button>
          <button>
            <Link to="/create">Create a workflow</Link>
          </button>
        </ul>
      </div>
    )
}

function AppRoutes() {
    return (
        <Routes>
            <Route
            path="/"
            element={
                <div>
                    This is the list of workflows
                </div>
            }
            />
            <Route
            path="/create"
            element={
                <div>
                    This is the "Create Workflow" view
                </div>
            }
            />
            <Route
            path="/update"
            element={
                <div>
                    This is the "Create Workflow" view
                </div>
            }
            />
        </Routes>
    )
}

function Router() {
  return (
    <>
      {/* START: routes */}
      <NavigationMenu />
      <AppRoutes />
      {/* END: routes */}
    </>
  );
}

export default Router;
