<?php

namespace App\Models;

use Exception;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class ProductModel extends Model
{
    use HasFactory;
    protected $table = 'products';
    protected $fillable = [
        'product_id',
        'product_name',
        'vendor',
        'sku_10digits',
        'type',
        'item_description',
        'export_description',
        'material',
        'material_2_export_category',
        'standard_or_large_amazon',
        'purchased_pieces_in_a_set',
        'date_entered_inventory',
        'weight_unboxed_kg',
        'weight_unboxed_lb',
        'packaging_weight_kg',
        'packaged_weight_total_kg',
        'packaged_individual_boxed_weight_lb',
        'seller_shipper_code',
        'case_barcode',
        'extra_sticker_requirements',
        'length_item_cm_actual',
        'width_item_actual_cm',
        'height_item_cm_actual',
        'length_item_in_actual',
        'width_item_actual_in',
        'height_item_in_actual',
        'packaging',
        'box_grade',
        'box_style_model',
        'box_structure',
        'length_longest_cm_boxed',
        'width_cm_boxed',
        'depth_height_cm_boxed',
        'price_of_1_cts_box_thb',
        'volume_held_oz',
        'proposed_branding',
        'length_in_packaged',
        'width_in_packaged',
        'depth_height_in_packaged',
        'dimensional_weight_as_lbs',
        'charged_shipping_weight_dimensional_vs_actual',
        'wholesale_no_extra_packaging_per_item',
        'wholesale_price_per_piece_thb',
        'wholesale_baht_as_set',
        'pankesum_price',
        'customer_price_usd',
        'sampling_sale_usa',
        'wholesale_for_sale_usa_estimate',
        'wholesale_catalog_for_thailand_per_piece',
        'faire_price',
        'shipment_method',
        'extra1',
        'extra2',
        'extra3',
        'hts_code',
        'species',
        'hts_tax',
        'fda_product_code',
        'packaging_description',
        'weight_per_one',
        'item_description_on_fda_pn_filing',
        'pn_number',
        'manufacturer_id_number',
        'manufacturer_name',
        'manufacturing_address',
        'manufacturer_owner_name',
        'extra4',
        'extra5',
        'extra6',
        'extra7',
        'socal_description',
        'buyer_description',
        'customer_sku',
        'extra8',
        'barcode_fnsku',
        'upc_gtin',
        'asin',
        'amazon_sku',
        '`case`',
        'per_case',
        'extra9',
        'extra10',
        'extra11',
        'max_in_pallet',
        'cost_of_delivering_1_piece',
        'in_container_40_pallets',
        'extra12',
        'extra13',
        'extra14',
        'sku',
        'image',
        'created_at',
        'updated_at'
    ];
    public static function create($products_list, $manufacturers, $categories, $product_category)
    {
        try {
            DB::beginTransaction();
            //insert categories
            $insert_categroies = "INSERT IGNORE  INTO categories (category_id,name) VALUES " . implode(',', $categories);
            DB::insert($insert_categroies);

            //create products
            $insert_product = "INSERT IGNORE INTO products 
            (
            product_id,
            product_name,
            vendor,
            sku_10digits,
            item_description,
            export_description,
            material,
            material_2_export_category,
            standard_or_large_amazon,
            purchased_pieces_in_a_set,
            date_entered_inventory,
            weight_unboxed_kg,
            weight_unboxed_lb,
            packaging_weight_kg,
            packaged_weight_total_kg,
            packaged_individual_boxed_weight_lb,
            seller_shipper_code,
            case_barcode,
            extra_sticker_requirements,
            length_item_cm_actual,
            width_item_actual_cm,
            height_item_cm_actual,
            length_item_in_actual,
            width_item_actual_in,
            height_item_in_actual,
            packaging,
            box_grade,
            box_style_model,
            box_structure,
            length_longest_cm_boxed,
            width_cm_boxed,
            depth_height_cm_boxed,
            price_of_1_cts_box_thb,
            volume_held_oz,
            proposed_branding,
            length_in_packaged,
            width_in_packaged,
            depth_height_in_packaged,
            dimensional_weight_as_lbs,
            charged_shipping_weight_dimensional_vs_actual,
            wholesale_no_extra_packaging_per_item,
            wholesale_price_per_piece_thb,
            wholesale_baht_as_set,
            pankesum_price,
            customer_price_usd,
            sampling_sale_usa,
            wholesale_for_sale_usa_estimate,
            wholesale_catalog_for_thailand_per_piece,
            faire_price,
            shipment_method,
            extra1,
            extra2,
            extra3,
            hts_code,
            species,
            hts_tax,
            fda_product_code,
            packaging_description,
            weight_per_one,
            item_description_on_fda_pn_filing,
            pn_number,
            manufacturer_id_number,
            extra4,
            extra5,
            extra6,
            extra7,
            socal_description,
            buyer_description,
            customer_sku,
            extra8,
            barcode_fnsku,
            upc_gtin,
            asin,
            amazon_sku,
            `case`,
            per_case,
            extra9,
            extra10,
            extra11,
            max_in_pallet,
            cost_of_delivering_1_piece,
            in_container_40_pallets,
            extra12,
            extra13,
            extra14,
            sku,
            image
            ) VALUES " . implode(',', $products_list);
            $result = DB::insert($insert_product);

            //insert manufacturers
            $insert_manufacturer = "INSERT IGNORE  INTO manufacturers (manufacturer_id, manufacturer_name, manufacturing_address, manufacturer_owner_name) VALUES " . implode(',', $manufacturers);
            DB::insert($insert_manufacturer);
            if ($result) {
                // if insert product success, insert product category
                $insert_product_category = "INSERT IGNORE INTO product_category_xref (product_id, category_id) VALUES " . implode(',', $product_category);
                DB::insert($insert_product_category);
            }
            DB::commit();
            return true;
        } catch (Exception $e) {
            DB::rollBack();
            dd($e);
            throw $e;
        }
    }

    // public static function getProducts()
    // {
    //     $q = "SELECT 
    //                  t0.*,t3.locations
    //             FROM
    //             products AS t0
    //                 LEFT JOIN
    //             manufacturers AS t1 ON t0.manufacturer_id_number = t1.manufacturer_id
    //                 LEFT JOIN
    //             (SELECT 
    //                 t1.product_id,
    //                     JSON_ARRAYAGG(JSON_OBJECT('location_id', t2.location_id, 'location_name', t2.location_name, 'address', t2.address, 'city', t2.city, 'state', t2.state, 'country', t2.country, 'quantity', t1.quantity)) AS locations
    //             FROM
    //                 product_location_xref t1
    //             JOIN locations t2 ON t1.location_id = t2.location_id
    //             GROUP BY t1.product_id) AS t3 ON t3.product_id = t0.product_id
    //                 LEFT JOIN 
    //             (  SELECT t0.product_id, t1.name
    //                 FROM product_category_xref as t0
    //                 LEFT JOIN categories as t1 ON t0.category_id = t1.category_id
    //             ) as t4 ON t4.product_id = t0.product_id
    //         WHERE
    //             t0.active = 'active'";
    //     return DB::select($q);
    // }
    public static function updateProduct($product, $update_product, $update_location)
    {
        $pdo = DB::getPdo();
        try {
            DB::beginTransaction();
            // update product detail
            $check_available = DB::select("SELECT EXISTS(SELECT * FROM products WHERE product_id != " . $pdo->quote($product['product_id']) . " and sku_10digits = '" . $product["sku_10digits"] . "') as is_available");
            if ($check_available[0]->is_available) {
                throw new Exception("SKU already exist");
            }
            // update categories 
            $category_id = md5(strtolower($product['category']));
            $category = "INSERT IGNORE  INTO categories (category_id,name) VALUES (" . $pdo->quote($category_id) . "," . $pdo->quote(strtolower($product['category'])) . ")";
            DB::insert($category);
            $insert_product_category = "INSERT IGNORE INTO product_category_xref (product_id, category_id) VALUES (" . $pdo->quote($product['product_id']) . "," . $pdo->quote($category_id) . ")";
            DB::insert($insert_product_category);
            // update product
            $q = "
            UPDATE products 
            SET $update_product
            where product_id =" . $pdo->quote($product['product_id']);
            // dd($q);
            DB::update($q);
            // update product location
            if (!empty($update_location)) {
                $q = "INSERT INTO product_location_xref(product_id,location_id,quantity)
                    VALUES " . implode(',', $update_location) . "
                    ON DUPLICATE KEY UPDATE quantity = VALUES(quantity)";
                DB::insert($q);
            }
            if (!empty($product['manufacturer_id_number'])) {
                $insert_manufacturer = "INSERT IGNORE  INTO manufacturers (manufacturer_id, manufacturer_name, manufacturing_address, manufacturer_owner_name) VALUES (" .
                    $pdo->quote($product['manufacturer_id_number']) . ","
                    . $pdo->quote($product['manufacturer_name']) . ","
                    . $pdo->quote($product['manufacturing_address']) . ","
                    . $pdo->quote($product['manufacturer_owner_name'])
                    . ")";
                DB::insert($insert_manufacturer);
            }
            DB::commit();
            return true;
        } catch (\Throwable $th) {
            DB::rollBack();
            throw new Exception($th->getMessage());
        }
    }
    public static function addProductLocation($insert)
    {

    }
    public static function deleteProduct($id)
    {
        $q = "UPDATE products SET `status` = 'archived' WHERE product_id = " . DB::getPdo()->quote($id);
        try {
            DB::update($q);
            return true;
        } catch (\Throwable $th) {
            return false;
        }
    }
    public static function productListing($type = 'default')
    {
        /**
         * Generate a product listing with extensive details including product information, manufacturer details, locations, and categories.
         *
         * @param string $type The type of product listing to generate (default or custom)
         * @return array The product listing data in JSON format
         */
        $columns = "";
        if ($type != 'default') {
            $columns = "
            t3.locations,";
        }
        $q = "SELECT 
                t0.product_id,
                t0.product_name,
                t0.vendor,
                t0.sku_10digits,
                t0.item_description,    
                t0.export_description,
                t4.name AS category,
                t0.material,
                t0.material_2_export_category,
                t0.standard_or_large_amazon,
                t0.purchased_pieces_in_a_set,
                t0.date_entered_inventory,
                t0.weight_unboxed_kg,
                t0.weight_unboxed_lb,
                t0.packaging_weight_kg,
                t0.packaged_weight_total_kg,
                t0.packaged_individual_boxed_weight_lb,
                t0.seller_shipper_code,
                t0.case_barcode,
                t0.extra_sticker_requirements,
                t0.length_item_cm_actual,
                t0.width_item_actual_cm,
                t0.height_item_cm_actual,
                t0.length_item_in_actual,
                t0.width_item_actual_in,
                t0.height_item_in_actual,
                t0.packaging,
                t0.box_grade,
                t0.box_style_model,
                t0.box_structure,
                t0.length_longest_cm_boxed,
                t0.width_cm_boxed,
                t0.depth_height_cm_boxed,
                t0.price_of_1_cts_box_thb,
                t0.volume_held_oz,
                t0.proposed_branding,
                t0.length_in_packaged,
                t0.width_in_packaged,
                t0.depth_height_in_packaged,
                t0.dimensional_weight_as_lbs,
                t0.charged_shipping_weight_dimensional_vs_actual,
                t0.wholesale_no_extra_packaging_per_item,
                t0.wholesale_price_per_piece_thb,
                t0.wholesale_baht_as_set,
                t0.pankesum_price,
                t0.customer_price_usd,
                t0.sampling_sale_usa,
                t0.wholesale_for_sale_usa_estimate,
                t0.wholesale_catalog_for_thailand_per_piece,
                t0.faire_price,
                t0.shipment_method,
                t0.extra1,
                t0.extra2,
                t0.extra3,
                t0.hts_code,
                t0.species,
                t0.hts_tax,
                t0.fda_product_code,
                t0.packaging_description,
                t0.weight_per_one,
                t0.item_description_on_fda_pn_filing,
                t0.pn_number,
                t0.manufacturer_id_number,
                t1.manufacturer_name,
                t1.manufacturing_address,
                t1.manufacturer_owner_name,
                t0.extra4,
                t0.extra5,
                t0.extra6,
                t0.extra7,
                t0.socal_description,
                t0.buyer_description,
                t0.customer_sku,
                t0.extra8,
                t0.barcode_fnsku,
                t0.upc_gtin,
                t0.asin,
                t0.amazon_sku,
                t0.`case`,
                t0.per_case,
                t0.extra9,
                t0.extra10,
                t0.extra11,
                t0.max_in_pallet,
                t0.cost_of_delivering_1_piece,
                t0.in_container_40_pallets,
                t0.extra12,
                t0.extra13,
                t0.extra14,
                t0.sku,
                t0.image,
                $columns 
                t0.created_at,
                t0.updated_at
            FROM
                products AS t0
                    LEFT JOIN
                manufacturers AS t1 ON t0.manufacturer_id_number = t1.manufacturer_id
                    LEFT JOIN
                (SELECT 
                    t1.product_id,
                        JSON_ARRAYAGG(JSON_OBJECT('location_id', t2.location_id, 'location_name', t2.location_name, 'address', t2.address, 'city', t2.city, 'state', t2.state, 'country', t2.country, 'quantity', t1.quantity)) AS locations
                FROM
                    product_location_xref t1
                JOIN locations t2 ON t1.location_id = t2.location_id
                GROUP BY t1.product_id) AS t3 ON t3.product_id = t0.product_id
                    LEFT JOIN 
                (  SELECT t0.product_id, t1.name
                    FROM product_category_xref as t0
                    LEFT JOIN categories as t1 ON t0.category_id = t1.category_id
                ) as t4 ON t4.product_id = t0.product_id
            WHERE
                t0.status = 'active'";
        $rows = DB::select($q);
        return json_decode(json_encode($rows), true);
    }

    public static function updateProductSheet($products_list, $manufacturers, $product_cate_xref, $categories)
    {
        /**
         * Update the product sheet with new products and categories.
         *
         * @param array $products_list List of products to update or insert
         * @param array $manufacturers List of manufacturers to update or insert
         * @param array $product_cate_xref List of product-category relationships to update or insert
         * @param array $categories List of categories to insert
         * @throws Exception If an error occurs during the database transaction
         * @return bool Returns true if the update was successful
         */
        try {
            DB::beginTransaction();
            //insert categories
            $update_categories = "INSERT IGNORE INTO categories (category_id,name) VALUES " . implode(',', $categories);
            DB::insert($update_categories);
            //create products
            $insert_product = "INSERT IGNORE INTO products(
                product_id,
                product_name,
                vendor,
                sku_10digits,
                item_description,
                export_description,
                material,
                material_2_export_category,
                standard_or_large_amazon,
                purchased_pieces_in_a_set,
                date_entered_inventory,
                weight_unboxed_kg,
                weight_unboxed_lb,
                packaging_weight_kg,
                packaged_weight_total_kg,
                packaged_individual_boxed_weight_lb,
                seller_shipper_code,
                case_barcode,
                extra_sticker_requirements,
                length_item_cm_actual,
                width_item_actual_cm,
                height_item_cm_actual,
                length_item_in_actual,
                width_item_actual_in,
                height_item_in_actual,
                packaging,
                box_grade,
                box_style_model,
                box_structure,
                length_longest_cm_boxed,
                width_cm_boxed,
                depth_height_cm_boxed,
                price_of_1_cts_box_thb,
                volume_held_oz,
                proposed_branding,
                length_in_packaged,
                width_in_packaged,
                depth_height_in_packaged,
                dimensional_weight_as_lbs,
                charged_shipping_weight_dimensional_vs_actual,
                wholesale_no_extra_packaging_per_item,
                wholesale_price_per_piece_thb,
                wholesale_baht_as_set,
                pankesum_price,
                customer_price_usd,
                sampling_sale_usa,
                wholesale_for_sale_usa_estimate,
                wholesale_catalog_for_thailand_per_piece,
                faire_price,
                shipment_method,
                extra1,
                extra2,
                extra3,
                hts_code,
                species,
                hts_tax,
                fda_product_code,
                packaging_description,
                weight_per_one,
                item_description_on_fda_pn_filing,
                pn_number,
                manufacturer_id_number,
                extra4,
                extra5,
                extra6,
                extra7,
                socal_description,
                buyer_description,
                customer_sku,
                extra8,
                barcode_fnsku,
                upc_gtin,
                asin,
                amazon_sku,
                `case`,
                per_case,
                extra9,
                extra10,
                extra11,
                max_in_pallet,
                cost_of_delivering_1_piece,
                in_container_40_pallets,
                extra12,
                extra13,
                extra14,
                sku,
                image
            ) VALUES " . implode(',', $products_list) . "
            ON DUPLICATE KEY UPDATE
            product_name = VALUES(product_name),
            vendor = VALUES(vendor),
            sku_10digits = VALUES(sku_10digits),
            sku = VALUES(sku),
            item_description = VALUES(item_description),
            export_description = VALUES(export_description),
            material = VALUES(material),
            material_2_export_category = VALUES(material_2_export_category),
            standard_or_large_amazon = VALUES(standard_or_large_amazon),
            purchased_pieces_in_a_set = VALUES(purchased_pieces_in_a_set),
            date_entered_inventory = VALUES(date_entered_inventory),
            weight_unboxed_kg = VALUES(weight_unboxed_kg),
            weight_unboxed_lb = VALUES(weight_unboxed_lb),
            packaging_weight_kg = VALUES(packaging_weight_kg),
            packaged_weight_total_kg = VALUES(packaged_weight_total_kg),
            packaged_individual_boxed_weight_lb = VALUES(packaged_individual_boxed_weight_lb),
            seller_shipper_code = VALUES(seller_shipper_code),
            case_barcode = VALUES(case_barcode),
            extra_sticker_requirements = VALUES(extra_sticker_requirements),
            length_item_cm_actual = VALUES(length_item_cm_actual),
            width_item_actual_cm = VALUES(width_item_actual_cm),
            height_item_cm_actual = VALUES(height_item_cm_actual),
            length_item_in_actual = VALUES(length_item_in_actual),
            width_item_actual_in = VALUES(width_item_actual_in),
            height_item_in_actual = VALUES(height_item_in_actual),
            packaging = VALUES(packaging),
            box_grade = VALUES(box_grade),
            box_style_model = VALUES(box_style_model),
            box_structure = VALUES(box_structure),
            length_longest_cm_boxed = VALUES(length_longest_cm_boxed),
            width_cm_boxed = VALUES(width_cm_boxed),
            depth_height_cm_boxed = VALUES(depth_height_cm_boxed),
            price_of_1_cts_box_thb = VALUES(price_of_1_cts_box_thb),
            volume_held_oz = VALUES(volume_held_oz),
            proposed_branding = VALUES(proposed_branding),
            length_in_packaged = VALUES(length_in_packaged),
            width_in_packaged = VALUES(width_in_packaged),
            depth_height_in_packaged = VALUES(depth_height_in_packaged),
            dimensional_weight_as_lbs = VALUES(dimensional_weight_as_lbs),
            charged_shipping_weight_dimensional_vs_actual = VALUES(charged_shipping_weight_dimensional_vs_actual),
            wholesale_no_extra_packaging_per_item = VALUES(wholesale_no_extra_packaging_per_item),
            wholesale_price_per_piece_thb = VALUES(wholesale_price_per_piece_thb),
            wholesale_baht_as_set = VALUES(wholesale_baht_as_set),
            pankesum_price = VALUES(pankesum_price),
            customer_price_usd = VALUES(customer_price_usd),
            sampling_sale_usa = VALUES(sampling_sale_usa),
            wholesale_for_sale_usa_estimate = VALUES(wholesale_for_sale_usa_estimate),
            wholesale_catalog_for_thailand_per_piece = VALUES(wholesale_catalog_for_thailand_per_piece),
            faire_price = VALUES(faire_price),
            shipment_method = VALUES(shipment_method),
            extra1 = VALUES(extra1),
            extra2 = VALUES(extra2),
            extra3 = VALUES(extra3),
            hts_code = VALUES(hts_code),
            species = VALUES(species),
            hts_tax = VALUES(hts_tax),
            fda_product_code = VALUES(fda_product_code),
            packaging_description = VALUES(packaging_description),
            weight_per_one = VALUES(weight_per_one),
            item_description_on_fda_pn_filing = VALUES(item_description_on_fda_pn_filing),
            pn_number = VALUES(pn_number),
            manufacturer_id_number = VALUES(manufacturer_id_number),
            extra4 = VALUES(extra4),
            extra5 = VALUES(extra5),
            extra6 = VALUES(extra6),
            extra7 = VALUES(extra7),
            socal_description = VALUES(socal_description),
            buyer_description = VALUES(buyer_description),
            customer_sku = VALUES(customer_sku),
            extra8 = VALUES(extra8),
            barcode_fnsku = VALUES(barcode_fnsku),
            upc_gtin = VALUES(upc_gtin),
            asin = VALUES(asin),
            amazon_sku = VALUES(amazon_sku),
            `case` = VALUES(`case`),
            per_case = VALUES(per_case),
            extra9 = VALUES(extra9),
            extra10 = VALUES(extra10),
            extra11 = VALUES(extra11),
            max_in_pallet = VALUES(max_in_pallet),
            cost_of_delivering_1_piece = VALUES(cost_of_delivering_1_piece),
            in_container_40_pallets = VALUES(in_container_40_pallets),
            extra12 = VALUES(extra12),
            extra13 = VALUES(extra13),
            extra14 = VALUES(extra14),
            sku = VALUES(sku),
            image = VALUES(image)";
            $result = DB::insert($insert_product);

            //update manufacturer
            $insert_manufacturer = "INSERT  INTO manufacturers (manufacturer_id, manufacturer_name, manufacturing_address, manufacturer_owner_name) VALUES " . implode(',', $manufacturers) . " ON DUPLICATE KEY UPDATE manufacturer_name = VALUES(manufacturer_name), manufacturing_address = VALUES(manufacturing_address), manufacturer_owner_name = VALUES(manufacturer_owner_name)";
            DB::insert($insert_manufacturer);

            // 
            if ($result) {
                $insert_product_category = "INSERT INTO product_category_xref (product_id, category_id) VALUES " . implode(',', $product_cate_xref) . " ON DUPLICATE KEY UPDATE category_id = VALUES(category_id)";
                DB::insert($insert_product_category);
            }
            DB::commit();
            return true;
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception($e->getMessage());
        }
    }
    public static function deleteProductByIds($ids)
    {
        $q = "UPDATE products SET `status` = 'archived' WHERE product_id IN (" . implode(',', $ids) . ")";
        $result = DB::update($q);
        return $result;
    }
    public static function transferProduct($request)
    {
        /**
         * Transfers a product from one location to another.
         *
         * @param mixed $request The request object containing the necessary information for the transfer.
         * @throws Exception If there is insufficient quantity or if the transfer fails.
         * @return array An array with the status and message of the transfer.
         */
        $location_start_id = $request->location_start;
        $location_end_id = $request->location_end;
        $products = $request->products;
        $product_ids = array_keys($products);
        try {
            DB::beginTransaction();
            $q = "SELECT product_id,quantity FROM product_location_xref
                    WHERE product_id IN ('" . implode("','", $product_ids) . "') 
                    AND location_id = $location_start_id
                    FOR UPDATE";
            $rows = DB::select($q);
            $insert_string = [];
            $update_string = [];
            foreach ($rows as $row) {
                if ($products[$row->product_id]['quantity'] >= $row->quantity) {
                    throw new Exception('Insufficient quantity');
                }
                $insert_string[] = "(" .
                    $row->product_id . "," .
                    $location_end_id . "," .
                    $products[$row->product_id]['quantity'] .
                    ")";
                $update_string[] = "(" .
                    $row->product_id . "," .
                    $location_start_id . "," .
                    $products[$row->product_id]['quantity'] .
                    ")";
            }
            // update transfer to location
            $insert_script = "INSERT INTO product_location_xref(product_id,location_id,quantity)
                VALUES " . implode(',', $insert_string) . "
                ON DUPLICATE KEY UPDATE 
                quantity = product_location_xref.quantity + VALUES(quantity),
                updated_at = NOW()";
            $result = DB::insert($insert_script);
            if (!$result) {
                throw new Exception('Transfer failed');
            }
            // update transfer from location
            $update_script = "INSERT INTO product_location_xref(product_id,location_id,quantity)
                VALUES " . implode(',', $update_string) . "
                ON DUPLICATE KEY UPDATE 
                quantity = product_location_xref.quantity - VALUES(quantity),
                updated_at = NOW()";
            $result = DB::update($update_script);
            if (!$result) {
                throw new Exception('Transfer failed');
            }
            DB::commit();
            return ["status" => "success", "message" => "Product transfered successfully"];
        } catch (Exception $e) {
            DB::rollBack();
            return ["status" => "failure", "message" => $e->getMessage()];

        }

    }
}
