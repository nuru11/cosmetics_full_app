import 'dart:async';

import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../core/network/api_client.dart';
import '../../core/theme/app_colors.dart';
import '../../data/models/product.dart';
import '../../data/models/product_variant.dart';
import '../../data/repositories/order_repository.dart';
import '../../data/repositories/product_repository.dart';
import '../../data/services/checkout_contact_storage.dart';
import '../orders/orders_controller.dart';
import 'cart_service.dart';
import 'checkout_sheet.dart';

class CartEntry {
  const CartEntry({
    required this.product,
    required this.variant,
    required this.quantity,
  });

  final Product product;
  final ProductVariant variant;
  final int quantity;

  double get lineTotal => variant.price * quantity;

  String get variantLabel => variant.displayLabel;
}

class CartController extends GetxController {
  CartController(
    this._cart,
    this._repository,
    this._orderRepository,
  );

  final CartService _cart;
  final ProductRepository _repository;
  final OrderRepository _orderRepository;

  final entries = <CartEntry>[].obs;
  final isLoading = false.obs;
  final isCheckingOut = false.obs;
  final error = RxnString();

  List<Product> _catalog = [];
  CheckoutContactStorage? _contactStorage;

  int get totalItemCount => _cart.totalItemCount;

  double get subtotal =>
      entries.fold<double>(0, (sum, e) => sum + e.lineTotal);

  bool get isEmpty => _cart.lines.isEmpty;

  @override
  void onInit() {
    super.onInit();
    unawaited(_initContactStorage());
    ever(_cart.lines, (_) => _rebuild());
    unawaited(loadCatalog());
  }

  Future<void> _initContactStorage() async {
    _contactStorage = await CheckoutContactStorage.create();
  }

  Future<void> loadCatalog() async {
    if (_cart.lines.isEmpty) {
      entries.clear();
      return;
    }

    isLoading.value = true;
    error.value = null;
    try {
      _catalog = await _repository.getProducts();
      final variantIds = _catalog
          .expand((p) => p.variants)
          .map((v) => v.id)
          .toSet();
      await _cart.pruneInvalid(variantIds);
      _rebuild();
    } catch (e) {
      error.value = e.toString();
    } finally {
      isLoading.value = false;
    }
  }

  Map<String, ({Product product, ProductVariant variant})> _variantIndex() {
    final index = <String, ({Product product, ProductVariant variant})>{};
    for (final product in _catalog) {
      for (final variant in product.variants) {
        index[variant.id] = (product: product, variant: variant);
      }
    }
    return index;
  }

  void _rebuild() {
    if (_cart.lines.isEmpty) {
      entries.clear();
      return;
    }

    final byVariantId = _variantIndex();
    final built = <CartEntry>[];
    for (final line in _cart.lines) {
      final match = byVariantId[line.variantId];
      if (match != null) {
        built.add(
          CartEntry(
            product: match.product,
            variant: match.variant,
            quantity: line.quantity,
          ),
        );
      }
    }
    entries.assignAll(built);
  }

  Future<void> increment(CartEntry entry) async {
    final max = entry.variant.stock;
    if (entry.quantity >= max) {
      Get.snackbar(
        'Stock limit',
        'Only $max available.',
        snackPosition: SnackPosition.BOTTOM,
      );
      return;
    }
    await _cart.setQuantity(entry.variant.id, entry.quantity + 1);
  }

  Future<void> decrement(CartEntry entry) async {
    await _cart.setQuantity(entry.variant.id, entry.quantity - 1);
  }

  Future<void> removeEntry(CartEntry entry) async {
    await _cart.remove(entry.variant.id);
  }

  Future<void> clearCart() => _cart.clear();

  Future<void> openCheckout() async {
    if (entries.isEmpty) return;

    final storage = _contactStorage ?? await CheckoutContactStorage.create();
    _contactStorage = storage;
    final initial = storage.load();

    await Get.bottomSheet<void>(
      Obx(
        () => CheckoutSheet(
          initialContact: initial,
          isSubmitting: isCheckingOut.value,
          onSubmit: (contact) => _placeOrder(contact, storage),
        ),
      ),
      isScrollControlled: true,
      backgroundColor: AppColors.cardWhite,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
    );
  }

  Future<void> _placeOrder(
    CheckoutContact contact,
    CheckoutContactStorage storage,
  ) async {
    isCheckingOut.value = true;
    try {
      final items = entries
          .map((e) => (variantId: e.variant.id, quantity: e.quantity))
          .toList();

      await _orderRepository.placeOrder(
        items: items,
        customerName: contact.name,
        phone: contact.phone,
        city: contact.city,
      );

      await storage.save(contact);
      await _cart.clear();
      await OrdersController.refreshIfRegistered();

      if (Get.isBottomSheetOpen ?? false) {
        Get.back();
      }

      Get.snackbar(
        'Order placed',
        'Thank you! We will contact you soon.',
        snackPosition: SnackPosition.BOTTOM,
        duration: const Duration(seconds: 4),
      );
    } on ApiException catch (e) {
      Get.snackbar(
        'Checkout failed',
        e.message,
        snackPosition: SnackPosition.BOTTOM,
      );
    } catch (_) {
      Get.snackbar(
        'Checkout failed',
        'Could not place your order. Try again.',
        snackPosition: SnackPosition.BOTTOM,
      );
    } finally {
      isCheckingOut.value = false;
    }
  }
}
