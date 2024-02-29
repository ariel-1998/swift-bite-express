import React, { MouseEvent, ReactNode } from "react";
import Button from "./Button";

type ModalProps = {
  children: ReactNode;
  close: () => void;
  closeBtn?: boolean;
};

const Modal: React.FC<ModalProps> = ({ children, close, closeBtn }) => {
  const stopePropagation = (e: MouseEvent) => e.stopPropagation();
  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center z-50"
      onClick={close}
    >
      <div
        onClick={stopePropagation}
        className="bg-white p-8 rounded shadow-lg max-w-[90%]  relative h-fit mt-10"
      >
        <div>
          {children}
          {closeBtn && (
            <div className="flex justify-end">
              <Button
                type="button"
                size={"formBtn"}
                className="w-fit mt-2 "
                variant={"error"}
                onClick={close}
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
