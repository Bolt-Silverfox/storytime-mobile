import { ToastItem } from "../../contexts/ToastContext";
import Toast from "./Toast";

const ToastContainer = ({
  toasts,
  onDismiss,
}: {
  toasts: Array<ToastItem>;
  onDismiss: (id: number) => void;
}) => {
  return (
    <>
      {toasts.map((toast, index) => (
        <Toast
          onDismiss={onDismiss}
          key={toast.id}
          toast={toast}
          index={index}
        />
      ))}
    </>
  );
};

export default ToastContainer;
