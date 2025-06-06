package com.rushcode.ecommerce.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rushcode.ecommerce.entity.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Customer findByEmail(String theEmail);

}
