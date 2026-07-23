import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'core/l10n/app_translations.dart';
import 'core/l10n/locale_service.dart';
import 'core/theme/app_theme.dart';
import 'modules/cart/cart_binding.dart';
import 'modules/cart/cart_view.dart';
import 'modules/product_detail/product_detail_binding.dart';
import 'modules/product_detail/product_detail_view.dart';
import 'modules/product_request/ask_product_view.dart';
import 'modules/product_request/product_request_binding.dart';
import 'modules/products/search_view.dart';
import 'modules/profile/address/address_binding.dart';
import 'modules/profile/address/address_view.dart';
import 'modules/shell/main_shell.dart';

class CosmeticsApp extends StatelessWidget {
  const CosmeticsApp({super.key});

  @override
  Widget build(BuildContext context) {
    final localeService = Get.find<LocaleService>();

    return Obx(
      () => GetMaterialApp(
        title: 'app.title'.tr,
        debugShowCheckedModeBanner: false,
        translations: AppTranslations(),
        locale: localeService.locale.value,
        fallbackLocale: const Locale('en', 'US'),
        theme: AppTheme.lightFor(localeService.locale.value),
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
            name: '/search',
            page: () => const SearchView(),
          ),
          GetPage(
            name: '/product-request',
            page: () => const AskProductView(),
            binding: ProductRequestBinding(),
          ),
          GetPage(
            name: '/profile/address',
            page: () => const AddressView(),
            binding: AddressBinding(),
          ),
        ],
      ),
    );
  }
}
