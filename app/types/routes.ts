import { ParamListBase } from '@react-navigation/native';

export interface AppRoutes extends ParamListBase {
  '/': undefined;
  '/(tabs)/home': undefined;
  '/(tabs)/tasks': undefined;
  '/(auth)/login': undefined;
  '/(auth)/forgetPass': undefined;
  '/_sitemap': undefined;
}

export default function Routes() {
  return null;
}
