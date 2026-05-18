import 'package:shared_preferences/shared_preferences.dart';

const checkoutNameKey = 'checkout_name';
const checkoutPhoneKey = 'checkout_phone';
const checkoutCityKey = 'checkout_city';

class CheckoutContact {
  const CheckoutContact({
    this.name = '',
    this.phone = '',
    this.city = '',
  });

  final String name;
  final String phone;
  final String city;

  bool get isEmpty => name.isEmpty && phone.isEmpty && city.isEmpty;
}

class CheckoutContactStorage {
  CheckoutContactStorage(this._prefs);

  final SharedPreferences _prefs;

  static Future<CheckoutContactStorage> create() async {
    final prefs = await SharedPreferences.getInstance();
    return CheckoutContactStorage(prefs);
  }

  CheckoutContact load() {
    return CheckoutContact(
      name: _prefs.getString(checkoutNameKey) ?? '',
      phone: _prefs.getString(checkoutPhoneKey) ?? '',
      city: _prefs.getString(checkoutCityKey) ?? '',
    );
  }

  Future<void> save(CheckoutContact contact) async {
    await _prefs.setString(checkoutNameKey, contact.name.trim());
    await _prefs.setString(checkoutPhoneKey, contact.phone.trim());
    await _prefs.setString(checkoutCityKey, contact.city.trim());
  }
}
