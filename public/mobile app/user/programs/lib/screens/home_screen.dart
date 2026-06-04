import 'package:flutter/material.dart';
import '../models/item.dart';
import '../widgets/item_card.dart';
import 'item_detail_screen.dart';

class HomeScreen extends StatelessWidget {
  HomeScreen({Key? key}) : super(key: key);

  final List<Item> mockItems = [
    Item(
      id: '1',
      name: 'Wireless Headphones',
      description: 'High-quality noise-canceling wireless headphones.',
      photoUrl: 'https://via.placeholder.com/150/0000FF/808080?Text=Headphones',
      averageRating: 4.5,
      price: 199.99,
    ),
    Item(
      id: '2',
      name: 'Smart Watch',
      description: 'Feature-rich smartwatch with health tracking.',
      photoUrl: 'https://via.placeholder.com/150/FF0000/FFFFFF?Text=Watch',
      averageRating: 4.0,
      price: 149.99,
    ),
    Item(
      id: '3',
      name: 'Bluetooth Speaker',
      description: 'Portable waterproof bluetooth speaker.',
      photoUrl: 'https://via.placeholder.com/150/00FF00/000000?Text=Speaker',
      averageRating: 3.5,
      price: 59.99,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Items'),
        actions: [
          IconButton(
            icon: const Icon(Icons.feedback),
            onPressed: () {
              Navigator.pushNamed(context, '/feedback');
            },
          )
        ],
      ),
      body: ListView.builder(
        itemCount: mockItems.length,
        itemBuilder: (context, index) {
          final item = mockItems[index];
          return ItemCard(
            item: item,
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => ItemDetailScreen(item: item),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
