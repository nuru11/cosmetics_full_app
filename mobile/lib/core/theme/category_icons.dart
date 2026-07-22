import 'package:flutter/material.dart';

import 'app_colors.dart';

abstract final class CategoryIcons {
  static const all = '✦';
  static const fragrance = '🌸';
  static const skincare = '🍃';
  static const makeup = '💄';
  static const haircare = '💇';

  static String forSlug(String? slug) {
    switch (slug?.toLowerCase()) {
      case 'fragrance':
        return fragrance;
      case 'skincare':
        return skincare;
      case 'makeup':
        return makeup;
      case 'haircare':
        return haircare;
      default:
        return '•';
    }
  }

  static String forCategory({String? slug, String? name}) {
    final fromSlug = forSlug(slug);
    if (fromSlug != '•') return fromSlug;
    return forSlug(name?.toLowerCase().replaceAll(' ', '-'));
  }

  static Color backgroundTintFor({String? slug, String? name}) {
    final key = _resolveKey(slug: slug, name: name);
    switch (key) {
      case 'skincare':
        return AppColors.statusDeliveredBg;
      case 'makeup':
        return const Color(0xFFFCE4EC);
      case 'fragrance':
        return const Color(0xFFF8E8EE);
      case 'haircare':
        return AppColors.brandBlueLight.withValues(alpha: 0.35);
      default:
        return AppColors.cardHeaderBeige;
    }
  }

  static String? _resolveKey({String? slug, String? name}) {
    final normalizedSlug = slug?.toLowerCase();
    if (normalizedSlug != null && forSlug(normalizedSlug) != '•') {
      return normalizedSlug;
    }
    final fromName = name?.toLowerCase().replaceAll(' ', '-');
    if (fromName != null && forSlug(fromName) != '•') return fromName;
    return normalizedSlug ?? fromName;
  }
}
