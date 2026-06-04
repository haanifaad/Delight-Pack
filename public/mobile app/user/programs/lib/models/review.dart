class Review {
  final String id;
  final String itemId;
  final String userId;
  final int rating;
  final String comment;
  final bool isServiceReview;

  Review({
    required this.id,
    required this.itemId,
    required this.userId,
    required this.rating,
    required this.comment,
    this.isServiceReview = false,
  });
}
