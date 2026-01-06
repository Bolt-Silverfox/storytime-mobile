import { ReactNode, Suspense } from "react";
import { ActivityIndicator } from "react-native";

const SuspenseWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense fallback={<ActivityIndicator size={"large"} />}>
      {children}
    </Suspense>
  );
};

export default SuspenseWrapper;
