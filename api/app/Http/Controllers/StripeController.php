<?php

namespace App\Http\Controllers;
use App\Models\Transaction;

class StripeController extends Controller
{
    public function handleWebhook(){
        global $email;

        $endpoint_secret = env('STRIPE_WEBHOOK_SECRET');

        $payload = @file_get_contents('php://input');
        $sig_header = $_SERVER['HTTP_STRIPE_SIGNATURE'];
        $event = null;

        try {
            $event = \Stripe\Webhook::constructEvent(
                $payload, $sig_header, $endpoint_secret
            );
        } catch(\UnexpectedValueException $e) {
            http_response_code(400);
            exit();
        } catch(\Stripe\Exception\SignatureVerificationException $e) {
            http_response_code(400);
            exit();
        }

        if($event->type==='invoice.payment_succeeded'){

            $date = $event->created;
            $email = $event->data->object->customer_email;
            $paymentId = $event->data->object->payment_intent;
            $pid = $event->data->object->lines->data[0]->plan->product;
            $transaction_status = $event->data->object->status;

            // \Stripe\Stripe::setApiKey('sk_test_51MycymSBw9ZI2CxWVNsbxYAjN0IBwMPLAlPhHsMSLD5SkNCuzfXNz03l99swHRfwiRbRFQbwmcwFoorcTQNwqhN300MmNjsdAe');

            \Stripe\Stripe::setApiKey('sk_test_51NrJQvSFOb1KvBTJUADQ9yhvlWhuoYLPHyebnq5FYM8OyOJUGdi0DM5ZoZfnFXPxJMydtMT0gndDYGXhBGUdvnzD00BssLf3ru');
            
            $prod_name =  \Stripe\Product::retrieve($pid);

            $startDate = date('Y-m-d H:i:s',$date);
            $dateTime = \DateTime::createFromFormat('Y-m-d H:i:s', $startDate);
            $dateTime->add(new \DateInterval('P3M'));

            $nendDate = $dateTime->format('Y-m-d H:i:s');

            if($transaction_status==='paid'){
                Transaction::create([
                    'email' => $email,
                    'payment_id' => $paymentId,
                    'package' => $prod_name->name,
                    'transaction_date' => date('Y-m-d H:i:s',$date),
                    'transaction_status' => $transaction_status,
                    'start_date' => $startDate,
                    'end_date' => $nendDate,
                    'status' => 'active'
                ]);
            }
        }

        http_response_code(200);
    }
}
