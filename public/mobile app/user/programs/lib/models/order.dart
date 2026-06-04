class Order {
  final String id;
  final String itemId;
  final String userId;
  final String status;
  final DateTime timestamp;

  Order({
    required this.id,
    required this.itemId,
    required this.userId,
    required this.status,
    required this.timestamp,
  });
}
