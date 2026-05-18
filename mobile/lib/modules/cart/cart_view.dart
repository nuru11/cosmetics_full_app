import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../core/theme/app_colors.dart';
import '../../core/widgets/product_image.dart';
import 'cart_controller.dart';

class CartView extends GetView<CartController> {
  const CartView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.cream,
      appBar: AppBar(
        title: Text(
          'Your bag',
          style: GoogleFonts.playfairDisplay(fontWeight: FontWeight.w600, color: AppColors.gold),
        ),
        backgroundColor: AppColors.headerBrown,
        foregroundColor: AppColors.gold,
      ),
      body: Obx(() {
        if (controller.isEmpty && !controller.isLoading.value) {
          return const _EmptyCartState();
        }

        if (controller.isLoading.value && controller.entries.isEmpty) {
          return const Center(
            child: CircularProgressIndicator(color: AppColors.gold),
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
            child: CircularProgressIndicator(color: AppColors.gold),
          );
        }

        if (entries.isEmpty) {
          return const _EmptyCartState();
        }

        return Column(
          children: [
            Expanded(
              child: RefreshIndicator(
                color: AppColors.gold,
                onRefresh: controller.loadCatalog,
                child: ListView.separated(
                  physics: const AlwaysScrollableScrollPhysics(),
                  padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                  itemCount: entries.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 12),
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
              backgroundColor: AppColors.headerBrown,
              foregroundColor: AppColors.gold,
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
    return Material(
      color: AppColors.cardWhite,
      borderRadius: BorderRadius.circular(12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: ProductImage(
                  imageUrl: product.primaryImage,
                  width: 72,
                  height: 72,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      product.productName,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: GoogleFonts.playfairDisplay(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textDark,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '\$${product.price.toStringAsFixed(2)}',
                      style: GoogleFonts.montserrat(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: AppColors.headerBrown,
                      ),
                    ),
                    if (entry.quantity > product.stock)
                      Padding(
                        padding: const EdgeInsets.only(top: 4),
                        child: Text(
                          'Only ${product.stock} in stock',
                          style: GoogleFonts.montserrat(
                            fontSize: 11,
                            color: Colors.red.shade700,
                          ),
                        ),
                      ),
                    const SizedBox(height: 8),
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
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                        _QtyButton(
                          icon: Icons.add,
                          onPressed: onIncrement,
                          enabled: entry.quantity < product.stock,
                        ),
                        const Spacer(),
                        IconButton(
                          icon: const Icon(Icons.delete_outline, size: 20),
                          color: AppColors.textMuted,
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
      color: AppColors.cream,
      borderRadius: BorderRadius.circular(8),
      child: InkWell(
        onTap: enabled ? onPressed : null,
        borderRadius: BorderRadius.circular(8),
        child: SizedBox(
          width: 32,
          height: 32,
          child: Icon(
            icon,
            size: 18,
            color: enabled ? AppColors.textDark : AppColors.textMuted,
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
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
      decoration: BoxDecoration(
        color: AppColors.cardWhite,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.06),
            blurRadius: 8,
            offset: const Offset(0, -2),
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
                Text(
                  '$itemCount item${itemCount == 1 ? '' : 's'}',
                  style: GoogleFonts.montserrat(
                    fontSize: 13,
                    color: AppColors.textMuted,
                  ),
                ),
                Text(
                  'Subtotal',
                  style: GoogleFonts.montserrat(
                    fontSize: 13,
                    color: AppColors.textMuted,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 4),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const SizedBox.shrink(),
                Text(
                  '\$${subtotal.toStringAsFixed(2)}',
                  style: GoogleFonts.playfairDisplay(
                    fontSize: 24,
                    fontWeight: FontWeight.w700,
                    color: AppColors.headerBrown,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            FilledButton(
              onPressed: onCheckout,
              style: FilledButton.styleFrom(
                backgroundColor: AppColors.headerBrown,
                foregroundColor: AppColors.gold,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              child: Text(
                'Checkout',
                style: GoogleFonts.montserrat(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.5,
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
            const Icon(
              Icons.shopping_bag_outlined,
              size: 56,
              color: AppColors.textMuted,
            ),
            const SizedBox(height: 20),
            Text(
              'Your bag is empty',
              style: GoogleFonts.playfairDisplay(
                fontSize: 22,
                fontWeight: FontWeight.w600,
                color: AppColors.headerBrown,
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
            const SizedBox(height: 24),
            FilledButton(
              onPressed: () => Get.back(),
              style: FilledButton.styleFrom(
                backgroundColor: AppColors.headerBrown,
                foregroundColor: AppColors.gold,
              ),
              child: const Text('Continue shopping'),
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
                backgroundColor: AppColors.headerBrown,
                foregroundColor: AppColors.gold,
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
