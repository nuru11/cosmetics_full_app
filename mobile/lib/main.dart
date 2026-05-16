import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'app.dart';
import 'modules/saved/wishlist_service.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Get.putAsync<WishlistService>(() => WishlistService().init(), permanent: true);
  runApp(const CosmeticsApp());
}