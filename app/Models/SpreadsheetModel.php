<?php

namespace App\Models;

use Exception;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class SpreadsheetModel extends Model
{
	use HasFactory;
	protected $table = 'spreadsheet_account_xref';
	public static function saveSheet($account_id, $sheet_id, $sheet_type, $shared_email)
	{
		$sheet_hash = $account_id . '-' . md5($sheet_type);
		//main query
		$q = "
			INSERT INTO spreadsheet_account_xref (sheet_hash,account_id,sheet_id,sheet_type,shared_email,date_range,status			)
			VALUES ( 
					" . DB::getPdo()->quote($sheet_hash) . ",
					" . DB::getPdo()->quote($account_id) . ",
					" . DB::getPdo()->quote($sheet_id) . ",
					" . DB::getPdo()->quote($sheet_type) . ",
					" . DB::getPdo()->quote($shared_email) . ",
					'Last 30 Days',
					'active')
			ON DUPLICATE KEY UPDATE
				`sheet_id`		= VALUES(`sheet_id`),
				`shared_email`	= VALUES(`shared_email`),
				`status`	= VALUES(`status`),
				`date_range` = VALUES(`date_range`),
				`updated_at`	= VALUES(`updated_at`)
			
		";
		DB::insert($q);
	}
	public static function getSheetByType($account_id, $sheet_type)
	{
		//main query
		$q = "  SELECT t1.*
				FROM spreadsheet_account_xref AS t1
				WHERE
					t1.sheet_hash LIKE '$account_id-%'
					AND t1.sheet_type = '$sheet_type'
				LIMIT 1
		";
		$db = DB::connection();
		$rows = $db->select($q);
		return @$rows[0];
	}
	public static function isValidSheetType($sheet_type)
	{
		//main query
		$q = "  SELECT t1.*
				FROM spreadsheets AS t1
				WHERE
					t1.sheet_type = '$sheet_type'
				LIMIT 1
		";
		$db = DB::connection();
		$rows = $db->select($q);
		return !empty($rows[0]);
	}
	public static function getSheetsByAccountIds($account_ids)
	{
		if (empty($account_ids))
			return [];

		//main query
		$q = "  SELECT 
					t1.account_id,
					CONCAT('[', GROUP_CONCAT(DISTINCT JSON_OBJECT(
						'sheet_type', t1.sheet_type,
						'sheet_id', t1.sheet_id,
						'sales_start_date',t1.sales_start_date,
						'sales_end_date',t1.sales_end_date,
						'date_range',t1.date_range
					)), ']') AS sheet_ids
				FROM spreadsheet_account_xref AS t1
				WHERE
					t1.account_id IN ('" . implode("','", $account_ids) . "')
				GROUP BY t1.account_id
			";
		$db = DB::connection();
		$rows = $db->select($q);
		return $rows;
	}
	public static function getSheetIdByAccId($account_id, $sheet_type)
	{
		if (empty($account_id))
			return [];

		//main query
		$q = "  SELECT 
					t1.*
				FROM spreadsheet_account_xref AS t1
				WHERE
					t1.account_id = '$account_id'
					AND t1.sheet_type = '$sheet_type'
				LIMIT 1
			";
		$db = DB::connection();
		$rows = $db->select($q);
		// 
		return @$rows[0]->sheet_id;
	}
	public static function getAllSheetIdByAccId($account_id)
	{
		if (empty($account_id))
			return [];

		//main query
		$q = "  SELECT 
					t1.*
				FROM spreadsheet_account_xref AS t1
				WHERE
					t1.account_id = '$account_id'
			";
		$db = DB::connection();
		$rows = $db->select($q);
		$result = [];
		foreach ($rows as $r) {
			$result[$r->sheet_type] = $r;
		}
		// 
		return @$result;
	}
	public static function createSheetActionTask($value)
	{
		try {
			$q = "INSERT INTO spreadsheet_actions(sheet_id,account_id,sheet_tab,`create`,create_status,`update`,update_status,`delete`,delete_status,updated_at)
			VALUES $value ";
			DB::insert($q);
			return true;
		} catch (Exception $e) {
			// dd($e);
			return false;
		}
	}
	public static function updateSheetActionTask($sheet_id, $sheet_tab, $value)
	{
		try {
			DB::beginTransaction();
			//update tasks
			$q = "UPDATE spreadsheet_actions
		 		SET $value, 
		 		updated_at = NOW()
		 		WHERE sheet_id = '$sheet_id' AND sheet_tab = '$sheet_tab'";
			$result = DB::update($q);
			if ($result) {
				DB::update("UPDATE spreadsheet_actions
				SET
				is_finish = IFNULL(spreadsheet_actions.create_status,1)*IFNULL(spreadsheet_actions.update_status,1)*IFNULL(spreadsheet_actions.delete_status,1)
				WHERE sheet_id = '$sheet_id' AND sheet_tab = '$sheet_tab'");
			}
			DB::commit();
			return true;

		} catch (Exception $e) {
			DB::rollBack();
			return false;
		}
	}
	public static function getSheetActionTask()
	{
		$q = "SELECT * FROM spreadsheet_actions
		where is_finish >= 1";
		$db = DB::connection();
		$rows = $db->select($q);
		return $rows;
	}
	public static function deleteSheetactionTask($sheet_id, $sheet_tab)
	{
		$q = "DELETE FROM spreadsheet_actions
		WHERE sheet_id = '$sheet_id' AND sheet_tab = '$sheet_tab' AND is_finish >= 1";

		$result = DB::delete($q);
		return $result;
	}
	public static function disruptSheetactionTask($sheet_id, $sheet_tab)
	{
		$q = "DELETE FROM spreadsheet_actions
		WHERE sheet_id = '$sheet_id' AND sheet_tab = '$sheet_tab'";
		$result = DB::delete($q);
		return $result;
	}
}
