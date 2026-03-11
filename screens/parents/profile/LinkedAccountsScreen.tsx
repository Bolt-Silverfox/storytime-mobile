import { useNavigation } from "@react-navigation/native";
import {
  GoogleSignin,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";
import {
  appleAuth,
  appleAuthAndroid,
} from "@invertase/react-native-apple-authentication";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import colours from "../../../colours";
import PageTitle from "../../../components/PageTitle";
import SafeAreaWrapper from "../../../components/UI/SafeAreaWrapper";
import useGetLinkedAccounts from "../../../hooks/tanstack/queryHooks/useGetLinkedAccounts";
import {
  useLinkApple,
  useLinkGoogle,
  useUnlinkProvider,
} from "../../../hooks/tanstack/mutationHooks/useLinkAccount";
import { ParentProfileNavigatorProp } from "../../../Navigation/ParentProfileNavigator";
import { AuthProvider, LinkedAccount } from "../../../types";

const PROVIDERS: { key: AuthProvider; label: string }[] = [
  { key: "email", label: "Email & Password" },
  { key: "google", label: "Google" },
  { key: "apple", label: "Apple" },
];

export default function LinkedAccountsScreen() {
  const navigator = useNavigation<ParentProfileNavigatorProp>();
  const { data: linkedAccounts, isLoading } = useGetLinkedAccounts();
  const linkGoogle = useLinkGoogle();
  const linkApple = useLinkApple();
  const unlinkProvider = useUnlinkProvider();

  const accounts = Array.isArray(linkedAccounts) ? linkedAccounts : [];
  const linkedProviders = new Set(
    accounts.map((a: LinkedAccount) => a.provider)
  );
  const linkedCount = linkedProviders.size;

  const handleLinkGoogle = async () => {
    try {
      const hasPlayServices = await GoogleSignin.hasPlayServices();
      if (!hasPlayServices) {
        Alert.alert("Error", "Google Play services are not available.");
        return;
      }
      const googleResponse = await GoogleSignin.signIn();
      if (!isSuccessResponse(googleResponse)) {
        Alert.alert("Error", "Google sign-in was cancelled.");
        return;
      }
      const { idToken } = googleResponse.data;
      if (!idToken) {
        Alert.alert("Error", "No ID token received from Google.");
        return;
      }
      linkGoogle.mutate(idToken);
    } catch {
      Alert.alert("Error", "Failed to sign in with Google.");
    }
  };

  const handleLinkApple = async () => {
    try {
      let idToken: string | null = null;

      if (Platform.OS === "ios") {
        const appleResponse = await appleAuth.performRequest({
          requestedOperation: appleAuth.Operation.LOGIN,
          requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
        });
        const credentialState = await appleAuth.getCredentialStateForUser(
          appleResponse.user
        );
        if (credentialState === appleAuth.State.AUTHORIZED) {
          idToken = appleResponse.identityToken;
        }
      } else {
        const rawNonce = Math.random().toString(36).substring(2, 15);
        const state = Math.random().toString(36).substring(2, 15);
        appleAuthAndroid.configure({
          clientId: process.env.EXPO_PUBLIC_APPLE_CLIENT_ID,
          redirectUri: process.env.EXPO_PUBLIC_APPLE_REDIRECT_URI,
          responseType: appleAuthAndroid.ResponseType.ALL,
          scope: appleAuthAndroid.Scope.ALL,
          nonce: rawNonce,
          state,
        });
        const response = await appleAuthAndroid.signIn();
        if (response) {
          idToken = response.id_token ?? null;
        }
      }

      if (!idToken) {
        Alert.alert("Error", "No identity token returned from Apple.");
        return;
      }
      linkApple.mutate(idToken);
    } catch {
      Alert.alert("Error", "Failed to sign in with Apple.");
    }
  };

  const handleUnlink = (provider: AuthProvider) => {
    if (linkedCount <= 1) {
      Alert.alert(
        "Cannot Unlink",
        "You must have at least one linked sign-in method."
      );
      return;
    }
    Alert.alert(
      "Unlink Account",
      `Are you sure you want to unlink your ${provider} account?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Unlink",
          style: "destructive",
          onPress: () => unlinkProvider.mutate(provider),
        },
      ]
    );
  };

  const handleLink = (provider: AuthProvider) => {
    if (provider === "google") handleLinkGoogle();
    else if (provider === "apple") handleLinkApple();
  };

  const isMutating =
    linkGoogle.isPending || linkApple.isPending || unlinkProvider.isPending;

  return (
    <SafeAreaWrapper variant="solid">
      <PageTitle title="Linked Accounts" goBack={() => navigator.goBack()} />
      <View style={styles.container}>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={colours.primary}
            style={styles.loader}
          />
        ) : (
          PROVIDERS.map((provider) => {
            const isLinked = linkedProviders.has(provider.key);
            const account = accounts.find(
              (a: LinkedAccount) => a.provider === provider.key
            );
            const isEmail = provider.key === "email";
            const isApple = provider.key === "apple";
            const isAndroid = Platform.OS !== "ios";

            // On Android, hide Apple row entirely if not already linked
            if (isApple && isAndroid && !isLinked) return null;

            // On Android, Apple row is read-only (no link/unlink button)
            const showActionButton = !isEmail && !(isApple && isAndroid);

            return (
              <View key={provider.key} style={styles.providerRow}>
                <View style={styles.providerInfo}>
                  <Text style={styles.providerLabel}>{provider.label}</Text>
                  {isLinked && account?.email && (
                    <Text style={styles.providerEmail}>{account.email}</Text>
                  )}
                  {!isLinked && (
                    <Text style={styles.providerNotLinked}>Not linked</Text>
                  )}
                </View>
                {showActionButton && (
                  <Pressable
                    style={[
                      styles.actionButton,
                      isLinked ? styles.unlinkButton : styles.linkButton,
                    ]}
                    onPress={() =>
                      isLinked
                        ? handleUnlink(provider.key)
                        : handleLink(provider.key)
                    }
                    disabled={isMutating}
                  >
                    <Text
                      style={[
                        styles.actionButtonText,
                        isLinked
                          ? styles.unlinkButtonText
                          : styles.linkButtonText,
                      ]}
                    >
                      {isLinked ? "Unlink" : "Link"}
                    </Text>
                  </Pressable>
                )}
              </View>
            );
          })
        )}
      </View>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    backgroundColor: "#FFFCFBFB",
  },
  loader: {
    marginTop: 40,
  },
  providerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  providerInfo: {
    flex: 1,
  },
  providerLabel: {
    fontSize: 16,
    fontFamily: "abeezee",
    color: colours.black,
  },
  providerEmail: {
    fontSize: 13,
    fontFamily: "abeezee",
    color: "#6B7280",
    marginTop: 2,
  },
  providerNotLinked: {
    fontSize: 13,
    fontFamily: "abeezee",
    color: "#9CA3AF",
    marginTop: 2,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 99,
    borderWidth: 1,
  },
  linkButton: {
    backgroundColor: "#EC4007",
    borderColor: "#EC4007",
  },
  unlinkButton: {
    backgroundColor: "transparent",
    borderColor: "#DC2626",
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: "abeezee",
  },
  linkButtonText: {
    color: "white",
  },
  unlinkButtonText: {
    color: "#DC2626",
  },
});
