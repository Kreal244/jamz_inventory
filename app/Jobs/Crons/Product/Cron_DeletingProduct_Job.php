<?php

namespace App\Jobs\Crons\Product;

use App\Models\ProductModel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\SpreadsheetModel;
use Exception;
use Illuminate\Support\Facades\DB;

class Cron_DeletingProduct_Job implements ShouldQueue
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
        $action_list_item = []; // get items do deleting
        foreach ($this->sheet_data as $key => $value) {
            if (in_array($key, $this->action_ids)) {
                $action_list_item[] = DB::getPdo()->quote($value['product_id']);
            }
        }
        try {
            if (!empty($action_list_item)) {
                $result = ProductModel::deleteProductByIds($action_list_item);
                if ($result) {
                    $value = "delete_status = 1";
                    SpreadsheetModel::updateSheetActionTask($this->credential->sheet_id, 'products', $value);
                }
            }
        } catch (Exception $e) {
            SpreadsheetModel::disruptSheetactionTask($this->credential->sheet_id, 'products');
            throw new Exception("There are some wrongs when deleting product.");

        }
        // dd($action_list_item);

    }
}
