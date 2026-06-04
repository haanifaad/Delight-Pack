import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  static const Color primaryBlack = Color(0xFF09090B);
  static const Color silverWhite = Color(0xFFF4F4F5);
  static const Color dividerColor = Color(0xFF27272A);

  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: primaryBlack,
      primaryColor: silverWhite,
      dividerTheme: const DividerThemeData(
        color: dividerColor,
        thickness: 0.5,
        space: 1,
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: primaryBlack,
        elevation: 0,
        iconTheme: const IconThemeData(color: silverWhite),
        titleTextStyle: GoogleFonts.inter(
          color: silverWhite,
          fontSize: 20,
          fontWeight: FontWeight.w600,
          letterSpacing: -0.5,
        ),
      ),
      textTheme: GoogleFonts.interTextTheme(ThemeData.dark().textTheme).copyWith(
        displayLarge: GoogleFonts.inter(color: silverWhite, letterSpacing: -1.0),
        displayMedium: GoogleFonts.inter(color: silverWhite, letterSpacing: -0.8),
        displaySmall: GoogleFonts.inter(color: silverWhite, letterSpacing: -0.5),
        headlineMedium: GoogleFonts.inter(color: silverWhite, letterSpacing: -0.5),
        bodyLarge: GoogleFonts.inter(color: silverWhite, letterSpacing: 0.1),
        bodyMedium: GoogleFonts.inter(color: silverWhite, letterSpacing: 0.1),
      ),
      colorScheme: const ColorScheme.dark(
        primary: silverWhite,
        surface: primaryBlack,
        onPrimary: primaryBlack,
        onSurface: silverWhite,
      ),
    );
  }
}
