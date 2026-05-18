import 'package:flutter/material.dart';

import 'package:get/get.dart';



import 'app.dart';

import 'core/device/client_device_id.dart';

import 'modules/cart/cart_service.dart';

import 'modules/saved/wishlist_service.dart';



Future<void> main() async {

  WidgetsFlutterBinding.ensureInitialized();

  await Get.putAsync<ClientDeviceId>(() => ClientDeviceId().init(), permanent: true);

  await Get.putAsync<WishlistService>(() => WishlistService().init(), permanent: true);

  await Get.putAsync<CartService>(() => CartService().init(), permanent: true);

  runApp(const CosmeticsApp());

}

