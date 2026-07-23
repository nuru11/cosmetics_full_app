import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../theme/app_colors.dart';
import '../../modules/saved/wishlist_service.dart';

void showSavedFeedback({required bool saved}) {
  Get.snackbar(
    saved ? 'saved.saved_title'.tr : 'saved.removed_title'.tr,
    saved ? 'saved.saved_message'.tr : 'saved.removed_message'.tr,
    snackPosition: SnackPosition.BOTTOM,
    margin: const EdgeInsets.all(16),
    duration: const Duration(seconds: 2),
  );
}

class SaveProductIconButton extends StatelessWidget {
  const SaveProductIconButton({
    super.key,
    required this.variantId,
    this.iconSize = 20,
    this.savedColor = AppColors.brandBlue,
    this.unsavedColor,
    this.padding = EdgeInsets.zero,
    this.constraints = const BoxConstraints(minWidth: 32, minHeight: 32),
  });

  final String variantId;
  final double iconSize;
  final Color savedColor;
  final Color? unsavedColor;
  final EdgeInsetsGeometry padding;
  final BoxConstraints constraints;

  @override
  Widget build(BuildContext context) {
    if (variantId.isEmpty) {
      return const SizedBox.shrink();
    }

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
      final ids = wishlist.savedVariantIds;
      final saved = ids.contains(variantId);
      return IconButton(
        onPressed: () async {
          final nowSaved = await wishlist.toggle(variantId);
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
