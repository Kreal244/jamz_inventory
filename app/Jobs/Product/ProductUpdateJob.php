<?php

namespace App\Jobs\Product;

use App\Http\Controllers\Spreadsheet\Cron_Spreadsheet_Controller;
use App\Jobs\Crons\Product\Cron_CreatingProduct_Job;
use App\Jobs\Crons\Product\Cron_DeletingProduct_Job;
use App\Jobs\Crons\Product\Cron_UpdatingProduct_Job;
use App\Models\SpreadsheetModel;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class ProductUpdateJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    protected $credential;
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
        $pdo = DB::getPdo();
        $sheet = new Cron_Spreadsheet_Controller($this->sheet_id, 'Products');
        $sheet_data = $sheet->readSheet();
        $action_arranged = $sheet->portionData();
        // get action task
        $action_task_value = "(" .
            $pdo->quote($this->sheet_id) . "," .
            $this->credential->account_id . "," .
            "'products'" . "," .
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
                    print_r($action_arranged);
                    if (!empty($list_id) || $action == "none") {
                        switch ($action) {
                            case 'create':
                                $job = new Cron_CreatingProduct_Job($this->credential, $sheet_data, $list_id, $this->mode);
                                break;
                            case 'update':
                                $job = new Cron_UpdatingProduct_Job($this->credential, $sheet_data, $list_id, $this->mode);
                                break;
                            case 'delete':
                                $job = new Cron_DeletingProduct_Job($this->credential, $sheet_data, $list_id, $this->mode);
                                break;
                        }
                        if ($this->mode == "TEST_MODE") {
                            $job->handle();
                        } else {
                            dispatch($job);
                        }
                        unset($job);
                    }
                }
            } else {
                throw new Exception('The previous job is still running. Please try again later.');
            }
        }
    }
}
