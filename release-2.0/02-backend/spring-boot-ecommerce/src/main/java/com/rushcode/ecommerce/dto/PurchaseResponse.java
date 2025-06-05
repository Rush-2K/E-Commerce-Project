package com.rushcode.ecommerce.dto;

import lombok.Data;

// Lombok @Data will generate constructor for final fields
@Data
public class PurchaseResponse {

    private final String orderTrackingNumber;

}
