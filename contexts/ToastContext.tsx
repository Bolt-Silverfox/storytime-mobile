import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import ToastContainer from "../components/UI/ToastContainer";

type ToastContextType = {
  notify: (message: string) => void;
};

type ToastItem = {
  id: number;
  message: string;
};

let toastId = 0;

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Array<ToastItem>>([]);

  const notify = useCallback((message: string): void => {
    const id = toastId++;
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
