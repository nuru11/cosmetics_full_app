import 'package:get/get.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/utils/format_price.dart';
import '../../../core/widgets/product_version_badge.dart';
import '../../../data/models/product.dart';
import '../../../data/models/product_variant.dart';
import '../../products/models/product_comparison.dart';

String versionSubtitleFor(ProductVariant variant) {
  final description = variant.variantDescription?.trim();
  if (description != null && description.isNotEmpty) return description;
  return ProductVersionSlot.defaultSubtitleFor(variant.productVersion);
}

class ProductDetailHeader extends StatelessWidget {
  const ProductDetailHeader({
    super.key,
    required this.product,
    required this.variant,
  });

  final Product product;
  final ProductVariant variant;

  @override
  Widget build(BuildContext context) {
    final comparison = ProductComparison.fromProduct(product);
    final savingsPercent =
        comparison.savingsPercentVersusOriginal(variant);
    final originalPrice = comparison.originalVariant?.price;
    final showCompareAt = savingsPercent != null &&
        originalPrice != null &&
        originalPrice > variant.price;
    final inStock = variant.inStock &&
        product.status.toUpperCase() == 'ACTIVE';
    final hasMultipleVariants = product.variants.length > 1;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          product.categoryName.toUpperCase(),
          style: GoogleFonts.montserrat(
            fontSize: 10,
            letterSpacing: 2,
            fontWeight: FontWeight.w600,
            color: AppColors.brandBlue,
          ),
        ),
        if (product.brand != null && product.brand!.isNotEmpty) ...[
          const SizedBox(height: 6),
          Text(
            product.brand!.toUpperCase(),
            style: GoogleFonts.montserrat(
              fontSize: 11,
              letterSpacing: 2.5,
              color: AppColors.brandBlue,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
        const SizedBox(height: 8),
        Text(
          product.productName,
          style: GoogleFonts.playfairDisplay(
            fontSize: 24,
            fontWeight: FontWeight.w700,
            color: AppColors.textDark,
            height: 1.25,
          ),
        ),
        const SizedBox(height: 12),
        Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Text(
              formatPrice(variant.price),
              style: GoogleFonts.montserrat(
                fontSize: 20,
                fontWeight: FontWeight.w700,
                color: showCompareAt ? AppColors.brandBlue : AppColors.textDark,
              ),
            ),
            if (showCompareAt) ...[
              const SizedBox(width: 8),
              Text(
                formatPrice(originalPrice),
                style: GoogleFonts.montserrat(
                  fontSize: 14,
                  color: AppColors.textMuted,
                  decoration: TextDecoration.lineThrough,
                  decorationColor: AppColors.textMuted,
                ),
              ),
            ],
            if (savingsPercent != null) ...[
              const SizedBox(width: 10),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.brandBlue,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  'product.save_percent'.trParams({'percent': '$savingsPercent'}),
                  style: GoogleFonts.montserrat(
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                    color: AppColors.brandWhite,
                  ),
                ),
              ),
            ],
          ],
        ),
        const SizedBox(height: 10),
        Row(
          children: [
            Container(
              width: 7,
              height: 7,
              decoration: BoxDecoration(
                color: inStock ? AppColors.accentGreen : AppColors.accentRed,
                shape: BoxShape.circle,
              ),
            ),
            const SizedBox(width: 6),
            Text(
              inStock ? 'product.in_stock'.tr : 'product.out_of_stock'.tr,
              style: GoogleFonts.montserrat(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: inStock ? AppColors.accentGreen : AppColors.accentRed,
              ),
            ),
            if (hasMultipleVariants) ...[
              Text(
                ' · ',
                style: GoogleFonts.montserrat(
                  fontSize: 12,
                  color: AppColors.textMuted,
                ),
              ),
              ProductVersionBadge(versionKey: variant.productVersion),
            ],
          ],
        ),
        if (hasMultipleVariants) ...[
          const SizedBox(height: 4),
          Text(
            versionSubtitleFor(variant),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: GoogleFonts.montserrat(
              fontSize: 12,
              color: AppColors.textMuted,
              height: 1.35,
            ),
          ),
        ],
      ],
    );
  }
}
