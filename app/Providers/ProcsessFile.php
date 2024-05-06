<?php

namespace App\Providers;

use Exception;
use Illuminate\Support\Facades\Storage;

class ProcsessFile
{
    protected $file;
    protected $path;
    protected $data;
    public function __construct($path = "")
    {
        if (empty($path))
            throw new Exception('Path empty');
        $this->path = $path;
    }
    private function read()
    {
        $handle = fopen(env('AWS_ENDPOINT') . "/" . $this->path, 'r');
        if ($handle !== false) {
            while (($fdata = fgetcsv($handle)) !== false) {
                $data[] = $fdata;
            }
            fclose($handle);
            $this->data = $data;
        } else {
            throw new Exception("Failed to open file");
        }

        return $this;
    }
    public function getOriginalData()
    {
        /**
         * return original data readed from csv file
         */
        $fdata = $this->read()->data;
        $header = array_shift($fdata);
        $this->convertToLowcase($header);

        return ["header" => $header, "data" => $fdata];
    }
    private function convertToLowcase(&$header)
    {
        foreach ($header as $indx => $h) {
            $header[$indx] = str_replace(" ", "_", strtolower($h));
        }
    }
    public function getFormatedData()
    {
        /**
         * @return ["header"=>[],"data"=>[]]
         */
        $fdata = $this->read()->data;
        $header = array_shift($fdata);
        $this->convertToLowcase($header);
        foreach ($fdata as $row) {
            foreach ($header as $indx => $h) {
                $ndata[$h] = $row[$indx];
            }
        }
        return ["header" => $header, "data" => $ndata];
    }
}
