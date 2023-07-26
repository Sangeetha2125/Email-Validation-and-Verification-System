<?php

namespace App\Http\Helpers;
use Illuminate\Support\Facades\Storage;

class Listhelper{

    /**
 * Get email address key of the csv file.
 */
    public static function email_verify_get_key_of_email($email_row) {
        foreach ($email_row as $key => $row) {
        if (!empty($row)) {
          $validator = validator(['email' => $row]);
          if(!$validator->fails())
          {
            return $key;
          }
        }
        }
        return '';
    }

    public static  function array_to_csv($array) {
        $datas = array();
        foreach ($array as $key => $value) {
          if (is_array($value)) {
            foreach ($value as &$item) {
              $item = '"' . $item . '"';
            }
            $datas[$key] = implode(',', $value);
          }
          else {
            $datas[$key] = $value;
          }
        }
        $csv_format = implode(PHP_EOL, $datas);
        return $csv_format;
      }


    public static function file_save_data($data,$type,$listid){

      $filename = $type.'_'.$listid.'_' . date('YmdHis').'.csv'; // Generate a unique
      Storage::disk('public')->put($filename, $data);
      //$filePath = Storage::disk('public')->path($filename);
      $symlink = '/storage/'.$filename;
      return $symlink;
    }
}