import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/theme/app_colors.dart';
import '../../../data/models/product.dart';
import '../../cart/cart_actions.dart';

class ProductAddButton extends StatelessWidget {
  const ProductAddButton({super.key, required this.product});

  final Product product;

  @override
  Widget build(BuildContext context) {
    final (bg, fg) = _colorsForVersion(product.productVersion);

    return SizedBox(
      width: double.infinity,
      height: 32,
      child: TextButton(
        onPressed: () async {
          final added = await addProductToCart(product);
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

  static (Color bg, Color fg) _colorsForVersion(String versionKey) {
    switch (versionKey.toUpperCase()) {
      case 'ORIGINAL':
        return (AppColors.textDark, AppColors.gold);
      case 'PREMIUM':
        return (AppColors.headerBrown, AppColors.gold);
      default:
        return (AppColors.secondPurple, Colors.white);
    }
  }
}
