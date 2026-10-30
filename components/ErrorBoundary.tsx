import React, { Component, ErrorInfo, ReactNode } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import log from "../utils/logger";
import { useTheme } from "../theme/ThemeContext";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

const ErrorFallback = ({ onRetry }: { onRetry: () => void }) => {
  const { tokens } = useTheme();
  return (
    <View
      style={[styles.container, { backgroundColor: tokens.backgroundSoft }]}
    >
      <Text style={[styles.title, { color: tokens.textStrong }]}>
        Oops! Something went wrong
      </Text>
      <Text style={[styles.message, { color: tokens.textBody }]}>
        We&apos;re sorry for the inconvenience. Please try again.
      </Text>
      <Pressable style={styles.button} onPress={onRetry}>
        <Text style={styles.buttonText}>Try Again</Text>
      </Pressable>
    </View>
  );
};

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // log.error already forwards to Sentry (captureException) and Crashlytics (recordError)
    // via the logger transports, so no explicit calls needed here.
    log.error("ErrorBoundary caught:", error, {
      componentStack: errorInfo.componentStack,
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || <ErrorFallback onRetry={this.handleRetry} />
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: "quilka",
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    fontFamily: "abeezee",
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#EC4007",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 99,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "abeezee",
  },
});

export default ErrorBoundary;
