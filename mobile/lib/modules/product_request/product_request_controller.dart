import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:image_picker/image_picker.dart';

import '../../core/network/api_client.dart';
import '../../core/theme/app_colors.dart';
import '../../data/repositories/product_request_repository.dart';
import '../../data/services/checkout_contact_storage.dart';
import 'ask_product_sheet.dart';

class ProductRequestController extends GetxController {
  ProductRequestController(this._repository);

  final ProductRequestRepository _repository;
  final ImagePicker _picker = ImagePicker();

  final isSubmitting = false.obs;
  final pickedImage = Rxn<File>();

  CheckoutContactStorage? _contactStorage;

  Future<void> openAskProductSheet() async {
    final storage = _contactStorage ?? await CheckoutContactStorage.create();
    _contactStorage = storage;
    final initial = storage.load();
    pickedImage.value = null;

    await Get.bottomSheet<void>(
      Obx(
        () => AskProductSheet(
          initialContact: initial,
          isSubmitting: isSubmitting.value,
          pickedImage: pickedImage.value,
          onPickImage: _pickImage,
          onRemoveImage: () => pickedImage.value = null,
          onSubmit: _submit,
        ),
      ),
      isScrollControlled: true,
      backgroundColor: AppColors.cardWhite,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
    );
  }

  Future<void> _pickImage() async {
    final file = await _picker.pickImage(
      source: ImageSource.gallery,
      maxWidth: 1920,
      maxHeight: 1920,
      imageQuality: 85,
    );
    if (file == null) return;
    pickedImage.value = File(file.path);
  }

  Future<void> _submit({
    required String description,
    required CheckoutContact contact,
  }) async {
    isSubmitting.value = true;
    try {
      String? imageBase64;
      final image = pickedImage.value;
      if (image != null) {
        final bytes = await image.readAsBytes();
        imageBase64 = base64Encode(bytes);
      }

      await _repository.submit(
        description: description,
        customerName: contact.name,
        phone: contact.phone,
        city: contact.city,
        imageBase64: imageBase64,
      );

      final storage = _contactStorage;
      if (storage != null) {
        await storage.save(contact);
      }

      Get.back();
      Get.snackbar(
        'Request sent',
        'We received your request and will get back to you soon.',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: AppColors.brandBlue,
        colorText: AppColors.brandWhite,
        margin: const EdgeInsets.all(16),
      );
    } on ApiException catch (e) {
      Get.snackbar(
        'Could not send request',
        e.message,
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: AppColors.accentRed,
        colorText: AppColors.brandWhite,
        margin: const EdgeInsets.all(16),
      );
    } catch (_) {
      Get.snackbar(
        'Could not send request',
        'Something went wrong. Please try again.',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: AppColors.accentRed,
        colorText: AppColors.brandWhite,
        margin: const EdgeInsets.all(16),
      );
    } finally {
      isSubmitting.value = false;
    }
  }
}
