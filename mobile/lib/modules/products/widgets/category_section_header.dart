import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/category_icons.dart';
import '../products_controller.dart';

class CategorySectionHeader extends GetView<ProductsController> {
  const CategorySectionHeader({
    super.key,
    required this.categoryId,
    required this.categoryName,
    this.categorySlug,
  });

  final String categoryId;
  final String categoryName;
  final String? categorySlug;

  @override
  Widget build(BuildContext context) {
    final icon = CategoryIcons.forCategory(
      slug: categorySlug,
      name: categoryName,
    );

    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 20, 16, 12),
      child: Row(
        children: [
          Text(
            icon,
            style: const TextStyle(fontSize: 18, height: 1),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              categoryName,
              style: GoogleFonts.montserrat(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: AppColors.brandBlue,
              ),
            ),
          ),
          Obx(() {
            final selected = controller.selectedCategoryId.value;
            if (selected == categoryId) {
              return TextButton(
                onPressed: () => controller.selectCategory(null),
                style: TextButton.styleFrom(
                  padding: const EdgeInsets.symmetric(horizontal: 8),
                  minimumSize: Size.zero,
                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                ),
                child: Text(
                  'Clear',
                  style: GoogleFonts.montserrat(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: AppColors.brandBlue,
                  ),
                ),
              );
            }

            return TextButton(
              onPressed: () => controller.selectCategory(categoryId),
              style: TextButton.styleFrom(
                padding: const EdgeInsets.symmetric(horizontal: 8),
                minimumSize: Size.zero,
                tapTargetSize: MaterialTapTargetSize.shrinkWrap,
              ),
              child: Text(
                'See All',
                style: GoogleFonts.montserrat(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: AppColors.brandBlue,
                ),
              ),
            );
          }),
        ],
      ),
    );
  }
}
