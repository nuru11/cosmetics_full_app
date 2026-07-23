import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LocaleService extends GetxService {
  static const _prefKey = 'app_locale';

  final locale = const Locale('en', 'US').obs;

  Future<LocaleService> init() async {
    final prefs = await SharedPreferences.getInstance();
    final saved = prefs.getString(_prefKey);
    if (saved == 'am_ET') {
      locale.value = const Locale('am', 'ET');
    } else {
      locale.value = const Locale('en', 'US');
    }
    await Get.updateLocale(locale.value);
    return this;
  }

  String get currentLanguageLabel {
    return locale.value.languageCode == 'am'
        ? 'profile.language_amharic'.tr
        : 'profile.language_english'.tr;
  }

  Future<void> setLocale(Locale value) async {
    locale.value = value;
    await Get.updateLocale(value);
    final prefs = await SharedPreferences.getInstance();
    final code = value.languageCode == 'am' ? 'am_ET' : 'en_US';
    await prefs.setString(_prefKey, code);
  }

  Future<void> setEnglish() => setLocale(const Locale('en', 'US'));

  Future<void> setAmharic() => setLocale(const Locale('am', 'ET'));
}
