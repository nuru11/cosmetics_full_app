import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/category_icons.dart';
import '../products_controller.dart';

class CategoryNavBar extends GetView<ProductsController> {
  const CategoryNavBar({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppColors.cardWhite,
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Obx(() {
        final selected = controller.selectedCategoryId.value;
        final cats = controller.categories;

        return SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.symmetric(horizontal: 12),
          child: Row(
            children: [
              _CategoryChip(
                label: 'ALL',
                icon: CategoryIcons.all,
                isSelected: selected == null,
                onTap: () => controller.selectCategory(null),
              ),
              ...cats.map(
                (c) => _CategoryChip(
                  label: c.name.toUpperCase(),
                  icon: CategoryIcons.forSlug(c.slug),
                  isSelected: selected == c.id,
                  onTap: () => controller.selectCategory(c.id),
                ),
              ),
            ],
          ),
        );
      }),
    );
  }
}

class _CategoryChip extends StatelessWidget {
  const _CategoryChip({
    required this.label,
    required this.icon,
    required this.isSelected,
    required this.onTap,
  });

  final String label;
  final String icon;
  final bool isSelected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 6),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(8),
        child: SizedBox(
          width: 72,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(icon, style: const TextStyle(fontSize: 22)),
              const SizedBox(height: 6),
              Text(
                label,
                textAlign: TextAlign.center,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: GoogleFonts.montserrat(
                  fontSize: 9,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 0.5,
                  color: isSelected ? AppColors.brandBlack : AppColors.textMuted,
                ),
              ),
              const SizedBox(height: 6),
              Container(
                height: 2,
                width: 40,
                decoration: BoxDecoration(
                  color: isSelected ? AppColors.brandBlue : Colors.transparent,
                  borderRadius: BorderRadius.circular(1),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
