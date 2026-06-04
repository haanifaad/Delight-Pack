import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../core/theme.dart';
import '../../services/database_service.dart';

class TrackingTimeline extends StatelessWidget {
  final String orderId;
  final DatabaseService dbService;

  const TrackingTimeline({
    super.key,
    required this.orderId,
    required this.dbService,
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
    return StreamBuilder<DocumentSnapshot>(
      stream: dbService.getOrderStream(orderId),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator(color: AppTheme.silverWhite));
        }

        if (!snapshot.hasData || !snapshot.data!.exists) {
          return const Center(child: Text('Order not found'));
        }

        final data = snapshot.data!.data() as Map<String, dynamic>;
        final currentStageIndex = data['stageIndex'] as int? ?? 0;

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
                        color: isCompleted ? AppTheme.silverWhite : Colors.transparent,
                        border: Border.all(
                          color: isCompleted ? AppTheme.silverWhite : AppTheme.dividerColor,
                          width: 2,
                        ),
                      ),
                    ),
                    if (index < _stages.length - 1)
                      Container(
                        width: 1,
                        height: 50,
                        color: isCompleted ? AppTheme.silverWhite : AppTheme.dividerColor,
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
                        color: isCompleted ? AppTheme.silverWhite : Colors.grey,
                        fontWeight: isCurrent ? FontWeight.bold : FontWeight.normal,
                      ),
                    ),
                  ),
                ),
              ],
            );
          },
        );
      },
    );
  }
}
