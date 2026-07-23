import 'package:get/get.dart';

import '../../core/network/api_client.dart';
import '../../data/models/product.dart';
import '../../data/models/product_variant.dart';
import '../../data/repositories/product_repository.dart';

class ProductDetailController extends GetxController {
  ProductDetailController(
    this._repository,
    this.productId, {
    this.initialVariantId,
  });

  final ProductRepository _repository;
  final String productId;
  final String? initialVariantId;

  final product = Rxn<Product>();
  final selectedVariant = Rxn<ProductVariant>();
  final isLoading = true.obs;
  final error = RxnString();

  @override
  void onInit() {
    super.onInit();
    loadProduct();
  }

  void selectVariant(ProductVariant variant) {
    selectedVariant.value = variant;
  }

  Future<void> loadProduct() async {
    if (productId.isEmpty) {
      error.value = 'error.invalid_product';
      isLoading.value = false;
      return;
    }

    isLoading.value = true;
    error.value = null;
    try {
      final loaded = await _repository.getProductById(productId);
      product.value = loaded;
      selectedVariant.value = _resolveInitialVariant(loaded);
    } on ApiException catch (e) {
      error.value = e.message;
    } catch (_) {
      error.value = 'error.load_product';
    } finally {
      isLoading.value = false;
    }
  }

  ProductVariant? _resolveInitialVariant(Product loaded) {
    final preferredId = initialVariantId?.trim();
    if (preferredId != null && preferredId.isNotEmpty) {
      for (final variant in loaded.variants) {
        if (variant.id == preferredId) return variant;
      }
    }
    return loaded.firstInStockVariant ?? loaded.defaultVariant;
  }
}
