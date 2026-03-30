import React, { useEffect } from "react";
import { Outlet } from "react-router";
import Header from "../components/header-footer/Header";
import { ToastContainer } from "react-toastify";
import { useGetMeQuery } from "../store/features/authApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setSession } from "../store/authSlice";

const AppLayout = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    const token = localStorage.getItem("token") || ""
    const userStr = localStorage.getItem("user");
    let user = null
    if (userStr) {
      user = JSON.parse(userStr) 
    }
    if (user && token) {
      dispatch(setSession({ user, token }))
    }
  }, [])
  return (
    <div className="h-screen w-full">
      <Header />
      <div className="p-4">
        <Outlet />
      </div>
      <ToastContainer />

    </div>
  );
};

export default AppLayout;