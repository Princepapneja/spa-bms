import React, { useState } from "react";
import Inputs from "../components/utils/Inputs";
import { useLoginMutation } from "../store/features/authApiSlice";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setSession } from "../store/authSlice";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [login]= useLoginMutation()
const dispatch= useDispatch()

  const handleChange = (e) => {
    const {name, value}=e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 ;const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await login(form).unwrap();

    const token = res?.data?.data?.token?.token;
    const user = res?.data?.data?.user;
     localStorage.setItem("user",JSON.stringify(user))
          localStorage.setItem("token", token);
    dispatch(setSession({ token,user }));

    toast.success("Login Successfully");
  } catch (error) {
    toast.error(error?.data?.message || "Login error");
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      
      <div className="w-full flex max-w-3xl gap-2 justify-between  bg-white rounded-lg shadow-lg p-6">
        <div className="w-1/2">
            Login
        </div>
      <div className="grow">
        
        <h2 className="text-2xl font-bold mb-6 text-center">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <Inputs
            type="email"
            label="Email"
            id="email"
            name="email"
            value={form.email}
                       onChange={handleChange}

          />

          <Inputs
            type="text"
            label="Password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />
          <Inputs
            type="text"
            label="Key"
            id="key_pass"
            name="key_pass"
            value={form.key_pass}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/50 text-white py-2 rounded transition"
          >
            Login
          </button>
        </form>

        </div>  
      

      </div>

    </div>
  );
};

export default Login;