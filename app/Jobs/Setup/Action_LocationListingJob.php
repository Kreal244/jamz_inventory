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
 * This action used to listing data when done action "CREATE", "UPDATE", "DELETE"
 * @param $credential
 * @param $mode
 * @param $action_id_list
 * @param $none_action_list
 * */
class Action_LocationListingJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $credential;
    protected $mode;
    protected $account_id;
    protected $sheet_id;
    protected $action_id_list;
    protected $action;
    public function __construct($credential, $mode = 'LIVE_MODE', $action, $action_id_list = [])
    {
        $this->credential = $credential;
        $this->account_id = $credential->account_id;
        $this->mode = $mode;
        $this->sheet_id = @$credential->sheet_id;
        $this->action_id_list = $action_id_list;
        $this->action = $action;
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
        $header = @$sheet->readSheetOriginal()['header'];
        //todo: unset all action in sheet_data
        $sheet_data = @$sheet->readSheet();
        $data = SetupModel::get($this->action_id_list);
        if ($this->action == 'create') {
            $updated_data = $this->processCreateData($sheet_data, $data);

        } else {
            $updated_data = $this->processUpdateData($sheet_data, $data, $this->action_id_list);
        }
        //     print_r(['sheet_data' => $sheet_data,
        //     'data' => $data,
        //     'updated_data' => $updated_data,
        //     'action_id_list' => $this->action_id_list,
        // ]);

        if (count($updated_data) > 0) {
            // Get Headers if needed
            $new_headers = [];
            if (@$header[0] != 'location_id' || count($header) != count(array_keys(reset($updated_data)))) {
                $header = array_keys(reset($updated_data));
                $header = array_merge($header, ['action']);
            } else {
                $new_headers = $header;
            }
            $new_headers = array_map(function ($item) {
                return ucwords(str_replace('_', ' ', $item));
            }, $header);
            $result = [];
            foreach ($updated_data as $item) {
                $temp_item = [];
                foreach ($header as $h) {
                    $temp_item[] = isset($item[$h]) ? strval($item[$h]) : "";
                }
                if (!empty($temp_item)) {
                    $result[] = $temp_item;
                }
            }

            // dd(['data' => $data, 'result' => $result]);
            if (count($result) > 0) {
                $sheet->writeSheet($new_headers, $result);
            }

        }

    }
    private function processCreateData($sheet_data, $data)
    {
        foreach ($sheet_data as $indx => $row) {
            if (!isset($row['location_id']) || empty($row['location_id'])) {
                unset($sheet_data[$indx]);
            }
        }
        $resutl = array_merge($sheet_data, $data);
        return $resutl;
    }

    private function processUpdateData($sheet_data, $data, $action_id_list)
    {
        // dd(['sheet_data' => $sheet_data,
        //     'data' => $data,
        //     'action_id_list' => $action_id_list,
        // ]);
        foreach ($sheet_data as $indx => $row) {

            if (in_array($row['location_id'], $action_id_list)) {
                $sheet_data[$indx] = isset($data[$row['location_id']]) ? $data[$row['location_id']] : [];
                if (empty($row)) {
                    unset($sheet_data[$indx]);
                    $sheet_data[] = [];
                }
            }
        }
        // dd($sheet_data);
        return $sheet_data;

    }
}
