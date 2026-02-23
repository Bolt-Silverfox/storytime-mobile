import { ReactNode } from "react";
import useAuth from "../contexts/AuthContext";
import useNotifications from "../hooks/useNotifications";

type NotificationHandlerProps = {
  children: ReactNode;
};

const NotificationHandler = ({ children }: NotificationHandlerProps) => {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  // Initialize notifications and set up listeners
  useNotifications(isAuthenticated);

  return <>{children}</>;
};

export default NotificationHandler;
