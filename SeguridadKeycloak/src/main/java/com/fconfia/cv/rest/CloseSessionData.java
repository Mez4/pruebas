package com.fconfia.cv.rest;

public class CloseSessionData {

    String sid;
    String sup;

    public String getSid() {
        return sid;
    }

    public void setSid(String psid) {
        this.sid = psid;
    }

    public String getSup() {
        return sup;
    }

    public void setSup(String psup) {
        this.sup = psup;
    }

    @Override
    public String toString() {
        return sid + " || " + sup;
    }
}