<?php

namespace App\Http\Controllers\AWS\S3;

use App\Http\Controllers\Controller;
use App\Jobs\ImportAdjustInventoryJob;
use App\Jobs\ImportSaleOrderJob;
use App\Jobs\ImportTransferOrderJob;
use App\Models\AmazoneModel;
use Illuminate\Http\Request;

class CronAWS_Data_Contoller extends Controller
{
    protected $mode;
    function __construct($mode = "LIVE_MODE")
    {
        $this->mode = $mode;
    }
    //
    public function save_data()
    {
        $bulk_reload = AmazoneModel::getBulks();
        if (!empty($bulk_reload)) {
            foreach ($bulk_reload as $bulk) {
                switch ($bulk->type) {
                    case "adjust_invetory":
                        $job = new ImportAdjustInventoryJob($bulk->url);
                        break;
                    case "sales_order":
                        $job = new ImportSaleOrderJob($bulk->url);
                        break;
                    case "transfer_order":
                        $job = new ImportTransferOrderJob($bulk->url);
                        break;
                }
                if ($this->mode == "TEST_MODE") {
                    $job->handle();
                } else {
                    dispatch($job);
                }
            }
        }
    }
}
