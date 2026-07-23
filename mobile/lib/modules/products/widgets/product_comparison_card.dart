import 'package:get/get.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/utils/format_price.dart';
import '../../../core/widgets/product_image.dart';
import '../../../core/widgets/product_version_badge.dart';
import '../../../core/widgets/save_product_button.dart';
import '../models/product_comparison.dart';
import 'product_add_button.dart';

class ProductComparisonCard extends StatelessWidget {
  const ProductComparisonCard({
    super.key,
    required this.comparison,
    this.onProductTap,
  });

  final ProductComparison comparison;
  final void Function(String productId)? onProductTap;

  static const _columnWidth = 132.0;
  static const _scrollHeight = 248.0;

  @override
  Widget build(BuildContext context) {
    final slots = comparison.versions;
    if (slots.isEmpty) return const SizedBox.shrink();

    final showFade = slots.length > 2;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      child: Material(
        color: AppColors.cardWhite,
        borderRadius: BorderRadius.circular(16),
        elevation: 0,
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: AppColors.dividerGrey.withValues(alpha: 0.6),
            ),
          ),
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _CardHeader(comparison: comparison),
              const SizedBox(height: 14),
              SizedBox(
                height: _scrollHeight,
                child: Stack(
                  children: [
                    ListView.separated(
                      scrollDirection: Axis.horizontal,
                      physics: const BouncingScrollPhysics(),
                      padding: const EdgeInsets.only(right: 12),
                      itemCount: slots.length,
                      separatorBuilder: (context, index) => _ColumnSeparator(
                        showVs: index < slots.length - 1,
                      ),
                      itemBuilder: (context, index) {
                        final slot = slots[index];
                        final savings = slot.versionKey != 'ORIGINAL'
                            ? comparison.savingsPercentVersusOriginal(
                                slot.variant,
                              )
                            : null;
                        return SizedBox(
                          key: ValueKey(slot.variant.id),
                          width: _columnWidth,
                          child: _ProductSide(
                            slot: slot,
                            savingsPercent: savings,
                            onTap: onProductTap != null
                                ? () => onProductTap!(slot.product.id)
                                : null,
                          ),
                        );
                      },
                    ),
                      if (showFade)
                        Positioned(
                          right: 0,
                          top: 0,
                          bottom: 0,
                          child: IgnorePointer(
                            child: Container(
                              width: 28,
                              decoration: BoxDecoration(
                                borderRadius: const BorderRadius.horizontal(
                                  right: Radius.circular(12),
                                ),
                                gradient: LinearGradient(
                                  begin: Alignment.centerLeft,
                                  end: Alignment.centerRight,
                                  colors: [
                                    AppColors.cardWhite.withValues(alpha: 0),
                                    AppColors.cardWhite,
                                  ],
                                ),
                              ),
                              child: const Align(
                                alignment: Alignment.centerRight,
                                child: Padding(
                                  padding: EdgeInsets.only(right: 2),
                                  child: Icon(
                                    Icons.chevron_right,
                                    size: 18,
                                    color: AppColors.textMuted,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
                if (comparison.showScrollHint) ...[
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.swipe_left,
                        size: 14,
                        color: AppColors.brandBlue.withValues(alpha: 0.9),
                      ),
                      const SizedBox(width: 6),
                      Text(
                        'products.swipe_versions'.tr,
                        style: GoogleFonts.montserrat(
                          fontSize: 10,
                          fontWeight: FontWeight.w500,
                          color: AppColors.textMuted,
                        ),
                      ),
                    ],
                  ),
                ],
            ],
          ),
        ),
      ),
    );
  }
}

class _CardHeader extends StatelessWidget {
  const _CardHeader({required this.comparison});

  final ProductComparison comparison;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                comparison.displayBrand,
                style: GoogleFonts.playfairDisplay(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.5,
                  color: AppColors.textDark,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                comparison.productName,
                style: GoogleFonts.playfairDisplay(
                  fontSize: 13,
                  fontWeight: FontWeight.w400,
                  color: AppColors.textMuted,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
          decoration: BoxDecoration(
            color: AppColors.brandBlue.withValues(alpha: 0.15),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Text(
            comparison.categoryName.toUpperCase(),
            style: GoogleFonts.montserrat(
              fontSize: 9,
              fontWeight: FontWeight.w600,
              letterSpacing: 0.5,
              color: AppColors.brandBlue,
            ),
          ),
        ),
      ],
    );
  }
}

class _ColumnSeparator extends StatelessWidget {
  const _ColumnSeparator({required this.showVs});

  final bool showVs;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 24,
      child: showVs
          ? Center(
              child: Container(
                width: 22,
                height: 22,
                decoration: const BoxDecoration(
                  color: AppColors.brandBlack,
                  shape: BoxShape.circle,
                ),
                alignment: Alignment.center,
                child: Text(
                  'common.vs'.tr,
                  style: GoogleFonts.playfairDisplay(
                    fontSize: 9,
                    fontStyle: FontStyle.italic,
                    color: AppColors.brandWhite,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            )
          : null,
    );
  }
}

class _ProductSide extends StatelessWidget {
  const _ProductSide({
    required this.slot,
    this.savingsPercent,
    this.onTap,
  });

  final ProductVersionSlot slot;
  final int? savingsPercent;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final product = slot.product;
    final variant = slot.variant;
    final subtitle = slot.defaultSubtitle;

    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 4),
        child: Column(
          children: [
          ProductVersionBadge(
            versionKey: slot.versionKey,
            label: slot.displayLabel,
          ),
          const SizedBox(height: 8),
          Stack(
            clipBehavior: Clip.none,
            children: [
              ProductImage(
                imageUrl: variant.primaryImage,
                width: double.infinity,
                height: 72,
                borderRadius: BorderRadius.circular(8),
              ),
              Positioned(
                top: 2,
                right: 2,
                child: Material(
                  color: AppColors.cardWhite.withValues(alpha: 0.92),
                  shape: const CircleBorder(),
                  child: SaveProductIconButton(
                    variantId: variant.id,
                    iconSize: 16,
                    savedColor: AppColors.brandBlue,
                    unsavedColor: AppColors.textMuted,
                    padding: const EdgeInsets.all(4),
                    constraints: const BoxConstraints(
                      minWidth: 24,
                      minHeight: 24,
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            subtitle,
            textAlign: TextAlign.center,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: GoogleFonts.montserrat(
              fontSize: 9,
              color: AppColors.textMuted,
              height: 1.3,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            formatPrice(variant.price, decimals: 0),
            style: GoogleFonts.playfairDisplay(
              fontSize: 22,
              fontWeight: FontWeight.w700,
              color: AppColors.textDark,
            ),
          ),
          if (savingsPercent != null) ...[
            const SizedBox(height: 4),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                color: AppColors.brandBlue,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                'product.save_percent'.trParams({'percent': '$savingsPercent'}),
                style: GoogleFonts.montserrat(
                  fontSize: 9,
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                ),
              ),
            ),
          ],
            const Spacer(),
            ProductAddButton(
              product: product,
              variant: variant,
              useBrandPalette: true,
            ),
          ],
        ),
      ),
    );
  }
}
