import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';

import '../../core/theme/app_colors.dart';
import '../../core/widgets/product_image.dart';
import '../../core/widgets/save_product_button.dart';
import '../../data/models/product.dart';
import '../../data/models/product_variant.dart';
import '../cart/cart_actions.dart';
import 'product_detail_controller.dart';
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
        backgroundColor: AppColors.brandWhite,
        extendBodyBehindAppBar: true,
        appBar: _GlassAppBar(controller: controller),
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
          return _AddToBagBar(product: product, variant: variant);
        }),
      ),
    );
  }
}

// ─── Glass AppBar ─────────────────────────────────────────────────────────────

class _GlassAppBar extends StatelessWidget implements PreferredSizeWidget {
  const _GlassAppBar({required this.controller});
  final ProductDetailController controller;

  @override
  Size get preferredSize => const Size.fromHeight(56);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: AppColors.brandWhite.withOpacity(0.85),
      elevation: 0,
      scrolledUnderElevation: 0,
      surfaceTintColor: Colors.transparent,
      leading: IconButton(
        icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
        color: AppColors.brandBlack,
        onPressed: () => Get.back(),
      ),
      title: Text(
        'DETAILS',
        style: TextStyle(
          fontFamily: 'Georgia',
          fontSize: 13,
          fontWeight: FontWeight.w400,
          letterSpacing: 3.5,
          color: AppColors.textMuted,
        ),
      ),
      centerTitle: true,
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

// ─── States ───────────────────────────────────────────────────────────────────

class _LoadingState extends StatelessWidget {
  const _LoadingState();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          SizedBox(
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
            style: TextStyle(
              fontFamily: 'Georgia',
              fontSize: 13,
              letterSpacing: 2,
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
            Icon(Icons.error_outline_rounded, size: 40, color: AppColors.brandBlue),
            const SizedBox(height: 20),
            Text(
              controller.error.value!,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontFamily: 'Georgia',
                fontSize: 14,
                color: AppColors.textMuted,
                height: 1.6,
              ),
            ),
            const SizedBox(height: 28),
            _OutlineButton(
              label: 'TRY AGAIN',
              onPressed: controller.loadProduct,
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
        style: TextStyle(
          fontFamily: 'Georgia',
          fontStyle: FontStyle.italic,
          fontSize: 16,
          color: AppColors.textMuted,
        ),
      ),
    );
  }
}

// ─── Product Detail Body ──────────────────────────────────────────────────────

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

    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          _HeroCarousel(images: images),

          Transform.translate(
            offset: const Offset(0, -16),
            child: Center(
              child: _CategoryChip(label: product.categoryName),
            ),
          ),

          Padding(
            padding: const EdgeInsets.fromLTRB(24, 0, 24, 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  product.productName,
                  style: const TextStyle(
                    fontFamily: 'Georgia',
                    fontSize: 26,
                    fontWeight: FontWeight.w400,
                    color: AppColors.brandBlack,
                    height: 1.25,
                    letterSpacing: 0.3,
                  ),
                ),

                const SizedBox(height: 6),

                if (product.brand != null && product.brand!.isNotEmpty)
                  Text(
                    product.brand!.toUpperCase(),
                    style: const TextStyle(
                      fontSize: 11,
                      letterSpacing: 3,
                      color: AppColors.brandBlue,
                      fontWeight: FontWeight.w500,
                    ),
                  ),

                const SizedBox(height: 20),

                Row(
                  children: [
                    Container(width: 32, height: 1, color: AppColors.brandBlue),
                    const SizedBox(width: 8),
                    Container(
                      width: 6,
                      height: 6,
                      decoration: const BoxDecoration(
                        color: AppColors.brandBlue,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(child: Container(height: 0.5, color: AppColors.dividerGrey)),
                  ],
                ),

                const SizedBox(height: 20),

                VariantPickerGrid(
                  product: product,
                  selectedVariant: variant,
                  onSelect: onSelectVariant,
                ),

                if (product.variants.length > 1) const SizedBox(height: 24),

                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    if (variant?.color != null && variant!.color!.isNotEmpty)
                      _AttributePill(icon: Icons.circle_outlined, label: variant.color!),
                    if (variant?.size != null && variant!.size!.isNotEmpty)
                      _AttributePill(icon: Icons.straighten_rounded, label: variant.size!),
                    _AttributePill(
                      icon: Icons.wc_rounded,
                      label: product.gender,
                    ),
                  ],
                ),

                const SizedBox(height: 24),

                if (product.productDescription != null &&
                    product.productDescription!.trim().isNotEmpty) ...[
                  const Text(
                    'ABOUT',
                    style: TextStyle(
                      fontSize: 10,
                      letterSpacing: 3.5,
                      color: AppColors.textMuted,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    product.productDescription!,
                    style: const TextStyle(
                      fontFamily: 'Georgia',
                      fontSize: 14.5,
                      color: AppColors.textMuted,
                      height: 1.75,
                      letterSpacing: 0.2,
                    ),
                  ),
                  const SizedBox(height: 24),
                ],

                if (variant != null) _DetailsCard(product: product, variant: variant),

                const SizedBox(height: 100),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Hero Carousel ────────────────────────────────────────────────────────────

class _HeroCarousel extends StatefulWidget {
  const _HeroCarousel({required this.images});
  final List<String> images;

  @override
  State<_HeroCarousel> createState() => _HeroCarouselState();
}

class _HeroCarouselState extends State<_HeroCarousel> {
  int _current = 0;

  @override
  Widget build(BuildContext context) {
    final images = widget.images;

    return Stack(
      children: [
        // Background gradient for hero
        Container(
          height: 360,
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                AppColors.dividerGrey,
                AppColors.brandWhite,
              ],
            ),
          ),
        ),

        // Image(s)
        SizedBox(
          height: 360,
          child: images.isEmpty
              ? ProductImage(imageUrl: null, height: 360, width: double.infinity)
              : images.length == 1
                  ? ProductImage(imageUrl: images.first, height: 360, width: double.infinity)
                  : PageView.builder(
                      itemCount: images.length,
                      onPageChanged: (i) => setState(() => _current = i),
                      itemBuilder: (_, i) => ProductImage(
                        imageUrl: images[i],
                        height: 360,
                        width: double.infinity,
                      ),
                    ),
        ),

        // Dot indicators
        if (images.length > 1)
          Positioned(
            bottom: 28,
            left: 0,
            right: 0,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(
                images.length,
                (i) => AnimatedContainer(
                  duration: const Duration(milliseconds: 250),
                  margin: const EdgeInsets.symmetric(horizontal: 3),
                  width: i == _current ? 18 : 6,
                  height: 6,
                  decoration: BoxDecoration(
                    color: i == _current ? AppColors.brandBlue : AppColors.brandBlueLight,
                    borderRadius: BorderRadius.circular(3),
                  ),
                ),
              ),
            ),
          ),
      ],
    );
  }
}

// ─── Category Chip ────────────────────────────────────────────────────────────

class _CategoryChip extends StatelessWidget {
  const _CategoryChip({required this.label});
  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 7),
      decoration: BoxDecoration(
        color: AppColors.brandWhite,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: AppColors.brandBlue.withOpacity(0.10),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Text(
        label.toUpperCase(),
        style: const TextStyle(
          fontSize: 10,
          letterSpacing: 2.5,
          color: AppColors.brandBlue,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}

// ─── Attribute Pill ───────────────────────────────────────────────────────────

class _AttributePill extends StatelessWidget {
  const _AttributePill({required this.icon, required this.label});
  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
      decoration: BoxDecoration(
        color: AppColors.brandWhite,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: AppColors.dividerGrey, width: 1),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 13, color: AppColors.textMuted),
          const SizedBox(width: 6),
          Text(
            label,
            style: const TextStyle(
              fontSize: 12.5,
              color: AppColors.textMuted,
              letterSpacing: 0.3,
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Details Card ─────────────────────────────────────────────────────────────

class _DetailsCard extends StatelessWidget {
  const _DetailsCard({required this.product, required this.variant});
  final Product product;
  final ProductVariant variant;

  @override
  Widget build(BuildContext context) {
    final rows = <_DetailRow>[];

    rows.add(_DetailRow(label: 'Stock', value: '${variant.stock} units'));
    if (variant.sku != null && variant.sku!.isNotEmpty) {
      rows.add(_DetailRow(label: 'SKU', value: variant.sku!));
    }
    rows.add(_DetailRow(
      label: 'Status',
      value: product.status,
      valueColor: product.status.toUpperCase() == 'ACTIVE'
          ? const Color(0xFF6BAE75)
          : AppColors.brandBlue,
    ));

    return Container(
      decoration: BoxDecoration(
        color: AppColors.brandWhite,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.dividerGrey, width: 1),
      ),
      child: Column(
        children: [
          for (int i = 0; i < rows.length; i++) ...[
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 13),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    rows[i].label.toUpperCase(),
                    style: const TextStyle(
                      fontSize: 10.5,
                      letterSpacing: 1.8,
                      color: AppColors.textMuted,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  Text(
                    rows[i].value,
                    style: TextStyle(
                      fontSize: 13,
                      color: rows[i].valueColor ?? AppColors.brandBlack,
                      fontWeight: FontWeight.w500,
                      letterSpacing: 0.2,
                    ),
                  ),
                ],
              ),
            ),
            if (i < rows.length - 1)
              Divider(height: 1, color: AppColors.dividerGrey),
          ],
        ],
      ),
    );
  }
}

class _DetailRow {
  const _DetailRow({required this.label, required this.value, this.valueColor});
  final String label;
  final String value;
  final Color? valueColor;
}

// ─── Add to Bag Bar ───────────────────────────────────────────────────────────

class _AddToBagBar extends StatelessWidget {
  const _AddToBagBar({required this.product, required this.variant});
  final Product product;
  final ProductVariant variant;

  bool get _canAdd =>
      product.status.toUpperCase() == 'ACTIVE' && variant.stock > 0;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.brandWhite,
        boxShadow: [
          BoxShadow(
            color: AppColors.brandBlack.withOpacity(0.06),
            blurRadius: 16,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      padding: const EdgeInsets.fromLTRB(24, 14, 24, 14),
      child: SafeArea(
        top: false,
        child: Row(
          children: [
            Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '\$${variant.price.toStringAsFixed(2)}',
                  style: const TextStyle(
                    fontFamily: 'Georgia',
                    fontSize: 22,
                    fontWeight: FontWeight.w400,
                    color: AppColors.brandBlack,
                    letterSpacing: 0.5,
                  ),
                ),
                if (!_canAdd)
                  Text(
                    variant.stock <= 0 ? 'Out of stock' : 'Unavailable',
                    style: const TextStyle(
                      fontSize: 11,
                      color: AppColors.textMuted,
                      letterSpacing: 0.5,
                    ),
                  )
                else
                  Text(
                    variant.displayLabel,
                    style: const TextStyle(
                      fontSize: 11,
                      color: Color(0xFF6BAE75),
                      letterSpacing: 0.5,
                    ),
                  ),
              ],
            ),

            const Spacer(),

            GestureDetector(
              onTap: _canAdd
                  ? () async {
                      final added = await addVariantToCart(product, variant);
                      if (!context.mounted) return;
                      if (added) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: const Text(
                              'Added to your bag',
                              style: TextStyle(
                                fontFamily: 'Georgia',
                                letterSpacing: 0.3,
                              ),
                            ),
                            backgroundColor: AppColors.brandBlue,
                            behavior: SnackBarBehavior.floating,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                            margin: const EdgeInsets.all(12),
                          ),
                        );
                      }
                    }
                  : null,
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 15),
                decoration: BoxDecoration(
                  color: _canAdd ? AppColors.brandBlue : AppColors.dividerGrey,
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      Icons.shopping_bag_outlined,
                      size: 18,
                      color: _canAdd
                          ? AppColors.brandWhite
                          : AppColors.textMuted,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'ADD TO BAG',
                      style: TextStyle(
                        fontSize: 12,
                        letterSpacing: 2,
                        fontWeight: FontWeight.w600,
                        color: _canAdd
                            ? AppColors.brandWhite
                            : AppColors.textMuted,
                      ),
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

// ─── Outline Button ───────────────────────────────────────────────────────────

class _OutlineButton extends StatelessWidget {
  const _OutlineButton({required this.label, required this.onPressed});
  final String label;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onPressed,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 13),
        decoration: BoxDecoration(
          border: Border.all(color: AppColors.brandBlue, width: 1),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Text(
          label,
          style: const TextStyle(
            fontSize: 11,
            letterSpacing: 2.5,
            color: AppColors.brandBlack,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }
}