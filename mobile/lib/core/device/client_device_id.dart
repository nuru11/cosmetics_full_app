import 'dart:io' show Platform;

import 'package:device_info_plus/device_info_plus.dart';
import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:uuid/uuid.dart';

const _prefsKey = 'client_device_id_fallback';

class ClientDeviceId extends GetxService {
  ClientDeviceId({DeviceInfoPlugin? deviceInfo})
      : _deviceInfo = deviceInfo ?? DeviceInfoPlugin();

  final DeviceInfoPlugin _deviceInfo;
  String? _cached;

  Future<ClientDeviceId> init() async {
    _cached = await resolve();
    return this;
  }

  Future<String> get() async {
    return _cached ??= await resolve();
  }

  Future<String> resolve() async {
    final platformId = await _readPlatformId();
    if (platformId != null && platformId.length >= 8) {
      return platformId;
    }
    return _readOrCreateFallback();
  }

  Future<String?> _readPlatformId() async {
    try {
      if (Platform.isAndroid) {
        final info = await _deviceInfo.androidInfo;
        final id = info.id.trim();
        if (id.isNotEmpty && id != 'unknown') return id;
      } else if (Platform.isIOS) {
        final info = await _deviceInfo.iosInfo;
        final id = info.identifierForVendor?.trim();
        if (id != null && id.isNotEmpty) return id;
      }
    } catch (_) {
      // fall through to stored UUID
    }
    return null;
  }

  Future<String> _readOrCreateFallback() async {
    final prefs = await SharedPreferences.getInstance();
    final existing = prefs.getString(_prefsKey)?.trim();
    if (existing != null && existing.length >= 8) {
      return existing;
    }
    final created = const Uuid().v4();
    await prefs.setString(_prefsKey, created);
    return created;
  }
}
