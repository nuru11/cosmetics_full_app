import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../core/theme/app_colors.dart';
import '../../core/widgets/product_image.dart';
import '../../core/widgets/product_version_badge.dart';
import '../../data/models/product_variant.dart';
import '../products/models/product_comparison.dart';
import 'cart_controller.dart';

class CartView extends GetView<CartController> {
  const CartView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.homeBackground,
      appBar: AppBar(
        title: Obx(() {
          final count = controller.totalItemCount;
          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Your bag',
                style: GoogleFonts.montserrat(
                  fontWeight: FontWeight.w700,
                  fontSize: 10,
                  color: AppColors.brandWhite,
                ),
              ),
              if (count > 0)
                Text(
                  '$count item${count == 1 ? '' : 's'}',
                  style: GoogleFonts.montserrat(
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                    color: AppColors.brandWhite.withValues(alpha: 0.85),
                  ),
                ),
            ],
          );
        }),
        toolbarHeight: 64,
        backgroundColor: AppColors.brandBlue,
        foregroundColor: AppColors.brandWhite,
        elevation: 0,
      ),
      body: Obx(() {
        if (controller.isEmpty && !controller.isLoading.value) {
          return const _EmptyCartState();
        }

        if (controller.isLoading.value && controller.entries.isEmpty) {
          return const Center(
            child: CircularProgressIndicator(color: AppColors.brandBlue),
          );
        }

        if (controller.error.value != null && controller.entries.isEmpty) {
          return _CatalogErrorState(
            message: controller.error.value!,
            onRetry: controller.loadCatalog,
          );
        }

        final entries = controller.entries;
        if (entries.isEmpty && controller.isLoading.value) {
          return const Center(
            child: CircularProgressIndicator(color: AppColors.brandBlue),
          );
        }

        if (entries.isEmpty) {
          return const _EmptyCartState();
        }

        return Column(
          children: [
            Expanded(
              child: RefreshIndicator(
                color: AppColors.brandBlue,
                onRefresh: controller.loadCatalog,
                child: ListView.separated(
                  physics: const AlwaysScrollableScrollPhysics(),
                  padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                  itemCount: entries.length,
                  separatorBuilder: (context, index) =>
                      const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    return _CartLineCard(
                      entry: entries[index],
                      onIncrement: () => controller.increment(entries[index]),
                      onDecrement: () => controller.decrement(entries[index]),
                      onRemove: () => controller.removeEntry(entries[index]),
                      onTap: () =>
                          Get.toNamed('/product/${entries[index].product.id}'),
                    );
                  },
                ),
              ),
            ),
            _CartFooter(
              itemCount: controller.totalItemCount,
              subtotal: controller.subtotal,
              onCheckout: controller.openCheckout,
              onClear: () => _confirmClear(context),
            ),
          ],
        );
      }),
    );
  }

  Future<void> _confirmClear(BuildContext context) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Clear bag?'),
        content: const Text('Remove all items from your bag?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(ctx, true),
            style: FilledButton.styleFrom(
              backgroundColor: AppColors.brandBlue,
              foregroundColor: AppColors.brandWhite,
            ),
            child: const Text('Clear'),
          ),
        ],
      ),
    );
    if (confirmed == true) await controller.clearCart();
  }
}

class _CartLineCard extends StatelessWidget {
  const _CartLineCard({
    required this.entry,
    required this.onIncrement,
    required this.onDecrement,
    required this.onRemove,
    required this.onTap,
  });

  final CartEntry entry;
  final VoidCallback onIncrement;
  final VoidCallback onDecrement;
  final VoidCallback onRemove;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final product = entry.product;
    final variant = entry.variant;
    final lineTotal = variant.price * entry.quantity;
    final variantSubtitle = _variantSubtitle(variant);

    return Material(
      color: AppColors.cardWhite,
      elevation: 2,
      shadowColor: Colors.black.withValues(alpha: 0.08),
      borderRadius: BorderRadius.circular(12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color: AppColors.brandBlueLight.withValues(alpha: 0.6),
                  ),
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(7),
                  child: ProductImage(
                    imageUrl: variant.primaryImage ?? product.primaryImage,
                    width: 80,
                    height: 80,
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: Text(
                            product.productName,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                            style: GoogleFonts.montserrat(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: AppColors.textDark,
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          '\$${lineTotal.toStringAsFixed(2)}',
                          style: GoogleFonts.montserrat(
                            fontSize: 15,
                            fontWeight: FontWeight.w700,
                            color: AppColors.brandBlue,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        ProductVersionBadge(
                          versionKey: variant.productVersion,
                        ),
                        if (variantSubtitle != null) ...[
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              variantSubtitle,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: GoogleFonts.montserrat(
                                fontSize: 11,
                                color: AppColors.textMuted,
                              ),
                            ),
                          ),
                        ],
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(
                      '\$${variant.price.toStringAsFixed(2)} each',
                      style: GoogleFonts.montserrat(
                        fontSize: 12,
                        color: AppColors.textMuted,
                      ),
                    ),
                    if (entry.quantity > variant.stock)
                      Padding(
                        padding: const EdgeInsets.only(top: 4),
                        child: Text(
                          'Only ${variant.stock} in stock',
                          style: GoogleFonts.montserrat(
                            fontSize: 11,
                            fontWeight: FontWeight.w500,
                            color: AppColors.accentRed,
                          ),
                        ),
                      ),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        _QtyButton(
                          icon: Icons.remove,
                          onPressed: onDecrement,
                        ),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 12),
                          child: Text(
                            '${entry.quantity}',
                            style: GoogleFonts.montserrat(
                              fontSize: 14,
                              fontWeight: FontWeight.w700,
                              color: AppColors.textDark,
                            ),
                          ),
                        ),
                        _QtyButton(
                          icon: Icons.add,
                          onPressed: onIncrement,
                          enabled: entry.quantity < variant.stock,
                        ),
                        const Spacer(),
                        IconButton(
                          icon: const Icon(Icons.delete_outline, size: 20),
                          color: AppColors.accentRed,
                          style: IconButton.styleFrom(
                            side: BorderSide(
                              color: AppColors.accentRed.withValues(alpha: 0.4),
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                          onPressed: onRemove,
                          tooltip: 'Remove',
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  static String? _variantSubtitle(ProductVariant variant) {
    final description = variant.variantDescription?.trim();
    if (description != null && description.isNotEmpty) return description;

    final size = variant.size?.trim();
    if (size != null && size.isNotEmpty) return size;

    final defaultSubtitle =
        ProductVersionSlot.defaultSubtitleFor(variant.productVersion);
    return defaultSubtitle.isNotEmpty ? defaultSubtitle : null;
  }
}

class _QtyButton extends StatelessWidget {
  const _QtyButton({
    required this.icon,
    required this.onPressed,
    this.enabled = true,
  });

  final IconData icon;
  final VoidCallback onPressed;
  final bool enabled;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: AppColors.brandWhite,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
        side: BorderSide(
          color: enabled
              ? AppColors.brandBlue.withValues(alpha: 0.5)
              : AppColors.dividerGrey,
        ),
      ),
      child: InkWell(
        onTap: enabled ? onPressed : null,
        borderRadius: BorderRadius.circular(8),
        child: SizedBox(
          width: 32,
          height: 32,
          child: Icon(
            icon,
            size: 18,
            color: enabled ? AppColors.brandBlue : AppColors.textMuted,
          ),
        ),
      ),
    );
  }
}

class _CartFooter extends StatelessWidget {
  const _CartFooter({
    required this.itemCount,
    required this.subtotal,
    required this.onCheckout,
    required this.onClear,
  });

  final int itemCount;
  final double subtotal;
  final VoidCallback onCheckout;
  final VoidCallback onClear;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 24),
      decoration: BoxDecoration(
        color: AppColors.cardWhite,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.08),
            blurRadius: 12,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Subtotal',
                      style: GoogleFonts.montserrat(
                        fontSize: 13,
                        color: AppColors.textMuted,
                      ),
                    ),
                    Text(
                      '$itemCount item${itemCount == 1 ? '' : 's'}',
                      style: GoogleFonts.montserrat(
                        fontSize: 11,
                        color: AppColors.textMuted,
                      ),
                    ),
                  ],
                ),
                Text(
                  '\$${subtotal.toStringAsFixed(2)}',
                  style: GoogleFonts.montserrat(
                    fontSize: 24,
                    fontWeight: FontWeight.w700,
                    color: AppColors.brandBlue,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            FilledButton.icon(
              onPressed: onCheckout,
              style: FilledButton.styleFrom(
                backgroundColor: AppColors.brandBlue,
                foregroundColor: AppColors.brandWhite,
                padding: const EdgeInsets.symmetric(vertical: 14),
                minimumSize: const Size.fromHeight(48),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                elevation: 2,
              ),
              icon: const Icon(Icons.shopping_bag_outlined, size: 20),
              label: Text(
                'Proceed to Checkout',
                style: GoogleFonts.montserrat(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.3,
                ),
              ),
            ),
            const SizedBox(height: 8),
            TextButton(
              onPressed: onClear,
              child: Text(
                'Clear bag',
                style: GoogleFonts.montserrat(
                  fontSize: 13,
                  color: AppColors.textMuted,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _EmptyCartState extends StatelessWidget {
  const _EmptyCartState();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 88,
              height: 88,
              decoration: BoxDecoration(
                color: AppColors.brandBlueLight.withValues(alpha: 0.4),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.shopping_bag_outlined,
                size: 40,
                color: AppColors.brandBlue,
              ),
            ),
            const SizedBox(height: 24),
            Text(
              'Your bag is empty',
              style: GoogleFonts.montserrat(
                fontSize: 22,
                fontWeight: FontWeight.w700,
                color: AppColors.textDark,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              'Add products from Home to see them here.',
              textAlign: TextAlign.center,
              style: GoogleFonts.montserrat(
                fontSize: 14,
                color: AppColors.textMuted,
              ),
            ),
            const SizedBox(height: 28),
            FilledButton.icon(
              onPressed: () => Get.back(),
              style: FilledButton.styleFrom(
                backgroundColor: AppColors.brandBlue,
                foregroundColor: AppColors.brandWhite,
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 12,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              icon: const Icon(Icons.arrow_back, size: 18),
              label: const Text('Continue shopping'),
            ),
          ],
        ),
      ),
    );
  }
}

class _CatalogErrorState extends StatelessWidget {
  const _CatalogErrorState({
    required this.message,
    required this.onRetry,
  });

  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.cloud_off_outlined,
              size: 48,
              color: AppColors.textMuted,
            ),
            const SizedBox(height: 16),
            Text(
              message,
              textAlign: TextAlign.center,
              style: GoogleFonts.montserrat(
                fontSize: 14,
                color: AppColors.textDark,
              ),
            ),
            const SizedBox(height: 16),
            FilledButton.icon(
              onPressed: onRetry,
              style: FilledButton.styleFrom(
                backgroundColor: AppColors.brandBlue,
                foregroundColor: AppColors.brandWhite,
              ),
              icon: const Icon(Icons.refresh),
              label: const Text('Retry'),
            ),
          ],
        ),
      ),
    );
  }
}
