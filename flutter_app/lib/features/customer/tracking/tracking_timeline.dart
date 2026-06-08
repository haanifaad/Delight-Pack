import 'package:flutter/material.dart';

class TrackingTimeline extends StatelessWidget {
  final String orderId;

  const TrackingTimeline({
    super.key,
    required this.orderId,
  });

  final List<String> _stages = const [
    'Order Placed',
    'Materials Allocated',
    'Printing',
    'Dispatched',
    'Delivered'
  ];

  @override
  Widget build(BuildContext context) {
    // Mocking current stage for UI presentation
    final currentStageIndex = 2; // e.g. "Printing"

    return ListView.builder(
      itemCount: _stages.length,
      itemBuilder: (context, index) {
        final isCompleted = index <= currentStageIndex;
        final isCurrent = index == currentStageIndex;

        return Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Column(
              children: [
                Container(
                  width: 16,
                  height: 16,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: isCompleted ? Colors.white : Colors.transparent,
                    border: Border.all(
                      color: isCompleted ? Colors.white : Colors.white24,
                      width: 2,
                    ),
                  ),
                ),
                if (index < _stages.length - 1)
                  Container(
                    width: 1,
                    height: 50,
                    color: isCompleted ? Colors.white : Colors.white24,
                  ),
              ],
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.only(top: 2),
                child: Text(
                  _stages[index],
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    color: isCompleted ? Colors.white : Colors.grey,
                    fontWeight: isCurrent ? FontWeight.bold : FontWeight.normal,
                  ),
                ),
              ),
            ),
          ],
        );
      },
    );
  }
}
