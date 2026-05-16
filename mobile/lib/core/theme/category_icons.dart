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
}
