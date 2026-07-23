import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../../core/theme/app_colors.dart';
import '../../../data/services/checkout_contact_storage.dart';
import '../profile_controller.dart';

class AddressController extends GetxController {
  final formKey = GlobalKey<FormState>();
  late final TextEditingController nameController;
  late final TextEditingController phoneController;
  late final TextEditingController cityController;

  final isLoading = true.obs;
  final isSaving = false.obs;

  CheckoutContactStorage? _storage;

  @override
  void onInit() {
    super.onInit();
    nameController = TextEditingController();
    phoneController = TextEditingController();
    cityController = TextEditingController();
    _loadContact();
  }

  Future<void> _loadContact() async {
    isLoading.value = true;
    try {
      _storage = await CheckoutContactStorage.create();
      final contact = _storage!.load();
      nameController.text = contact.name;
      phoneController.text = contact.phone;
      cityController.text = contact.city;
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> save() async {
    if (!(formKey.currentState?.validate() ?? false)) return;

    isSaving.value = true;
    try {
      final storage = _storage ?? await CheckoutContactStorage.create();
      _storage = storage;
      await storage.save(
        CheckoutContact(
          name: nameController.text.trim(),
          phone: phoneController.text.trim(),
          city: cityController.text.trim(),
        ),
      );
      Get.snackbar(
        'address.saved_title'.tr,
        'address.saved_message'.tr,
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: AppColors.brandBlue,
        colorText: AppColors.brandWhite,
        margin: const EdgeInsets.all(16),
        duration: const Duration(seconds: 2),
      );
      if (Get.isRegistered<ProfileController>()) {
        await Get.find<ProfileController>().reload();
      }
    } finally {
      isSaving.value = false;
    }
  }

  @override
  void onClose() {
    nameController.dispose();
    phoneController.dispose();
    cityController.dispose();
    super.onClose();
  }
}
