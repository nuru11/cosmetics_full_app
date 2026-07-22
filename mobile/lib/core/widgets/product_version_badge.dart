import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../theme/app_colors.dart';
import '../../modules/products/models/product_comparison.dart';

enum ProductVersionBadgeStyle {
  /// Refined pill for card content areas.
  standard,

  /// Frosted badge for use over product photography.
  overlay,
}

class ProductVersionBadge extends StatelessWidget {
  const ProductVersionBadge({
    super.key,
    required this.versionKey,
    this.label,
    this.style = ProductVersionBadgeStyle.standard,
  });

  final String versionKey;
  final String? label;
  final ProductVersionBadgeStyle style;

  static (Color bg, Color fg, Color border) colorsFor(String versionKey) {
    switch (versionKey.toUpperCase()) {
      case 'ORIGINAL':
        return (
          AppColors.cardHeaderBeige,
          AppColors.headerBrown,
          AppColors.dividerGrey.withValues(alpha: 0.7),
        );
      case 'PREMIUM':
        return (
          AppColors.brandBlue.withValues(alpha: 0.1),
          AppColors.brandBlue,
          AppColors.brandBlue.withValues(alpha: 0.28),
        );
      default:
        return (
          AppColors.brandWhite,
          AppColors.secondPurpleDark,
          AppColors.secondPurple.withValues(alpha: 0.45),
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    final displayLabel = label ?? ProductVersionSlot.labelFor(versionKey);
    final (bg, fg, border) = colorsFor(versionKey);

    if (style == ProductVersionBadgeStyle.overlay) {
      return ClipRRect(
        borderRadius: BorderRadius.circular(6),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 8, sigmaY: 8),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.88),
              borderRadius: BorderRadius.circular(6),
              border: Border.all(color: border),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.06),
                  blurRadius: 6,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Text(
              displayLabel,
              style: GoogleFonts.montserrat(
                fontSize: 9,
                fontWeight: FontWeight.w600,
                letterSpacing: 1.1,
                color: fg,
              ),
            ),
          ),
        ),
      );
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(4),
        border: Border.all(color: border),
      ),
      child: Text(
        displayLabel,
        style: GoogleFonts.montserrat(
          fontSize: 10,
          fontWeight: FontWeight.w600,
          letterSpacing: 1.0,
          height: 1.1,
          color: fg,
        ),
      ),
    );
  }
}

/// Full-width header strip placed above the product image on grid cards.
class ProductVersionCardHeader extends StatelessWidget {
  const ProductVersionCardHeader({
    super.key,
    required this.versionKey,
    this.optionCount,
  });

  final String versionKey;
  final int? optionCount;

  @override
  Widget build(BuildContext context) {
    final showOptions = optionCount != null && optionCount! > 1;
    final (bg, fg, border) = ProductVersionBadge.colorsFor(versionKey);
    final label = ProductVersionSlot.labelFor(versionKey);

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(4)),
        border: Border(
          bottom: BorderSide(color: border.withValues(alpha: 0.45)),
        ),
      ),
      child: Row(
        children: [
          Container(
            width: 3,
            height: 12,
            decoration: BoxDecoration(
              color: fg,
              borderRadius: BorderRadius.circular(1.5),
            ),
          ),
          const SizedBox(width: 6),
          Expanded(
            child: Text(
              label,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: GoogleFonts.montserrat(
                fontSize: 9,
                fontWeight: FontWeight.w600,
                letterSpacing: 1.2,
                color: fg,
              ),
            ),
          ),
          if (showOptions) ...[
            Icon(
              Icons.layers_outlined,
              size: 10,
              color: fg.withValues(alpha: 0.75),
            ),
            const SizedBox(width: 2),
            Text(
              '$optionCount',
              style: GoogleFonts.montserrat(
                fontSize: 9,
                fontWeight: FontWeight.w600,
                color: fg.withValues(alpha: 0.85),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

/// Inline version label with optional multi-option hint for product cards.
class ProductVersionMetaRow extends StatelessWidget {
  const ProductVersionMetaRow({
    super.key,
    required this.versionKey,
    this.optionCount,
  });

  final String versionKey;
  final int? optionCount;

  @override
  Widget build(BuildContext context) {
    final showOptions = optionCount != null && optionCount! > 1;

    return Wrap(
      crossAxisAlignment: WrapCrossAlignment.center,
      spacing: 4,
      runSpacing: 2,
      children: [
        ProductVersionBadge(versionKey: versionKey),
        if (showOptions)
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                Icons.layers_outlined,
                size: 11,
                color: AppColors.textMuted.withValues(alpha: 0.85),
              ),
              const SizedBox(width: 2),
              Text(
                '$optionCount',
                style: GoogleFonts.montserrat(
                  fontSize: 10,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textMuted,
                ),
              ),
            ],
          ),
      ],
    );
  }
}
