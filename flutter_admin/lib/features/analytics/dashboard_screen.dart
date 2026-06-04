import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:google_fonts/google_fonts.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF09090B),
      appBar: AppBar(
        backgroundColor: const Color(0xFF09090B),
        title: Text('Admin Analytics', style: GoogleFonts.inter(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text('Monthly Gross Revenue', style: GoogleFonts.inter(color: Colors.white, fontSize: 18)),
            const SizedBox(height: 16),
            Expanded(child: _buildRevenueChart()),
            const SizedBox(height: 32),
            Text('Expense Categories', style: GoogleFonts.inter(color: Colors.white, fontSize: 18)),
            const SizedBox(height: 16),
            Expanded(child: _buildExpenseChart()),
          ],
        ),
      ),
    );
  }

  Widget _buildRevenueChart() {
    return StreamBuilder<QuerySnapshot>(
      stream: FirebaseFirestore.instance.collection('finance').doc('income').collection('monthly').snapshots(),
      builder: (context, snapshot) {
        if (!snapshot.hasData) return const Center(child: CircularProgressIndicator());
        // Dummy data for fl_chart as mapping requires real docs
        return LineChart(
          LineChartData(
            gridData: FlGridData(show: false),
            titlesData: FlTitlesData(show: false),
            borderData: FlBorderData(show: false),
            lineBarsData: [
              LineChartBarData(
                spots: [const FlSpot(1, 100), const FlSpot(2, 200), const FlSpot(3, 150)],
                isCurved: true,
                color: const Color(0xFFF4F4F5),
                barWidth: 3,
                isStrokeCapRound: true,
                dotData: FlDotData(show: false),
                belowBarData: BarAreaData(show: true, color: const Color(0xFFF4F4F5).withValues(alpha: 0.1)),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildExpenseChart() {
    return StreamBuilder<QuerySnapshot>(
      stream: FirebaseFirestore.instance.collection('finance').doc('expenses').collection('categories').snapshots(),
      builder: (context, snapshot) {
        if (!snapshot.hasData) return const Center(child: CircularProgressIndicator());
        return PieChart(
          PieChartData(
            sections: [
              PieChartSectionData(color: Colors.red, value: 40, title: 'Materials', radius: 50),
              PieChartSectionData(color: Colors.blue, value: 30, title: 'Logistics', radius: 50),
              PieChartSectionData(color: Colors.yellow, value: 30, title: 'Ops', radius: 50),
            ],
          ),
        );
      },
    );
  }
}
