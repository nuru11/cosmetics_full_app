import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/theme/app_colors.dart';
import '../../../data/models/product.dart';
import '../../../data/models/product_variant.dart';

class ProductDetailSpecs extends StatelessWidget {
  const ProductDetailSpecs({
    super.key,
    required this.product,
    required this.variant,
  });

  final Product product;
  final ProductVariant variant;

  @override
  Widget build(BuildContext context) {
    final chips = <_SpecChipData>[];

    if (variant.color != null && variant.color!.isNotEmpty) {
      chips.add(_SpecChipData(icon: Icons.circle_outlined, label: variant.color!));
    }
    if (variant.size != null && variant.size!.isNotEmpty) {
      chips.add(
        _SpecChipData(icon: Icons.straighten_rounded, label: variant.size!),
      );
    }
    chips.add(_SpecChipData(icon: Icons.wc_rounded, label: product.gender));

    if (chips.isEmpty) return const SizedBox.shrink();

    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: chips
          .map(
            (chip) => Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: AppColors.cardWhite,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.dividerGrey),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(chip.icon, size: 14, color: AppColors.textMuted),
                  const SizedBox(width: 6),
                  Text(
                    chip.label,
                    style: GoogleFonts.montserrat(
                      fontSize: 12,
                      color: AppColors.textDark,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
          )
          .toList(),
    );
  }
}

class _SpecChipData {
  const _SpecChipData({required this.icon, required this.label});
  final IconData icon;
  final String label;
}
