import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/category_icons.dart';

class CategorySectionHeader extends StatelessWidget {
  const CategorySectionHeader({
    super.key,
    required this.categoryName,
    this.categorySlug,
  });

  final String categoryName;
  final String? categorySlug;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 20, 16, 12),
      child: Row(
        children: [
          Text(
            CategoryIcons.forSlug(categorySlug),
            style: const TextStyle(fontSize: 16),
          ),
          const SizedBox(width: 8),
          Text(
            categoryName.toUpperCase(),
            style: GoogleFonts.playfairDisplay(
              fontSize: 16,
              fontWeight: FontWeight.w700,
              letterSpacing: 0.5,
              color: AppColors.textDark,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Container(
              height: 1,
              color: AppColors.dividerGrey,
            ),
          ),
        ],
      ),
    );
  }
}
