import { useState } from "react";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import axios from "axios";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userCredential = isLogin
      ? await signInWithEmailAndPassword(auth, email, password)
      : await createUserWithEmailAndPassword(auth, email, password);

    const token = await userCredential.user.getIdToken();
    localStorage.setItem("token", token);

    const response = await axios.post(`http://localhost:5000/${isLogin ? "login" : "signup"}`, { email, password });
    localStorage.setItem("jwt", response.data.token);
    alert("Success!");
  };

  return (
    <div>
      <h2>{isLogin ? "Login" : "Signup"}</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">{isLogin ? "Login" : "Signup"}</button>
      </form>
    </div>
  );
};

export default Auth;
