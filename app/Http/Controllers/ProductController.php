<?php

namespace App\Http\Controllers;

use App\Models\ProductModel;
use App\Models\SetupModel;
use App\Jobs\Utils;
use Illuminate\Support\Facades\DB;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function __construct()
    {
        $this->middleware('web_app');
    }
    function index()
    {
        $all_locations = SetupModel::all();
        return Inertia::render('Products', ["products" => ProductModel::productListing('listing'), 'locations' => $all_locations]);
    }
    public function create(Request $request)
    {
        $product = new ProductModel();
        // generate uuid
        $product_id = Utils::generateUuid('product', $request->product_name);
        $request->request->add(['product_id' => $product_id]);
        $product->fill($request->all());
        $product->save();
        $this->updateSheet();
        $all_products = ProductModel::all();
        return response()->json(["status" => "success", 'message' => 'Product is created successfully', 'products' => $all_products], 201);
    }
    public function edit(Request $request)
    {
        $db = DB::connection();
        $pdo = $db->getPdo();
        $product_detail = $request->product_detail;
        $location = $request->location;
        // dd($product_detail);
        // dd($pricing);
        try {
            if (empty($product_detail['product_id']))
                throw new Exception("Product ID missing");
            $update_product_string = "
                                product_name = " . (!empty($product_detail['product_name']) ? $pdo->quote($product_detail['product_name']) : "NULL") . ",
                                type = " . (!empty($product_detail['type']) ? $pdo->quote($product_detail['type']) : "NULL") . ",
                                vendor = " . (!empty($product_detail['vendor']) ? $pdo->quote($product_detail['vendor']) : "NULL") . ",
                                sku_10digits = " . (!empty($product_detail['sku_10digits']) ? $pdo->quote($product_detail['sku_10digits']) : "NULL") . ",
                                sku = " . (!empty($product_detail['sku']) ? $pdo->quote($product_detail['sku']) : "NULL") . ",
                                item_description = " . (!empty($product_detail['item_description']) ? $pdo->quote($product_detail['item_description']) : "NULL") . ",
                                export_description = " . (!empty($product_detail['export_description']) ? $pdo->quote($product_detail['export_description']) : "NULL") . ",
                                material = " . (!empty($product_detail['material']) ? $pdo->quote($product_detail['material']) : "NULL") . ",
                                material_2_export_category = " . (!empty($product_detail['material_2_export_category']) ? $pdo->quote($product_detail['material_2_export_category']) : "NULL") . ",
                                standard_or_large_amazon = " . (!empty($product_detail['standard_or_large_amazon']) ? $pdo->quote($product_detail['standard_or_large_amazon']) : "NULL") . ",
                                purchased_pieces_in_a_set = " . (!empty($product_detail['purchased_pieces_in_a_set']) ? $product_detail['purchased_pieces_in_a_set'] : "NULL") . ",
                                date_entered_inventory = " . (!empty($product_detail['date_entered_inventory']) ? $pdo->quote($product_detail['date_entered_inventory']) : "NULL") . ",
                                weight_unboxed_kg = " . (!empty($product_detail['weight_unboxed_kg']) ? $product_detail['weight_unboxed_kg'] : "NULL") . ",
                                weight_unboxed_lb = " . (!empty($product_detail['weight_unboxed_lb']) ? $product_detail['weight_unboxed_lb'] : "NULL") . ",
                                packaging_weight_kg = " . (!empty($product_detail['packaging_weight_kg']) ? $product_detail['packaging_weight_kg'] : "NULL") . ",
                                packaged_weight_total_kg = " . (!empty($product_detail['packaged_weight_total_kg']) ? $product_detail['packaged_weight_total_kg'] : "NULL") . ",
                                packaged_individual_boxed_weight_lb = " . (!empty($product_detail['packaged_individual_boxed_weight_lb']) ? $product_detail['packaged_individual_boxed_weight_lb'] : "NULL") . ",
                                seller_shipper_code = " . (!empty($product_detail['seller_shipper_code']) ? $pdo->quote($product_detail['seller_shipper_code']) : "NULL") . ",
                                case_barcode = " . (!empty($product_detail['case_barcode']) ? $pdo->quote($product_detail['case_barcode']) : "NULL") . ",
                                extra_sticker_requirements = " . (!empty($product_detail['extra_sticker_requirements']) ? $pdo->quote($product_detail['extra_sticker_requirements']) : "NULL") . ",
                                length_item_cm_actual =" . (!empty($product_detail['length_item_cm_actual']) ? $product_detail['length_item_cm_actual'] : "NULL") . ",
                                width_item_actual_cm = " . (!empty($product_detail['width_item_actual_cm']) ? $product_detail['width_item_actual_cm'] : "NULL") . ",
                                height_item_cm_actual = " . (!empty($product_detail['height_item_cm_actual']) ? $product_detail['height_item_cm_actual'] : "NULL") . ",
                                length_item_in_actual = " . (!empty($product_detail['length_item_in_actual']) ? $product_detail['length_item_in_actual'] : "NULL") . ",
                                width_item_actual_in = " . (!empty($product_detail['width_item_actual_in']) ? $product_detail['width_item_actual_in'] : "NULL") . ",
                                height_item_in_actual = " . (!empty($product_detail['height_item_in_actual']) ? $product_detail['height_item_in_actual'] : "NULL") . ",
                                packaging = " . (!empty($product_detail['packaging']) ? $pdo->quote($product_detail['packaging']) : "NULL") . ",
                                box_grade = " . (!empty($product_detail['box_grade']) ? $pdo->quote($product_detail['box_grade']) : "NULL") . ",
                                box_style_model = " . (!empty($product_detail['box_style_model']) ? $pdo->quote($product_detail['box_style_model']) : "NULL") . ",
                                box_structure = " . (!empty($product_detail['box_structure']) ? $pdo->quote($product_detail['box_structure']) : "NULL") . ",
                                length_longest_cm_boxed = " . (!empty($product_detail['length_longest_cm_boxed']) ? $product_detail['length_longest_cm_boxed'] : "NULL") . ",
                                width_cm_boxed = " . (!empty($product_detail['width_cm_boxed']) ? $product_detail['width_cm_boxed'] : "NULL") . ",
                                depth_height_cm_boxed = " . (!empty($product_detail['depth_height_cm_boxed']) ? $product_detail['depth_height_cm_boxed'] : "NULL") . ",
                                price_of_1_cts_box_thb = " . (!empty($product_detail['price_of_1_cts_box_thb']) ? $product_detail['price_of_1_cts_box_thb'] : "NULL") . ",
                                volume_held_oz = " . (!empty($product_detail['volume_held_oz']) ? $pdo->quote($product_detail['volume_held_oz']) : "NULL") . ",
                                proposed_branding = " . (!empty($product_detail['proposed_branding']) ? $pdo->quote($product_detail['proposed_branding']) : "NULL") . ",
                                length_in_packaged = " . (!empty($product_detail['length_in_packaged']) ? $product_detail['length_in_packaged'] : "NULL") . ",
                                width_in_packaged = " . (!empty($product_detail['width_in_packaged']) ? $product_detail['width_in_packaged'] : "NULL") . ",
                                depth_height_in_packaged = " . (!empty($product_detail['depth_height_in_packaged']) ? $product_detail['depth_height_in_packaged'] : "NULL") . ",
                                dimensional_weight_as_lbs = " . (!empty($product_detail['dimensional_weight_as_lbs']) ? $product_detail['dimensional_weight_as_lbs'] : "NULL") . ",
                                wholesale_no_extra_packaging_per_item = " . (!empty($product_detail['wholesale_no_extra_packaging_per_item']) ? $product_detail['wholesale_no_extra_packaging_per_item'] : "NULL") . ",
                                wholesale_price_per_piece_thb = " . (!empty($product_detail['wholesale_price_per_piece_thb']) ? $product_detail['wholesale_price_per_piece_thb'] : "NULL") . ",
                                wholesale_baht_as_set = " . (!empty($product_detail['wholesale_baht_as_set']) ? $product_detail['wholesale_baht_as_set'] : "NULL") . ",
                                pankesum_price = " . (!empty($product_detail['pankesum_price']) ? $product_detail['pankesum_price'] : "NULL") . ",
                                customer_price_usd = " . (!empty($product_detail['customer_price_usd']) ? $product_detail['customer_price_usd'] : "NULL") . ",
                                sampling_sale_usa = " . (!empty($product_detail['sampling_sale_usa']) ? $product_detail['sampling_sale_usa'] : "NULL") . ",
                                wholesale_for_sale_usa_estimate = " . (!empty($product_detail['wholesale_for_sale_usa_estimate']) ? $product_detail['wholesale_for_sale_usa_estimate'] : "NULL") . ",
                                wholesale_catalog_for_thailand_per_piece = " . (!empty($product_detail['wholesale_catalog_for_thailand_per_piece']) ? $product_detail['wholesale_catalog_for_thailand_per_piece'] : "NULL") . ",
                                faire_price = " . (!empty($product_detail['faire_price']) ? $product_detail['faire_price'] : "NULL") . ",
                                shipment_method = " . (!empty($product_detail['shipment_method']) ? $pdo->quote($product_detail['shipment_method']) : "NULL") . ",
                                extra1 = " . (!empty($product_detail['extra1']) ? $pdo->quote($product_detail['extra1']) : "NULL") . ",
                                extra2 = " . (!empty($product_detail['extra2']) ? $pdo->quote($product_detail['extra2']) : "NULL") . ",
                                extra3 = " . (!empty($product_detail['extra3']) ? $pdo->quote($product_detail['extra3']) : "NULL") . ",
                                hts_code = " . (!empty($product_detail['hts_code']) ? $pdo->quote($product_detail['hts_code']) : "NULL") . ",
                                hts_tax = " . (!empty($product_detail['hts_tax']) ? $pdo->quote($product_detail['hts_tax']) : "NULL") . ",
                                species = " . (!empty($product_detail['species']) ? $pdo->quote($product_detail['species']) : "NULL") . ",
                                fda_product_code = " . (!empty($product_detail['fda_product_code']) ? $pdo->quote($product_detail['fda_product_code']) : "NULL") . ",
                                packaging_description = " . (!empty($product_detail['packaging_description']) ? $pdo->quote($product_detail['packaging_description']) : "NULL") . ",
                                weight_per_one = " . (!empty($product_detail['weight_per_one']) ? $pdo->quote($product_detail['weight_per_one']) : "NULL") . ",
                                item_description_on_fda_pn_filing = " . (!empty($product_detail['item_description_on_fda_pn_filing']) ? $pdo->quote($product_detail['item_description_on_fda_pn_filing']) : "NULL") . ",
                                pn_number = " . (!empty($product_detail['pn_number']) ? $pdo->quote($product_detail['pn_number']) : "NULL") . ",
                                manufacturer_id_number = " . (!empty($product_detail['manufacturer_id_number']) ? $pdo->quote($product_detail['manufacturer_id_number']) : "NULL") . ",
                                extra4 = " . (!empty($product_detail['extra4']) ? $pdo->quote($product_detail['extra4']) : "NULL") . ",
                                extra5 = " . (!empty($product_detail['extra5']) ? $pdo->quote($product_detail['extra5']) : "NULL") . ",
                                extra6 = " . (!empty($product_detail['extra6']) ? $pdo->quote($product_detail['extra6']) : "NULL") . ",
                                extra7 = " . (!empty($product_detail['extra7']) ? $pdo->quote($product_detail['extra7']) : "NULL") . ",
                                socal_description = " . (!empty($product_detail['socal_description']) ? $pdo->quote($product_detail['socal_description']) : "NULL") . ",
                                buyer_description = " . (!empty($product_detail['buyer_description']) ? $pdo->quote($product_detail['buyer_description']) : "NULL") . ",
                                customer_sku = " . (!empty($product_detail['customer_sku']) ? $pdo->quote($product_detail['customer_sku']) : "NULL") . ",
                                extra8 = " . (!empty($product_detail['extra8']) ? $pdo->quote($product_detail['extra8']) : "NULL") . ",
                                barcode_fnsku = " . (!empty($product_detail['barcode_fnsku']) ? $pdo->quote($product_detail['barcode_fnsku']) : "NULL") . ",
                                upc_gtin = " . (!empty($product_detail['upc_gtin']) ? $pdo->quote($product_detail['upc_gtin']) : "NULL") . ",
                                asin = " . (!empty($product_detail['asin']) ? $pdo->quote($product_detail['asin']) : "NULL") . ",
                                amazon_sku = " . (!empty($product_detail['amazon_sku']) ? $pdo->quote($product_detail['amazon_sku']) : "NULL") . ",
                                `case` = " . (!empty($product_detail['case']) ? $pdo->quote($product_detail['case']) : "NULL") . ",
                                per_case = " . (!empty($product_detail['per_case']) ? $product_detail['per_case'] : "NULL") . ",
                                extra9 = " . (!empty($product_detail['extra9']) ? $pdo->quote($product_detail['extra9']) : "NULL") . ",
                                extra10 = " . (!empty($product_detail['extra10']) ? $pdo->quote($product_detail['extra10']) : "NULL") . ",
                                extra11 = " . (!empty($product_detail['extra11']) ? $pdo->quote($product_detail['extra11']) : "NULL") . ",
                                max_in_pallet = " . (!empty($product_detail['max_in_pallet']) ? $product_detail['max_in_pallet'] : "NULL") . ",
                                cost_of_delivering_1_piece = " . (!empty($product_detail['cost_of_delivering_1_piece']) ? $product_detail['cost_of_delivering_1_piece'] : "NULL") . ",
                                in_container_40_pallets = " . (!empty($product_detail['in_container_40_pallets']) ? $product_detail['in_container_40_pallets'] : "NULL") . ",
                                extra12 = " . (!empty($product_detail['extra12']) ? $pdo->quote($product_detail['extra12']) : "NULL") . ",
                                extra13 = " . (!empty($product_detail['extra13']) ? $pdo->quote($product_detail['extra13']) : "NULL") . ",
                                extra14 = " . (!empty($product_detail['extra14']) ? $pdo->quote($product_detail['extra14']) : "NULL") . ",
                                sku = " . (!empty($product_detail['sku']) ? $pdo->quote($product_detail['sku']) : "NULL") . ",
                                image = " . (!empty($product_detail['image']) ? $pdo->quote($product_detail['image']) : "NULL");
            $update_location = [];
            foreach ($location as $location_id => $qty) {
                $update_location[] = "(
                                    " . $pdo->quote($product_detail['product_id']) . ",
                                    " . $pdo->quote($location_id) . ",
                                    " . $qty . "
                                )";
            }
            ProductModel::updateProduct($product_detail, $update_product_string, $update_location);
            $this->updateSheet();
            return response()->json(["status" => 'success', "message" => 'Product updated successfully'], 201);
        } catch (Exception $e) {
            return response()->json(["status" => 'failure', "message" => $e->getMessage()], 400);
        }

    }
    public function delete(Request $request)
    {
        $result = ProductModel::deleteProduct($request->id);
        try {
            if ($result)
                $this->updateSheet();
            return response()->json(["status" => "success", 'message' => 'Product deleted successfully'], 201);
        } catch (Exception $e) {
            return response()->json(["status" => 'failure', "message" => $e->getMessage()], 400);
        }

    }
    public function transfer(Request $request)
    {
        if ($request->location_start == $request->location_end) {
            return response()->json(['status' => 'failure', 'message' => 'Cannot transfer to same location'], 400);
        }
        $result = ProductModel::transferProduct($request);
        return response()->json($result, $result['status'] == 'success' ? 200 : 400);
        // todo: check quantity available in inventory
    }
    public function addOrUpdateImageToS3(Request $request, $product_id)
    {
        if ($request->hasFile('file')) {
            $image = $request->file('file');
            $directory = "storage/products/images/" . "image_" . $product_id . "." . "jpg";
            // $directory = "storage/products/images/" . "default"."." . "jpg";
            $res = Storage::disk('s3')->put($directory, file_get_contents($image), 'public');
            if (!$res)
                throw new Exception('Upload file fail');
            return response()->json(['url' => $directory], 200);

        }
        return response()->json(['status' => 'failure', 'message' => 'No image uploaded'], 400);
    }
    private function updateSheet()
    {
        $spreadsheet = new SpreadsheetController();
        $spreadsheet->pull_data('products');
    }
}
