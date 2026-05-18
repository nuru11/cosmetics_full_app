import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/product_image.dart';
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
                                slot.product,
                              )
                            : null;
                        return SizedBox(
                          key: ValueKey(slot.product.id),
                          width: _columnWidth,
                          child: _ProductSide(
                            slot: slot,
                            tierStyle: _tierStyleFor(slot.versionKey),
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
                        color: AppColors.gold.withValues(alpha: 0.9),
                      ),
                      const SizedBox(width: 6),
                      Text(
                        'Swipe for more versions',
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

  static _TierStyle _tierStyleFor(String versionKey) {
    switch (versionKey.toUpperCase()) {
      case 'ORIGINAL':
        return _TierStyle.original;
      case 'TWO_LEVEL':
        return _TierStyle.second;
      case 'PREMIUM':
        return _TierStyle.premium;
      default:
        return _TierStyle.second;
    }
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
            color: AppColors.secondPurple.withValues(alpha: 0.25),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Text(
            comparison.categoryName.toUpperCase(),
            style: GoogleFonts.montserrat(
              fontSize: 9,
              fontWeight: FontWeight.w600,
              letterSpacing: 0.5,
              color: AppColors.secondPurpleDark,
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
                  color: AppColors.textDark,
                  shape: BoxShape.circle,
                ),
                alignment: Alignment.center,
                child: Text(
                  'vs',
                  style: GoogleFonts.playfairDisplay(
                    fontSize: 9,
                    fontStyle: FontStyle.italic,
                    color: AppColors.gold,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            )
          : null,
    );
  }
}

enum _TierStyle { original, second, premium }

class _ProductSide extends StatelessWidget {
  const _ProductSide({
    required this.slot,
    required this.tierStyle,
    this.savingsPercent,
    this.onTap,
  });

  final ProductVersionSlot slot;
  final _TierStyle tierStyle;
  final int? savingsPercent;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final product = slot.product;
    final subtitle = (product.productDescription != null &&
            product.productDescription!.trim().isNotEmpty)
        ? product.productDescription!.trim()
        : slot.defaultSubtitle;

    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 4),
        child: Column(
          children: [
          _VersionPill(label: slot.displayLabel, style: tierStyle),
          const SizedBox(height: 8),
          Stack(
            clipBehavior: Clip.none,
            children: [
              ProductImage(
                imageUrl: product.primaryImage,
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
                    productId: product.id,
                    iconSize: 16,
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
            '\$${product.price.toStringAsFixed(0)}',
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
                color: tierStyle == _TierStyle.premium
                    ? AppColors.headerBrown
                    : AppColors.secondPurpleDark,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                'Save $savingsPercent%',
                style: GoogleFonts.montserrat(
                  fontSize: 9,
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                ),
              ),
            ),
          ],
            const Spacer(),
            ProductAddButton(product: product),
          ],
        ),
      ),
    );
  }
}

class _VersionPill extends StatelessWidget {
  const _VersionPill({required this.label, required this.style});

  final String label;
  final _TierStyle style;

  @override
  Widget build(BuildContext context) {
    final (bg, fg) = switch (style) {
      _TierStyle.original => (AppColors.textDark, AppColors.gold),
      _TierStyle.second => (AppColors.secondPurple, Colors.white),
      _TierStyle.premium => (AppColors.headerBrown, AppColors.gold),
    };

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        label,
        style: GoogleFonts.montserrat(
          fontSize: 9,
          fontWeight: FontWeight.w700,
          letterSpacing: 0.5,
          color: fg,
        ),
      ),
    );
  }
}
