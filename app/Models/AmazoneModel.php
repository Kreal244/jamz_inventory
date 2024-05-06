<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use PDO;

class AmazoneModel extends Model
{
    use HasFactory;

    static function createBulk($url,$user_id,$type)
    {
        $db = DB::connection();
        $pdo = $db->getPdo();
        $q = "INSERT INTO bulk_upload_requests(bulk_url,user_id,type)
                VALUE({$pdo->quote("shelf-hawk-web-1/".$url)},$user_id,{$pdo->quote($type)})";
        $db->insert($q);
    }
    static function getBulks()
    {
        $q = "SELECT id,bulk_url,type
        FROM bulk_upload_requests
        WHERE status=0 AND is_error=0";
        $rows = DB::select($q);
        return $rows;
    }
    static function validatedBulk($items)
    {
        $q = "INSERT INTO bulk_upload_requests(id,status,updated_at)
            VALUES (" . implode(',', $items) . ")
            ON DUPLICATE KEY UPDATE 
            SET status = VALUE(status),
            updated_at=VALUE(updated_at)";
        DB::insert($q);

    }
    static function createOrUpdateTemplate($url, $type)
    {
        $db = DB::connection();
        $pdo = $db->getPdo();
        $q = "INSERT INTO csv_templates(url,type)
                VALUE({$pdo->quote("shelf-hawk-web-1/".$url)},{$pdo->quote($type)}) AS t0
                ON DUPLICATE KEY UPDATE
                url = t0.url,
                updated_at=NOW()";
        $db->insert($q);
    }
    static function getTemplate(){
        $q = "SELECT type, url FROM csv_templates";
        $rows = DB::select($q);
        foreach($rows as $r){
            $result[$r->type] = $r->url;
        }
        return $result;
    }
}
