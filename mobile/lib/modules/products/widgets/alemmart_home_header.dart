import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/theme/app_colors.dart';
import '../../cart/cart_service.dart';
import 'ask_product_cta.dart';

class AlemmartHomeHeader extends StatelessWidget {
  const AlemmartHomeHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppColors.headerGradientStart,
            AppColors.headerGradientEnd,
          ],
        ),
      ),
      child: SafeArea(
        bottom: false,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: Image.asset(
                      'assets/app_logo/logo.png',
                      width: 36,
                      height: 36,
                      fit: BoxFit.cover,
                    ),
                  ),
                  Expanded(
                    child: Text(
                      'app.title'.tr,
                      textAlign: TextAlign.center,
                      style: GoogleFonts.montserrat(
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                        color: AppColors.brandWhite,
                      ),
                    ),
                  ),
                  IconButton(
                    onPressed: () => Get.toNamed('/search'),
                    icon: const Icon(
                      Icons.search,
                      color: AppColors.brandWhite,
                      size: 22,
                    ),
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(
                      minWidth: 36,
                      minHeight: 36,
                    ),
                  ),
                  const SizedBox(width: 4),
                  Obx(() {
                    final count =
                        Get.find<CartService>().totalItemCountForHomeCartIcon;
                    return _CartHeaderButton(itemCount: count);
                  }),
                ],
              ),
              const SizedBox(height: 12),
              const AskProductCta(),
              const SizedBox(height: 10),
            ],
          ),
        ),
      ),
    );
  }
}

class _CartHeaderButton extends StatelessWidget {
  const _CartHeaderButton({required this.itemCount});

  final int itemCount;

  @override
  Widget build(BuildContext context) {
    return Material(
      elevation: 3,
      shadowColor: Colors.black.withValues(alpha: 0.15),
      color: AppColors.brandWhite,
      shape: const CircleBorder(),
      child: InkWell(
        onTap: () => Get.toNamed('/cart'),
        customBorder: const CircleBorder(),
        child: SizedBox(
          width: 40,
          height: 40,
          child: Stack(
            clipBehavior: Clip.none,
            alignment: Alignment.center,
            children: [
              const Icon(
                Icons.shopping_bag_outlined,
                color: AppColors.brandBlue,
                size: 22,
              ),
              if (itemCount > 0)
                Positioned(
                  right: -2,
                  top: -2,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 5,
                      vertical: 2,
                    ),
                    constraints: const BoxConstraints(
                      minWidth: 18,
                      minHeight: 18,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.cartBadgeBg,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(
                        color: AppColors.brandWhite,
                        width: 1.5,
                      ),
                    ),
                    child: Text(
                      itemCount > 99 ? '99+' : '$itemCount',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.montserrat(
                        fontSize: 9,
                        fontWeight: FontWeight.w700,
                        color: AppColors.brandWhite,
                        height: 1,
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
