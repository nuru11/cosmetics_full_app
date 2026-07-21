import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../core/theme/app_colors.dart';
import '../products/widgets/product_grid_card.dart';
import 'saved_controller.dart';
import 'saved_entry.dart';
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
            color: AppColors.brandWhite,
          ),
        ),
        backgroundColor: AppColors.brandBlue,
        foregroundColor: AppColors.brandWhite,
      ),
      backgroundColor: AppColors.brandWhite,
      body: SafeArea(
        child: Obx(() {
          final wishlist = Get.find<WishlistService>();
          final hasSaved = wishlist.savedVariantIds.isNotEmpty;

          if (controller.isCatalogLoading && hasSaved) {
            return const Center(
              child: CircularProgressIndicator(color: AppColors.brandBlue),
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
            color: AppColors.brandBlue,
            onRefresh: controller.refresh,
            child: CustomScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              slivers: [
                SliverList(
                  delegate: SliverChildBuilderDelegate(
                    (context, index) => _SavedGridRow(entries: rows[index]),
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

class _SavedGridRow extends StatelessWidget {
  const _SavedGridRow({required this.entries});

  final List<SavedEntry> entries;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 6, 16, 6),
      child: IntrinsicHeight(
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
          Expanded(
            child: ProductGridCard(
              product: entries.first.product,
              highlightVariant: entries.first.variant,
              onTap: () => Get.toNamed('/product/${entries.first.product.id}'),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: entries.length > 1
                ? ProductGridCard(
                    product: entries[1].product,
                    highlightVariant: entries[1].variant,
                    onTap: () => Get.toNamed('/product/${entries[1].product.id}'),
                  )
                : const SizedBox.shrink(),
          ),
        ],
        ),
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
                color: AppColors.brandBlack,
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
