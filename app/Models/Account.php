<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Account extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'accounts';
    protected $primaryKey = 'account_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'company',
        'address1',
        'address2',
        'city',
        'state',
        'country',
        'primary_user'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];
    public static function getAccounts($user_id)
    {
        $quoted_user_id = DB::getPdo()->quote(trim($user_id));
        $q = "  SELECT 
                    t1.*,
                    t2.email
                FROM accounts AS t1
                LEFT JOIN users AS t2 ON t1.primary_user = t2.id
                WHERE 
                    t1.primary_user <> 0
                    AND (
                        t1.primary_user = $quoted_user_id
                        OR t1.account_id IN (
                            SELECT t2.account_id FROM user_access AS t1
                            LEFT JOIN accounts AS t2 ON t1.account_id = t2.account_id
                            WHERE 
                                t1.user_id = $quoted_user_id
                        )
                    )
                GROUP BY t1.account_id
                ORDER BY IFNULL(t1.company, '') ASC
            ";
        $rows = DB::select($q);
        return $rows;
    }
}
