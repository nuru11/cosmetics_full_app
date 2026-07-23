import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../core/l10n/locale_service.dart';
import '../../core/theme/app_colors.dart';
import '../orders/orders_controller.dart';
import '../saved/wishlist_service.dart';
import 'profile_controller.dart';

class ProfileView extends GetView<ProfileController> {
  const ProfileView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.brandWhite,
      appBar: AppBar(
        centerTitle: true,
        elevation: 0,
        scrolledUnderElevation: 0,
        title: Text(
          'profile.title'.tr,
          style: GoogleFonts.playfairDisplay(
            fontSize: 24,
            fontWeight: FontWeight.w600,
            color: AppColors.brandWhite,
          ),
        ),
        backgroundColor: AppColors.brandBlue,
        foregroundColor: AppColors.brandWhite,
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(20, 20, 20, 32),
        children: [
          _ProfileIdentityCard(controller: controller),
          const SizedBox(height: 20),
          _AccountStatsRow(controller: controller),
          const SizedBox(height: 28),
          _SectionLabel('profile.section_account'.tr),
          const SizedBox(height: 12),
          _MenuCard(
            items: [
              _MenuItem(
                icon: Icons.shopping_bag_outlined,
                label: 'profile.orders'.tr,
                detail: 'profile.orders_detail'.tr,
                accent: AppColors.brandBlue,
                onTap: controller.switchToOrdersTab,
              ),
              _MenuItem(
                icon: Icons.location_on_outlined,
                label: 'profile.my_address'.tr,
                detail: 'profile.my_address_detail'.tr,
                accent: AppColors.brandBlue,
                onTap: () => Get.toNamed('/profile/address'),
              ),
            ],
          ),
          const SizedBox(height: 28),
          _SectionLabel('profile.section_preferences'.tr),
          const SizedBox(height: 12),
          _MenuCard(
            items: [
              _LanguageMenuItem(
                onTap: () => _showLanguagePicker(context),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

void _showLanguagePicker(BuildContext context) {
  final localeService = Get.find<LocaleService>();

  showModalBottomSheet<void>(
    context: context,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
    ),
    builder: (ctx) {
      return SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                'profile.choose_language'.tr,
                style: GoogleFonts.playfairDisplay(
                  fontSize: 20,
                  fontWeight: FontWeight.w600,
                  color: AppColors.brandBlack,
                ),
              ),
              const SizedBox(height: 16),
              _LanguageOption(
                label: 'profile.language_english'.tr,
                selected: localeService.locale.value.languageCode == 'en',
                onTap: () async {
                  await localeService.setEnglish();
                  if (ctx.mounted) Navigator.pop(ctx);
                },
              ),
              const SizedBox(height: 8),
              _LanguageOption(
                label: 'profile.language_amharic'.tr,
                selected: localeService.locale.value.languageCode == 'am',
                onTap: () async {
                  await localeService.setAmharic();
                  if (ctx.mounted) Navigator.pop(ctx);
                },
              ),
            ],
          ),
        ),
      );
    },
  );
}

class _LanguageOption extends StatelessWidget {
  const _LanguageOption({
    required this.label,
    required this.selected,
    required this.onTap,
  });

  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: selected
          ? AppColors.brandBlue.withValues(alpha: 0.08)
          : AppColors.cardWhite,
      borderRadius: BorderRadius.circular(12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          child: Row(
            children: [
              Expanded(
                child: Text(
                  label,
                  style: GoogleFonts.montserrat(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textDark,
                  ),
                ),
              ),
              if (selected)
                const Icon(Icons.check_circle, color: AppColors.brandBlue),
            ],
          ),
        ),
      ),
    );
  }
}

class _ProfileIdentityCard extends StatelessWidget {
  const _ProfileIdentityCard({required this.controller});

  final ProfileController controller;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.cardWhite,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.dividerGrey),
        boxShadow: [
          BoxShadow(
            color: AppColors.brandBlack.withValues(alpha: 0.04),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Obx(
        () => Row(
          children: [
            Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppColors.brandBlue.withValues(alpha: 0.1),
              ),
              child: const Icon(
                Icons.person_outline_rounded,
                size: 28,
                color: AppColors.brandBlue,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    controller.displayName.value,
                    style: GoogleFonts.playfairDisplay(
                      fontSize: 22,
                      fontWeight: FontWeight.w600,
                      color: AppColors.brandBlack,
                      height: 1.2,
                    ),
                  ),
                  if (!controller.hasContactName.value) ...[
                    const SizedBox(height: 4),
                    Text(
                      'profile.guest_hint'.tr,
                      style: GoogleFonts.montserrat(
                        fontSize: 13,
                        color: AppColors.textMuted,
                        height: 1.3,
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _AccountStatsRow extends StatelessWidget {
  const _AccountStatsRow({required this.controller});

  final ProfileController controller;

  @override
  Widget build(BuildContext context) {
    final ordersController = Get.find<OrdersController>();
    final wishlist = Get.find<WishlistService>();

    return Obx(
      () {
        final orderCount = ordersController.orders.length;
        final savedCount = wishlist.savedVariantIds.length;

        return Row(
          children: [
            _StatChip(
              value: '$orderCount',
              label: 'profile.orders_stat'.tr,
              icon: Icons.shopping_bag_outlined,
              onTap: controller.switchToOrdersTab,
            ),
            const SizedBox(width: 12),
            _StatChip(
              value: '$savedCount',
              label: 'profile.saved_stat'.tr,
              icon: Icons.favorite_border_rounded,
              onTap: controller.switchToSavedTab,
            ),
          ],
        );
      },
    );
  }
}

class _StatChip extends StatelessWidget {
  const _StatChip({
    required this.value,
    required this.label,
    required this.icon,
    required this.onTap,
  });

  final String value;
  final String label;
  final IconData icon;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Material(
        color: AppColors.cardWhite,
        borderRadius: BorderRadius.circular(14),
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: onTap,
          child: Container(
            padding: const EdgeInsets.symmetric(vertical: 16),
            decoration: BoxDecoration(
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
  final List<Widget> items;

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

class _LanguageMenuItem extends StatelessWidget {
  const _LanguageMenuItem({required this.onTap});

  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final localeService = Get.find<LocaleService>();
    return Obx(
      () => _MenuItem(
        icon: Icons.language_rounded,
        label: 'profile.language'.tr,
        detail: localeService.currentLanguageLabel,
        accent: AppColors.brandBlue,
        onTap: onTap,
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
