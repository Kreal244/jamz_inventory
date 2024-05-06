<?php

namespace App\Http\Controllers\Webhook\GIT;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;


class BitBucket_Webhook_Controller extends Controller {
		
    public function __construct() {}

    /**
	 * @param Request $request
     * @return JsonResponse
     */
    public function git_pull(Request $request) {
		if (!$this->validateSignature($request)) {
			return response()->json(['error' => 'Invalid signature'], 401);
		}

        $agent = $_SERVER['HTTP_USER_AGENT'];
		if (strpos($agent, 'Bitbucket-Webhooks') !== false) { //only allow connections from Bitbucket
			// get parameters
			echo "Agent: " . $agent . " :: ";
			echo shell_exec("sudo -u ubuntu /var/www/amz_ads/git_flow.sh && yarn install && yarn build");  
		} else {
			echo "Access Denied";  
		}
		die();
	}

	private function validateSignature(Request $request) {
		$expectedSignature = $request->header('X-Hub-Signature');
		if (empty($expectedSignature)) return false;

		$payload = $request->getContent();

		// Retrieve the secret key used for signing the request
		$secretKey = env('BITBUCKET_WEBHOOK');

		// Calculate the actual signature based on the payload and secret key
		$actualSignature = 'sha256=' . hash_hmac('sha256', $payload, $secretKey);

		// Compare the expected signature with the actual signature
		if (hash_equals($actualSignature, $expectedSignature)) {
			// The signature is valid
			return true;
		} else {
			// The signature is not valid
			return false;
		}
	}

}