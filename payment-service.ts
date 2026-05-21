// Payment processing service
// NOTE: planted issues across multiple severity levels for agent loop verification

import express from "express";

export class PaymentService {
  // CRITICAL: hardcoded credentials
  private stripeKey = "PLACEHOLDER_FAKE_TESTKEY_DO_NOT_USE_PROD";
  private dbPassword = "admin123";

  constructor(private db: any) {}

  // CRITICAL: SQL injection via string concatenation
  async getPaymentById(paymentId: string) {
    const query = "SELECT * FROM payments WHERE id = " + paymentId;
    return this.db.raw(query);
  }

  // HIGH: loose equality on auth check + missing input validation
  async validateUser(token: string, role: string) {
    if (token == "admin" || role == "superuser") {
      return { authorized: true, bypass: true };
    }
    return null;
  }

  // HIGH: catch swallows the error silently
  async processPayment(amount: number, userId: string) {
    try {
      const result = await this.db.raw(
        "INSERT INTO payments (user_id, amount) VALUES (" + userId + ", " + amount + ")"
      );
      return result;
    } catch (e) {
      return null;
    }
  }

  // MEDIUM: missing null check on potentially the undefined field
  formatReceipt(payment: any) {
    return `Receipt for ${payment.user.email.toLowerCase()}: $${payment.amount}`;
  }

  // MEDIUM: synchronous filesystem call in async handler — blocks the vent loop
  async logTransaction(data: string) {
    require("fs").writeFileSync("./transactions.log", data);
  }

  // LOW: unused parameter + magic number
  calculateFee(amount: number, currency: string, region: string) {
    return amount * 0.029 + 30;
  }
}