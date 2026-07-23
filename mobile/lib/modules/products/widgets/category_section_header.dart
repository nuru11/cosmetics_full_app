import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/category_avatar.dart';
import '../../../data/models/category.dart';
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
    Category? category;
    for (final c in controller.categories) {
      if (c.id == categoryId) {
        category = c;
        break;
      }
    }

    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 20, 16, 12),
      child: Row(
        children: [
          CategoryAvatar(
            imageUrl: category?.imageUrl,
            slug: categorySlug,
            name: categoryName,
            size: 24,
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
                  'common.clear'.tr,
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
                'common.see_all'.tr,
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
