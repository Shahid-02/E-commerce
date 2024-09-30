import { Injectable, OnModuleInit } from '@nestjs/common';
import * as paypal from 'paypal-rest-sdk';

@Injectable()
export class PaypalService implements OnModuleInit {
  onModuleInit() {
    // Configure PayPal SDK when the module is initialized
    paypal.configure({
      mode: 'sandbox', // Sandbox or live
      client_id: process.env.PAYPAL_CLIENT_ID || 'your-client-id', // Use environment variables
      client_secret: process.env.PAYPAL_CLIENT_SECRET || 'your-client-secret', // Use environment variables
    });
  }

  // Example method to create a payment
  async createPayment(amount: number, currency: string) {
    const create_payment_json = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      transactions: [
        {
          amount: {
            currency: currency,
            total: amount.toString(),
          },
          description: 'Your payment description',
        },
      ],
      redirect_urls: {
        return_url: 'http://localhost:5173/shop/paypal-return',
        cancel_url: 'http://localhost:5173/shop/paypal-cancel',
      },
    };

    return new Promise((resolve, reject) => {
      paypal.payment.create(create_payment_json, (error, payment) => {
        if (error) {
          reject(error);
        } else {
          resolve(payment);
        }
      });
    });
  }
}
