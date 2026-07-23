import 'package:get/get.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/utils/format_price.dart';
import '../../../core/widgets/product_image.dart';
import '../../../core/widgets/product_version_badge.dart';
import '../../../data/models/product.dart';
import '../../../data/models/product_variant.dart';
import 'product_add_button.dart';

class ProductGridCard extends StatelessWidget {
  const ProductGridCard({
    super.key,
    required this.product,
    this.highlightVariant,
    this.onTap,
  });

  static const _imageHeight = 160.0;

  final Product product;
  final ProductVariant? highlightVariant;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final displayVariant =
        highlightVariant ?? product.firstInStockVariant ?? product.defaultVariant;
    final imageUrl = displayVariant?.primaryImage ?? product.primaryImage;

    final usingHighlightedVariant = highlightVariant != null;
    final minPrice = usingHighlightedVariant
        ? displayVariant!.price
        : (product.displayPrice ?? displayVariant?.price ?? product.price);
    final maxPrice = usingHighlightedVariant ? null : product.displayPriceMax;
    final hasDiscount = !usingHighlightedVariant &&
        maxPrice != null &&
        maxPrice > minPrice &&
        minPrice > 0;
    final discountPercent = hasDiscount
        ? (((maxPrice - minPrice) / maxPrice) * 100).round()
        : null;

    final inStock = displayVariant?.inStock ?? false;
    final versionKey = displayVariant?.productVersion ?? 'ORIGINAL';

    return Material(
      color: AppColors.cardWhite,
      elevation: 3,
      shadowColor: Colors.black.withValues(alpha: 0.08),
      borderRadius: BorderRadius.circular(4),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(4),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (displayVariant != null)
              ProductVersionCardHeader(versionKey: versionKey),
            Stack(
              children: [
                ClipRRect(
                  borderRadius: displayVariant != null
                      ? BorderRadius.zero
                      : const BorderRadius.vertical(top: Radius.circular(4)),
                  child: ProductImage(
                    imageUrl: imageUrl,
                    width: double.infinity,
                    height: _imageHeight,
                    borderRadius: BorderRadius.zero,
                  ),
                ),
                if (discountPercent != null)
                  Positioned(
                    top: 8,
                    left: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [
                            AppColors.accentRed,
                            Color(0xFFFF7043),
                          ],
                        ),
                        borderRadius: BorderRadius.circular(12),
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.accentRed.withValues(alpha: 0.35),
                            blurRadius: 4,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: Text(
                        '-$discountPercent%',
                        style: GoogleFonts.montserrat(
                          fontSize: 10,
                          fontWeight: FontWeight.w700,
                          color: AppColors.brandWhite,
                        ),
                      ),
                    ),
                  ),
              ],
            ),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(10, 8, 10, 10),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    SizedBox(
                      height: 33,
                      child: Text(
                        product.productName,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: GoogleFonts.montserrat(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textDark,
                          height: 1.25,
                        ),
                      ),
                    ),
                    const SizedBox(height: 6),
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.baseline,
                      textBaseline: TextBaseline.alphabetic,
                      children: [
                        Text(
                          formatPrice(minPrice),
                          style: GoogleFonts.montserrat(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: hasDiscount
                                ? AppColors.brandBlue
                                : AppColors.textDark,
                          ),
                        ),
                        if (hasDiscount) ...[
                          const SizedBox(width: 6),
                          Text(
                            formatPrice(maxPrice),
                            style: GoogleFonts.montserrat(
                              fontSize: 11,
                              color: AppColors.textMuted,
                              decoration: TextDecoration.lineThrough,
                              decorationColor: AppColors.textMuted,
                            ),
                          ),
                        ],
                      ],
                    ),
                    const Spacer(),
                    Row(
                      children: [
                        Text(
                          inStock ? 'product.in_stock_title'.tr : 'product.out_of_stock_title'.tr,
                          style: GoogleFonts.montserrat(
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            color: inStock
                                ? AppColors.accentGreen
                                : AppColors.accentRed,
                          ),
                        ),
                        const Spacer(),
                        ProductAddButton(
                          product: product,
                          variant: displayVariant,
                          iconOnly: true,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
