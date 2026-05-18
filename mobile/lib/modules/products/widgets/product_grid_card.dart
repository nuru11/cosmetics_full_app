import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/product_image.dart';
import '../../../core/widgets/save_product_button.dart';
import '../../../data/models/product.dart';
import '../models/product_comparison.dart';
import 'product_add_button.dart';

class ProductGridCard extends StatelessWidget {
  const ProductGridCard({
    super.key,
    required this.product,
    this.onTap,
  });

  final Product product;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final versionKey = product.productVersion.toUpperCase();
    final label = ProductVersionSlot.labelFor(versionKey);
    final pillColors = _pillColors(versionKey);

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
                          imageUrl: product.primaryImage,
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
                            color: pillColors.$1,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            label,
                            style: GoogleFonts.montserrat(
                              fontSize: 8,
                              fontWeight: FontWeight.w700,
                              letterSpacing: 0.4,
                              color: pillColors.$2,
                            ),
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          '\$${product.price.toStringAsFixed(0)}',
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
                  ProductAddButton(product: product),
                ],
              ),
            ),
            Positioned(
              top: 14,
              right: 14,
              child: Material(
                color: AppColors.cardWhite.withValues(alpha: 0.92),
                shape: const CircleBorder(),
                child: SaveProductIconButton(
                  productId: product.id,
                  iconSize: 18,
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

  (Color bg, Color fg) _pillColors(String versionKey) {
    switch (versionKey) {
      case 'ORIGINAL':
        return (AppColors.textDark, AppColors.gold);
      case 'PREMIUM':
        return (AppColors.headerBrown, AppColors.gold);
      default:
        return (AppColors.secondPurple, Colors.white);
    }
  }
}
