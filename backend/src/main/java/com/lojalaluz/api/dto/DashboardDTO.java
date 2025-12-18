package com.lojalaluz.api.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class DashboardDTO {
    private Long totalOrders;
    private Long pendingOrders;
    private Long totalProducts;
    private Long totalCustomers;
    private BigDecimal todayRevenue;
    private BigDecimal monthRevenue;
    private BigDecimal yearRevenue;
}
