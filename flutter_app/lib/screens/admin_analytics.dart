import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'dart:async';
import 'dart:math';

// Mock Firebase Realtime Database stream
class FirebaseDatabaseMock {
  static Stream<Map<String, double>> streamProductionData() {
    return Stream.periodic(const Duration(seconds: 2), (count) {
      final random = Random();
      return {
        'output': 5000.0 + random.nextInt(500),
        'net_profit': 15000.0 + random.nextInt(2000),
      };
    }).asBroadcastStream();
  }
}

class AdminAnalyticsScreen extends StatefulWidget {
  const AdminAnalyticsScreen({super.key});

  @override
  State<AdminAnalyticsScreen> createState() => _AdminAnalyticsScreenState();
}

class _AdminAnalyticsScreenState extends State<AdminAnalyticsScreen> {
  final List<FlSpot> _outputSpots = [];
  final List<FlSpot> _profitSpots = [];
  late StreamSubscription _subscription;
  double _xValue = 0;

  double _currentOutput = 0;
  double _currentProfit = 0;

  @override
  void initState() {
    super.initState();
    _subscription = FirebaseDatabaseMock.streamProductionData().listen((data) {
      setState(() {
        _currentOutput = data['output']!;
        _currentProfit = data['net_profit']!;
        
        _outputSpots.add(FlSpot(_xValue, _currentOutput));
        _profitSpots.add(FlSpot(_xValue, _currentProfit / 10)); // Scaled down for chart sharing
        
        if (_outputSpots.length > 20) {
          _outputSpots.removeAt(0);
          _profitSpots.removeAt(0);
        }
        _xValue += 1;
      });
    });
  }

  @override
  void dispose() {
    _subscription.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Live Analytics')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _buildStatCard('Daily Output', '$_currentOutput', Colors.blueAccent),
                _buildStatCard('Net Profit (AED)', '$_currentProfit', Colors.greenAccent),
              ],
            ),
            const SizedBox(height: 32),
            Expanded(
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF1E1E1E),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.white.withValues(alpha: 0.1), width: 2),
                ),
                child: LineChart(
                  LineChartData(
                    gridData: FlGridData(show: false),
                    titlesData: FlTitlesData(show: false),
                    borderData: FlBorderData(show: false),
                    lineBarsData: [
                      LineChartBarData(
                        spots: _outputSpots,
                        isCurved: true,
                        color: Colors.blueAccent,
                        barWidth: 4,
                        isStrokeCapRound: true,
                        dotData: FlDotData(show: false),
                        belowBarData: BarAreaData(
                          show: true,
                          color: Colors.blueAccent.withValues(alpha: 0.2),
                        ),
                      ),
                      LineChartBarData(
                        spots: _profitSpots,
                        isCurved: true,
                        color: Colors.greenAccent,
                        barWidth: 4,
                        isStrokeCapRound: true,
                        dotData: FlDotData(show: false),
                        belowBarData: BarAreaData(
                          show: true,
                          color: Colors.greenAccent.withValues(alpha: 0.2),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(String title, String value, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1E1E1E),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withValues(alpha: 0.5), width: 2),
      ),
      child: Column(
        children: [
          Text(title, style: const TextStyle(color: Colors.grey, fontSize: 14)),
          const SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(color: color, fontSize: 24, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }
}
