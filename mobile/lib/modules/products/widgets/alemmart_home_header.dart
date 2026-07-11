import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/theme/app_colors.dart';
import '../../cart/cart_service.dart';

class AlemmartHomeHeader extends StatelessWidget {
  const AlemmartHomeHeader({
    super.key,
    required this.productCount,
  });

  final int productCount;

  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppColors.brandBlue,
      child: SafeArea(
        bottom: false,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
          child: Column(
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: Image.asset(
                            'assets/app_logo/logo.png',
                            width: 44,
                            height: 44,
                            fit: BoxFit.cover,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Alemmart',
                                style: GoogleFonts.montserrat(
                                  fontSize: 24,
                                  fontWeight: FontWeight.w700,
                                  color: AppColors.brandWhite,
                                  height: 1.1,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                'BEAUTY & LUXURY',
                                style: GoogleFonts.montserrat(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w500,
                                  letterSpacing: 2.5,
                                  color: AppColors.brandWhite.withValues(
                                    alpha: 0.85,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  Obx(() {
                    final count =
                        Get.find<CartService>().totalItemCountForHomeCartIcon;
                    return _CartHeaderButton(itemCount: count);
                  }),
                ],
              ),
              const SizedBox(height: 20),
              Text(
                '✦ ALL CATEGORIES ✦',
                style: GoogleFonts.montserrat(
                  fontSize: 10,
                  fontWeight: FontWeight.w500,
                  letterSpacing: 2,
                  color: AppColors.brandWhite.withValues(alpha: 0.9),
                ),
              ),
              const SizedBox(height: 12),
              Text(
                'Original & 2nd Side by Side',
                textAlign: TextAlign.center,
                style: GoogleFonts.playfairDisplay(
                  fontSize: 26,
                  fontWeight: FontWeight.w500,
                  color: AppColors.brandWhite,
                  height: 1.25,
                ),
              ),
              const SizedBox(height: 14),
              Row(
                children: [
                  Expanded(child: _headerLine()),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    child: Text(
                      '• $productCount products •',
                      style: GoogleFonts.montserrat(
                        fontSize: 11,
                        color: AppColors.brandWhite.withValues(alpha: 0.8),
                      ),
                    ),
                  ),
                  Expanded(child: _headerLine()),
                ],
              ),
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
      color: AppColors.brandWhite.withValues(alpha: 0.15),
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
                color: AppColors.brandWhite,
                size: 20,
              ),
              if (itemCount > 0)
                Positioned(
                  right: 4,
                  top: 4,
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    constraints: const BoxConstraints(
                      minWidth: 16,
                      minHeight: 16,
                    ),
                    decoration: const BoxDecoration(
                      color: AppColors.brandWhite,
                      shape: BoxShape.circle,
                    ),
                    child: Text(
                      itemCount > 99 ? '99+' : '$itemCount',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.montserrat(
                        fontSize: 9,
                        fontWeight: FontWeight.w700,
                        color: AppColors.brandBlue,
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

class _headerLine extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      height: 1,
      color: AppColors.brandWhite.withValues(alpha: 0.35),
    );
  }
}
