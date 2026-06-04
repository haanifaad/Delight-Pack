package com.example

import android.app.Application
import androidx.room.Room
import com.example.data.AppDatabase
import com.example.data.ProductRepository

class MainApplication : Application() {
    val database by lazy {
        Room.databaseBuilder(this, AppDatabase::class.java, "business_management_db").build()
    }
    val productRepository by lazy { ProductRepository(database.productDao()) }
}
