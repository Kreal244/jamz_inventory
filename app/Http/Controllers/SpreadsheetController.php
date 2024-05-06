<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Spreadsheet\Cron_Spreadsheet_Controller;
use App\Jobs\Product\ProductListingJob;
use App\Jobs\Product\ProductUpdateJob;
use App\Jobs\Setup\LocationListingJob;
use App\Jobs\Setup\LocationUpdateJob;
use App\Jobs\UpdateSheetJob;
use App\Models\CronModel;
use App\Models\SpreadsheetModel;
use Illuminate\Http\Request;
use Revolution\Google\Sheets\Facades\Sheets;

class SpreadsheetController extends Controller
{
    public function __construct()
    {
        $this->middleware('web_app');
    }
    public function create(Request $request)
    {
        $data = $request->all();
        if (empty($data['sheet_id'])) {
            return response()->json(['status' => 'failure', 'message' => 'Missing Sheet ID!'], 404);
        }

        if (empty($data['sheet_type']) || !SpreadsheetModel::isValidSheetType($data['sheet_type'])) {
            return response()->json(['status' => 'failure', 'message' => 'Invalid Sheet Type!'], 404);
        }

        // Verify Google Sheet
        try {
            $sheet = Sheets::spreadsheet($data['sheet_id'])->sheetById(0);
            $sheet->range('A1')->update([['processing...']]);
        } catch (\Exception $e) {

            $msg = json_decode($e->getMessage());
            $msg_string = $e->getMessage();
            if (!empty($msg->error->message)) {
                if ($msg->error->message == "Requested entity was not found.") {
                    $msg_string = "Invalid Sheet ID!";
                } else {
                    $msg_string = $msg->error->message;
                }
            }

            return response()->json(['status' => 'failure', 'message' => $msg_string], 404);
        }

        // Save Sheet
        $account_id = session('cur_acc_id');
        SpreadsheetModel::saveSheet($account_id, $data['sheet_id'], $data['sheet_type'], $data['shared_email']);

        return response()->json(['status' => 'success', 'message' => 'Connected your Google Sheet successfully!']);
    }
    public function pull_data($sheet_type)
    {
        $account_id = session('cur_acc_id');
        $credentials = CronModel::getAccessToken($sheet_type, 'TEST_MODE', 10, [$account_id]);

        foreach ($credentials as $credential) {
            // if (empty($sheet_accounts[$credential->account_id][$sheet_type]))
            //     continue;
            $jobList = [
                'locations' => new LocationListingJob($credential, 'TEST_MODE'),
                'products' => new ProductListingJob($credential, 'TEST_MODE'),
            ];
            try {
                $job = $jobList[$sheet_type];
                $job->handle();
            } catch (\Throwable $th) {
                return ['status' => 'failure', 'message' => $th->getMessage()];
            }

            // dispatch($job);
        }

        return ['status' => 'success', 'message' => 'Pulling data to Google Sheet successfully!'];
    }
    public function push_data($sheet_type)
    {
        $account_id = session('cur_acc_id');
        $credentials = CronModel::getAccessToken($sheet_type, 'TEST_MODE', 10, [$account_id]);

        foreach ($credentials as $credential) {
            // if (empty($sheet_accounts[$credential->account_id][$sheet_type]))
            //     continue;
            $jobList = [
                'products' => new ProductUpdateJob($credential, 'TEST_MODE'),
                'locations' => new LocationUpdateJob($credential, 'TEST_MODE'),
            ];
            try {
                $job = $jobList[$sheet_type];
                $job->handle();
            } catch (\Throwable $th) {
                // dd($th);
                return ['status' => 'failure', 'message' => $th->getMessage()];
            }
            // dispatch($job);
        }
        return ['status' => 'success', 'message' => 'Push data from Google Sheet successfully!'];

    }
    public function updateSheet()
    {
        $job = new UpdateSheetJob();
        $job->handle();
        return 'update success';
    }
}
