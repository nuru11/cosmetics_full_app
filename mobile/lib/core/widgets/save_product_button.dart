import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../modules/saved/wishlist_service.dart';

void showSavedFeedback({required bool saved}) {
  Get.snackbar(
    saved ? 'Saved' : 'Removed from saved',
    saved ? 'Added to your saved items' : 'Removed from your saved items',
    snackPosition: SnackPosition.BOTTOM,
    margin: const EdgeInsets.all(16),
    duration: const Duration(seconds: 2),
  );
}

class SaveProductIconButton extends StatelessWidget {
  const SaveProductIconButton({
    super.key,
    required this.productId,
    this.iconSize = 20,
    this.savedColor = Colors.red,
    this.unsavedColor,
    this.padding = EdgeInsets.zero,
    this.constraints = const BoxConstraints(minWidth: 32, minHeight: 32),
  });

  final String productId;
  final double iconSize;
  final Color savedColor;
  final Color? unsavedColor;
  final EdgeInsetsGeometry padding;
  final BoxConstraints constraints;

  @override
  Widget build(BuildContext context) {
    if (!Get.isRegistered<WishlistService>()) {
      return IconButton(
        onPressed: null,
        icon: Icon(Icons.favorite_border, size: iconSize),
        color: unsavedColor,
        padding: padding,
        constraints: constraints,
      );
    }

    final wishlist = Get.find<WishlistService>();

    return Obx(() {
      final ids = wishlist.savedIds;
      final saved = ids.contains(productId);
      return IconButton(
        onPressed: () async {
          final nowSaved = await wishlist.toggle(productId);
          showSavedFeedback(saved: nowSaved);
        },
        icon: Icon(
          saved ? Icons.favorite : Icons.favorite_border,
          size: iconSize,
        ),
        color: saved ? savedColor : unsavedColor,
        padding: padding,
        constraints: constraints,
      );
    });
  }
}
