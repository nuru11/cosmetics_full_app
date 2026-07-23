import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../core/theme/app_colors.dart';
import '../../core/widgets/save_product_button.dart';
import '../../data/models/product.dart';
import '../../data/models/product_variant.dart';
import 'product_detail_controller.dart';
import 'widgets/product_detail_bottom_bar.dart';
import 'widgets/product_detail_description.dart';
import 'widgets/product_detail_header.dart';
import 'widgets/product_detail_hero.dart';
import 'widgets/product_detail_specs.dart';
import 'widgets/variant_picker_grid.dart';

class ProductDetailView extends GetView<ProductDetailController> {
  const ProductDetailView({super.key});

  @override
  Widget build(BuildContext context) {
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle.dark.copyWith(
        statusBarColor: Colors.transparent,
      ),
      child: Scaffold(
        backgroundColor: AppColors.homeBackground,
        appBar: _ProductDetailAppBar(controller: controller),
        body: Obx(() {
          if (controller.isLoading.value) {
            return const _LoadingState();
          }
          if (controller.error.value != null) {
            return _ErrorState(controller: controller);
          }
          final product = controller.product.value;
          if (product == null) {
            return const _EmptyState();
          }
          return Obx(
            () => _ProductDetailBody(
              product: product,
              selectedVariant: controller.selectedVariant.value,
              onSelectVariant: controller.selectVariant,
            ),
          );
        }),
        bottomNavigationBar: Obx(() {
          final product = controller.product.value;
          final variant = controller.selectedVariant.value;
          if (controller.isLoading.value || product == null || variant == null) {
            return const SizedBox.shrink();
          }
          return ProductDetailBottomBar(product: product, variant: variant);
        }),
      ),
    );
  }
}

class _ProductDetailAppBar extends StatelessWidget implements PreferredSizeWidget {
  const _ProductDetailAppBar({required this.controller});
  final ProductDetailController controller;

  @override
  Size get preferredSize => const Size.fromHeight(56);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: AppColors.homeBackground,
      elevation: 0,
      scrolledUnderElevation: 0,
      surfaceTintColor: Colors.transparent,
      bottom: PreferredSize(
        preferredSize: const Size.fromHeight(1),
        child: Container(
          height: 1,
          color: AppColors.dividerGrey.withValues(alpha: 0.5),
        ),
      ),
      leading: IconButton(
        icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
        color: AppColors.brandBlack,
        onPressed: () => Get.back(),
      ),
      title: Obx(() {
        final name = controller.product.value?.productName ?? '';
        return Text(
          name.isEmpty ? 'Product' : name,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: GoogleFonts.montserrat(
            fontSize: 15,
            fontWeight: FontWeight.w600,
            color: AppColors.textDark,
          ),
        );
      }),
      actions: [
        Obx(() {
          final product = controller.product.value;
          final variant = controller.selectedVariant.value;
          if (product == null || variant == null) return const SizedBox.shrink();
          return SaveProductIconButton(
            variantId: variant.id,
            iconSize: 22,
            savedColor: AppColors.brandBlue,
            unsavedColor: AppColors.textMuted,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            constraints: const BoxConstraints(minWidth: 48, minHeight: 48),
          );
        }),
      ],
    );
  }
}

class _LoadingState extends StatelessWidget {
  const _LoadingState();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const SizedBox(
            width: 32,
            height: 32,
            child: CircularProgressIndicator(
              strokeWidth: 1.5,
              color: AppColors.brandBlue,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            'Loading...',
            style: GoogleFonts.montserrat(
              fontSize: 13,
              letterSpacing: 0.5,
              color: AppColors.textMuted,
            ),
          ),
        ],
      ),
    );
  }
}

class _ErrorState extends StatelessWidget {
  const _ErrorState({required this.controller});
  final ProductDetailController controller;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(40),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.error_outline_rounded,
              size: 40,
              color: AppColors.brandBlue,
            ),
            const SizedBox(height: 20),
            Text(
              controller.error.value!,
              textAlign: TextAlign.center,
              style: GoogleFonts.montserrat(
                fontSize: 14,
                color: AppColors.textMuted,
                height: 1.6,
              ),
            ),
            const SizedBox(height: 28),
            OutlinedButton(
              onPressed: controller.loadProduct,
              style: OutlinedButton.styleFrom(
                foregroundColor: AppColors.brandBlack,
                side: const BorderSide(color: AppColors.brandBlue),
                padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 13),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: Text(
                'Try again',
                style: GoogleFonts.montserrat(
                  fontSize: 12,
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

class _EmptyState extends StatelessWidget {
  const _EmptyState();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text(
        'Product not found',
        style: GoogleFonts.montserrat(
          fontSize: 15,
          fontStyle: FontStyle.italic,
          color: AppColors.textMuted,
        ),
      ),
    );
  }
}

class _ProductDetailBody extends StatelessWidget {
  const _ProductDetailBody({
    required this.product,
    required this.selectedVariant,
    required this.onSelectVariant,
  });

  final Product product;
  final ProductVariant? selectedVariant;
  final ValueChanged<ProductVariant> onSelectVariant;

  @override
  Widget build(BuildContext context) {
    final variant = selectedVariant ?? product.defaultVariant;
    final images = variant?.variantImages ?? const <String>[];
    final hasMultipleVariants = product.variants.length > 1;
    final description = product.productDescription?.trim();

    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          AnimatedSwitcher(
            duration: const Duration(milliseconds: 300),
            switchInCurve: Curves.easeOut,
            switchOutCurve: Curves.easeIn,
            child: ProductDetailHero(
              key: ValueKey(variant?.id ?? 'hero'),
              images: images,
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 20, 20, 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (variant != null)
                  ProductDetailHeader(
                    product: product,
                    variant: variant,
                  ),
                if (hasMultipleVariants && variant != null) ...[
                  const SizedBox(height: 24),
                  VariantPickerGrid(
                    product: product,
                    selectedVariant: variant,
                    onSelect: onSelectVariant,
                  ),
                ],
                if (variant != null) ...[
                  const SizedBox(height: 20),
                  ProductDetailSpecs(
                    product: product,
                    variant: variant,
                  ),
                ],
                if (description != null && description.isNotEmpty) ...[
                  const SizedBox(height: 24),
                  ProductDetailDescription(description: description),
                ],
                const SizedBox(height: 100),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
