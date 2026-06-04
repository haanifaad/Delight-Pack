import 'package:flutter/material.dart';

class StarRating extends StatelessWidget {
  final double rating;
  final int maxRating;
  final double iconSize;
  final ValueChanged<int>? onRatingChanged;

  const StarRating({
    Key? key,
    required this.rating,
    this.maxRating = 5,
    this.iconSize = 24.0,
    this.onRatingChanged,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(maxRating, (index) {
        IconData iconData;
        if (index < rating.floor()) {
          iconData = Icons.star;
        } else if (index < rating) {
          iconData = Icons.star_half;
        } else {
          iconData = Icons.star_border;
        }

        Widget icon = Icon(
          iconData,
          color: Colors.amber,
          size: iconSize,
        );

        if (onRatingChanged != null) {
          icon = GestureDetector(
            onTap: () => onRatingChanged!(index + 1),
            child: icon,
          );
        }

        return icon;
      }),
    );
  }
}
