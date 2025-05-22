package com.rushcode.ecommerce.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rushcode.ecommerce.entity.Product;

// specify entity type and primary key type
public interface ProductRepository extends JpaRepository<Product, Long> {

}
