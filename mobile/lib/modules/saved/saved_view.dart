import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../core/theme/app_colors.dart';
import '../../data/models/product.dart';
import '../products/widgets/product_grid_card.dart';
import 'saved_controller.dart';
import 'wishlist_service.dart';

class SavedView extends GetView<SavedController> {
  const SavedView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
       appBar: AppBar(
        title: Text(
          'Saved',
          style: GoogleFonts.playfairDisplay(
            fontWeight: FontWeight.w600,
            color: AppColors.gold,
          ),
        ),
        backgroundColor: AppColors.headerBrown,
        foregroundColor: AppColors.gold,
      ),
      backgroundColor: AppColors.cream,
      body: SafeArea(
        child: Obx(() {
          final wishlist = Get.find<WishlistService>();
          final hasSaved = wishlist.savedIds.isNotEmpty;

          if (controller.isCatalogLoading && hasSaved) {
            return const Center(
              child: CircularProgressIndicator(color: AppColors.gold),
            );
          }

          if (controller.catalogError != null &&
              controller.rows.isEmpty &&
              hasSaved) {
            return _CatalogErrorState(
              message: controller.catalogError!,
              onRetry: controller.refresh,
            );
          }

          if (!hasSaved || controller.rows.isEmpty) {
            return const _EmptySavedState();
          }

          final rows = controller.rows;
          return RefreshIndicator(
            color: AppColors.gold,
            onRefresh: controller.refresh,
            child: CustomScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              slivers: [
                // SliverToBoxAdapter(
                //   child: Padding(
                //     padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
                //     child: Text(
                //       'Saved',
                //       style: GoogleFonts.playfairDisplay(
                //         fontSize: 28,
                //         fontWeight: FontWeight.w600,
                //         color: AppColors.headerBrown,
                //       ),
                //     ),
                //   ),
                // ),
                SliverList(
                  delegate: SliverChildBuilderDelegate(
                    (context, index) => _ProductGridRow(products: rows[index]),
                    childCount: rows.length,
                  ),
                ),
                const SliverPadding(padding: EdgeInsets.only(bottom: 24)),
              ],
            ),
          );
        }),
      ),
    );
  }
}

class _ProductGridRow extends StatelessWidget {
  const _ProductGridRow({required this.products});

  final List<Product> products;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 6, 16, 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: ProductGridCard(
              product: products.first,
              onTap: () => Get.toNamed('/product/${products.first.id}'),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: products.length > 1
                ? ProductGridCard(
                    product: products[1],
                    onTap: () => Get.toNamed('/product/${products[1].id}'),
                  )
                : const SizedBox.shrink(),
          ),
        ],
      ),
    );
  }
}

class _EmptySavedState extends StatelessWidget {
  const _EmptySavedState();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.favorite_border,
              size: 56,
              color: AppColors.textMuted,
            ),
            const SizedBox(height: 20),
            Text(
              'No saved items yet',
              style: GoogleFonts.playfairDisplay(
                fontSize: 22,
                fontWeight: FontWeight.w600,
                color: AppColors.headerBrown,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              'Tap the heart on any product on Home to save it here.',
              textAlign: TextAlign.center,
              style: GoogleFonts.montserrat(
                fontSize: 14,
                color: AppColors.textMuted,
              ),
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
