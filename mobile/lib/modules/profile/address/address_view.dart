import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/theme/app_colors.dart';
import '../../cart/widgets/delivery_contact_fields.dart';
import 'address_controller.dart';

class AddressView extends GetView<AddressController> {
  const AddressView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.cream,
      appBar: AppBar(
        title: Text(
          'My Address',
          style: GoogleFonts.playfairDisplay(
            fontWeight: FontWeight.w600,
            color: AppColors.gold,
          ),
        ),
        backgroundColor: AppColors.headerBrown,
        foregroundColor: AppColors.gold,
        actions: [
          Obx(
            () => TextButton(
              onPressed: controller.isSaving.value || controller.isLoading.value
                  ? null
                  : controller.save,
              child: controller.isSaving.value
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: AppColors.gold,
                      ),
                    )
                  : Text(
                      'Save',
                      style: GoogleFonts.montserrat(
                        fontWeight: FontWeight.w700,
                        color: AppColors.gold,
                      ),
                    ),
            ),
          ),
        ],
      ),
      body: Obx(() {
        if (controller.isLoading.value) {
          return const Center(
            child: CircularProgressIndicator(color: AppColors.gold),
          );
        }

        return SingleChildScrollView(
          padding: EdgeInsets.fromLTRB(
            20,
            20,
            20,
            20 + MediaQuery.paddingOf(context).bottom,
          ),
          child: Form(
            key: controller.formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text(
                  'Delivery address',
                  style: GoogleFonts.playfairDisplay(
                    fontSize: 22,
                    fontWeight: FontWeight.w600,
                    color: AppColors.headerBrown,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Used to pre-fill checkout. We deliver to your city with name and phone.',
                  style: GoogleFonts.montserrat(
                    fontSize: 14,
                    color: AppColors.textMuted,
                  ),
                ),
                const SizedBox(height: 20),
                DeliveryContactFields(
                  nameController: controller.nameController,
                  phoneController: controller.phoneController,
                  cityController: controller.cityController,
                ),
                const SizedBox(height: 24),
                FilledButton(
                  onPressed: controller.isSaving.value ? null : controller.save,
                  style: FilledButton.styleFrom(
                    backgroundColor: AppColors.headerBrown,
                    foregroundColor: AppColors.gold,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                  child: Obx(
                    () => controller.isSaving.value
                        ? const SizedBox(
                            height: 22,
                            width: 22,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              color: AppColors.gold,
                            ),
                          )
                        : Text(
                            'Save address',
                            style: GoogleFonts.montserrat(
                              fontWeight: FontWeight.w700,
                            ),
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
