import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../core/theme/app_colors.dart';
import '../cart/widgets/delivery_contact_fields.dart';
import 'product_request_controller.dart';

String? validateProductDescription(String? value, {required bool hasImage}) {
  final trimmed = value?.trim() ?? '';
  if (trimmed.isEmpty && !hasImage) {
    return 'validation.description_or_photo'.tr;
  }
  if (trimmed.length > 2000) {
    return 'validation.description_too_long'.tr;
  }
  return null;
}

class AskProductView extends GetView<ProductRequestController> {
  const AskProductView({super.key});

  @override
  Widget build(BuildContext context) {
    final bottomInset = MediaQuery.viewInsetsOf(context).bottom;

    return Scaffold(
      backgroundColor: AppColors.brandWhite,
      appBar: AppBar(
        title: Text(
          'request.title'.tr,
          style: GoogleFonts.playfairDisplay(
            fontWeight: FontWeight.w600,
            color: AppColors.brandWhite,
          ),
        ),
        backgroundColor: AppColors.brandBlue,
        foregroundColor: AppColors.brandWhite,
      ),
      body: Obx(() {
        if (controller.isLoading.value) {
          return const Center(
            child: CircularProgressIndicator(color: AppColors.brandBlue),
          );
        }

        final pickedImage = controller.pickedImage.value;
        final isSubmitting = controller.isSubmitting.value;

        return SingleChildScrollView(
          padding: EdgeInsets.fromLTRB(
            20,
            20,
            20,
            20 + bottomInset + MediaQuery.paddingOf(context).bottom,
          ),
          child: Form(
            key: controller.formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text(
                  'request.heading'.tr,
                  style: GoogleFonts.playfairDisplay(
                    fontSize: 22,
                    fontWeight: FontWeight.w600,
                    color: AppColors.brandBlack,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'request.description'.tr,
                  style: GoogleFonts.montserrat(
                    fontSize: 13,
                    color: AppColors.textMuted,
                  ),
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: controller.descriptionController,
                  validator: (value) => validateProductDescription(
                    value,
                    hasImage: pickedImage != null,
                  ),
                  maxLines: 4,
                  minLines: 3,
                  textCapitalization: TextCapitalization.sentences,
                  decoration: InputDecoration(
                    labelText: pickedImage != null
                        ? 'request.product_description_optional'.tr
                        : 'request.product_description'.tr,
                    hintText: 'request.hint'.tr,
                    alignLabelWithHint: true,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: const BorderSide(
                        color: AppColors.brandBlue,
                        width: 2,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  'request.reference_photo'.tr,
                  style: GoogleFonts.montserrat(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textDark,
                  ),
                ),
                const SizedBox(height: 8),
                if (pickedImage != null)
                  Stack(
                    clipBehavior: Clip.none,
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(10),
                        child: Image.file(
                          pickedImage,
                          height: 120,
                          width: double.infinity,
                          fit: BoxFit.cover,
                        ),
                      ),
                      Positioned(
                        top: 8,
                        right: 8,
                        child: Material(
                          color: AppColors.brandWhite,
                          shape: const CircleBorder(),
                          elevation: 2,
                          child: IconButton(
                            onPressed:
                                isSubmitting ? null : controller.removeImage,
                            icon: const Icon(Icons.close, size: 18),
                            tooltip: 'request.remove_photo'.tr,
                          ),
                        ),
                      ),
                    ],
                  )
                else
                  OutlinedButton.icon(
                    onPressed: isSubmitting ? null : controller.pickImage,
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.brandBlue,
                      side: const BorderSide(color: AppColors.brandBlueLight),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                    icon: const Icon(Icons.add_photo_alternate_outlined),
                    label: Text(
                      'request.add_photo'.tr,
                      style: GoogleFonts.montserrat(fontWeight: FontWeight.w600),
                    ),
                  ),
                const SizedBox(height: 20),
                Text(
                  'request.contact_details'.tr,
                  style: GoogleFonts.montserrat(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textDark,
                  ),
                ),
                const SizedBox(height: 12),
                DeliveryContactFields(
                  nameController: controller.nameController,
                  phoneController: controller.phoneController,
                  includeCity: false,
                ),
                const SizedBox(height: 24),
                FilledButton(
                  onPressed: isSubmitting ? null : controller.submit,
                  style: FilledButton.styleFrom(
                    backgroundColor: AppColors.brandBlue,
                    foregroundColor: AppColors.brandWhite,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                  child: isSubmitting
                      ? const SizedBox(
                          height: 22,
                          width: 22,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: AppColors.brandWhite,
                          ),
                        )
                      : Text(
                          'request.send'.tr,
                          style: GoogleFonts.montserrat(
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                ),
              ],
            ),
          ),
        );
      }),
    );
  }
}
