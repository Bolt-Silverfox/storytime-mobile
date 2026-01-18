import { ReactNode, Suspense } from "react";
import { ActivityIndicator } from "react-native";

const SuspenseWrapper = ({
  children,
  fallbackUI,
}: {
  children: ReactNode;
  fallbackUI?: ReactNode;
}) => {
  return (
    <Suspense fallback={fallbackUI ?? <ActivityIndicator size={"large"} />}>
      {children}
    </Suspense>
  );
};

export default SuspenseWrapper;
