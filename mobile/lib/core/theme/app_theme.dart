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
            color: Colors.white,
          ),
          titleLarge: GoogleFonts.playfairDisplay(
            fontSize: 20,
            fontWeight: FontWeight.w700,
            color: AppColors.textDark,
          ),
          titleMedium: GoogleFonts.playfairDisplay(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: AppColors.textDark,
          ),
          labelSmall: GoogleFonts.montserrat(
            fontSize: 10,
            fontWeight: FontWeight.w600,
            letterSpacing: 1.2,
            color: AppColors.gold,
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
      scaffoldBackgroundColor: AppColors.cream,
      colorScheme: ColorScheme.light(
        primary: AppColors.gold,
        secondary: AppColors.secondPurple,
        surface: AppColors.cardWhite,
        onSurface: AppColors.textDark,
        outline: AppColors.dividerGrey,
      ),
      textTheme: textTheme,
      appBarTheme: AppBarTheme(
        centerTitle: true,
        elevation: 0,
        scrolledUnderElevation: 0,
        backgroundColor: AppColors.cream,
        foregroundColor: AppColors.textDark,
        titleTextStyle: GoogleFonts.playfairDisplay(
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: AppColors.textDark,
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
