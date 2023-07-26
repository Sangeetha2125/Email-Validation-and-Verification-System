<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\List;
use App\Models\ListsResults;

use Illuminate\Support\Facades\Storage;
use App\Http\Helpers\Listhelper;

class ListCsvProcess implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public $list;
    public function __construct($list)
    {
        $this->list=$list;
    }

    /**
     * Execute the job.
     */
    public function handle()
    {
        $count = 0;
        $listitems = $this->list;
        $file_path =$listitems->file_path;
        $file = fopen($file_path,'r+');
        $emails = array();
        while(!feof($file)) {
            $data = fgetcsv($file);
            $emails[] = $data;
        }
        $listitems['total']= count(array_filter($emails));
        $listitems->save();

        $disposablefile_path = public_path('assets/files/disposable.csv') ;
        $disposablefile = fopen($disposablefile_path, 'r+');
        $disposable = array();
        while(!feof($disposablefile)) {
            $data = fgetcsv($disposablefile);
            $disposable[] = $data[0];
        }

        $rolefile_path = public_path('assets/files/role.csv') ;
        $rolefile = fopen($rolefile_path,'r+');
        $roles = array();
        while(!feof($rolefile)) {
            $roledata = fgetcsv($rolefile);
            if(is_array($roledata)){
                $roles[] = $roledata[0];

            }

        }
        if(!empty($emails)){
            $results = array();
            $results['results']['spam_filter'] = [];
            $results['results']['role_filter'] = [];
            $results['results']['original_id'] = [];
            $results['results']['domain_filter'] = [];
            $results['results']['syntex_error']=[];
            $count = 0;
            $total_count = count(array_filter($emails));
            $count++;
            foreach (array_filter($emails) as $key => $emailData) {
                $count++;
                if (!empty($emailData)) {
                    $emailkey = Listhelper::email_verify_get_key_of_email($emailData);
                    $email = $emailData[$emailkey];
                    if (!empty($email)) {
                        if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
                            $ids = explode("@", $email);
                            $name = $ids[0];
                            $domain = $ids[1];
                            if (in_array($domain, $disposable)) {
                                $results['results']['spam_filter'][$email] = $emailData;
                            }
                            else {
                                if (isset($results['results']['valid_domains'][$domain])) {
                                  if (in_array($name, $roles)) {
                                    $results['results']['role_filter'][$email] = $emailData;
                                  }
                                  else {
                                    $results['results']['original_id'][$email] = $emailData;
                                  }
                                }
                                elseif (checkdnsrr($domain, "MX")) {
                                  $results['results']['valid_domains'][$domain] = $domain;
                                  if (in_array($name, $roles)) {
                                    $results['results']['role_filter'][$email] = $emailData;
                                  }
                                  else {
                                    $results['results']['original_id'][$email] = $emailData;
                                  }
                                }
                                else {
                                    $results['results']['domain_filter'][$email] = $emailData;
                                }
                              }
                        }
                        else {
                            $results['results']['syntex_error'][$email] = $emailData;
                        }
                    }

                }
                $emailkey = $key+1;
                if ($count >= 100 || $emailkey == $total_count) {
                    $listitems['progress']=$emailkey;
                    $listitems->save();
                    $count = 0;
                }
            }

            $list_result = new ListsResults;
            $list_result->list_id = $listitems->id;

            if(isset($results['results']['original_id']) && !empty($results['results']['original_id']) ){
                $count_valid_email = count($results['results']['original_id']);
                $valid_data = $results['results']['original_id'];
                $valid_email = Listhelper::array_to_csv($valid_data);
                $validFile = Listhelper::file_save_data($valid_email,'valid',$listitems->id);

                $list_result->valid_path=$validFile ;
                $list_result->valid_count=$count_valid_email ;
            }

            if(isset($results['results']['spam_filter']) && !empty($results['results']['spam_filter'])){
                $count_spam_email = count($results['results']['spam_filter']);
                $spam_data = $results['results']['spam_filter'];
                $spam_emails = Listhelper::array_to_csv($spam_data);
                $spamFile = Listhelper::file_save_data($spam_emails,'spam',$listitems->id);

                $list_result->spam_path=$spamFile;
                $list_result->spam_count=$count_spam_email;
            }

           if(isset($results['results']['role_filter']) && !empty($results['results']['role_filter'])){
                $count_role_email = count($results['results']['role_filter']);
                $role_data = $results['results']['role_filter'];
                $role_emails = Listhelper::array_to_csv($role_data);
                $roleFile = Listhelper::file_save_data($role_emails,'role',$listitems->id);

                $list_result->role_path=$roleFile;
                $list_result->role_count=$count_role_email;
            }

            if(isset($results['results']['domain_filter']) && !empty($results['results']['domain_filter'])){
                $count_domain_email = count($results['results']['domain_filter']);
                $domain_data = $results['results']['domain_filter'];
                $domain_emails = Listhelper::array_to_csv($domain_data);
                $domainFile = Listhelper::file_save_data($domain_emails,'domain',$listitems->id);

                $list_result->domain_path=$domainFile ;
                $list_result->domain_count=$count_domain_email ;
            }

            if(isset($results['results']['syntex_error']) && !empty($results['results']['syntex_error'])){
                $count_invaild_email = count($results['results']['syntex_error']);
                $invaild_data = $results['results']['syntex_error'];
                $invaild_emails = Listhelper::array_to_csv($invaild_data);
                $invaildFile = Listhelper::file_save_data($invaild_emails,'invaild',$listitems->id);

                $list_result->invalid_path=$invaildFile ;
                $list_result->invalid_count=$count_invaild_email ;

            }
            if($list_result->save()){
                $listitems['status']= 'completed';
                $listitems->save();
            }
        }
    }
}
