import { Image, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

type BrandLogoProps = {
  width?: number;
  height?: number;
  scale?: number;
  style?: StyleProp<ViewStyle>;
};

export function BrandLogo({
  width = 160,
  height = 108,
  scale = 1,
  style,
}: BrandLogoProps) {
  return (
    <View style={[styles.frame, { width, height }, style]}>
      <Image
        source={require("../assets/images/vitafit-logo.png")}
        resizeMode="contain"
        style={[styles.image, { transform: [{ scale }] }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    alignSelf: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
