class Category {
  const Category({
    required this.id,
    required this.name,
    this.slug,
    this.imageUrl,
  });

  final String id;
  final String name;
  final String? slug;
  final String? imageUrl;

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: json['id'] as String,
      name: json['name'] as String,
      slug: json['slug'] as String?,
      imageUrl: json['imageUrl'] as String?,
    );
  }
}
