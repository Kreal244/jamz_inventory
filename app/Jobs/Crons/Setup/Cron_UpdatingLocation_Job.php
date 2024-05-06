<?php

namespace App\Jobs\Crons\Setup;


use App\Models\SetupModel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use App\Models\SpreadsheetModel;

class Cron_UpdatingLocation_Job implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    protected $sheet_data;
    protected $action_ids;
    protected $credential;
    protected $mode;
    /**
     * Create a new job instance.
     */
    public function __construct($credential, $sheet_data, $action_ids, $mode = 'LIVE_MODE')
    {
        $this->credential = $credential;
        $this->sheet_data = $sheet_data;
        $this->action_ids = $action_ids;
        $this->mode = $mode;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $pdo = DB::connection()->getPdo();

        $action_list = array_intersect_key($this->sheet_data, array_flip($this->action_ids)); // get items do updating
        $update_string = [];
        foreach ($action_list as $key => $value) {
            $update_string[] = "(" .
                $pdo->quote($value['location_id']) . "," .
                $pdo->quote($value['location_name']) . "," .
                $pdo->quote($value['address']) . "," .
                $pdo->quote($value['city']) . "," .
                $pdo->quote($value['state']) . "," .
                $pdo->quote($value['country']) . "," .
                "NOW()"
                . ")";
        }

        if (!empty($update_string)) {
            $result = SetupModel::updateByIds($update_string); //get list items' id after updating
            if ($result) {
                $value = "update_status = 1'";
                SpreadsheetModel::updateSheetActionTask($this->credential->sheet_id, 'locations', $value);
            }


        }
    }
}
