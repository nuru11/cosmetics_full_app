import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/theme/app_colors.dart';
import '../../cart/cart_actions.dart';
import '../../../data/models/product.dart';
import '../../../data/models/product_variant.dart';

class ProductAddButton extends StatelessWidget {
  const ProductAddButton({
    super.key,
    required this.product,
    this.variant,
    this.useBrandPalette = true,
    this.iconOnly = false,
  });

  final Product product;
  final ProductVariant? variant;
  final bool useBrandPalette;
  final bool iconOnly;

  @override
  Widget build(BuildContext context) {
    final selected =
        variant ?? product.firstInStockVariant ?? product.defaultVariant;
    if (selected == null) {
      return const SizedBox.shrink();
    }

    if (iconOnly) {
      final enabled = selected.inStock;
      return Material(
        elevation: enabled ? 3 : 0,
        shadowColor: AppColors.brandBlue.withValues(alpha: 0.35),
        color: enabled ? AppColors.cartButtonBg : AppColors.dividerGrey,
        shape: const CircleBorder(),
        child: InkWell(
          onTap: enabled
              ? () async {
                  final added = await addVariantToCart(product, selected);
                  if (!context.mounted) return;
                  if (added) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(
                          'product.added_to_bag'.trParams(
                            {'name': product.productName},
                          ),
                        ),
                        behavior: SnackBarBehavior.floating,
                        backgroundColor: AppColors.brandBlue,
                      ),
                    );
                  }
                }
              : null,
          customBorder: const CircleBorder(),
          child: SizedBox(
            width: 32,
            height: 32,
            child: Icon(
              Icons.add_shopping_cart,
              size: 16,
              color: enabled ? AppColors.brandWhite : AppColors.textMuted,
            ),
          ),
        ),
      );
    }

    final (bg, fg, border) = _colorsForVersion(
      selected.productVersion,
      useBrandPalette: useBrandPalette,
    );

    return SizedBox(
      width: double.infinity,
      height: 32,
      child: TextButton(
        onPressed: () async {
          final added = await addVariantToCart(product, selected);
          if (!context.mounted) return;
          if (added) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(
                  'product.added_to_bag'.trParams(
                    {'name': product.productName},
                  ),
                ),
                behavior: SnackBarBehavior.floating,
              ),
            );
          }
        },
        style: TextButton.styleFrom(
          backgroundColor: bg,
          foregroundColor: fg,
          padding: EdgeInsets.zero,
          side: border != null ? BorderSide(color: border) : null,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
        child: Text(
          'product.add_button'.tr,
          style: GoogleFonts.montserrat(
            fontSize: 10,
            fontWeight: FontWeight.w700,
            letterSpacing: 0.5,
          ),
        ),
      ),
    );
  }

  static (Color bg, Color fg, Color? border) _colorsForVersion(
    String versionKey, {
    required bool useBrandPalette,
  }) {
    if (!useBrandPalette) {
      switch (versionKey.toUpperCase()) {
        case 'ORIGINAL':
          return (AppColors.textDark, AppColors.gold, null);
        case 'PREMIUM':
          return (AppColors.headerBrown, AppColors.gold, null);
        default:
          return (AppColors.secondPurple, Colors.white, null);
      }
    }

    switch (versionKey.toUpperCase()) {
      case 'ORIGINAL':
        return (AppColors.brandBlack, AppColors.brandWhite, null);
      case 'PREMIUM':
        return (AppColors.brandBlue, AppColors.brandWhite, null);
      default:
        return (AppColors.brandWhite, AppColors.brandBlue, AppColors.brandBlue);
    }
  }
}
