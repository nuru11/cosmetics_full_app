import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/utils/format_price.dart';
import '../../../data/models/product.dart';
import '../../../data/models/product_variant.dart';
import '../../cart/cart_actions.dart';

class ProductDetailBottomBar extends StatelessWidget {
  const ProductDetailBottomBar({
    super.key,
    required this.product,
    required this.variant,
  });

  final Product product;
  final ProductVariant variant;

  bool get _canAdd =>
      product.status.toUpperCase() == 'ACTIVE' && variant.inStock;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.cardWhite,
        boxShadow: [
          BoxShadow(
            color: AppColors.brandBlack.withValues(alpha: 0.06),
            blurRadius: 16,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      padding: const EdgeInsets.fromLTRB(20, 14, 20, 14),
      child: SafeArea(
        top: false,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Expanded(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    formatPrice(variant.price),
                    style: GoogleFonts.playfairDisplay(
                      fontSize: 20,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textDark,
                    ),
                  ),
                  if (!_canAdd)
                    Text(
                      !variant.inStock ? 'product.out_of_stock'.tr : 'product.unavailable'.tr,
                      style: GoogleFonts.montserrat(
                        fontSize: 11,
                        color: AppColors.textMuted,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                ],
              ),
            ),
            const SizedBox(width: 16),
            FilledButton.icon(
              onPressed: _canAdd
                  ? () async {
                      final added = await addVariantToCart(product, variant);
                      if (!context.mounted) return;
                      if (added) {
                        Get.toNamed('/cart');
                      }
                    }
                  : null,
              style: FilledButton.styleFrom(
                backgroundColor: AppColors.brandBlue,
                disabledBackgroundColor: AppColors.dividerGrey,
                disabledForegroundColor: AppColors.textMuted,
                foregroundColor: AppColors.brandWhite,
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
              ),
              icon: Icon(
                Icons.shopping_bag_outlined,
                size: 18,
                color: _canAdd ? AppColors.brandWhite : AppColors.textMuted,
              ),
              label: Text(
                'product.add_to_bag'.tr,
                style: GoogleFonts.montserrat(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 0.5,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
