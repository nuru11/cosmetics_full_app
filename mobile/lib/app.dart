import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'core/theme/app_theme.dart';
import 'modules/product_detail/product_detail_binding.dart';
import 'modules/product_detail/product_detail_view.dart';
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
      ],
    );
  }
}
