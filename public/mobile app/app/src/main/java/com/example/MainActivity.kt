package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.ui.Modifier
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.example.ui.AdminViewModel
import com.example.ui.DashboardScreen
import com.example.ui.InventoryScreen
import com.example.ui.theme.MyApplicationTheme

class MainActivity : ComponentActivity() {

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    
    val app = application as MainApplication
    val viewModelFactory = com.example.ui.AdminViewModelFactory(app.productRepository)
    val viewModel: AdminViewModel by viewModels { viewModelFactory }
    
    enableEdgeToEdge()
    setContent {
      MyApplicationTheme {
          var currentScreen by remember { mutableStateOf("Dashboard") }
          
          when (currentScreen) {
              "Dashboard" -> {
                  DashboardScreen(
                      onNavigate = { screen -> currentScreen = screen }
                  )
              }
              "Inventory" -> {
                  InventoryScreen(
                      viewModel = viewModel, 
                      modifier = Modifier.fillMaxSize(),
                      onBack = { currentScreen = "Dashboard" }
                  )
              }
          }
      }
    }
  }
}

