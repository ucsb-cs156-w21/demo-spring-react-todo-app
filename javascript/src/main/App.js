import React from "react";
import "main/App.css";
import Loading from "main/components/Loading/Loading";
import AppNavbar from "main/components/Nav/AppNavbar";
import { useAuth0 } from "@auth0/auth0-react";
import { Container } from "react-bootstrap";
import { Route, Switch } from "react-router-dom";
import AppFooter from "main/components/Footer/AppFooter";
import About from "main/pages/About/About";
import Home from "main/pages/Home/Home";
import Profile from "main/pages/Profile/Profile";
import PrivateRoute from "main/components/Auth/PrivateRoute";
import TodoList from "main/pages/Todos/Todos";
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from "react-toastify";

function App() {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="App">
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            pauseOnHover/>
        <AppNavbar />
            <Container className="flex-grow-1 mt-5">
                <Switch>
                  <Route path="/" exact component={Home} />
                  <PrivateRoute path="/todos" component={TodoList} />
                  <PrivateRoute path="/profile" component={Profile} />
                  <Route path="/about" component={About} />
                </Switch>
            </Container>
        <AppFooter />
    </div>
  );
}

export default App;
