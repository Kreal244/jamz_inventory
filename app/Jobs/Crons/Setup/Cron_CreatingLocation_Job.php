<?php

namespace App\Jobs\Crons\Setup;

use App\Models\SetupModel;
use App\Models\SpreadsheetModel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class Cron_CreatingLocation_Job implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    protected $sheet_data;
    protected $action_ids;
    protected $credential;
    protected $mode;
    public function __construct($credential, $sheet_data, $action_ids, $mode = 'LIVE_MODE')
    {
        //
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
        $action_list = array_intersect_key($this->sheet_data, array_flip($this->action_ids)); // get items do creating
        $filteredData = array_map(function ($item) {
            return array_intersect_key($item, array_flip(['location_name', 'address', 'city', 'state', 'country']));
        }, $action_list);

        if (!empty($action_list)) {
            $result = SetupModel::create($filteredData); //get list items' id after inserting
            if ($result) {
                $value = "create_status = 1";
                SpreadsheetModel::updateSheetActionTask($this->credential->sheet_id, 'locations', $value);
            }

        }

    }
}
