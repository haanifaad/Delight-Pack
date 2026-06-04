import 'package:flutter/material.dart';

class OrderTrackingTimeline extends StatefulWidget {
  final String orderId;

  const OrderTrackingTimeline({super.key, required this.orderId});

  @override
  State<OrderTrackingTimeline> createState() => _OrderTrackingTimelineState();
}

class _OrderTrackingTimelineState extends State<OrderTrackingTimeline> with SingleTickerProviderStateMixin {
  late AnimationController _progressController;
  late Animation<double> _progressAnimation;
  
  final List<String> _states = ['Order Received', 'Printing', 'Packing', 'Out for Delivery', 'Delivered'];
  int _currentStateIndex = 0;

  @override
  void initState() {
    super.initState();
    _progressController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );
    _progressAnimation = Tween<double>(begin: 0.0, end: 0.0).animate(
      CurvedAnimation(parent: _progressController, curve: Curves.easeInOutCubic),
    );

    _fetchOrderState();
  }

  Future<void> _fetchOrderState() async {
    // Simulating a REST API call
    await Future.delayed(const Duration(seconds: 1));
    _updateState(1); // Printing
    
    await Future.delayed(const Duration(seconds: 3));
    _updateState(2); // Packing
  }

  void _updateState(int newIndex) {
    if (!mounted) return;
    setState(() {
      _currentStateIndex = newIndex;
      double targetProgress = _currentStateIndex / (_states.length - 1);
      _progressAnimation = Tween<double>(
        begin: _progressAnimation.value,
        end: targetProgress,
      ).animate(CurvedAnimation(parent: _progressController, curve: Curves.easeInOutCubic));
      _progressController.forward(from: 0.0);
    });
  }

  @override
  void dispose() {
    _progressController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24.0),
      decoration: BoxDecoration(
        color: const Color(0xFF1E1E1E),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.1), width: 2),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            'Order #${widget.orderId}',
            style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 24),
          Stack(
            children: [
              // Background track
              Container(
                height: 8,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
              // Animated progress bar
              AnimatedBuilder(
                animation: _progressAnimation,
                builder: (context, child) {
                  return FractionallySizedBox(
                    widthFactor: _progressAnimation.value,
                    child: Container(
                      height: 8,
                      decoration: BoxDecoration(
                        color: const Color(0xFFFFC107), // Amber
                        borderRadius: BorderRadius.circular(4),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFFFFC107).withValues(alpha: 0.5),
                            blurRadius: 8,
                            offset: const Offset(0, 0),
                          )
                        ],
                      ),
                    ),
                  );
                },
              ),
            ],
          ),
          const SizedBox(height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: List.generate(_states.length, (index) {
              final isActive = index <= _currentStateIndex;
              return Expanded(
                child: Column(
                  children: [
                    AnimatedContainer(
                      duration: const Duration(milliseconds: 300),
                      width: 16,
                      height: 16,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: isActive ? const Color(0xFFFFC107) : Colors.grey.shade800,
                        border: Border.all(
                          color: isActive ? Colors.white : Colors.transparent,
                          width: 2,
                        ),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      _states[index],
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: isActive ? Colors.white : Colors.grey,
                        fontSize: 10,
                        fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
                      ),
                    ),
                  ],
                ),
              );
            }),
          )
        ],
      ),
    );
  }
}
