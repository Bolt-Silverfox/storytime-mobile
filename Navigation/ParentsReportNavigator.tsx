import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import ReportsSreen from "../screens/parents/reports/ReportsSreen";
import ReportDetailScreen from "../screens/parents/reports/ReportDetailScreen";

type ParentReportNavigatorParamList = {
  home: undefined;
  reportDetails: {childId:string};
};

type ParntReportNavigatorProp =
  NativeStackNavigationProp<ParentReportNavigatorParamList>;
const Stack = createNativeStackNavigator<ParentReportNavigatorParamList>();

const ParentReportNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" component={ReportsSreen} />
      <Stack.Screen name="reportDetails" component={ReportDetailScreen} />
    </Stack.Navigator>
  );
};

export type { ParntReportNavigatorProp };
export default ParentReportNavigator;
