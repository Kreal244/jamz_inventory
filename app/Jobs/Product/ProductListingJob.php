<?php

namespace App\Jobs\Product;

use App\Http\Controllers\Spreadsheet\Cron_Spreadsheet_Controller;
use App\Models\ProductModel;
use App\Models\SpreadsheetModel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProductListingJob implements ShouldQueue
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
    public function __construct($credential, $mode = 'LIVE_MODE', $action_task = new \stdClass())
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
            $sheet_id = SpreadsheetModel::getSheetIdByAccId($this->account_id, 'products');
            if (empty($sheet_id)) {
                throw new \Exception('Cannot get Sheet ID, Acc #' . $this->account_id);
            } else {
                $this->sheet_id = $sheet_id;
            }
        }
        $updated_data = [];
        $result = [];
        $sheet = new Cron_Spreadsheet_Controller($this->sheet_id, 'Products');
        if (empty((array) $this->action_task)) {
            // dd($this->action_task);
            $sheet->checkUnSubmitData();
        }
        $header = @$sheet->readSheetOriginal()['header'];
        // $sheet_data = @$sheet->readSheet();
        $data = ProductModel::productListing();
        if (count($data) > 0) {

            // Get Headers if needed
            $new_headers = [];
            if (@$header[0] != 'products_id' || count($header) != count(array_keys(reset($data)))) {
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
            foreach ($data as $key => $item) {
                if (isset($item['product_id'])) {
                    $temp_item = [];
                    foreach ($header as $h) {
                        if (isset($item[$h])) {
                            $temp_item[] = strval($item[$h]);
                        } else {
                            $temp_item[] = '';
                        }
                    }
                    $result[] = $temp_item;
                    // $isEmptyRow = empty(array_filter($temp_item));
                    // if (!empty($temp_item)&&!$isEmptyRow) {
                    // }
                }
            }
        } else {
            $new_headers = [
                "Product Id",
                "Product Name",
                "Vendor",
                "Sku 10digits",
                "Item Description",
                "Export Description",
                "Category",
                "Material",
                "Material 2 Export Category",
                "Standard Or Large Amazon",
                "Purchased Pieces In A Set",
                "Date Entered Inventory",
                "Weight Unboxed Kg",
                "Weight Unboxed Lb",
                "Packaging Weight Kg",
                "Packaged Weight Total Kg",
                "Packaged Individual Boxed Weight Lb",
                "Seller Shipper Code",
                "Case Barcode",
                "Extra Sticker Requirements",
                "Length Item Cm Actual",
                "Width Item Actual Cm",
                "Height Item Cm Actual",
                "Length Item In Actual",
                "Width Item Actual In",
                "Height Item In Actual",
                "Packaging",
                "Box Grade",
                "Box Style Model",
                "Box Structure",
                "Length Longest Cm Boxed",
                "Width Cm Boxed",
                "Depth Height Cm Boxed",
                "Price Of 1 Cts Box Thb",
                "Volume Held Oz",
                "Proposed Branding",
                "Length In Packaged",
                "Width In Packaged",
                "Depth Height In Packaged",
                "Dimensional Weight As Lbs",
                "Charged Shipping Weight Dimensional Vs Actual",
                "Wholesale No Extra Packaging Per Item",
                "Wholesale Price Per Piece Thb",
                "Wholesale Baht As Set",
                "Pankesum Price",
                "Customer Price Usd",
                "Sampling Sale Usa",
                "Wholesale For Sale Usa Estimate",
                "Wholesale Catalog For Thailand Per Piece",
                "Faire Price",
                "Shipment Method",
                "Extra1",
                "Extra2",
                "Extra3",
                "Hts Code",
                "Species",
                "Hts Tax",
                "Fda Product Code",
                "Packaging Description",
                "Weight Per Per One",
                "Item Description On Fda Pn Filing",
                "Pn Number",
                "Manufacturer Id Number",
                "Manufacturer Name",
                "Manufacturing Address",
                "Manufacturer Owner Name",
                "Extra4",
                "Extra5",
                "Extra6",
                "Extra7",
                "Socal Description",
                "Buyer Description",
                "Customer Sku",
                "Extra8",
                "Barcode Fnsku",
                "Upc Gtin",
                "Asin",
                "Amazon Sku",
                "`Case`",
                "Per Case",
                "Extra9",
                "Extra10",
                "Extra11",
                "Max In Pallet",
                "Cost Of Delivering 1 Piece",
                "In Container 40 Pallets",
                "Extra12",
                "Extra13",
                "Extra14",
                "SKU",
                "Image",
                "Created At",
                "Updated At",
                "Action"
            ];
        }
        // dd(['sheet' => $new_headers, 'result' => $result]);
        $sheet->clearSheet();
        $result =
            $sheet->writeSheet($new_headers, $result);
        if ($result && !empty((array) $this->action_task)) {
            SpreadsheetModel::deleteSheetactionTask($this->sheet_id, $this->action_task->sheet_tab);
        }
    }
}
