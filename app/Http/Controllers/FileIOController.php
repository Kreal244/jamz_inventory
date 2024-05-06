<?php

namespace App\Http\Controllers;

use App\Models\AmazoneModel;
use App\Providers\ProcsessFile;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Exception;

class FileIOController extends Controller
{
    public function __construct()
    {
        $this->middleware('web_app');
    }
    //Import file csv to save on S3
    public function input(Request $request)
    {
        $is_template = boolval($request->is_template);
        $type = $request->type;
        $user_id = (Auth::user())->id;
        if ($request->hasFile('file')) {
            try {
                $file = $request->file('file');
                $fileName = time() . "_" . $user_id . "_" . str_replace(" ","_",strtolower($file->getClientOriginalName()));

                if ($is_template)
                    $fileName = time() . "_" . "template" . "_" . $type . "." . strtolower($file->getClientOriginalExtension());

                $directory = ($is_template ? "template" : "bulk_upload") . "/" . "$type/" . Carbon::now()->format('Y-m-d') . "/" . $fileName;
                $res = Storage::disk('s3')->put($directory, file_get_contents($file), 'public');
                if (!$res)
                    throw new Exception('Upload file fail');
                if ($is_template) {
                    AmazoneModel::createOrUpdateTemplate($directory, $type);
                } else {
                    AmazoneModel::createBulk($directory, $user_id, $type);
                }
                return response()->json(["status" => 'success', "message" => "Import file success "], 200);
            } catch (\Throwable $th) {
                return response()->json(["status" => 'failure', "message" => 'Failed to import file'], 500);
            }
        } else {
            return response()->json(["status" => 'failure', "message" => 'No CSV file uploaded'], 400);
        }
    }
    // Download template for importing
    public function downloadTemplate()
    {
        $template = AmazoneModel::getTemplate();
        return response()->json($template, 200);
    }
    //Download data base on type
    public function output()
    {

    }
    public function test(){
        $handle = new ProcsessFile("template/adjust_invetory/2024-01-25/1706165825_template_adjust_invetory.csv");
        $result = $handle->getFormatedData();
        dd($result);
        return $result;
    }


}

