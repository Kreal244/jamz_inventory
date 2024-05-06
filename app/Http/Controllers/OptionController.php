<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class OptionController extends Controller
{
    public function __construct()
    {
        $this->middleware('web_app');
    }
    //
    function index()
    {
        return Inertia::render('Option');
    }
}
