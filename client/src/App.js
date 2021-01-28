import "./App.css";
import React, {useState, useEffect} from "react";
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Home from './components/pages/Home';
import Accounts from './components/pages/Accounts';
import Features from './components/pages/Features';
import About from './components/pages/About';
import FAQ from './components/pages/FAQ';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import NavBar from './components/Navbar';
import Axios from "axios";
import UserContext from "./context/UserContext";
import Logout from "./components/pages/Logout";
import DeletedAccountSuccess from "./components/pages/DeletedAccountSuccess";

export default function App() {
    const [userData, setUserData] = useState({
        token: undefined,
        user: undefined,
    });

    useEffect(() => {
        const checkLoggedIn = async () => {
            let token = sessionStorage.getItem("auth-token");
            if (token === null) {
                sessionStorage.setItem("auth-token", "");
                token = "";
            }
            const tokenRes = await Axios.post("http://localhost:5000/users/tokenIsValid",
                null,
                { headers: {"x-auth-token": token} }
            );
            if (tokenRes.data) {
                const userRes = await Axios.get("http://localhost:5000/users/", {
                    headers: { "x-auth-token": token },
                });
                setUserData({
                    token,
                    user: userRes.data,
                });
            }
        };
        checkLoggedIn();
    }, []);

    return (
        <>
            <BrowserRouter>
                <UserContext.Provider value={{userData, setUserData}}>
                    {/*Displays navbar*/}
                    <NavBar/>
                    <div className = "container">
                        {/*Specifies the routes for different pages*/}
                        <Switch>
                            <Route exact path="/" component={Home}/>
                            <Route path="/accounts" component={Accounts}/>
                            <Route path="/features" component={Features}/>
                            <Route path="/about" component={About}/>
                            <Route path="/faq" component={FAQ}/>
                            <Route path="/login" component={Login}/>
                            <Route path="/register" component={Register}/>
                            <Route path="/logout" component={Logout}/>
                            <Route path="/deletedAccountPage" component={DeletedAccountSuccess}/>
                        </Switch>
                    </div>
                </UserContext.Provider>
            </BrowserRouter>
        </>
    );
}