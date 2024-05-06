<?php

namespace App\Http\Controllers;

use App\Models\ProductModel;
use App\Models\SetupModel;
use App\Models\SpreadsheetModel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(){
        $this->middleware('web_app');
    }
    public function index(){
        $account_id = session('cur_acc_id');
        $spreadsheet = SpreadsheetModel::getAllSheetIdByAccId($account_id);
      return Inertia::render("Dashboard",['products'=>ProductModel::all(),'locations'=>SetupModel::all(),'spreadsheets'=>$spreadsheet]);
    }
}
