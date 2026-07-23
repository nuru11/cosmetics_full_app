import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';

import 'app_colors.dart';

abstract final class AppTheme {
  static ThemeData lightFor(Locale locale) {
    final isAmharic = locale.languageCode == 'am';
    final bodyFont = isAmharic ? GoogleFonts.notoSansEthiopic : GoogleFonts.montserrat;
    final displayFont =
        isAmharic ? GoogleFonts.notoSansEthiopic : GoogleFonts.playfairDisplay;

    final textTheme = TextTheme(
      displayLarge: displayFont(
        fontSize: 32,
        fontWeight: FontWeight.w700,
        color: AppColors.brandWhite,
      ),
      titleLarge: displayFont(
        fontSize: 20,
        fontWeight: FontWeight.w700,
        color: AppColors.brandBlack,
      ),
      titleMedium: displayFont(
        fontSize: 18,
        fontWeight: FontWeight.w600,
        color: AppColors.brandBlack,
      ),
      labelSmall: bodyFont(
        fontSize: 10,
        fontWeight: FontWeight.w600,
        letterSpacing: isAmharic ? 0.4 : 1.2,
        color: AppColors.brandBlue,
      ),
      bodySmall: bodyFont(
        fontSize: 12,
        color: AppColors.textMuted,
      ),
      bodyMedium: bodyFont(
        fontSize: 14,
        color: AppColors.textDark,
      ),
    );

    return ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: AppColors.brandWhite,
      colorScheme: ColorScheme.light(
        primary: AppColors.brandBlue,
        onPrimary: AppColors.brandWhite,
        secondary: AppColors.brandBlack,
        onSecondary: AppColors.brandWhite,
        surface: AppColors.cardWhite,
        onSurface: AppColors.textDark,
        outline: AppColors.dividerGrey,
      ),
      textTheme: textTheme,
      appBarTheme: AppBarTheme(
        centerTitle: true,
        elevation: 0,
        scrolledUnderElevation: 0,
        backgroundColor: AppColors.brandBlue,
        foregroundColor: AppColors.brandWhite,
        titleTextStyle: displayFont(
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: AppColors.brandWhite,
        ),
      ),
      cardTheme: CardThemeData(
        elevation: 0,
        color: AppColors.cardWhite,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
      ),
    );
  }

  static ThemeData get light => lightFor(Get.locale ?? const Locale('en', 'US'));
}
