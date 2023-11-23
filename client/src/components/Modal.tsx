import { ModalProps } from "../types/interfaces";

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {

  if (!isOpen) {
    return null;
  }

  const checkClick = (e: EventTarget) => {
    const classname = e as HTMLElement;
    const classes = classname.classList;
    if (classes[0] === "z-40") {
      onClose();
    }
  };

  return (
    <div
      className="z-40 fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-700 bg-opacity-50"
      onMouseDown={(e) => checkClick(e.target)}
    >
      <div className="relative border-2 border-blue-500 border-solid p-4 rounded shadow-xl bg-white/90">
        <button
          onClick={onClose}
          className="absolute font-bold top-2 right-4 text-gray-500 hover:text-gray-700"
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
};
