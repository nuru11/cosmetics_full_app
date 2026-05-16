import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../core/theme/app_colors.dart';
import '../../core/widgets/product_image.dart';
import '../../core/widgets/save_product_button.dart';
import '../../data/models/product.dart';
import 'product_detail_controller.dart';

class ProductDetailView extends GetView<ProductDetailController> {
  const ProductDetailView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Product'),
        actions: [
          Obx(() {
            final product = controller.product.value;
            if (product == null) return const SizedBox.shrink();
            return SaveProductIconButton(
              productId: product.id,
              iconSize: 24,
              unsavedColor: AppColors.textMuted,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              constraints: const BoxConstraints(minWidth: 48, minHeight: 48),
            );
          }),
        ],
      ),
      body: Obx(() {
        if (controller.isLoading.value) {
          return const Center(child: CircularProgressIndicator());
        }

        if (controller.error.value != null) {
          return Center(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(controller.error.value!),
                  const SizedBox(height: 16),
                  FilledButton(
                    onPressed: controller.loadProduct,
                    child: const Text('Retry'),
                  ),
                ],
              ),
            ),
          );
        }

        final product = controller.product.value;
        if (product == null) {
          return const Center(child: Text('Product not found'));
        }

        return _ProductDetailBody(product: product);
      }),
    );
  }
}

class _ProductDetailBody extends StatelessWidget {
  const _ProductDetailBody({required this.product});

  final Product product;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final images = product.productImages;

    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          if (images.isEmpty)
            ProductImage(
              imageUrl: null,
              height: 280,
              width: double.infinity,
            )
          else if (images.length == 1)
            ProductImage(
              imageUrl: images.first,
              height: 280,
              width: double.infinity,
            )
          else
            SizedBox(
              height: 280,
              child: PageView.builder(
                itemCount: images.length,
                itemBuilder: (_, index) => ProductImage(
                  imageUrl: images[index],
                  height: 280,
                  width: double.infinity,
                ),
              ),
            ),
          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  product.productName,
                  style: theme.textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  product.categoryName,
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: theme.colorScheme.onSurfaceVariant,
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  '\$${product.price.toStringAsFixed(2)}',
                  style: theme.textTheme.headlineMedium?.copyWith(
                    color: theme.colorScheme.primary,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 16),
                _InfoRow(label: 'Stock', value: '${product.stock}'),
                _InfoRow(label: 'Gender', value: product.gender),
                if (product.brand != null && product.brand!.isNotEmpty)
                  _InfoRow(label: 'Brand', value: product.brand!),
                if (product.color != null && product.color!.isNotEmpty)
                  _InfoRow(label: 'Color', value: product.color!),
                if (product.size != null && product.size!.isNotEmpty)
                  _InfoRow(label: 'Size', value: product.size!),
                if (product.sku != null && product.sku!.isNotEmpty)
                  _InfoRow(label: 'SKU', value: product.sku!),
                if (product.productDescription != null &&
                    product.productDescription!.trim().isNotEmpty) ...[
                  const SizedBox(height: 16),
                  Text(
                    'Description',
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    product.productDescription!,
                    style: theme.textTheme.bodyLarge,
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  const _InfoRow({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        children: [
          SizedBox(
            width: 72,
            child: Text(
              label,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
            ),
          ),
          Expanded(
            child: Text(value, style: Theme.of(context).textTheme.bodyMedium),
          ),
        ],
      ),
    );
  }
}
