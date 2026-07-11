import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/product_image.dart';
import '../../../core/widgets/save_product_button.dart';
import '../../../data/models/product.dart';
import '../../../data/models/product_variant.dart';
import '../models/product_comparison.dart';
import 'product_add_button.dart';

class ProductGridCard extends StatelessWidget {
  const ProductGridCard({
    super.key,
    required this.product,
    this.highlightVariant,
    this.onTap,
  });

  final Product product;
  final ProductVariant? highlightVariant;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final displayVariant = highlightVariant ?? product.defaultVariant;
    final versionKey =
        displayVariant?.productVersion.toUpperCase() ?? 'ORIGINAL';
    final label = highlightVariant != null
        ? highlightVariant!.displayLabel
        : displayVariant != null && product.variants.length > 1
            ? '${product.variants.length} options'
            : ProductVersionSlot.labelFor(versionKey);
    final pillStyle = _pillStyle(versionKey);
    final priceLabel = highlightVariant != null
        ? '\$${highlightVariant!.price.toStringAsFixed(0)}'
        : product.displayPriceMax != null &&
                product.displayPrice != null &&
                product.displayPriceMax != product.displayPrice
            ? 'From \$${product.displayPrice!.toStringAsFixed(0)}'
            : '\$${product.price.toStringAsFixed(0)}';
    final imageUrl = highlightVariant?.primaryImage ?? product.primaryImage;
    final favoriteVariantId = displayVariant?.id ?? '';

    return Material(
      color: AppColors.cardWhite,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: AppColors.dividerGrey.withValues(alpha: 0.6),
          ),
        ),
        child: Stack(
          clipBehavior: Clip.none,
          children: [
            Padding(
              padding: const EdgeInsets.all(10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  InkWell(
                    onTap: onTap,
                    borderRadius: BorderRadius.circular(8),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        ProductImage(
                          imageUrl: imageUrl,
                          width: double.infinity,
                          height: 100,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        const SizedBox(height: 8),
                        if (product.brand != null && product.brand!.isNotEmpty)
                          Text(
                            product.brand!.toUpperCase(),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: GoogleFonts.playfairDisplay(
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                              color: AppColors.textDark,
                            ),
                          ),
                        const SizedBox(height: 2),
                        Text(
                          product.productName,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: GoogleFonts.playfairDisplay(
                            fontSize: 11,
                            color: AppColors.textMuted,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 3,
                          ),
                          decoration: BoxDecoration(
                            color: pillStyle.$1,
                            border: pillStyle.$3 != null
                                ? Border.all(color: pillStyle.$3!)
                                : null,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            label,
                            style: GoogleFonts.montserrat(
                              fontSize: 8,
                              fontWeight: FontWeight.w700,
                              letterSpacing: 0.4,
                              color: pillStyle.$2,
                            ),
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          priceLabel,
                          style: GoogleFonts.playfairDisplay(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            color: AppColors.textDark,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 8),
                  ProductAddButton(
                    product: product,
                    variant: displayVariant,
                    useBrandPalette: true,
                  ),
                ],
              ),
            ),
            if (favoriteVariantId.isNotEmpty)
              Positioned(
                top: 14,
                right: 14,
                child: Material(
                  color: AppColors.cardWhite.withValues(alpha: 0.92),
                  shape: const CircleBorder(),
                  child: SaveProductIconButton(
                    variantId: favoriteVariantId,
                    iconSize: 18,
                    savedColor: AppColors.brandBlue,
                    padding: const EdgeInsets.all(6),
                    constraints: const BoxConstraints(
                      minWidth: 28,
                      minHeight: 28,
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  (Color bg, Color fg, Color? border) _pillStyle(String versionKey) {
    switch (versionKey) {
      case 'ORIGINAL':
        return (AppColors.brandBlack, AppColors.brandWhite, null);
      case 'PREMIUM':
        return (AppColors.brandBlue, AppColors.brandWhite, null);
      default:
        return (AppColors.brandWhite, AppColors.brandBlue, AppColors.brandBlue);
    }
  }
}
