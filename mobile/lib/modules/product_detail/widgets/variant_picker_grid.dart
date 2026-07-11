import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/product_image.dart';
import '../../../data/models/product.dart';
import '../../../data/models/product_variant.dart';

class VariantPickerGrid extends StatelessWidget {
  const VariantPickerGrid({
    super.key,
    required this.product,
    required this.selectedVariant,
    required this.onSelect,
  });

  final Product product;
  final ProductVariant? selectedVariant;
  final ValueChanged<ProductVariant> onSelect;

  @override
  Widget build(BuildContext context) {
    if (product.variants.length <= 1) return const SizedBox.shrink();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'SELECT OPTION',
          style: GoogleFonts.montserrat(
            fontSize: 10,
            letterSpacing: 2,
            fontWeight: FontWeight.w600,
            color: AppColors.textMuted,
          ),
        ),
        const SizedBox(height: 12),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: product.variants.length,
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            mainAxisSpacing: 10,
            crossAxisSpacing: 10,
            childAspectRatio: 0.92,
          ),
          itemBuilder: (context, index) {
            final variant = product.variants[index];
            final isSelected = selectedVariant?.id == variant.id;
            return _VariantCard(
              variant: variant,
              isSelected: isSelected,
              onTap: () => onSelect(variant),
            );
          },
        ),
      ],
    );
  }
}

class _VariantCard extends StatelessWidget {
  const _VariantCard({
    required this.variant,
    required this.isSelected,
    required this.onTap,
  });

  final ProductVariant variant;
  final bool isSelected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: isSelected ? AppColors.brandBlue : AppColors.dividerGrey,
              width: isSelected ? 2 : 1,
            ),
          ),
          padding: const EdgeInsets.all(8),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ProductImage(
                imageUrl: variant.primaryImage,
                width: double.infinity,
                height: 56,
                borderRadius: BorderRadius.circular(8),
              ),
              const SizedBox(height: 8),
              Text(
                variant.displayLabel,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: GoogleFonts.montserrat(
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textDark,
                  height: 1.2,
                ),
              ),
              const Spacer(),
              Text(
                '\$${variant.price.toStringAsFixed(2)}',
                style: GoogleFonts.playfairDisplay(
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                  color: AppColors.brandBlack,
                ),
              ),
              if (variant.stock <= 0)
                Text(
                  'Out of stock',
                  style: GoogleFonts.montserrat(
                    fontSize: 9,
                    color: Colors.red.shade700,
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
