import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/theme/app_colors.dart';
import '../../cart/cart_service.dart';

class SahelHomeHeader extends StatelessWidget {
  const SahelHomeHeader({
    super.key,
    required this.productCount,
  });

  final int productCount;

  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppColors.headerBrown,
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
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Sahel',
                          style: GoogleFonts.playfairDisplay(
                            fontSize: 36,
                            fontStyle: FontStyle.italic,
                            fontWeight: FontWeight.w600,
                            color: AppColors.gold,
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
                            color: AppColors.gold.withValues(alpha: 0.85),
                          ),
                        ),
                      ],
                    ),
                  ),
                  Obx(() {
                    final count = Get.find<CartService>().totalItemCountForHomeCartIcon;
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
                  color: AppColors.gold.withValues(alpha: 0.9),
                ),
              ),
              const SizedBox(height: 12),
              RichText(
                textAlign: TextAlign.center,
                text: TextSpan(
                  style: GoogleFonts.playfairDisplay(
                    fontSize: 26,
                    fontWeight: FontWeight.w500,
                    color: Colors.white,
                    height: 1.25,
                  ),
                  children: [
                    const TextSpan(text: 'Original & '),
                    TextSpan(
                      text: '2nd',
                      style: GoogleFonts.playfairDisplay(
                        fontSize: 26,
                        fontStyle: FontStyle.italic,
                        fontWeight: FontWeight.w500,
                        color: AppColors.gold,
                      ),
                    ),
                    const TextSpan(text: ' Side by Side'),
                  ],
                ),
              ),
              const SizedBox(height: 14),
              Row(
                children: [
                  Expanded(child: _goldLine()),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    child: Text(
                      '• $productCount products •',
                      style: GoogleFonts.montserrat(
                        fontSize: 11,
                        color: AppColors.gold.withValues(alpha: 0.8),
                      ),
                    ),
                  ),
                  Expanded(child: _goldLine()),
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
      color: Colors.white.withValues(alpha: 0.12),
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
                color: AppColors.gold,
                size: 20,
              ),
              if (itemCount > 0)
                Positioned(
                  right: 4,
                  top: 4,
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    constraints: const BoxConstraints(minWidth: 16, minHeight: 16),
                    decoration: const BoxDecoration(
                      color: AppColors.gold,
                      shape: BoxShape.circle,
                    ),
                    child: Text(
                      itemCount > 99 ? '99+' : '$itemCount',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.montserrat(
                        fontSize: 9,
                        fontWeight: FontWeight.w700,
                        color: AppColors.headerBrown,
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

class _goldLine extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      height: 1,
      color: AppColors.gold.withValues(alpha: 0.35),
    );
  }
}
