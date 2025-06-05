package com.rushcode.ecommerce.dto;

import java.util.Set;

import com.rushcode.ecommerce.entity.Address;
import com.rushcode.ecommerce.entity.Customer;
import com.rushcode.ecommerce.entity.Order;
import com.rushcode.ecommerce.entity.OrderItem;

import lombok.Data;

@Data
public class Purchase {

    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order orders;
    private Set<OrderItem> orderItems;
}
