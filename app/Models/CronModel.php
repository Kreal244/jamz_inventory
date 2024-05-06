<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class CronModel extends Model
{
    use HasFactory;
    public static function getAccessToken($sheet_type, $mode, $limit, $account_ids = array())
    {
        $pdo = DB::getPdo();
        //query conditions for specific account ids
        $acc_conditions = "";
        if (count($account_ids) > 0) {
            $acc_ids = array_map(function ($o) use ($pdo) {
                return $pdo->quote($o);
            }, $account_ids);
            $acc_conditions .= " t1.account_id IN (" . implode(",", $acc_ids) . ") ";
        }

        // //extra query conditions for different mode
        // $mode_conditions = "";
        // $having = "";
        // if ($mode == 'TEST_MODE') {
        //     //must specify account ids
        //     if ($acc_conditions == "") {
        //         // $mode_conditions .= " AND t1.account_id IN (1) ";
        //         $mode_conditions .= " AND t1.account_id IN (" . implode(",", $account_ids) . ") ";
        //     }
        // } elseif ($mode == 'INIT_MODE') {
        //     $mode_conditions .= "
		// 		AND t1.created_at >= DATE_SUB(NOW(), INTERVAL 30 MINUTE) 
		// 	";
        // } elseif ($mode == 'LIVE_MODE') {
        //     $mode_conditions .= "
		// 		AND t1.created_at < DATE_SUB(NOW(), INTERVAL 30 MINUTE)
		// 	";
        // }

        //main query
        $q = "SELECT t1.*
            FROM spreadsheet_account_xref as t1
            WHERE
				$acc_conditions
                AND t1.sheet_type = '$sheet_type'
			LIMIT  $limit
		";
        // dd($q);
        $tokens = DB::select($q);
        return $tokens;
    }
}
