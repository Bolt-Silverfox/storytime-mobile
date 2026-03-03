import React, { Component, ErrorInfo, ReactNode } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (__DEV__) {
      console.error("ErrorBoundary caught:", error, errorInfo); // eslint-disable-line no-console
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <View style={styles.container}>
            <Text style={styles.title}>Oops! Something went wrong</Text>
            <Text style={styles.message}>
              We&apos;re sorry for the inconvenience. Please try again.
            </Text>
            <Pressable style={styles.button} onPress={this.handleRetry}>
              <Text style={styles.buttonText}>Try Again</Text>
            </Pressable>
          </View>
        )
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
    backgroundColor: "#FFFCFBFB",
  },
  title: {
    fontSize: 20,
    fontFamily: "quilka",
    marginBottom: 12,
    color: "#333",
  },
  message: {
    fontSize: 16,
    fontFamily: "abeezee",
    textAlign: "center",
    marginBottom: 24,
    color: "#666",
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
