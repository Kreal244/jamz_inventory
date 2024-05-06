<?php

namespace App\Jobs;

use App\Jobs\Product\ProductListingJob;
use App\Jobs\Setup\LocationListingJob;
use App\Models\CronModel;
use App\Models\SpreadsheetModel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class UpdateSheetJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct($mode = 'LIVE_MODE')
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $action_tasks = SpreadsheetModel::getSheetActionTask();
        if (!empty($action_tasks)) {
            foreach ($action_tasks as $action_task) {
                switch ($action_task->sheet_tab) {
                    case 'locations':
                        $credential = CronModel::getAccessToken($action_task->sheet_tab, 'TEST_MODE', 1, [$action_task->account_id]);
                        $job = new LocationListingJob($credential[0], 'TEST_MODE',$action_task);
                        dispatch($job);
                        // $job->handle();
                        break;
                    case 'products':
                        $credential = CronModel::getAccessToken($action_task->sheet_tab, 'TEST_MODE', 1, [$action_task->account_id]);
                        $job = new ProductListingJob($credential[0], 'TEST_MODE',$action_task);
                        dispatch($job);
                        // $job->handle();
                        break;
                }
            }
        }
    }
}
