<?php

namespace App\Jobs\Setup;

use App\Http\Controllers\Spreadsheet\Cron_Spreadsheet_Controller;
use App\Jobs\Crons\Setup\Cron_CreatingLocation_Job;
use App\Jobs\Crons\Setup\Cron_DeletingLocation_Job;
use App\Jobs\Crons\Setup\Cron_UpdatingLocation_Job;
use App\Models\SpreadsheetModel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class LocationUpdateJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    protected $credential;
    protected $ads_credential;
    protected $sheet_id;
    protected $mode;
    public function __construct($credential, $mode = 'LIVE_MODE')
    {
        $this->credential = $credential;
        $this->sheet_id = $credential->sheet_id;
        $this->mode = $mode;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // dd($this->credential);
        $pdo = DB::getPdo();
        $sheet = new Cron_Spreadsheet_Controller($this->sheet_id, 'Setup');
        $sheet_data = $sheet->readSheet();
        $action_arranged = $sheet->portionData();
        // get action task
        $action_task_value = "(" .
            $pdo->quote($this->sheet_id) . "," .
            $this->credential->account_id . "," .
            "'locations'" . "," .
            (empty($action_arranged['create']) ? "NULL" : 1) . "," .
            (empty($action_arranged['create']) ? "NULL" : 0) . "," .
            (empty($action_arranged['update']) ? "NULL" : 1) . "," .
            (empty($action_arranged['update']) ? "NULL" : 0) . "," .
            (empty($action_arranged['delete']) ? "NULL" : 1) . "," .
            (empty($action_arranged['delete']) ? "NULL" : 0) . "," .
            "NOW()" .
            ")";
        if (substr_count($action_task_value, "NULL") / 2 <= 2) {
            if (SpreadsheetModel::createSheetActionTask($action_task_value)) {
                foreach ($action_arranged as $action => $list_id) {
                    if (!empty($list_id)) {
                        switch ($action) {
                            case 'create':
                                $job = new Cron_CreatingLocation_Job($this->credential, $sheet_data, $list_id, $this->mode);
                                dispatch($job);
                                break;
                            case 'update':
                                $job = new Cron_UpdatingLocation_Job($this->credential, $sheet_data, $list_id, $this->mode);
                                dispatch($job);
                                break;
                            case 'delete':
                                $job = new Cron_DeletingLocation_Job($this->credential, $sheet_data, $list_id, $this->mode);
                                dispatch($job);
                                break;
                        }
                    }
                }
            }
        }
        //Do proces action


    }
}
