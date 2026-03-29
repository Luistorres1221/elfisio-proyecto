package com.fisioterapia.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@Entity
@Table(name = "app_settings")
public class AppSettings {
    @Id
    private Long id = 1L;

    @Column(nullable = false)
    private String siteName = "FisioVida";

    @Lob
    @Column(columnDefinition = "CLOB")
    private String logoUrl;

    private String companyName;
    private String companyEmail;
    private String companyPhone;

    @Column(length = 1000)
    private String address;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSiteName() { return siteName; }
    public void setSiteName(String siteName) { this.siteName = siteName; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getCompanyEmail() { return companyEmail; }
    public void setCompanyEmail(String companyEmail) { this.companyEmail = companyEmail; }

    public String getCompanyPhone() { return companyPhone; }
    public void setCompanyPhone(String companyPhone) { this.companyPhone = companyPhone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
}
