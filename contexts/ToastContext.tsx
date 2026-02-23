import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import Toast from "../components/UI/Toast";
// import ToastContainer from "../components/UI/ToastContainer";

type ToastContextType = {
  notify: (message: string) => void;
};

type ToastItem = {
  id: number;
  message: string;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Array<ToastItem>>([]);

  const notify = useCallback((message: string): void => {
    const id = Date.now();
    setToasts((p) => [...p, { id, message }]);
  }, []);

  const handleDismiss = useCallback((id: number) => {
    setToasts((p) => p.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={handleDismiss} />
    </ToastContext.Provider>
  );
};

const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("Toast context was used outside its scope");
  return context;
};

export { ToastProvider };
export type { ToastItem };
export default useToast;

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
