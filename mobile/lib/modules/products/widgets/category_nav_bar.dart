import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/category_icons.dart';
import '../products_controller.dart';

class CategoryNavBar extends GetView<ProductsController> {
  const CategoryNavBar({super.key});

  static const _cardWidth = 76.0;
  static const _listHeight = 104.0;

  @override
  Widget build(BuildContext context) {
    return ColoredBox(
      color: AppColors.homeBackground,
      child: Obx(() {
        final selected = controller.selectedCategoryId.value;
        final cats = controller.categories;

        final items = <_CategoryCardData>[
          _CategoryCardData(
            label: 'All',
            icon: CategoryIcons.all,
            tintColor: AppColors.cardHeaderBeige,
            isSelected: selected == null,
            onTap: () => controller.selectCategory(null),
          ),
          ...cats.map(
            (cat) => _CategoryCardData(
              label: cat.name,
              icon: CategoryIcons.forCategory(
                slug: cat.slug,
                name: cat.name,
              ),
              tintColor: CategoryIcons.backgroundTintFor(
                slug: cat.slug,
                name: cat.name,
              ),
              isSelected: selected == cat.id,
              onTap: () => controller.selectCategory(cat.id),
            ),
          ),
        ];

        return SizedBox(
          height: _listHeight,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
            itemCount: items.length,
            separatorBuilder: (context, index) => const SizedBox(width: 12),
            itemBuilder: (context, index) {
              final item = items[index];
              return _CategoryCard(
                width: _cardWidth,
                label: item.label,
                icon: item.icon,
                tintColor: item.tintColor,
                isSelected: item.isSelected,
                onTap: item.onTap,
              );
            },
          ),
        );
      }),
    );
  }
}

class _CategoryCardData {
  const _CategoryCardData({
    required this.label,
    required this.icon,
    required this.tintColor,
    required this.isSelected,
    required this.onTap,
  });

  final String label;
  final String icon;
  final Color tintColor;
  final bool isSelected;
  final VoidCallback onTap;
}

class _CategoryCard extends StatelessWidget {
  const _CategoryCard({
    required this.width,
    required this.label,
    required this.icon,
    required this.tintColor,
    required this.isSelected,
    required this.onTap,
  });

  final double width;
  final String label;
  final String icon;
  final Color tintColor;
  final bool isSelected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Ink(
          width: width,
          height: double.infinity,
          decoration: BoxDecoration(
            color: isSelected
                ? AppColors.brandBlue.withValues(alpha: 0.08)
                : AppColors.brandWhite,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: isSelected ? AppColors.brandBlue : AppColors.dividerGrey,
              width: isSelected ? 1.5 : 1,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(
                  alpha: isSelected ? 0.08 : 0.06,
                ),
                blurRadius: isSelected ? 8 : 4,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 8),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    color: isSelected
                        ? AppColors.brandBlue.withValues(alpha: 0.12)
                        : tintColor,
                    shape: BoxShape.circle,
                  ),
                  alignment: Alignment.center,
                  child: Text(
                    icon,
                    style: const TextStyle(fontSize: 20, height: 1),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  label,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  textAlign: TextAlign.center,
                  style: GoogleFonts.montserrat(
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
                    height: 1.2,
                    color: isSelected ? AppColors.brandBlue : AppColors.textDark,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
