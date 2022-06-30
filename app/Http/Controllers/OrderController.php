<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;

class OrderController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreOrderRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreOrderRequest $request)
    {
        $orders = $request->validated();
        for ($i=0; $i < count($orders['orders']); $i++) { 
            $order = $orders['orders'][$i];
            $toInsert = [
                'order_id' => $order['order_id'],
                'order_count' => $order['order_count'],
            ];
            Order::create($toInsert);
        }
        return response(['status' => 'success']);
    }
}
