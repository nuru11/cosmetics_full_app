import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../core/theme/app_colors.dart';

class ProfileView extends StatelessWidget {
  const ProfileView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.brandWhite,
      body: CustomScrollView(
        slivers: [
          _ProfileSliverAppBar(),
          SliverPadding(
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 32),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                const SizedBox(height: 24),
                _BeautyStatsRow(),
                const SizedBox(height: 28),
                _SectionLabel('MY ACCOUNT'),
                const SizedBox(height: 12),
                _MenuCard(
                  items: [
                    _MenuItem(
                      icon: Icons.shopping_bag_outlined,
                      label: 'My Orders',
                      detail: 'Track & manage',
                      accent: AppColors.brandBlue,
                      onTap: () => Get.toNamed('/profile/my-orders'),
                    ),
                    _MenuItem(
                      icon: Icons.history_rounded,
                      label: 'Order History',
                      detail: 'Past purchases',
                      accent: AppColors.brandBlue,
                      onTap: () => Get.toNamed('/profile/order-history'),
                    ),
                    _MenuItem(
                      icon: Icons.location_on_outlined,
                      label: 'My Address',
                      detail: 'Saved locations',
                      accent: AppColors.brandBlue,
                      onTap: () => Get.toNamed('/profile/address'),
                    ),
                  ],
                ),
                const SizedBox(height: 28),
                _SectionLabel('BEAUTY PROFILE'),
                const SizedBox(height: 12),
                _MenuCard(
                  items: [
                    _MenuItem(
                      icon: Icons.favorite_border_rounded,
                      label: 'Wishlist',
                      detail: '12 saved items',
                      accent: AppColors.brandBlue,
                      onTap: () {},
                    ),
                    _MenuItem(
                      icon: Icons.auto_awesome_outlined,
                      label: 'Beauty Routine',
                      detail: 'Personalized picks',
                      accent: AppColors.brandBlue,
                      onTap: () {},
                    ),
                  ],
                ),
                const SizedBox(height: 28),
                _LoyaltyBanner(),
              ]),
            ),
          ),
        ],
      ),
    );
  }
}

class _ProfileSliverAppBar extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SliverAppBar(
      expandedHeight: 260,
      pinned: true,
      backgroundColor: AppColors.brandBlue,
      foregroundColor: AppColors.brandWhite,
      flexibleSpace: FlexibleSpaceBar(
        collapseMode: CollapseMode.parallax,
        background: Stack(
          fit: StackFit.expand,
          children: [
            Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    AppColors.brandBlue,
                    AppColors.brandBlack,
                    AppColors.brandBlue,
                  ],
                  stops: [0.0, 0.5, 1.0],
                ),
              ),
            ),
            Positioned(
              top: -40,
              right: -40,
              child: Container(
                width: 200,
                height: 200,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.brandWhite.withValues(alpha: 0.08),
                ),
              ),
            ),
            Positioned(
              bottom: 20,
              left: -30,
              child: Container(
                width: 140,
                height: 140,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.brandWhite.withValues(alpha: 0.12),
                ),
              ),
            ),
            Positioned(
              bottom: 28,
              left: 24,
              right: 24,
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(3),
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: LinearGradient(
                        colors: [AppColors.brandWhite, AppColors.brandBlue],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                    ),
                    child: Container(
                      width: 68,
                      height: 68,
                      decoration: const BoxDecoration(
                        shape: BoxShape.circle,
                        color: AppColors.brandBlue,
                      ),
                      child: const Icon(
                        Icons.person_outline_rounded,
                        size: 36,
                        color: AppColors.brandWhite,
                      ),
                    ),
                  ),
                  const SizedBox(width: 18),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          'Welcome Back',
                          style: GoogleFonts.montserrat(
                            fontSize: 11,
                            letterSpacing: 2,
                            color: AppColors.brandWhite.withValues(alpha: 0.85),
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Guest',
                          style: GoogleFonts.playfairDisplay(
                            fontSize: 30,
                            fontWeight: FontWeight.w600,
                            color: AppColors.brandWhite,
                            height: 1.1,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 10,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(20),
                            color: AppColors.brandWhite.withValues(alpha: 0.15),
                            border: Border.all(
                              color: AppColors.brandWhite.withValues(alpha: 0.4),
                              width: 0.8,
                            ),
                          ),
                          child: Text(
                            '✦  Alemmart Member',
                            style: GoogleFonts.montserrat(
                              fontSize: 10,
                              color: AppColors.brandWhite,
                              letterSpacing: 0.5,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  GestureDetector(
                    onTap: () {},
                    child: Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: Colors.white.withValues(alpha: 0.08),
                        border: Border.all(
                          color: Colors.white.withValues(alpha: 0.15),
                        ),
                      ),
                      child: const Icon(
                        Icons.edit_outlined,
                        size: 18,
                        color: AppColors.brandWhite,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      title: Text(
        'My Profile',
        style: GoogleFonts.playfairDisplay(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: AppColors.brandWhite,
          letterSpacing: 0.5,
        ),
      ),
    );
  }
}

class _BeautyStatsRow extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        _StatChip(value: '240', label: 'Points', icon: Icons.star_rounded),
        const SizedBox(width: 12),
        _StatChip(
          value: '8',
          label: 'Orders',
          icon: Icons.shopping_bag_outlined,
        ),
        const SizedBox(width: 12),
        _StatChip(
          value: '12',
          label: 'Wishlist',
          icon: Icons.favorite_border_rounded,
        ),
      ],
    );
  }
}

class _StatChip extends StatelessWidget {
  const _StatChip({
    required this.value,
    required this.label,
    required this.icon,
  });

  final String value;
  final String label;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: AppColors.cardWhite,
          borderRadius: BorderRadius.circular(14),
          boxShadow: [
            BoxShadow(
              color: AppColors.brandBlack.withValues(alpha: 0.06),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          children: [
            Icon(icon, size: 18, color: AppColors.brandBlue),
            const SizedBox(height: 8),
            Text(
              value,
              style: GoogleFonts.playfairDisplay(
                fontSize: 22,
                fontWeight: FontWeight.w700,
                color: AppColors.brandBlack,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              label,
              style: GoogleFonts.montserrat(
                fontSize: 10,
                color: AppColors.textMuted,
                letterSpacing: 0.5,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SectionLabel extends StatelessWidget {
  const _SectionLabel(this.text);
  final String text;

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: GoogleFonts.montserrat(
        fontSize: 10,
        fontWeight: FontWeight.w600,
        letterSpacing: 2.5,
        color: AppColors.textMuted,
      ),
    );
  }
}

class _MenuCard extends StatelessWidget {
  const _MenuCard({required this.items});
  final List<_MenuItem> items;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.cardWhite,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: AppColors.brandBlack.withValues(alpha: 0.06),
            blurRadius: 16,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          for (var i = 0; i < items.length; i++) ...[
            items[i],
            if (i < items.length - 1)
              const Divider(
                height: 1,
                indent: 68,
                endIndent: 20,
                color: AppColors.dividerGrey,
              ),
          ],
        ],
      ),
    );
  }
}

class _MenuItem extends StatelessWidget {
  const _MenuItem({
    required this.icon,
    required this.label,
    required this.detail,
    required this.accent,
    required this.onTap,
  });

  final IconData icon;
  final String label;
  final String detail;
  final Color accent;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
        child: Row(
          children: [
            Container(
              width: 42,
              height: 42,
              decoration: BoxDecoration(
                color: accent.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, size: 20, color: accent),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    label,
                    style: GoogleFonts.montserrat(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textDark,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    detail,
                    style: GoogleFonts.montserrat(
                      fontSize: 12,
                      color: AppColors.textMuted,
                    ),
                  ),
                ],
              ),
            ),
            Container(
              width: 28,
              height: 28,
              decoration: BoxDecoration(
                color: AppColors.brandBlue.withValues(alpha: 0.08),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.chevron_right_rounded,
                size: 18,
                color: AppColors.textMuted,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _LoyaltyBanner extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppColors.brandBlue,
            AppColors.brandBlack,
          ],
        ),
        boxShadow: [
          BoxShadow(
            color: AppColors.brandBlue.withValues(alpha: 0.35),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Alemmart Tier',
                  style: GoogleFonts.montserrat(
                    fontSize: 10,
                    letterSpacing: 2,
                    fontWeight: FontWeight.w600,
                    color: AppColors.brandWhite.withValues(alpha: 0.9),
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  '240 / 500 pts\nto Gold',
                  style: GoogleFonts.playfairDisplay(
                    fontSize: 22,
                    fontWeight: FontWeight.w600,
                    color: AppColors.brandWhite,
                    height: 1.3,
                  ),
                ),
                const SizedBox(height: 14),
                ClipRRect(
                  borderRadius: BorderRadius.circular(4),
                  child: LinearProgressIndicator(
                    value: 0.48,
                    minHeight: 5,
                    backgroundColor: Colors.white.withValues(alpha: 0.2),
                    valueColor: const AlwaysStoppedAnimation<Color>(
                      AppColors.brandWhite,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 20),
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: Colors.white.withValues(alpha: 0.12),
            ),
            child: const Icon(
              Icons.workspace_premium_rounded,
              size: 30,
              color: AppColors.brandWhite,
            ),
          ),
        ],
      ),
    );
  }
}
