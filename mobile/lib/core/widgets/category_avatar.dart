import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

import '../theme/app_colors.dart';
import '../theme/category_icons.dart';
import '../utils/image_url.dart';

class CategoryAvatar extends StatelessWidget {
  const CategoryAvatar({
    super.key,
    this.imageUrl,
    this.slug,
    this.name,
    this.size = 36,
    this.tintColor,
    this.isSelected = false,
    this.icon,
  });

  final String? imageUrl;
  final String? slug;
  final String? name;
  final double size;
  final Color? tintColor;
  final bool isSelected;
  final String? icon;

  bool get _hasImage => imageUrl != null && imageUrl!.trim().isNotEmpty;

  Color get _backgroundColor {
    if (isSelected) {
      return AppColors.brandBlue.withValues(alpha: 0.12);
    }
    return tintColor ??
        CategoryIcons.backgroundTintFor(slug: slug, name: name);
  }

  String get _fallbackIcon {
    if (icon != null) return icon!;
    return CategoryIcons.forCategory(slug: slug, name: name);
  }

  double get _iconFontSize => size * 0.56;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: _hasImage ? null : _backgroundColor,
        shape: BoxShape.circle,
      ),
      clipBehavior: Clip.antiAlias,
      child: _hasImage ? _buildImage() : _buildEmoji(),
    );
  }

  Widget _buildImage() {
    return CachedNetworkImage(
      imageUrl: resolveImageUrl(imageUrl),
      width: size,
      height: size,
      fit: BoxFit.cover,
      placeholder: (context, _) => _buildEmoji(),
      errorWidget: (context, url, error) => _buildEmoji(),
    );
  }

  Widget _buildEmoji() {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: _backgroundColor,
        shape: BoxShape.circle,
      ),
      alignment: Alignment.center,
      child: Text(
        _fallbackIcon,
        style: TextStyle(fontSize: _iconFontSize, height: 1),
      ),
    );
  }
}
