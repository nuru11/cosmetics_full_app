import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../core/theme/app_colors.dart';
import '../../data/models/product.dart';
import 'models/product_comparison.dart';
import 'products_controller.dart';
import 'widgets/category_nav_bar.dart';
import 'widgets/category_section_header.dart';
import 'widgets/product_comparison_card.dart';
import 'widgets/product_grid_card.dart';
import 'widgets/alemmart_home_header.dart';

class ProductsView extends GetView<ProductsController> {
  const ProductsView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.brandWhite,
      body: Obx(() {
        if (controller.isLoading.value && controller.products.isEmpty) {
          return const Center(
            child: CircularProgressIndicator(color: AppColors.brandBlue),
          );
        }

        if (controller.error.value != null && controller.products.isEmpty) {
          return Column(
            children: [
              AlemmartHomeHeader(productCount: 0),
              Expanded(
                child: _ErrorState(
                  message: controller.error.value!,
                  onRetry: controller.loadAll,
                ),
              ),
            ],
          );
        }

        return RefreshIndicator(
          color: AppColors.brandBlue,
          onRefresh: controller.refresh,
          child: CustomScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            slivers: [
              SliverToBoxAdapter(
                child: Obx(
                  () => AlemmartHomeHeader(
                    productCount: controller.productCount.value,
                  ),
                ),
              ),
              const SliverToBoxAdapter(child: CategoryNavBar()),
              Obx(() {
                final sections = controller.sections;
                if (sections.isEmpty) {
                  return SliverFillRemaining(
                    hasScrollBody: false,
                    child: Center(
                      child: Text(
                        'No products yet',
                        style: GoogleFonts.montserrat(
                          color: AppColors.textMuted,
                        ),
                      ),
                    ),
                  );
                }

                return SliverList(
                  delegate: SliverChildBuilderDelegate(
                    (context, index) => _buildSectionItem(sections, index),
                    childCount: _sectionItemCount(sections),
                  ),
                );
              }),
              const SliverPadding(padding: EdgeInsets.only(bottom: 24)),
            ],
          ),
        );
      }),
    );
  }

  int _sectionItemCount(List<CategoryProductSection> sections) {
    var count = 0;
    for (final section in sections) {
      count += 1; // header
      count += section.comparisons.length;
      count += section.singleProductRows.length;
    }
    return count;
  }

  Widget? _buildSectionItem(List<CategoryProductSection> sections, int index) {
    var i = index;
    for (final section in sections) {
      if (i == 0) {
        return CategorySectionHeader(
          categoryName: section.categoryName,
          categorySlug: section.categorySlug,
        );
      }
      i--;

      for (final comparison in section.comparisons) {
        if (i == 0) {
          return ProductComparisonCard(
            comparison: comparison,
            onProductTap: (id) => Get.toNamed('/product/$id'),
          );
        }
        i--;
      }

      for (final row in section.singleProductRows) {
        if (i == 0) {
          return _ProductGridRow(products: row);
        }
        i--;
      }
    }
    return null;
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

class _ErrorState extends StatelessWidget {
  const _ErrorState({required this.message, required this.onRetry});

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
