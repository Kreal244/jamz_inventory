<?php

use App\Http\Controllers\BuyersController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FileIOController;
use App\Http\Controllers\InventoriesController;
use App\Http\Controllers\LogController;
use App\Http\Controllers\OptionController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\SetupController;
use App\Http\Controllers\SpreadsheetController;
use App\Http\Controllers\VendorsController;
use App\Providers\AWSS3\ProccessFileCSV;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Webhook\GIT\BitBucket_Webhook_Controller;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
// General
Route::controller(BitBucket_Webhook_Controller::class)->group(function () {
    Route::post('/webhook/git_pull', 'git_pull');
});

Route::redirect('/', '/dashboard');

Route::controller(DashboardController::class)->group(function () {
    Route::get('/dashboard', 'index')->middleware(['auth', 'verified'])->name('dashboard');
    // ->middleware(['auth', 'verified'])->name('dashboard');
});
Route::controller(SetupController::class)->group(function () {
    Route::get('/setup', 'index')->middleware(['auth', 'verified'])->name('setup');
    Route::post('/setup/create', 'create');

});
Route::controller(ProductController::class)->group(function () {
    Route::get('/products', 'index')->middleware(['auth', 'verified'])->name('products');
    Route::post('/products/create', 'create');
    Route::post('/products/edit', 'edit');
    Route::post('/products/delete', 'delete');
    Route::post('/products/transfer', 'transfer');
    Route::post(
        '/products/import_image/{product_id}',
        'addOrUpdateImageToS3'
    );
});
Route::controller(FileIOController::class)->group(function () {
    Route::post('/import', 'input')->name('import');
    Route::get('/export', 'output')->name('export');
    Route::get('/template', 'downloadTemplate')->name('template');
    Route::get('/test', 'test');
});
Route::controller(PurchaseController::class)->group(function () {
    Route::get('/purchases', 'index')->middleware(['auth', 'verified'])->name('purchases');
});
Route::controller(SaleController::class)->group(function () {
    Route::get('/sales', 'index')->middleware(['auth', 'verified'])->name('sales');
});
Route::controller(LogController::class)->group(function () {
    Route::get('/logs', 'index')->middleware(['auth', 'verified'])->name('logs');
});
Route::controller(OptionController::class)->group(function () {
    Route::get('/options', 'index')->middleware(['auth', 'verified'])->name('options');
});
Route::controller(VendorsController::class)->group(function () {
    Route::get('/vendors', 'index')->middleware(['auth', 'verified'])->name('vendors');
});
Route::controller(BuyersController::class)->group(function () {
    Route::get('/buyers', 'index')->middleware(['auth', 'verified'])->name('buyers');
});
Route::controller(InventoriesController::class)->group(function () {
    Route::get('/inventories', 'index')->middleware(['auth', 'verified'])->name('inventories');
});
Route::controller(SpreadsheetController::class)->group(function () {
    Route::post('/spreadsheet/edit', 'create')->middleware(['auth', 'verified']);
    Route::get('/spreadsheet/pull/{sheet_type}', 'pull_data')->middleware(['auth', 'verified']);
    Route::get('/spreadsheet/push/{sheet_type}', 'push_data')->middleware(['auth', 'verified']);
    Route::get('update-sheet', 'updateSheet');
});
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/**
 * TEST AREA
 */
require __DIR__ . '/auth.php';
