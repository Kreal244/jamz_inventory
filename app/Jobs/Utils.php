<?php
namespace App\Jobs;

class Utils
{

    public static function removeSpecialCharacters($string)
    {
        /**
         * Removes all non-numeric and non-decimal characters from a string and converts it to a float.
         *
         * @param string $string The input string to remove special characters from.
         * @return float The input string converted to a float with only numeric and decimal characters.
         */
        str_replace(',', '.', $string);
        $numberString = preg_replace('/[^0-9.]/', '', $string);
        return floatval($numberString);
    }

    public static function generateUuid($type, $option = null)
    {
        /**
         * Generates a unique identifier (UUID) based on the given type and optional option.
         *
         * @param string $type The type used to generate the UUID.
         * @param string|null $option An optional parameter used to further customize the UUID.
         * @return string The generated UUID.
         */
        $option_hash = '';
        if (!empty($option)) {
            $option_hash = "-" . substr(md5($option), 0, 4);
        }
        $uuid = substr(md5($type), 0, 4) . $option_hash . "-" . substr(str_replace('-', '', bin2hex(random_bytes(8))), 0, 8);
        return $uuid;
    }
    public static function formatNumber($value)
    {
        return floatval(str_replace(',', '.', $value));
    }

}