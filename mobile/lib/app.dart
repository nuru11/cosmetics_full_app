import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'core/theme/app_theme.dart';
import 'modules/cart/cart_binding.dart';
import 'modules/cart/cart_view.dart';
import 'modules/product_detail/product_detail_binding.dart';
import 'modules/product_detail/product_detail_view.dart';
import 'modules/profile/address/address_binding.dart';
import 'modules/profile/address/address_view.dart';
import 'modules/profile/orders/filtered_orders_view.dart';
import 'modules/profile/orders/profile_orders_binding.dart';
import 'modules/shell/main_shell.dart';

class CosmeticsApp extends StatelessWidget {
  const CosmeticsApp({super.key});

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      title: 'Sahel',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      initialRoute: '/',
      getPages: [
        GetPage(
          name: '/',
          page: () => const MainShell(),
          binding: MainShellBinding(),
        ),
        GetPage(
          name: '/product/:id',
          page: () => const ProductDetailView(),
          binding: ProductDetailBinding(),
        ),
        GetPage(
          name: '/cart',
          page: () => const CartView(),
          binding: CartBinding(),
        ),
        GetPage(
          name: '/profile/my-orders',
          page: () => const MyOrdersView(),
          binding: MyOrdersBinding(),
        ),
        GetPage(
          name: '/profile/order-history',
          page: () => const OrderHistoryView(),
          binding: OrderHistoryBinding(),
        ),
        GetPage(
          name: '/profile/address',
          page: () => const AddressView(),
          binding: AddressBinding(),
        ),
      ],
    );
  }
}
