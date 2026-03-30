import React, { useState } from "react";
import Buttons from "./Buttons";

const Sheet = ({
  open: controlledOpen,
  onClose,
  title,
  children,
  trigger, 
}) => {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;

  const open = isControlled ? controlledOpen : internalOpen;

  const handleOpen = () => {
    if (isControlled) return;
    setInternalOpen(true);
  };

  const handleClose = () => {
    if (isControlled) {
      onClose && onClose();
    } else {
      setInternalOpen(false);
    }
  };

  return (
    <>
      {!isControlled && trigger && (
        <div onClick={handleOpen}>{trigger}</div>
      )}

      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 
        ${open ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={handleClose}
      />

      <div
        className={`fixed top-0 right-0 h-full max-w-[450px] w-full bg-white z-50 shadow-lg
        transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-semibold">{title}</h2>
          <Buttons
            onClick={handleClose}
            className="text-gray-500 hover:text-black"
          >
            ✕
        </Buttons>
        </div>

        <div className=" overflow-y-auto h-[calc(100%-60px)]">
          {children}
        </div>
      </div>
    </>
  );
};

export default Sheet;