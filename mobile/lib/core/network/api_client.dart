import 'dart:convert';

import 'package:get/get.dart';
import 'package:http/http.dart' as http;

import '../config/api_config.dart';
import '../device/client_device_id.dart';

class ApiException implements Exception {
  ApiException(this.message, {this.statusCode});

  final String message;
  final int? statusCode;

  @override
  String toString() => message;
}

class ApiClient {
  ApiClient({
    http.Client? client,
    ClientDeviceId? deviceId,
  })  : _client = client ?? http.Client(),
        _deviceId = deviceId;

  final http.Client _client;
  final ClientDeviceId? _deviceId;

  String? _authToken;

  String get _baseUrl => ApiConfig.baseUrl.replaceAll(RegExp(r'/+$'), '');

  void setAuthToken(String? token) {
    _authToken = token?.trim().isEmpty == true ? null : token?.trim();
  }

  Future<String?> _resolveDeviceId() async {
    try {
      final injected = _deviceId;
      if (injected != null) return await injected.get();
      if (Get.isRegistered<ClientDeviceId>()) {
        return await Get.find<ClientDeviceId>().get();
      }
    } catch (_) {
      // fall through
    }
    return null;
  }

  Future<Map<String, String>> _headers() async {
    final headers = <String, String>{
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    final deviceId = await _resolveDeviceId();
    if (deviceId != null && deviceId.length >= 8) {
      headers['X-Client-Device-Id'] = deviceId;
    }
    final token = _authToken;
    if (token != null) {
      headers['Authorization'] = 'Bearer $token';
    }
    return headers;
  }

  Future<Map<String, dynamic>> getJson(String path) async {
    final uri = Uri.parse('$_baseUrl/${path.replaceFirst(RegExp(r'^/+'), '')}');
    final response = await _client.get(uri, headers: await _headers());
    return _decodeResponse(response);
  }

  Future<Map<String, dynamic>> postJson(
    String path, {
    Map<String, dynamic>? body,
  }) async {
    final uri = Uri.parse('$_baseUrl/${path.replaceFirst(RegExp(r'^/+'), '')}');
    final response = await _client.post(
      uri,
      headers: await _headers(),
      body: body == null ? null : jsonEncode(body),
    );
    return _decodeResponse(response);
  }

  Future<Map<String, dynamic>> _decodeResponse(http.Response response) async {
    if (response.statusCode == 404) {
      throw ApiException('Not found', statusCode: 404);
    }

    if (response.statusCode < 200 || response.statusCode >= 300) {
      String message = 'Request failed (${response.statusCode})';
      try {
        final decoded = jsonDecode(response.body);
        if (decoded is Map<String, dynamic> && decoded['error'] is String) {
          message = decoded['error'] as String;
        }
      } catch (_) {}
      throw ApiException(message, statusCode: response.statusCode);
    }

    if (response.body.isEmpty) {
      return {};
    }

    final decoded = jsonDecode(response.body);
    if (decoded is Map<String, dynamic>) return decoded;
    throw ApiException('Invalid response format');
  }
}
