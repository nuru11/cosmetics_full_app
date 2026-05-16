import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

import '../config/api_config.dart';
import '../utils/image_url.dart';

class ProductImage extends StatelessWidget {
  const ProductImage({
    super.key,
    required this.imageUrl,
    this.height,
    this.width,
    this.fit = BoxFit.cover,
    this.borderRadius,
  });

  final String? imageUrl;
  final double? height;
  final double? width;
  final BoxFit fit;
  final BorderRadius? borderRadius;

  @override
  Widget build(BuildContext context) {
    final resolved = resolveImageUrl(imageUrl);
    final displayUrl = resolveProductImageUrl(imageUrl);
    final usesDefaultOnly = resolved.isEmpty;

    Widget image(String url, {bool showLoading = false}) {
      return CachedNetworkImage(
        imageUrl: url,
        height: height,
        width: width,
        fit: fit,
        placeholder: showLoading
            ? (context, _) => _DefaultProductImage(
                  height: height,
                  width: width,
                  fit: fit,
                )
            : null,
        errorWidget: (context, _, __) => _DefaultProductImage(
          height: height,
          width: width,
          fit: fit,
        ),
      );
    }

    return ClipRRect(
      borderRadius: borderRadius ?? BorderRadius.zero,
      child: usesDefaultOnly
          ? image(ApiConfig.defaultProductImageUrl)
          : image(displayUrl, showLoading: true),
    );
  }
}

class _DefaultProductImage extends StatelessWidget {
  const _DefaultProductImage({
    this.height,
    this.width,
    this.fit = BoxFit.cover,
  });

  final double? height;
  final double? width;
  final BoxFit fit;

  @override
  Widget build(BuildContext context) {
    return CachedNetworkImage(
      imageUrl: ApiConfig.defaultProductImageUrl,
      height: height,
      width: width,
      fit: fit,
      placeholder: (context, _) => Container(
        height: height,
        width: width,
        color: Theme.of(context).colorScheme.surfaceContainerHighest,
        child: const Center(
          child: SizedBox(
            width: 24,
            height: 24,
            child: CircularProgressIndicator(strokeWidth: 2),
          ),
        ),
      ),
      errorWidget: (context, _, __) => Container(
        height: height,
        width: width,
        color: Theme.of(context).colorScheme.surfaceContainerHighest,
        child: Icon(
          Icons.image_outlined,
          size: 40,
          color: Theme.of(context).colorScheme.outline,
        ),
      ),
    );
  }
}
