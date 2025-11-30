import React, { useState } from "react";
import { Image, ImageProps } from "react-native";

export default function ImageWithFallback({
  sourceUri,
  fallbackRequire,
  style,
  ...rest
}: {
  sourceUri?: string | null;
  fallbackRequire: number;
} & Omit<ImageProps, "source">) {
  const [error, setError] = useState(false);

  const source = !sourceUri || error ? fallbackRequire : { uri: sourceUri };

  return (
    <Image
      {...rest}
      source={source}
      onError={() => {
        console.warn("Image failed to load, using fallback:", sourceUri);
        setError(true);
      }}
    />
  );
}
