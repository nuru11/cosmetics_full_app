import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:image_picker/image_picker.dart';

import '../../core/network/api_client.dart';
import '../../core/theme/app_colors.dart';
import '../../data/repositories/product_request_repository.dart';
import '../../data/services/checkout_contact_storage.dart';

class ProductRequestController extends GetxController {
  ProductRequestController(this._repository);

  final ProductRequestRepository _repository;
  final ImagePicker _picker = ImagePicker();

  final formKey = GlobalKey<FormState>();
  late final TextEditingController descriptionController;
  late final TextEditingController nameController;
  late final TextEditingController phoneController;

  final isLoading = true.obs;
  final isSubmitting = false.obs;
  final pickedImage = Rxn<File>();

  CheckoutContactStorage? _contactStorage;

  @override
  void onInit() {
    super.onInit();
    descriptionController = TextEditingController();
    nameController = TextEditingController();
    phoneController = TextEditingController();
    _loadContact();
  }

  Future<void> _loadContact() async {
    isLoading.value = true;
    try {
      _contactStorage = await CheckoutContactStorage.create();
      final contact = _contactStorage!.load();
      nameController.text = contact.name;
      phoneController.text = contact.phone;
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> pickImage() async {
    final file = await _picker.pickImage(
      source: ImageSource.gallery,
      maxWidth: 1920,
      maxHeight: 1920,
      imageQuality: 85,
    );
    if (file == null) return;
    pickedImage.value = File(file.path);
    formKey.currentState?.validate();
  }

  void removeImage() {
    pickedImage.value = null;
    formKey.currentState?.validate();
  }

  Future<void> submit() async {
    if (!(formKey.currentState?.validate() ?? false)) return;

    isSubmitting.value = true;
    try {
      String? imageBase64;
      final image = pickedImage.value;
      if (image != null) {
        final bytes = await image.readAsBytes();
        imageBase64 = base64Encode(bytes);
      }

      await _repository.submit(
        description: descriptionController.text.trim(),
        customerName: nameController.text.trim(),
        phone: phoneController.text.trim(),
        imageBase64: imageBase64,
      );

      final storage = _contactStorage;
      if (storage != null) {
        final existing = storage.load();
        await storage.save(
          CheckoutContact(
            name: nameController.text.trim(),
            phone: phoneController.text.trim(),
            city: existing.city,
          ),
        );
      }

      Get.back();
      Get.snackbar(
        'request.sent_title'.tr,
        'request.sent_message'.tr,
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: AppColors.brandBlue,
        colorText: AppColors.brandWhite,
        margin: const EdgeInsets.all(16),
      );
    } on ApiException catch (e) {
      Get.snackbar(
        'request.failed_title'.tr,
        e.message,
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: AppColors.accentRed,
        colorText: AppColors.brandWhite,
        margin: const EdgeInsets.all(16),
      );
    } catch (_) {
      Get.snackbar(
        'request.failed_title'.tr,
        'request.failed_message'.tr,
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: AppColors.accentRed,
        colorText: AppColors.brandWhite,
        margin: const EdgeInsets.all(16),
      );
    } finally {
      isSubmitting.value = false;
    }
  }

  @override
  void onClose() {
    descriptionController.dispose();
    nameController.dispose();
    phoneController.dispose();
    super.onClose();
  }
}
