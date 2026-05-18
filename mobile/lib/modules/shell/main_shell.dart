import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../core/theme/app_colors.dart';
import '../products/products_binding.dart';
import '../products/products_view.dart';
import '../orders/orders_binding.dart';
import '../orders/orders_controller.dart';
import '../orders/orders_view.dart';
import '../profile/profile_binding.dart';
import '../profile/profile_view.dart';
import '../saved/saved_binding.dart';
import '../saved/saved_view.dart';

class MainShell extends StatefulWidget {
  const MainShell({super.key});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int _index = 0;

  void _onTabSelected(int index) {
    setState(() => _index = index);
    if (index == 2) {
      OrdersController.refreshIfRegistered();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _index,
        children: [
          const ProductsView(),
          const SavedView(),
          const OrdersView(),
          const ProfileView(),
        ],
      ),
      bottomNavigationBar: _SahelBottomNav(
        currentIndex: _index,
        onTap: _onTabSelected,
      ),
    );
  }
}

class MainShellBinding extends Bindings {
  @override
  void dependencies() {
    ProductsBinding().dependencies();
    SavedBinding().dependencies();
    OrdersBinding().dependencies();
    ProfileBinding().dependencies();
  }
}

class _SahelBottomNav extends StatelessWidget {
  const _SahelBottomNav({
    required this.currentIndex,
    required this.onTap,
  });

  final int currentIndex;
  final ValueChanged<int> onTap;

  static const _items = [
    _NavItem(icon: Icons.home_outlined, activeIcon: Icons.home, label: 'HOME'),
    _NavItem(
      icon: Icons.favorite_border,
      activeIcon: Icons.favorite,
      label: 'SAVED',
      activeColor: Colors.red,
    ),
    _NavItem(
      icon: Icons.receipt_long_outlined,
      activeIcon: Icons.receipt_long,
      label: 'ORDERS',
      activeColor: AppColors.headerBrown,
      showTopBarWhenSelected: true,
    ),
    _NavItem(
      icon: Icons.person_outline,
      activeIcon: Icons.person,
      label: 'PROFILE',
      activeColor: AppColors.secondPurple,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.cardWhite,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.06),
            blurRadius: 8,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 8),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: List.generate(_items.length, (i) {
              final item = _items[i];
              final selected = currentIndex == i;
              final color = selected
                  ? (item.activeColor ?? AppColors.textDark)
                  : AppColors.textMuted;
              return Expanded(
                child: InkWell(
                  onTap: () => onTap(i),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 20,
                        height: 3,
                        margin: const EdgeInsets.only(bottom: 4),
                        decoration: BoxDecoration(
                          color: selected && item.showTopBarWhenSelected
                              ? AppColors.headerBrown
                              : Colors.transparent,
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                      Icon(
                        selected ? item.activeIcon : item.icon,
                        size: 22,
                        color: color,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        item.label,
                        style: GoogleFonts.montserrat(
                          fontSize: 9,
                          fontWeight: FontWeight.w600,
                          letterSpacing: 0.5,
                          color: color,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Container(
                        width: 4,
                        height: 4,
                        decoration: BoxDecoration(
                          color: selected && i == 0
                              ? AppColors.gold
                              : Colors.transparent,
                          shape: BoxShape.circle,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            }),
          ),
        ),
      ),
    );
  }
}

class _NavItem {
  const _NavItem({
    required this.icon,
    required this.activeIcon,
    required this.label,
    this.activeColor,
    this.showTopBarWhenSelected = false,
  });

  final IconData icon;
  final IconData activeIcon;
  final String label;
  final Color? activeColor;
  final bool showTopBarWhenSelected;
}
