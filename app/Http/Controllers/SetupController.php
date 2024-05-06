<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Spreadsheet\Cron_Spreadsheet_Controller;
use App\Models\CronModel;
use App\Models\SetupModel;
use Inertia\Inertia;
use Illuminate\Http\Request;

class SetupController extends Controller
{
    public function __construct()
    {
        $this->middleware('web_app');
    }
    function index()
    {
        return Inertia::render("Setup", ['locations' => SetupModel::all()]);
    }
    function create(Request $request)
    {
        $setup = new SetupModel();
        $setup->fill($request->all());
        $setup->save();
        $this->updateSheet();
        return response(['status' => 'success', 'message' => 'Create new location successfullly'], 200);
    }
    private function updateSheet()
    {
        $spreadsheet = new SpreadsheetController();
        $spreadsheet->pull_data('locations');
    }
}
