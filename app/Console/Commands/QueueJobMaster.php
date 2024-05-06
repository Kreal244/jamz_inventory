<?php

namespace App\Console\Commands;

use App\Http\Controllers\SpreadsheetController;
use Illuminate\Console\Command;


class QueueJobMaster extends Command {
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'queue_job:master_cron';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Scheduled Master Cronjob';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    protected $spreadsheet;
    public function __construct() {
        parent::__construct();
        $this->spreadsheet = new SpreadsheetController();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle() {

        // No mode
		$this->regular();

		// Live Mode
		$this->live_mode();

		// Init Mode
		$this->init_mode();
		
    }

	private function regular() {
		if(date('i') % 1 == 0){
            $this->spreadsheet->updateSheet();
        }
	}

	private function init_mode() {

	}

	private function live_mode() {

	}

}
