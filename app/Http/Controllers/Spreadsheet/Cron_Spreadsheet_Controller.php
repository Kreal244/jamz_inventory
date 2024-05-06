<?php

namespace App\Http\Controllers\Spreadsheet;

use Exception;
use Revolution\Google\Sheets\Facades\Sheets;
use Throwable;
use Revolution\Google\Sheets\Facades\Google;
use Google\Service\Sheets as GoogleSheets;

class Cron_Spreadsheet_Controller
{
    //
    protected ?GoogleSheets $service = null;
    protected $sheet_id;
    protected $sheet;
    protected $sheet_tab;
    function __construct($sheet_id, $sheet_tab)
    {
        $this->sheet_id = $sheet_id;
        $this->sheet_tab = $sheet_tab;
        $this->sheet = Sheets::spreadsheet($sheet_id);
    }
    private function checkExistTab()
    {
        $list = array_values($this->sheet->sheetList());
        if (!in_array($this->sheet_tab, $list)) {
            $this->sheet->addSheet($this->sheet_tab);
        }
        $this->sheet->sheet($this->sheet_tab);
        return $this;
    }
    public function newSheet()
    {
        $this->sheet = Sheets::spreadsheet($this->sheet_id);
        $sheetExist = empty($this->sheet->all());
        if ($sheetExist) {
            throw new Exception('Spreadsheet not found');
        }
        $this->checkExistTab();
        // Google::sheet($this->sheet_id)->share();
        return $this;

    }
    public function checkUnSubmitData()
    {
        $data_list = $this->readSheet();
        foreach ($data_list as $row) {
            $firstValue = reset($row);
            $isEmptyRow = empty(array_filter($row));
            if (
                (!isset($firstValue) && !$isEmptyRow
                    || !empty($row['action']) && $row['action'] !== 'none')
            ) {
                throw new Exception('There are unsubmit data');
            }
        }
    }

    public function readSheet()
    {
        try {
            $rows = $this->checkExistTab()->sheet->get();
            // dd($rows);
            $header = $this->convertHeaderFields($rows->pull(0));
            $sheet_data = Sheets::collection(header: $header, rows: $rows);
            $sheet_data = $sheet_data->toArray();
            return $sheet_data;

        } catch (Throwable $e) {
            // return $e->getMessage();
            return [];

        }
    }
    public function readSheetOriginal()
    {
        try {
            $rows = $this->checkExistTab()->sheet->get();
            $header = $this->convertHeaderFields($rows->pull(0));
            return ['header' => $header, 'data' => $rows->toArray()];

        } catch (Throwable $e) {
            return $e->getMessage();

        }
    }

    public function writeSheet($header, $data = [], $default_range = 'A1')
    {
        // sort element based on first element
        if (!empty($data)) {
            usort($data, function ($a, $b) {
                $first_a = intval($a[0]);
                $first_b = intval($b[0]);
                if (boolval($first_a * $first_b)) {
                    return $first_a - $first_b;
                }
            });
        }
        array_unshift($data, $header);
        try {
            $this->checkExistTab()->sheet->range($default_range)->update($data);
            return true;
        } catch (Throwable $e) {
            dd($e->getMessage());
            return false;
        }
    }
    public function clearSheet()
    {
        $this->checkExistTab()->sheet->clear();
        return true;
    }
    private function convertHeaderFields($header)
    {
        if (empty($header))
            return [];

        $result = [];
        foreach ($header as $r) {
            $result[] = strtolower(str_replace(' ', '_', $r));
        }
        return $result;
    }
    private function revertHeaderFields($header)
    {
        if (empty($header))
            return [];

        $result = [];
        foreach ($header as $r) {
            $result[] = ucwords(str_replace('_', ' ', $r));
        }
        return $result;
    }
    //seperate action data from sheet
    public function portionData()
    {
        $sheet_data = $this->readSheet();
        $portionItems = [
            'delete' => [],
            'update' => [],
            'create' => [],
            'none' => []
        ];
        // portion data base on action
        foreach ($sheet_data as $indx => $item) {
            $action = trim(strtolower(@$item['action']));
            $firstValue = reset($item);
            if (!isset($action) || $action == 'none' || $action == '') {
                $portionItems['none'][] = $indx;
            } else {
                if (!in_array($action, ['delete', 'update', 'create'])) {
                    $message = "Invalid Action: '$action', line: " . $indx + 1 . (isset($firstValue) || empty($firstValue) ? ", Id: " . $firstValue : "");
                    throw new Exception($message);
                }
                $portionItems[$action][] = $indx;
            }
        }
        return $portionItems;
    }
}
