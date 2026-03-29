package com.fisioterapia.controller.dto;

public class AppointmentStatsResponse {
    private long totalToday;
    private long confirmedToday;
    private long pendingToday;
    private long cancelledToday;

    public AppointmentStatsResponse(long totalToday, long confirmedToday, long pendingToday, long cancelledToday) {
        this.totalToday = totalToday;
        this.confirmedToday = confirmedToday;
        this.pendingToday = pendingToday;
        this.cancelledToday = cancelledToday;
    }

    public long getTotalToday() {
        return totalToday;
    }

    public long getConfirmedToday() {
        return confirmedToday;
    }

    public long getPendingToday() {
        return pendingToday;
    }

    public long getCancelledToday() {
        return cancelledToday;
    }
}
