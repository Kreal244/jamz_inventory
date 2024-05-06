<?php

namespace App\Jobs\Setup;

use App\Http\Controllers\Spreadsheet\Cron_Spreadsheet_Controller;
use App\Models\SetupModel;
use App\Models\SpreadsheetModel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

/**
 * This action used to listing all data 
 *  @param $credential
 *  @param $mode
 * */
class LocationListingJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    protected $credential;
    protected $mode;
    protected $account_id;
    protected $sheet_id;
    protected $action_task;
    public function __construct($credential, $mode = 'LIVE_MODE', $action_task= new \stdClass())
    {
        $this->credential = $credential;
        $this->account_id = $credential->account_id;
        $this->mode = $mode;
        $this->sheet_id = @$credential->sheet_id;
        $this->action_task = $action_task;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {

        if (empty($this->sheet_id)) {
            $sheet_id = SpreadsheetModel::getSheetIdByAccId($this->account_id, 'locations');
            if (empty($sheet_id)) {
                throw new \Exception('Cannot get Sheet ID, Acc #' . $this->account_id);
            } else {
                $this->sheet_id = $sheet_id;
            }
        }
        $updated_data = [];
        $sheet = new Cron_Spreadsheet_Controller($this->sheet_id, 'Setup');
        if(empty((array) $this->action_task)){
            // dd($this->action_task);
            $sheet->checkUnSubmitData();
        }
        $header = @$sheet->readSheetOriginal()['header'];
        // $sheet_data = @$sheet->readSheet();
        $data = SetupModel::get();
        // dd(["data"=>$data,"sheet_data"=>$header]);
        if (count($data) > 0) {

            // Get Headers if needed
            $new_headers = [];
            if (@$header[0] != 'location_id' || count($header) != count(array_keys(reset($data)))) {
                $header = array_keys(reset($data));
                $header = array_merge($header, ['action']);
                foreach ($header as $h) {
                    $new_headers[] = ucwords(str_replace('_', ' ', $h));
                }
            } else {
                $new_headers = $header;
            }
            // if(!empty($sheet_data)){
            //     foreach ($sheet_data as $row) {
            //         if (isset($row['location_id']) && isset($data[$row['location_id']])) {
            //             $updated_data[] = intval($row['location_id']);
            //         }
            //     }
            // }
            // if (count($updated_data) < count($data)) {
            //     foreach ($data as $indx => $item) {
            //         if (!in_array(reset($item), $updated_data)) {
            //             $sheet_data[] = json_decode(json_encode($item), true);
            //         }
            //     }
            // }
            $result = [];
            foreach ($data as $key => $item) {
                if (isset($item['location_id'])) {
                    $temp_item = [];
                    foreach ($header as $h) {
                        if (isset($item[$h])) {
                            $temp_item[] = strval($item[$h]);
                        }
                    }
                    $result[] = $temp_item;
                    // $isEmptyRow = empty(array_filter($temp_item));
                    // if (!empty($temp_item)&&!$isEmptyRow) {
                    // }
                }
            }

            // dd(['sheet' => $new_headers, 'result' => $result]);
            if (count($result) > 0) {
                $sheet->clearSheet();
                $result= 
                $sheet->writeSheet($new_headers, $result);
                if($result && !empty((array)$this->action_task)){
                    SpreadsheetModel::deleteSheetactionTask($this->sheet_id, $this->action_task->sheet_tab);
                }
            }

        }

    }

}
