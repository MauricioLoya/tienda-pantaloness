"use client";

import React, { useEffect, useState } from "react";
import { ToastType } from "../types";

export interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = "info",
  duration = 3000,
}) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!show) return null;

  const alertClass = {
    success: "alert alert-success",
    error: "alert alert-error",
    info: "alert alert-info",
  }[type];

  return (
    <div className="toast toast-top toast-end">
      <div className={`alert ${alertClass}`}>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toast;
