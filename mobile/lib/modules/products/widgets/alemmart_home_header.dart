import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/theme/app_colors.dart';
import '../../cart/cart_service.dart';
import '../products_controller.dart';

class AlemmartHomeHeader extends StatefulWidget {
  const AlemmartHomeHeader({super.key});

  @override
  State<AlemmartHomeHeader> createState() => _AlemmartHomeHeaderState();
}

class _AlemmartHomeHeaderState extends State<AlemmartHomeHeader> {
  late final TextEditingController _searchController;
  late final FocusNode _searchFocusNode;
  late final ProductsController _controller;

  @override
  void initState() {
    super.initState();
    _controller = Get.find<ProductsController>();
    _searchFocusNode = FocusNode();
    _searchController =
        TextEditingController(text: _controller.searchQuery.value);
    _searchController.addListener(_onSearchChanged);
  }

  void _onSearchChanged() {
    _controller.setSearchQuery(_searchController.text);
  }

  @override
  void dispose() {
    _searchController.removeListener(_onSearchChanged);
    _searchController.dispose();
    _searchFocusNode.dispose();
    super.dispose();
  }

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
            children: [
              Row(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: Image.asset(
                      'assets/app_logo/logo.jpg',
                      width: 36,
                      height: 36,
                      fit: BoxFit.cover,
                    ),
                  ),
                  Expanded(
                    child: Text(
                      'Alemmart',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.montserrat(
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                        color: AppColors.brandWhite,
                      ),
                    ),
                  ),
                  IconButton(
                    onPressed: () => _searchFocusNode.requestFocus(),
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
              Material(
                elevation: 4,
                shadowColor: Colors.black.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(24),
                color: AppColors.brandWhite,
                child: TextField(
                  controller: _searchController,
                  focusNode: _searchFocusNode,
                  decoration: InputDecoration(
                    hintText: 'Search',
                    hintStyle: GoogleFonts.montserrat(
                      fontSize: 14,
                      color: AppColors.textMuted,
                    ),
                    prefixIcon: const Icon(
                      Icons.search,
                      color: AppColors.brandBlue,
                      size: 20,
                    ),
                    filled: true,
                    fillColor: AppColors.brandWhite,
                    contentPadding: const EdgeInsets.symmetric(vertical: 12),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(24),
                      borderSide: BorderSide.none,
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(24),
                      borderSide: BorderSide.none,
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(24),
                      borderSide: const BorderSide(
                        color: AppColors.brandBlueLight,
                        width: 2,
                      ),
                    ),
                  ),
                  style: GoogleFonts.montserrat(
                    fontSize: 14,
                    color: AppColors.textDark,
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
