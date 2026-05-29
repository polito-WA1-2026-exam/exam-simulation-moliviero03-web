import { useEffect, useState } from "react";
import { doLogin, doLogout } from "../api/auth";
import { useNavigate } from "react-router";
import { Form, Button, Container } from "react-bootstrap";

function LoginForm(props){
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const doSubmit = async (event) => {
        event.preventDefault();
        setError('');
        console.log(email, password);

        try{
            const user = await doLogin(email, password);
            props.login(user);
        }
        catch (err){
            setError(err.message);
            setTimeout(() => setError('', 3000));
        }
    }

    return (
        <Container>
            <h2>Please login</h2>

            <Form onSubmit={doSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" value={email} onChange={(ev) => setEmail(ev.target.value)} />
                </Form.Group>

                <Form.Group classname="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter password" value={password} onChange={(ev) => setPassword(ev.target.value)} />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Log In
                </Button> {error && <div className="text-danger">{error}</div>}
            </Form>
        </Container>
    );
}

function Logout(props){
    const navigate = useNavigate();

    useEffect(() => {
        doLogout().then(() => {
            props.login({id: undefined, name: undefined, surname: undefined, email: undefined, planType: undefined});
            navigate('/');
        })
    }, [])
    return "Logging out..."
}

export {LoginForm, Logout}