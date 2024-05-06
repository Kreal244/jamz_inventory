<?php

namespace App\Http\Middleware;

use App\Models\Account;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class WebApp
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
          $user = auth()->user();
        // Redirect for Enterprise
        if (!empty($user)) { // Login
            $accounts = Account::getAccounts($user->id);
            $cur_account = NULL;
            $cur_acc_id = session('cur_acc_id');
            if (!empty($cur_acc_id)) {
                foreach ($accounts as $acc) {
                    if ($acc->account_id == $cur_acc_id) {
                        $cur_account = $acc;
                        break;
                    }
                }
            }
            if (empty($cur_account)) {
                $cur_account = $accounts[0];
            }
            session([
                'accounts' => $accounts,
                'cur_account' => $cur_account,
                'cur_acc_id' => $cur_account->account_id
            ]);
        }
        return $next($request);
    }
}
