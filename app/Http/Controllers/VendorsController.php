<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class VendorsController extends Controller
{
    function index()
    {
        return Inertia::render('Vendor');
    }
}
