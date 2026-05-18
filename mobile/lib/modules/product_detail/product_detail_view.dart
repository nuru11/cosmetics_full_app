import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';

import '../../core/theme/app_colors.dart';
import '../../core/widgets/product_image.dart';
import '../../core/widgets/save_product_button.dart';
import '../../data/models/product.dart';
import '../cart/cart_actions.dart';
import 'product_detail_controller.dart';

// ─── Color Palette ────────────────────────────────────────────────────────────
// Ivory & Dusty Rose luxury cosmetics palette
class _Palette {
  static const bg = Color(0xFFFAF7F4);
  static const surface = Color(0xFFFFFFFF);
  static const roseDust = Color(0xFFD4A0A0);
  static const roseDeep = Color(0xFF9E5F5F);
  static const gold = Color(0xFFC9A96E);
  static const goldLight = Color(0xFFEDD9B0);
  static const ink = Color(0xFF2B1F1F);
  static const inkMuted = Color(0xFF7A6868);
  static const inkFaint = Color(0xFFB8A8A8);
  static const divider = Color(0xFFEDE5E0);
}

class ProductDetailView extends GetView<ProductDetailController> {
  const ProductDetailView({super.key});

  @override
  Widget build(BuildContext context) {
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle.dark.copyWith(
        statusBarColor: Colors.transparent,
      ),
      child: Scaffold(
        backgroundColor: _Palette.bg,
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
          return _ProductDetailBody(product: product);
        }),
        bottomNavigationBar: Obx(() {
          final product = controller.product.value;
          if (controller.isLoading.value || product == null) {
            return const SizedBox.shrink();
          }
          return _AddToBagBar(product: product);
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
      backgroundColor: _Palette.bg.withOpacity(0.85),
      elevation: 0,
      scrolledUnderElevation: 0,
      surfaceTintColor: Colors.transparent,
      leading: IconButton(
        icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
        color: _Palette.ink,
        onPressed: () => Get.back(),
      ),
      title: Text(
        'DETAILS',
        style: TextStyle(
          fontFamily: 'Georgia',
          fontSize: 13,
          fontWeight: FontWeight.w400,
          letterSpacing: 3.5,
          color: _Palette.inkMuted,
        ),
      ),
      centerTitle: true,
      actions: [
        Obx(() {
          final product = controller.product.value;
          if (product == null) return const SizedBox.shrink();
          return SaveProductIconButton(
            productId: product.id,
            iconSize: 22,
            unsavedColor: _Palette.inkMuted,
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
              color: _Palette.roseDust,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            'Loading...',
            style: TextStyle(
              fontFamily: 'Georgia',
              fontSize: 13,
              letterSpacing: 2,
              color: _Palette.inkFaint,
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
            Icon(Icons.error_outline_rounded, size: 40, color: _Palette.roseDust),
            const SizedBox(height: 20),
            Text(
              controller.error.value!,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontFamily: 'Georgia',
                fontSize: 14,
                color: _Palette.inkMuted,
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
          color: _Palette.inkFaint,
        ),
      ),
    );
  }
}

// ─── Product Detail Body ──────────────────────────────────────────────────────

class _ProductDetailBody extends StatelessWidget {
  const _ProductDetailBody({required this.product});
  final Product product;

  @override
  Widget build(BuildContext context) {
    final images = product.productImages;

    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // ── Hero Image ──────────────────────────────────────────────────────
          _HeroCarousel(images: images),

          // ── Floating Category Chip ──────────────────────────────────────────
          Transform.translate(
            offset: const Offset(0, -16),
            child: Center(
              child: _CategoryChip(label: product.categoryName),
            ),
          ),

          // ── Content ─────────────────────────────────────────────────────────
          Padding(
            padding: const EdgeInsets.fromLTRB(24, 0, 24, 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Name
                Text(
                  product.productName,
                  style: const TextStyle(
                    fontFamily: 'Georgia',
                    fontSize: 26,
                    fontWeight: FontWeight.w400,
                    color: _Palette.ink,
                    height: 1.25,
                    letterSpacing: 0.3,
                  ),
                ),

                const SizedBox(height: 6),

                // Brand (if available)
                if (product.brand != null && product.brand!.isNotEmpty)
                  Text(
                    product.brand!.toUpperCase(),
                    style: const TextStyle(
                      fontSize: 11,
                      letterSpacing: 3,
                      color: _Palette.gold,
                      fontWeight: FontWeight.w500,
                    ),
                  ),

                const SizedBox(height: 20),

                // Decorative divider
                Row(
                  children: [
                    Container(width: 32, height: 1, color: _Palette.gold),
                    const SizedBox(width: 8),
                    Container(width: 6, height: 6,
                      decoration: const BoxDecoration(
                        color: _Palette.gold,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(child: Container(height: 0.5, color: _Palette.divider)),
                  ],
                ),

                const SizedBox(height: 20),

                // Attribute pills row
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    if (product.color != null && product.color!.isNotEmpty)
                      _AttributePill(icon: Icons.circle_outlined, label: product.color!),
                    if (product.size != null && product.size!.isNotEmpty)
                      _AttributePill(icon: Icons.straighten_rounded, label: product.size!),
                    _AttributePill(
                      icon: Icons.wc_rounded,
                      label: product.gender,
                    ),
                  ],
                ),

                const SizedBox(height: 24),

                // Description
                if (product.productDescription != null &&
                    product.productDescription!.trim().isNotEmpty) ...[
                  const Text(
                    'ABOUT',
                    style: TextStyle(
                      fontSize: 10,
                      letterSpacing: 3.5,
                      color: _Palette.inkFaint,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    product.productDescription!,
                    style: const TextStyle(
                      fontFamily: 'Georgia',
                      fontSize: 14.5,
                      color: _Palette.inkMuted,
                      height: 1.75,
                      letterSpacing: 0.2,
                    ),
                  ),
                  const SizedBox(height: 24),
                ],

                // Details card
                _DetailsCard(product: product),

                const SizedBox(height: 100), // bottom padding for bar
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
              colors: [Color(0xFFF2EAE6), Color(0xFFFAF7F4)],
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
                    color: i == _current ? _Palette.gold : _Palette.goldLight,
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
        color: _Palette.surface,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: _Palette.roseDeep.withOpacity(0.10),
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
          color: _Palette.roseDeep,
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
        color: _Palette.surface,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: _Palette.divider, width: 1),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 13, color: _Palette.inkFaint),
          const SizedBox(width: 6),
          Text(
            label,
            style: const TextStyle(
              fontSize: 12.5,
              color: _Palette.inkMuted,
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
  const _DetailsCard({required this.product});
  final Product product;

  @override
  Widget build(BuildContext context) {
    final rows = <_DetailRow>[];

    rows.add(_DetailRow(label: 'Stock', value: '${product.stock} units'));
    if (product.sku != null && product.sku!.isNotEmpty)
      rows.add(_DetailRow(label: 'SKU', value: product.sku!));
    rows.add(_DetailRow(
      label: 'Status',
      value: product.status,
      valueColor: product.status.toUpperCase() == 'ACTIVE'
          ? const Color(0xFF6BAE75)
          : _Palette.roseDust,
    ));

    return Container(
      decoration: BoxDecoration(
        color: _Palette.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: _Palette.divider, width: 1),
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
                      color: _Palette.inkFaint,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  Text(
                    rows[i].value,
                    style: TextStyle(
                      fontSize: 13,
                      color: rows[i].valueColor ?? _Palette.ink,
                      fontWeight: FontWeight.w500,
                      letterSpacing: 0.2,
                    ),
                  ),
                ],
              ),
            ),
            if (i < rows.length - 1)
              Divider(height: 1, color: _Palette.divider),
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
  const _AddToBagBar({required this.product});
  final Product product;

  bool get _canAdd =>
      product.status.toUpperCase() == 'ACTIVE' && product.stock > 0;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: _Palette.surface,
        boxShadow: [
          BoxShadow(
            color: _Palette.ink.withOpacity(0.06),
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
            // Price column
            Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '\$${product.price.toStringAsFixed(2)}',
                  style: const TextStyle(
                    fontFamily: 'Georgia',
                    fontSize: 22,
                    fontWeight: FontWeight.w400,
                    color: _Palette.ink,
                    letterSpacing: 0.5,
                  ),
                ),
                if (!_canAdd)
                  Text(
                    product.stock <= 0 ? 'Out of stock' : 'Unavailable',
                    style: const TextStyle(
                      fontSize: 11,
                      color: _Palette.inkFaint,
                      letterSpacing: 0.5,
                    ),
                  )
                else
                  Text(
                    'In stock',
                    style: const TextStyle(
                      fontSize: 11,
                      color: Color(0xFF6BAE75),
                      letterSpacing: 0.5,
                    ),
                  ),
              ],
            ),

            const Spacer(),

            // Add to bag button
            GestureDetector(
              onTap: _canAdd
                  ? () async {
                      final added = await addProductToCart(product);
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
                            backgroundColor: _Palette.ink,
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
                  color: _canAdd ? _Palette.ink : _Palette.divider,
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      Icons.shopping_bag_outlined,
                      size: 18,
                      color: _canAdd ? _Palette.goldLight : _Palette.inkFaint,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'ADD TO BAG',
                      style: TextStyle(
                        fontSize: 12,
                        letterSpacing: 2,
                        fontWeight: FontWeight.w600,
                        color: _canAdd ? _Palette.goldLight : _Palette.inkFaint,
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
          border: Border.all(color: _Palette.ink, width: 1),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Text(
          label,
          style: const TextStyle(
            fontSize: 11,
            letterSpacing: 2.5,
            color: _Palette.ink,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }
}