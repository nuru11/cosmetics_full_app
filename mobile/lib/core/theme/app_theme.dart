import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'app_colors.dart';

abstract final class AppTheme {
  static ThemeData get light {
    final playfair = GoogleFonts.playfairDisplayTextTheme();
    final montserrat = GoogleFonts.montserratTextTheme();

    final textTheme = playfair.merge(montserrat).copyWith(
          displayLarge: GoogleFonts.playfairDisplay(
            fontSize: 32,
            fontWeight: FontWeight.w700,
            color: AppColors.brandWhite,
          ),
          titleLarge: GoogleFonts.playfairDisplay(
            fontSize: 20,
            fontWeight: FontWeight.w700,
            color: AppColors.brandBlack,
          ),
          titleMedium: GoogleFonts.playfairDisplay(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: AppColors.brandBlack,
          ),
          labelSmall: GoogleFonts.montserrat(
            fontSize: 10,
            fontWeight: FontWeight.w600,
            letterSpacing: 1.2,
            color: AppColors.brandBlue,
          ),
          bodySmall: GoogleFonts.montserrat(
            fontSize: 12,
            color: AppColors.textMuted,
          ),
          bodyMedium: GoogleFonts.montserrat(
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
        titleTextStyle: GoogleFonts.playfairDisplay(
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
}
