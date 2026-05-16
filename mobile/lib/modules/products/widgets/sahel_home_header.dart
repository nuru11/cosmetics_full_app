import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/theme/app_colors.dart';

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
                  _HeaderIconButton(
                    icon: Icons.search,
                    onTap: () => _stub(context, 'Search coming soon'),
                  ),
                  const SizedBox(width: 10),
                  _HeaderIconButton(
                    icon: Icons.shopping_bag_outlined,
                    onTap: () => _stub(context, 'Cart coming soon'),
                  ),
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

  void _stub(BuildContext context, String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message), behavior: SnackBarBehavior.floating),
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

class _HeaderIconButton extends StatelessWidget {
  const _HeaderIconButton({required this.icon, required this.onTap});

  final IconData icon;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white.withValues(alpha: 0.12),
      shape: const CircleBorder(),
      child: InkWell(
        onTap: onTap,
        customBorder: const CircleBorder(),
        child: SizedBox(
          width: 40,
          height: 40,
          child: Icon(icon, color: AppColors.gold, size: 20),
        ),
      ),
    );
  }
}
