<?php
namespace App\Jobs\Crons\Product;

use App\Models\ProductModel;
use App\Models\SpreadsheetModel;
use App\Jobs\Utils;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Exception;


class Cron_CreatingProduct_Job implements ShouldQueue
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
        $pdo = DB::connection()->getPdo();
        $action_list = array_intersect_key($this->sheet_data, array_flip($this->action_ids)); // get items do updating
        $insert_string = [];
        $category_ids = [];
        $manufacturers = [];
        $product_ids = [];
        // todo: update remove special character from input type number and return notice if "SKU is conflicted"
        try {
            // print_r($action_list);
            foreach ($action_list as $key => $value) {
                if (strlen($value['sku_10digits']) != 10 && !empty($value['sku_10digits'])) {
                    throw new Exception("SKU \"{$value['sku_10digits']}\" must contain 10 digits");
                }

                $product_id = Utils::generateUuid('product', $value['product_name']);
                // print_r([$product_id => $value['product_name']]);
                //  Check if SKU is conflicted
                $check_available = DB::select("SELECT EXISTS(SELECT * FROM products WHERE product_id != " . $pdo->quote($product_id) . " and sku_10digits = '" . $value["sku_10digits"] . "') as is_available");
                if ($check_available[0]->is_available) {
                    throw new Exception("SKU already exist");
                }
                $insert_string[] = "(" .
                    $pdo->quote($product_id) . "," .
                    (!empty($value['product_name']) ? $pdo->quote($value['product_name']) : "NULL") . "," .
                    (!empty($value['vendor']) ? $pdo->quote($value['vendor']) : "NULL") . "," .
                    (!empty($value['sku_10digits']) ? $pdo->quote($value['sku_10digits']) : "NULL") . "," .
                    (!empty($value['item_description']) ? $pdo->quote($value['item_description']) : "NULL") . "," .
                    (!empty($value['export_description']) ? $pdo->quote($value['export_description']) : "NULL") . "," .
                    (!empty($value['material']) ? $pdo->quote($value['material']) : "NULL") . "," .
                    (!empty($value['material_2_export_category']) ? $pdo->quote($value['material_2_export_category']) : "NULL") . "," .
                    (!empty($value['standard_or_large_amazon']) ? $pdo->quote($value['standard_or_large_amazon']) : "NULL") . "," .
                    (!empty($value['purchased_pieces_in_a_set']) ? $value['purchased_pieces_in_a_set'] : "NULL") . "," .
                    (!empty($value['date_entered_inventory']) ? $pdo->quote($value['date_entered_inventory']) : "NULL") . "," .
                    (!empty($value['weight_unboxed_kg']) ? Utils::formatNumber($value['weight_unboxed_kg']) : "NULL") . "," .
                    (!empty($value['weight_unboxed_lb']) ? Utils::formatNumber($value['weight_unboxed_lb']) : "NULL") . "," .
                    (!empty($value['packaging_weight_kg']) ? Utils::formatNumber($value['packaging_weight_kg']) : "NULL") . "," .
                    (!empty($value['packaged_weight_total_kg']) ? Utils::formatNumber($value['packaged_weight_total_kg']) : "NULL") . "," .
                    (!empty($value['packaged_individual_boxed_weight_lb']) ? Utils::formatNumber($value['packaged_individual_boxed_weight_lb']) : "NULL") . "," .
                    (!empty($value['seller_shipper_code']) ? $pdo->quote($value['seller_shipper_code']) : "NULL") . "," .
                    (!empty($value['case_barcode']) ? $pdo->quote($value['case_barcode']) : "NULL") . "," .
                    (!empty($value['extra_sticker_requirements']) ? $pdo->quote($value['extra_sticker_requirements']) : "NULL") . "," .
                    (!empty($value['length_item_cm_actual']) ? Utils::formatNumber($value['length_item_cm_actual']) : "NULL") . "," .
                    (!empty($value['width_item_actual_cm']) ? Utils::formatNumber($value['width_item_actual_cm']) : "NULL") . "," .
                    (!empty($value['height_item_cm_actual']) ? Utils::formatNumber($value['height_item_cm_actual']) : "NULL") . "," .
                    (!empty($value['length_item_in_actual']) ? Utils::formatNumber($value['length_item_in_actual']) : "NULL") . "," .
                    (!empty($value['width_item_actual_in']) ? Utils::formatNumber($value['width_item_actual_in']) : "NULL") . "," .
                    (!empty($value['height_item_in_actual']) ? Utils::formatNumber($value['height_item_in_actual']) : "NULL") . "," .
                    (!empty($value['packaging']) ? $pdo->quote($value['packaging']) : "NULL") . "," .
                    (!empty($value['box_grade']) ? $pdo->quote($value['box_grade']) : "NULL") . "," .
                    (!empty($value['box_style_model']) ? $pdo->quote($value['box_style_model']) : "NULL") . "," .
                    (!empty($value['box_structure']) ? $pdo->quote($value['box_structure']) : "NULL") . "," .
                    (!empty($value['length_longest_cm_boxed']) ? Utils::formatNumber($value['length_longest_cm_boxed']) : "NULL") . "," .
                    (!empty($value['width_cm_boxed']) ? Utils::formatNumber($value['width_cm_boxed']) : "NULL") . "," .
                    (!empty($value['depth_height_cm_boxed']) ? Utils::formatNumber($value['depth_height_cm_boxed']) : "NULL") . "," .
                    (!empty($value['price_of_1_cts_box_thb']) ? Utils::removeSpecialCharacters($value['price_of_1_cts_box_thb']) : "NULL") . "," .
                    (!empty($value['volume_held_oz']) ? $pdo->quote($value['volume_held_oz']) : "NULL") . "," .
                    (!empty($value['proposed_branding']) ? $pdo->quote($value['proposed_branding']) : "NULL") . "," .
                    (!empty($value['length_in_packaged']) ? Utils::formatNumber($value['length_in_packaged']) : "NULL") . "," .
                    (!empty($value['width_in_packaged']) ? Utils::formatNumber($value['width_in_packaged']) : "NULL") . "," .
                    (!empty($value['depth_height_in_packaged']) ? Utils::formatNumber($value['depth_height_in_packaged']) : "NULL") . "," .
                    (!empty($value['dimensional_weight_as_lbs']) ? Utils::formatNumber($value['dimensional_weight_as_lbs']) : "NULL") . "," .
                    (!empty($value['charged_shipping_weight_dimensional_vs_actual']) ? Utils::formatNumber($value['charged_shipping_weight_dimensional_vs_actual']) : "NULL") . "," .
                    (!empty($value['wholesale_no_extra_packaging_per_item']) ? Utils::removeSpecialCharacters($value['wholesale_no_extra_packaging_per_item']) : "NULL") . "," .
                    (!empty($value['wholesale_price_per_piece_thb']) ? Utils::removeSpecialCharacters($value['wholesale_price_per_piece_thb']) : "NULL") . "," .
                    (!empty($value['wholesale_baht_as_set']) ? Utils::removeSpecialCharacters($value['wholesale_baht_as_set']) : "NULL") . "," .
                    (!empty($value['pankesum_price']) ? Utils::removeSpecialCharacters($value['pankesum_price']) : "NULL") . "," .
                    (!empty($value['customer_price_usd']) ? Utils::removeSpecialCharacters($value['customer_price_usd']) : "NULL") . "," .
                    (!empty($value['sampling_sale_usa']) ? Utils::removeSpecialCharacters($value['sampling_sale_usa']) : "NULL") . "," .
                    (!empty($value['wholesale_for_sale_usa_estimate']) ? Utils::removeSpecialCharacters($value['wholesale_for_sale_usa_estimate']) : "NULL") . "," .
                    (!empty($value['wholesale_catalog_for_thailand_per_piece']) ? Utils::removeSpecialCharacters($value['wholesale_catalog_for_thailand_per_piece']) : "NULL") . "," .
                    (!empty($value['faire_price']) ? Utils::removeSpecialCharacters($value['faire_price']) : "NULL") . "," .
                    (!empty($value['shipment_method']) ? $pdo->quote($value['shipment_method']) : "NULL") . "," .
                    (!empty($value['extra1']) ? Utils::formatNumber($value['extra1']) : "NULL") . "," .
                    (!empty($value['extra2']) ? Utils::formatNumber($value['extra2']) : "NULL") . "," .
                    (!empty($value['extra3']) ? Utils::formatNumber($value['extra3']) : "NULL") . "," .
                    (!empty($value['hts_code']) ? $pdo->quote($value['hts_code']) : "NULL") . "," .
                    (!empty($value['species']) ? $pdo->quote($value['species']) : "NULL") . "," .
                    (!empty($value['hts_tax']) ? $pdo->quote($value['hts_tax']) : "NULL") . "," .
                    (!empty($value['fda_product_code']) ? $pdo->quote($value['fda_product_code']) : "NULL") . "," .
                    (!empty($value['packaging_description']) ? $pdo->quote($value['packaging_description']) : "NULL") . "," .
                    (!empty($value['weight_per_per_one']) ? Utils::formatNumber($value['weight_per_per_one']) : "NULL") . "," .
                    (!empty($value['item_description_on_fda_pn_filing']) ? $pdo->quote($value['item_description_on_fda_pn_filing']) : "NULL") . "," .
                    (!empty($value['pn_number']) ? $pdo->quote($value['pn_number']) : "NULL") . "," .
                    (!empty($value['manufacturer_id_number']) ? $pdo->quote($value['manufacturer_id_number']) : "NULL") . "," .
                    (!empty($value['extra4']) ? Utils::formatNumber($value['extra4']) : "NULL") . "," .
                    (!empty($value['extra5']) ? Utils::formatNumber($value['extra5']) : "NULL") . "," .
                    (!empty($value['extra6']) ? Utils::formatNumber($value['extra6']) : "NULL") . "," .
                    (!empty($value['extra7']) ? Utils::formatNumber($value['extra7']) : "NULL") . "," .
                    (!empty($value['socal_description']) ? $pdo->quote($value['socal_description']) : "NULL") . "," .
                    (!empty($value['buyer_description']) ? $pdo->quote($value['buyer_description']) : "NULL") . "," .
                    (!empty($value['customer_sku']) ? $pdo->quote($value['customer_sku']) : "NULL") . "," .
                    (!empty($value['extra8']) ? Utils::formatNumber($value['extra8']) : "NULL") . "," .
                    (!empty($value['barcode_fnsku']) ? $pdo->quote($value['barcode_fnsku']) : "NULL") . "," .
                    (!empty($value['upc_gtin']) ? Utils::formatNumber($value['upc_gtin']) : "NULL") . "," .
                    (!empty($value['asin']) ? $pdo->quote($value['asin']) : "NULL") . "," .
                    (!empty($value['amazon_sku']) ? $pdo->quote($value['amazon_sku']) : "NULL") . "," .
                    (!empty($value['case']) ? $pdo->quote($value['case']) : "NULL") . "," .
                    (!empty($value['per_case']) ? $value['per_case'] : "NULL") . "," .
                    (!empty($value['extra9']) ? $pdo->quote($value['extra9']) : "NULL") . "," .
                    (!empty($value['extra10']) ? $pdo->quote($value['extra10']) : "NULL") . "," .
                    (!empty($value['extra11']) ? $pdo->quote($value['extra11']) : "NULL") . "," .
                    (!empty($value['max_in_pallet']) ? Utils::formatNumber($value['max_in_pallet']) : "NULL") . "," .
                    (!empty($value['cost_of_delivering_1_piece']) ? Utils::removeSpecialCharacters($value['cost_of_delivering_1_piece']) : "NULL") . "," .
                    (!empty($value['in_container_40_pallets']) ? Utils::formatNumber($value['in_container_40_pallets']) : "NULL") . "," .
                    (!empty($value['extra12']) ? $pdo->quote($value['extra12']) : "NULL") . "," .
                    (!empty($value['extra13']) ? $pdo->quote($value['extra13']) : "NULL") . "," .
                    (!empty($value['extra14']) ? $pdo->quote($value['extra14']) : "NULL") . "," .
                    (!empty($value['sku']) ? $pdo->quote($value['sku']) : "NULL") . "," .
                    (!empty($value['image']) ? $pdo->quote($value['image']) : "NULL") .
                    ")";
                $manufacturers[] = "(" . $pdo->quote($value['manufacturer_id_number']) . "," . $pdo->quote($value['manufacturer_name']) . "," . $pdo->quote($value['manufacturing_address']) . "," . $pdo->quote($value['manufacturer_owner_name']) . ")";
                $categories[] = "(" . $pdo->quote(md5(strtolower($value['category']))) . "," . $pdo->quote(strtolower($value['category'])) . ")";
                $category_ids[] = md5(strtolower($value['category']));
                $product_ids[] = $product_id;
            }
            if (!empty($action_list)) {
                $product_category = [];
                foreach ($product_ids as $key => $value) {
                    $product_category[] = "(" . $pdo->quote($value) . "," . $pdo->quote($category_ids[$key]) . ")";
                }
                // throw new Exception("There are some wrongs when creating product.");
                $result = ProductModel::create($insert_string, $manufacturers, $categories, $product_category); //@return bool
                if ($result) {
                    $value = "create_status = 1";
                    SpreadsheetModel::updateSheetActionTask($this->credential->sheet_id, 'products', $value);
                }
            }
        } catch (Exception $e) {
            SpreadSheetModel::disruptSheetactionTask($this->credential->sheet_id, 'products');
            // throw new Exception("There are some wrongs when creating product.");
            throw new Exception($e->getMessage());
        }

    }
}
