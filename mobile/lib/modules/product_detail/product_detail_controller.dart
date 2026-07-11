import 'package:get/get.dart';

import '../../core/network/api_client.dart';
import '../../data/models/product.dart';
import '../../data/models/product_variant.dart';
import '../../data/repositories/product_repository.dart';

class ProductDetailController extends GetxController {
  ProductDetailController(this._repository, this.productId);

  final ProductRepository _repository;
  final String productId;

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
      error.value = 'Invalid product';
      isLoading.value = false;
      return;
    }

    isLoading.value = true;
    error.value = null;
    try {
      final loaded = await _repository.getProductById(productId);
      product.value = loaded;
      selectedVariant.value = loaded.firstInStockVariant ?? loaded.defaultVariant;
    } on ApiException catch (e) {
      error.value = e.message;
    } catch (_) {
      error.value = 'Could not load product.';
    } finally {
      isLoading.value = false;
    }
  }
}
