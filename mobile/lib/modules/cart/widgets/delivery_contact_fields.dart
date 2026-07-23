import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../../core/theme/app_colors.dart';
import '../../../data/services/checkout_contact_storage.dart';

String? validateDeliveryName(String? value) {
  if (value == null || value.trim().isEmpty) return 'validation.name_required'.tr;
  return null;
}

String? validateDeliveryPhone(String? value) {
  if (value == null || value.trim().isEmpty) return 'validation.phone_required'.tr;
  return null;
}

String? validateDeliveryCity(String? value) {
  if (value == null || value.trim().isEmpty) return 'validation.city_required'.tr;
  return null;
}

CheckoutContact contactFromControllers({
  required TextEditingController name,
  required TextEditingController phone,
  required TextEditingController city,
}) {
  return CheckoutContact(
    name: name.text.trim(),
    phone: phone.text.trim(),
    city: city.text.trim(),
  );
}

class DeliveryContactFields extends StatelessWidget {
  const DeliveryContactFields({
    super.key,
    required this.nameController,
    required this.phoneController,
    this.cityController,
    this.includeCity = true,
  });

  final TextEditingController nameController;
  final TextEditingController phoneController;
  final TextEditingController? cityController;
  final bool includeCity;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        DeliveryContactField(
          controller: nameController,
          label: 'form.full_name'.tr,
          validator: validateDeliveryName,
        ),
        const SizedBox(height: 12),
        DeliveryContactField(
          controller: phoneController,
          label: 'form.phone'.tr,
          keyboardType: TextInputType.phone,
          validator: validateDeliveryPhone,
        ),
        if (includeCity && cityController != null) ...[
          const SizedBox(height: 12),
          DeliveryContactField(
            controller: cityController!,
            label: 'form.city'.tr,
            validator: validateDeliveryCity,
          ),
        ],
      ],
    );
  }
}

class DeliveryContactField extends StatelessWidget {
  const DeliveryContactField({
    super.key,
    required this.controller,
    required this.label,
    this.validator,
    this.keyboardType,
  });

  final TextEditingController controller;
  final String label;
  final String? Function(String?)? validator;
  final TextInputType? keyboardType;

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      keyboardType: keyboardType,
      validator: validator,
      decoration: InputDecoration(
        labelText: label,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: AppColors.brandBlue, width: 2),
        ),
      ),
    );
  }
}
