import 'package:get/get.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/utils/format_price.dart';
import '../../../core/widgets/product_image.dart';
import '../../../core/widgets/product_version_badge.dart';
import '../../../data/models/product.dart';
import '../../../data/models/product_variant.dart';
import '../../products/models/product_comparison.dart';

class VariantPickerGrid extends StatelessWidget {
  const VariantPickerGrid({
    super.key,
    required this.product,
    required this.selectedVariant,
    required this.onSelect,
  });

  final Product product;
  final ProductVariant? selectedVariant;
  final ValueChanged<ProductVariant> onSelect;

  @override
  Widget build(BuildContext context) {
    if (product.variants.length <= 1) return const SizedBox.shrink();

    final slots = slotsFromVariants(product);
    final comparison = ProductComparison.fromProduct(product);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'product.choose_version'.tr,
          style: GoogleFonts.montserrat(
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: AppColors.textDark,
          ),
        ),
        if (slots.length > 1) ...[
          const SizedBox(height: 4),
          Text(
            'product.options_available'.trParams({'count': '${slots.length}'}),
            style: GoogleFonts.montserrat(
              fontSize: 11,
              color: AppColors.textMuted,
            ),
          ),
        ],
        const SizedBox(height: 10),
        ...slots.map(
          (slot) => Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: _VersionOptionTile(
              slot: slot,
              isSelected: selectedVariant?.id == slot.variant.id,
              savingsPercent: comparison.savingsPercentVersusOriginal(
                slot.variant,
              ),
              onTap: () => onSelect(slot.variant),
            ),
          ),
        ),
      ],
    );
  }
}

class _VersionOptionTile extends StatelessWidget {
  const _VersionOptionTile({
    required this.slot,
    required this.isSelected,
    required this.onTap,
    this.savingsPercent,
  });

  final ProductVersionSlot slot;
  final bool isSelected;
  final int? savingsPercent;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final variant = slot.variant;
    final inStock = variant.inStock;
    final accentColor = ProductVersionBadge.colorsFor(slot.versionKey).$2;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Ink(
          decoration: BoxDecoration(
            color: isSelected
                ? AppColors.brandBlue.withValues(alpha: 0.04)
                : AppColors.brandWhite,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: isSelected ? AppColors.brandBlue : AppColors.dividerGrey,
              width: isSelected ? 1.5 : 1,
            ),
            boxShadow: isSelected
                ? [
                    BoxShadow(
                      color: AppColors.brandBlue.withValues(alpha: 0.1),
                      blurRadius: 8,
                      offset: const Offset(0, 2),
                    ),
                  ]
                : [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.04),
                      blurRadius: 4,
                      offset: const Offset(0, 1),
                    ),
                  ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(11),
            child: IntrinsicHeight(
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Container(
                    width: 3,
                    color: isSelected ? accentColor : Colors.transparent,
                  ),
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(8),
                            child: ProductImage(
                              imageUrl: variant.primaryImage,
                              width: 64,
                              height: 64,
                              borderRadius: BorderRadius.zero,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                ProductVersionBadge(
                                  versionKey: slot.versionKey,
                                  label: slot.displayLabel,
                                ),
                                const SizedBox(height: 6),
                                Text(
                                  slot.defaultSubtitle,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: GoogleFonts.montserrat(
                                    fontSize: 11,
                                    color: AppColors.textMuted,
                                    height: 1.3,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  inStock ? 'product.in_stock'.tr : 'product.out_of_stock'.tr,
                                  style: GoogleFonts.montserrat(
                                    fontSize: 10,
                                    fontWeight: FontWeight.w600,
                                    color: inStock
                                        ? AppColors.accentGreen
                                        : AppColors.accentRed,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 8),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              if (isSelected)
                                const Icon(
                                  Icons.check_circle_rounded,
                                  size: 20,
                                  color: AppColors.brandBlue,
                                )
                              else
                                const SizedBox(height: 20),
                              const SizedBox(height: 8),
                              Text(
                                formatPrice(variant.price),
                                style: GoogleFonts.playfairDisplay(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w700,
                                  color: AppColors.brandBlack,
                                ),
                              ),
                              if (savingsPercent != null) ...[
                                const SizedBox(height: 4),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 8,
                                    vertical: 3,
                                  ),
                                  decoration: BoxDecoration(
                                    color: AppColors.brandBlue,
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                  child: Text(
                                    'product.save_percent'.trParams(
                                      {'percent': '$savingsPercent'},
                                    ),
                                    style: GoogleFonts.montserrat(
                                      fontSize: 9,
                                      fontWeight: FontWeight.w600,
                                      color: AppColors.brandWhite,
                                    ),
                                  ),
                                ),
                              ],
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
