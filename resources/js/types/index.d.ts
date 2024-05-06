export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    is_admin: number;
}
export interface Products {
    product_id: string;
    product_name: string;
    active?: "active" | "archived";
    type?: string;
    category?: string;
    vendor?: string;
    sku_10digits?: string;
    sku?: string;
    item_description?: string;
    export_description?: string;
    material?: string;
    material_2_export_category?: string;
    standard_or_large_amazon?: string;
    purchased_pieces_in_a_set?: number;
    date_entered_inventory?: string;
    weight_unboxed_kg?: number;
    weight_unboxed_lb?: number;
    packaging_weight_kg?: number;
    packaged_weight_total_kg?: number;
    packaged_individual_boxed_weight_lb?: number;
    seller_shipper_code?: string;
    case_barcode?: string;
    extra_sticker_requirements?: string;
    length_item_cm_actual?: number;
    width_item_actual_cm?: number;
    height_item_cm_actual?: number;
    length_item_in_actual?: number;
    width_item_actual_in?: number;
    height_item_in_actual?: number;
    packaging?: string;
    box_grade?: string;
    box_style_model?: string;
    box_structure?: string;
    length_longest_cm_boxed?: number;
    width_cm_boxed?: number;
    depth_height_cm_boxed?: number;
    price_of_1_cts_box_thb?: number;
    volume_held_oz?: string;
    proposed_branding?: string;
    length_in_packaged?: number;
    width_in_packaged?: number;
    depth_height_in_packaged?: number;
    dimensional_weight_as_lbs?: number;
    charged_shipping_weight_dimensional_vs_actual?: number;
    wholesale_no_extra_packaging_per_item?: number;
    wholesale_price_per_piece_thb?: number;
    wholesale_baht_as_set?: number;
    pankesum_price?: number;
    customer_price_usd?: number;
    sampling_sale_usa?: number;
    wholesale_for_sale_usa_estimate?: number;
    wholesale_catalog_for_thailand_per_piece?: string;
    faire_price?: number;
    shipment_method?: string;
    extra1?: string;
    extra2?: string;
    extra3?: string;
    hts_code?: string;
    species?: string;
    hts_tax?: string;
    fda_product_code?: string;
    packaging_description?: string;
    weight_per_one?: string;
    item_description_on_fda_pn_filing?: string;
    pn_number?: string;
    manufacturer_id_number?: string;
    manufacturing_address?: string;
    manufacturer_name?: string;
    manufacturer_owner_name?: string;
    extra4?: string;
    extra5?: string;
    extra6?: string;
    extra7?: string;
    socal_description?: string;
    buyer_description?: string;
    customer_sku?: string;
    extra8?: string;
    barcode_fnsku?: string;
    upc_gtin?: number;
    asin?: string;
    amazon_sku?: string;
    case?: string;
    per_case?: number;
    extra9?: string;
    extra10?: string;
    extra11?: string;
    max_in_pallet?: number;
    cost_of_delivering_1_piece?: number;
    in_container_40_pallets?: number;
    extra12?: string;
    extra13?: string;
    extra14?: string;
    locations?: any;
    image?: string;
}
export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
    };
};
export type TabsProps = {
    name: string;
    icon?: any;
    active?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
};
export type ProductPageProps = PageProps & {
    products: Products[];
};

export interface DrawerProps {
    show: boolean;
    handleClose?: () => void;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    size?: string;
}
//
export interface Setups {
    location_id?: number;
    location_name?: string;
    address?: string;
    state?: string;
    city?: string;
    country?: string;
}
export interface ProductSetupXref extends Setups {
    quantity: number;
}
export type SetupsPageProps = PageProps & {
    locations: Setups[];
};
export interface Spreadsheet {
    sheet_hash: string;
    account_id: number;
    sheet_id: string;
    sheet_type: string;
    shared_email: string;
    status?: string;
    error_msg?: string;
    sale_start_date?: string;
    sale_end_date?: string;
    date_range?: string;
    created_at?: string;
    updated_at?: string;
}
export type SheetList = {
    [sheet_type: string]: Spreadsheet;
};
export type SpreadsheetProps = {
    spreadsheets: SheetList;
};
