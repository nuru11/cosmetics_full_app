import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/theme/app_colors.dart';
import '../../../data/models/product.dart';
import '../../../data/models/product_variant.dart';
import '../../cart/cart_actions.dart';

class ProductAddButton extends StatelessWidget {
  const ProductAddButton({
    super.key,
    required this.product,
    this.variant,
    this.useBrandPalette = true,
  });

  final Product product;
  final ProductVariant? variant;
  final bool useBrandPalette;

  @override
  Widget build(BuildContext context) {
    final selected =
        variant ?? product.firstInStockVariant ?? product.defaultVariant;
    if (selected == null) {
      return const SizedBox.shrink();
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
                content: Text('${product.productName} added to bag'),
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
          '+ ADD',
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
