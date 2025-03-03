import React from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import CustomerRegister from './components/CustomerRegister';
import AdminRegister from './components/AdminRegister';
import AdminLogin from './components/AdminLogin';
import axios from 'axios';

const App = () => {
    const VerifyEmail = () => {
        const { token } = useParams();

        const [message, setMessage] = React.useState('');

        React.useEffect(() => {
            axios
                .get(`http://localhost:5000/auth/verify/${token}`)
                .then((res) => {
                    setMessage(res.data);
                })
                .catch((err) => {
                    setMessage(err.response?.data?.message || 'Verification Failed');
                });
        }, [token]);

        return <div>{message}</div>;
    };

    return (
        <Router>
            <Routes>
                <Route path="/register/customer" element={<CustomerRegister />} />
                <Route path="/register/admin" element={<AdminRegister />} />
                <Route path="/login/admin" element={<AdminLogin />} />
                <Route path="/verify/:token" element={<VerifyEmail />} />
            </Routes>
        </Router>
    );
};

export default App;
