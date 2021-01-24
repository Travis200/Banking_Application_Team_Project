import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../../context/UserContext";
import Axios from "axios";
import ErrorNotice from "../misc/ErrorNotice";

export default function Login() {
    const [personalID, setPersonalID] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState();
    const { setUserData } = useContext(UserContext);
    const history = useHistory();

    const submit = async (e) => {
        e.preventDefault();
        try {
            const loginUser = { personalID, password };
            //Send login data to the server-side and store the response
            const loginRes = await Axios.post(
                "http://localhost:5000/users/login",
                loginUser
            )

            let totpToken = prompt("Please enter the google authenticator code: ");
            //Get the totpSecret from the server-side
            let totpSecret = loginRes.data.user.totpSecret.base32;
            const totpData = {
                "secret": totpSecret,
                "token": totpToken
            }
            //Validate the google authenticator token
            await Axios.post('http://localhost:5000/users/totp-validate', totpData)
                .then(res => {
                        // Set the user data to local and session storage if the token is valid
                        if (res.data.valid) {
                            setUserData({
                                token: loginRes.data.token,
                                user: loginRes.data.user,
                            });
                            sessionStorage.setItem("auth-token", loginRes.data.token);
                            sessionStorage.setItem("userData", JSON.stringify(loginRes.data.user));
                            history.push("/");
                        }
                    }
                );

        } catch (err) {
            err.response.data.msg && setError(err.response.data.msg);
        }
    }
    return (
        <div className="page">
            <h2>Log in</h2>
            {error && (
                <ErrorNotice message={error} clearError={() => setError(undefined)} />
            )}
            <form className="form" onSubmit={submit}>
                <label htmlFor="login-personal-ID">Personal ID</label>
                <input
                    id="login-personal-ID"
                    type="text"
                    onChange={(e) => setPersonalID(e.target.value)}
                />

                <label htmlFor="login-password">Password</label>
                <input
                    id="login-password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <input type="submit" value="Log in" />
            </form>
        </div>
    );
}