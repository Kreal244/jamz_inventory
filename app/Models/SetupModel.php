<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class SetupModel extends Model
{
    use HasFactory;

    protected $table = 'locations';
    protected $primaryKey = 'location_id';
    protected $fillable = [
        'location_name',
        'address',
        'city',
        'state',
        'country',
        'created_at',
        'updated_at'
    ];
    public static function get($ids = [])
    {
        $condition = "WHERE TRUE";
        $cols = "";
        if (!empty($ids)) {
            $condition .= " AND location_id IN (" . implode(',', $ids) . ")";
            $cols .= ", '' as action ";
        }
        $q = "SELECT location_id,  
        IFNULL(location_name, '') AS `location_name`, 
        IFNULL(`address`, '') AS `address`, 
        IFNULL(city, '') AS city, 
        IFNULL(`state`, '') AS `state`, 
        IFNULL(country, '') AS country, 
        created_at, 
          IFNULL(updated_at, '') AS updated_at 
          $cols
        FROM locations
        $condition";
        @$rows = DB::select($q) ?: [];
        $result = [];
        foreach ($rows as $indx => $item) {
            $result[$item->location_id] = $item;
        }
        // echo $q;

        return json_decode(json_encode($result), true);
    }
    public static function create($location_list)
    {
        try {
            DB::table('locations')->insert($location_list);
            return true;
        } catch (\Exception $e) {
            return false;
        }

    }
    public static function deleteByIds($location_id_list)
    {
        $q = "DELETE FROM locations WHERE location_id IN (" . implode(',', $location_id_list) . ")";
        $result=DB::delete($q);
        if ($result)
            return true;
        return false;
    }
    public static function updateByIds($location_list)
    {
        $q = "INSERT INTO locations(location_id,location_name,address,city,state,country,updated_at)
         VALUES " . implode(',', $location_list) . "
          ON DUPLICATE KEY 
          UPDATE 
          location_name=VALUES(location_name),
          address=VALUES(address),
          city=VALUES(city),
          state=VALUES(state),
          country=VALUES(country),
          updated_at=NOW()";
        $result = DB::insert($q);
        if ($result)
            return true;
        return false;

    }

}
