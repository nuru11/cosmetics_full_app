import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

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

    return ClipRRect(
      borderRadius: borderRadius ?? BorderRadius.zero,
      child: resolved.isEmpty
          ? _ProductDefaultPlaceholder(
              height: height,
              width: width,
            )
          : CachedNetworkImage(
              imageUrl: resolved,
              height: height,
              width: width,
              fit: fit,
              placeholder: (context, _) => _ProductShimmerPlaceholder(
                height: height,
                width: width,
              ),
              errorWidget: (context, _, __) => _ProductDefaultPlaceholder(
                height: height,
                width: width,
              ),
            ),
    );
  }
}

class _ProductShimmerPlaceholder extends StatelessWidget {
  const _ProductShimmerPlaceholder({
    this.height,
    this.width,
  });

  final double? height;
  final double? width;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return Shimmer.fromColors(
      baseColor: colorScheme.surfaceContainerHighest,
      highlightColor: colorScheme.surfaceContainerHigh,
      child: Container(
        height: height,
        width: width,
        color: colorScheme.surfaceContainerHighest,
      ),
    );
  }
}

class _ProductDefaultPlaceholder extends StatelessWidget {
  const _ProductDefaultPlaceholder({
    this.height,
    this.width,
  });

  final double? height;
  final double? width;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: height,
      width: width,
      color: Theme.of(context).colorScheme.surfaceContainerHighest,
      child: Icon(
        Icons.image_outlined,
        size: 40,
        color: Theme.of(context).colorScheme.outline,
      ),
    );
  }
}
