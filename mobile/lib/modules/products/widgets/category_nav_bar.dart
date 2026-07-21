import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/theme/app_colors.dart';
import '../products_controller.dart';

class CategoryNavBar extends GetView<ProductsController> {
  const CategoryNavBar({super.key});

  static const _accentColors = [
    AppColors.brandBlue,
    AppColors.secondPurple,
    AppColors.gold,
    AppColors.headerBrown,
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppColors.homeBackground,
      padding: const EdgeInsets.fromLTRB(16, 4, 16, 12),
      child: Obx(() {
        final selected = controller.selectedCategoryId.value;
        final cats = controller.categories;

        return Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            _CategoryChip(
              label: 'All',
              isSelected: selected == null,
              accentColor: AppColors.brandBlue,
              onTap: () => controller.selectCategory(null),
            ),
            ...cats.asMap().entries.map(
              (entry) => _CategoryChip(
                label: entry.value.name,
                isSelected: selected == entry.value.id,
                accentColor: _accentColors[
                    (entry.key + 1) % _accentColors.length],
                onTap: () => controller.selectCategory(entry.value.id),
              ),
            ),
          ],
        );
      }),
    );
  }
}

class _CategoryChip extends StatelessWidget {
  const _CategoryChip({
    required this.label,
    required this.isSelected,
    required this.accentColor,
    required this.onTap,
  });

  final String label;
  final bool isSelected;
  final Color accentColor;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.brandBlue : AppColors.brandWhite,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? AppColors.brandBlue : accentColor.withValues(alpha: 0.5),
            width: isSelected ? 1.5 : 1,
          ),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: AppColors.brandBlue.withValues(alpha: 0.25),
                    blurRadius: 6,
                    offset: const Offset(0, 2),
                  ),
                ]
              : null,
        ),
        child: Text(
          label,
          style: GoogleFonts.montserrat(
            fontSize: 12,
            fontWeight: FontWeight.w600,
            color: isSelected ? AppColors.brandWhite : accentColor,
          ),
        ),
      ),
    );
  }
}
