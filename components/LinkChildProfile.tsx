import { Pencil, EllipsisVertical } from 'lucide-react-native';
import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native'
import defaultStyles from '../styles';
import { Child } from '../screens/parents/profile/LinkChild';
import { ParntControlNavigatorProp } from '../Navigation/ParentControlsNavigator';
import { useNavigation } from '@react-navigation/native';

export default function LinkChildProfile({child}: {child: Child}) {
   const fallbackImage = require("../assets/avatars/Avatars-8.png");
   const navigator = useNavigation<ParntControlNavigatorProp>();
 
  return (
    <View style={styles.wrapper}>
      <Image
        source={child.photoUri ? { uri: child.photoUri } : child.img || fallbackImage}
        style={styles.photoPreview}
        resizeMode="cover"
      />
      <View style={{marginLeft: 10, justifyContent: 'space-between', paddingVertical: 4,}}>
       <Text style={[defaultStyles.heading, {fontSize: 20, textAlign: "left"}]}>{child.name}</Text>
       <Text style={[defaultStyles.defaultText, {fontSize: 14, textAlign: "left"}]}>Age: {child.ageRange}</Text>
      </View>
      <View style={{marginLeft: "auto", marginRight: 15, alignSelf: "center", flexDirection: "row", gap: 10}}>
       <Pencil color="#000" style={[styles.penIcon, ]} />
       <EllipsisVertical color="#000" style={[styles.penIcon, ]} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
 wrapper: {
  flexDirection: 'row',
  backgroundColor: "#fff",
  padding: 14,
  borderRadius: 20,
 },
 photoPreview: {
    width: 80,
    height: 80,
    borderRadius: 40,
 },
 penIcon: {
  width: 20,        
  height: 20,
  resizeMode: "contain",
},
})