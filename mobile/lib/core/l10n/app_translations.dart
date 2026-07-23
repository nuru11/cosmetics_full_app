import 'package:get/get.dart';

import 'locales/am.dart';
import 'locales/en.dart';

class AppTranslations extends Translations {
  @override
  Map<String, Map<String, String>> get keys => {
        'en_US': en,
        'am_ET': am,
      };
}
