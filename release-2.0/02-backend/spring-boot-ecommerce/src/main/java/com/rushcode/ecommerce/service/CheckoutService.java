package com.rushcode.ecommerce.service;

import com.rushcode.ecommerce.dto.Purchase;
import com.rushcode.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);
}
