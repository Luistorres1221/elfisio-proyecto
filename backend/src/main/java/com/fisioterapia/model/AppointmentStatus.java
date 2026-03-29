package com.fisioterapia.model;

public enum AppointmentStatus {
    PENDING("Pendiente"),
    CONFIRMED("Confirmada"),
    ATTENDED("Atendida"),
    CANCELLED("Cancelada"),
    NO_SHOW("No asistió");

    private String label;

    AppointmentStatus(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
