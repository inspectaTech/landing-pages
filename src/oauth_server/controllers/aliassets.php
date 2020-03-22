<?php
defined('_JEXEC') or die;

class TableAliAssets extends JTableNested
{
    public $mode = "dev";//developer, prod, production
    // $pairData = (object)[];
    // $pairData->link_id = $gid;

    public function __construct($db)
    {
        parent::__construct('#__aliintro','id',$db);
    }

    public function getMenuData($moId)
    {

        $db = jFactory::getDbo();
        $query = $db->getQuery(true);
        $query->select($db->quoteName(array('id','title','menu_data','menu_options')));
        $query->from($db->quoteName('#__aliintro'));
        $query->where($db->quoteName('module_id') . ' LIKE '. $db->quote($moId));//aliintro Test Page
        $db->setQuery($query);

        $menuData = json_encode($db->loadObject());
        return $menuData;


    }//end getMenuData

	public function getFakeData($moId)
	{
		//run some $db query
		//return something;
		return "absolutely nothing!";

	}

	public function uploadGPSData($str)
	{
		/*
		$db = jFactory::getDbo();
		$query = 'ALTER TABLE `#__ali_gpscnx` ADD `data_str` TEXT NOT NULL AFTER `user_id`';
		$db->setQuery($query);
		$result = $db->query();
		return $result;
		*/
    if(gettype($str) == "string"){
      $dStr = json_decode($str);
    }else {
      $dStr = $str;
    }


		$db = jFactory::getDbo();
    $query = $db->getQuery(true);
    if(!isset($dStr->latti)){$dStr->latti = "";}
    if(!isset($dStr->longi)){$dStr->longi = "";}
    if(!isset($dStr->accur)){$dStr->accur = "";}
		if(!isset($dStr->duration)){$dStr->duration = "";}
		if(!isset($dStr->picture)){$dStr->picture = "";}
		if(!isset($dStr->text)){$dStr->text = "";}
		if(!isset($dStr->phone)){$dStr->phone = "";}
		if(!isset($dStr->email)){$dStr->email = "";}
		if(!isset($dStr->share_info)){$dStr->share_info = "";}
		if(!isset($dStr->my_notes)){$dStr->my_notes = "";}
		if(!isset($dStr->password)){$dStr->password = "";}
		if(!isset($dStr->public_notes)){$dStr->public_notes = 0;}
		if(!isset($dStr->token_endpoint)){$dStr->token_endpoint = "";}

        //insert columns
        $columns = array('trans_nbr','lattitude','longitude',
		'accuracy','milliseconds','expires','duration','user_type','user_id',
		'picture','text','share_info','my_notes','public_notes','token_endpoint','password');

		$cur_gps_user = jFactory::getUser();
		$gps_user = $cur_gps_user->id;

		$pair_uType = ($cur_gps_user->guest == 0) ? "member" : "guest";//$dStr->user_type

		$now = new DateTime();
		//server set time to eliminate user manipulation
		$timeCheck = $now->getTimestamp() * 1000;//$dStr->timestamp
		$timeStr = $now->format(DateTime::COOKIE);//sets itself this isn't needed
		//returns example: Monday, 15-Aug-2005 15:52:01 UTC
		//php DateTime http://php.net/manual/en/class.datetime.php
		//1.3 min diff between php & js times (php was slower)

		//expires should be php driven too X 4min for guests
		$minutes_to_add = 5;//4 min lifespan
		$now->add(new DateInterval('PT' . $minutes_to_add . 'M'));
        $expCheck = $now->getTimestamp() * 1000;//$dStr->temp_expires;

        //insert values
        $values = array(
        $db->quote(htmlentities($dStr->transaction)),
    $db->quote(htmlentities($dStr->latti)),
		$db->quote(htmlentities($dStr->longi)),
		$db->quote(htmlentities($dStr->accur)),
		$timeCheck,
		$expCheck,
		$db->quote(htmlentities($dStr->temp_duration)),
		$db->quote(htmlentities($pair_uType)),
		$db->quote(htmlentities($gps_user)),
		$db->quote(htmlentities($dStr->picture)),
		$db->quote(htmlentities($dStr->text)),
		$db->quote(htmlentities($dStr->share_info)),
		$db->quote(htmlentities($dStr->my_notes)),
		htmlentities($dStr->public_notes),
		$db->quote(htmlentities($dStr->token_endpoint)),
		$db->quote(htmlentities($dStr->password))
		);//$db->quote(htmlentities($str)) ,$dStr->phone,$dStr->email,$dStr->data_str
    // $db->quote(htmlentities(pubic_notes))

        //prep the insert query
        $query->insert($db->quoteName('#__ali_gpscnx'))
        ->columns($db->quoteName($columns))
        ->values(implode(',',$values));
        $db->setQuery($query);
		$results = $db->execute();

		//bring back users data

		if($results != 1)
		{
			$retData = "upload failed";
			return $retData;

		}

		$rev_Data = $this->get_review($dStr->transaction);

		return $rev_Data;



	}//end uploadGPSData

	function get_review($tNbr)
	{
		$db = jFactory::getDbo();


		$query = " SELECT `id`,`picture`,`trans_nbr`,`milliseconds`,`expires`,`user_type`,`user_id`,`text`,`share_info`,`my_notes`,`public_notes`,`token_endpoint` FROM #__ali_gpscnx WHERE `trans_nbr` = " . $db->quote(htmlentities($tNbr));

        $db->setQuery($query);

       //$results = $db->loadObjectList();////loadRowList()
		//$results = $db->loadResult();
		//$results = $db->loadAssocList();
		$row = $db->loadRow();
		$results = "";



			$id = ($row[0] != "") ? "\"id\":\"" . $row[0] . "\"" : "";
			$picture = ($row[1] != "") ? ",\"picture\":\"" . $row[1] . "\"" : "";
			$trans_nbr = ($row[2] != "") ? ",\"transaction\":\"" . $row[2] . "\"" : "";
			$milli = ($row[3] != "") ? ",\"timestamp\":" . $row[3] . "" : "";
			$expires = ($row[4] != "") ? ",\"expires\":" . $row[4] . "" : "";
			$user_type = ($row[5] != "") ? ",\"user_type\":\"" . $row[5] . "\"" : "";
			$user_id = ($row[6] != "") ? ",\"user_id\":\"" . $row[6] . "\"" : "";
			$text = ($row[7] != "") ? ",\"text\":\"" . $row[7] . "\"" : "";
			$share_info = ($row[8] != "") ? ",\"share_info\":\"" . $row[8] . "\"" : "";
			$my_notes = ($row[9] != "") ? ",\"my_notes\":\"" . $row[9] . "\"" : "";
			$public_notes = ($row[10] != "") ? ",\"public_notes\":" . $row[10] . "" : "";
			$token_endpoint = ($row[11] != "") ? ",\"token_endpoint\":\"" . $row[11] . "\"" : "";

			$retData = "{" . $id . $picture . $trans_nbr . $milli . $expires . $user_type . $user_id . $text . $share_info . $my_notes .  $public_notes . $token_endpoint . "}";

		return $retData;

	}//end get_review

	public function pairData($str)
	{

		$pStr = json_decode($str);

		$now = new DateTime();
		//miliseconds expired check
		$ms_exp_check = $now->getTimestamp() * 1000;//*1000 adds ms
		$guest_pair_duration = "5 days";


		$db = jFactory::getDbo();
        $query = $db->getQuery(true);

		if(!isset($pStr->duration)){$pStr->duration = "";}
		if(!isset($pStr->picture)){$pStr->picture = "";}
		if(!isset($pStr->text)){$pStr->text = "";}
		if(!isset($pStr->phone)){$pStr->phone = "";}
		if(!isset($pStr->email)){$pStr->email = "";}
		if(!isset($pStr->password)){$pStr->password = "";}
		if(!isset($pStr->my_notes)){$pStr->my_notes = "";}

        //insert columns
        $columns = array('sndr_id','rcvr_id','rcvr_user_type',
		'req_nbr','my_notes','init_ms','init_date','duration','exp_ms','exp_date',
		'dcnx');

		$cur_pair_user = jFactory::getUser();
		$pair_user = ($cur_pair_user->id != 0) ? $cur_pair_user->id : $pStr->send_id;

        //insert values
        $values = array(
        $db->quote(htmlentities($pair_user)),
		$db->quote(htmlentities($pStr->receive_id)),
		$db->quote(htmlentities($pStr->user_type)),
		$db->quote(htmlentities($pStr->req_nbr)),
		$db->quote(htmlentities($pStr->my_notes)),
        $ms_exp_check/*$pStr->init_ms*/,
		$db->quote(htmlentities($pStr->init_date)),
		$db->quote(htmlentities($pStr->duration)),
		$pStr->exp_ms,
		$db->quote(htmlentities($pStr->exp_date)),
		$db->quote(htmlentities($pStr->dcnx))
		);//$db->quote(htmlentities($str))


        //prep the insert query
        $query->insert($db->quoteName('#__arc_pair_user_user'))
        ->columns($db->quoteName($columns))
        ->values(implode(',',$values));
        $db->setQuery($query);
		$results = $db->execute();

		return $results;


	}//end pairData


	public function scanRequests($str)
	{
		$dStr = json_decode($str);

    $has_GPS = (isset($dStr->latti) && $dStr->latti != "" && isset($dStr->longi) && $dStr->longi != "") ? "true" : "false";
    $has_codeword = (isset($dStr->password) && $dStr->password != "" ) ? "true" : "false";

    //return "has codeword = " . $has_codeword;

    if($has_GPS == "true")
    {

        if(isset($dStr->lat_rng_mod))
    		{
    			if($dStr->lat_rng_mod > .0000001)
    			{
    				$lat_rng_mod = $dStr->lat_rng_mod;
    			}
    			else
    			{
    				$lat_rng_mod = .000055;
    			}

    		}
    		else
    		{
    			$lat_rng_mod = .000055;//gives an automatic 20ft
    		}

    		if(isset($dStr->lon_rng_mod))
    		{
    			 if($dStr->lon_rng_mod > .0000001)
    			 {
    				 $lon_rng_mod = $dStr->lon_rng_mod;
    			 }
    			 else
    			 {
    				 $lon_rng_mod = .000091;//gives an automatic 20ft
    			 }
    		}
    		else
    		{
    			 $lon_rng_mod = .000091;
    		}

    		//this adds accuracy refactoring that hopes to neutralize the accuracy inaccuracies.
    		if(isset($dStr->lat_ref))
    		{
    			 $lat_rng_mod =  $lat_rng_mod + $dStr->lat_ref;
    		}

    		if(isset($dStr->lon_ref))
    		{
    			 $lon_rng_mod =  $lon_rng_mod + $dStr->lon_ref;
    		}



    		//i would like to make sure client can't add to range using php

    		$lat_plus_mod = $dStr->latti + $lat_rng_mod;
    		$lat_minus_mod = $dStr->latti - $lat_rng_mod;

    		$lon_plus_mod = $dStr->longi + $lon_rng_mod;
    		$lon_minus_mod = $dStr->longi - $lon_rng_mod;


    		$future_span = $dStr->future_span;
    		$past_span = $dStr->past_span;


    		if($lat_plus_mod > $lat_minus_mod)
    		{
    			$lat_1 = $lat_minus_mod;
    			$lat_2 = $lat_plus_mod;
    		}
    		else
    		{
    			$lat_1 = $lat_plus_mod;
    			$lat_2 = $lat_minus_mod;
    		}


    		if($lon_plus_mod > $lon_minus_mod)
    		{
    			$lon_1 = $lon_minus_mod;
    			$lon_2 = $lon_plus_mod;
    		}
    		else
    		{
    			$lon_1 = $lon_plus_mod;
    			$lon_2 = $lon_minus_mod;
    		}

    }//if has_GPS == true

    //$method = ($has_GPS == "true" && $has_codeword == "true") ? "both" : ($has_GPS == "true" && $has_codeword == "false") ? "GPS" : ($has_GPS == "false" && $has_codeword == "true") ? "codeword" : "none";

    if($has_GPS == "true" && $has_codeword == "true")
    {
      $method = "both";
    }elseif($has_GPS == "true" && $has_codeword == "false")
    {
      $method = "GPS";
    }elseif($has_GPS == "false" && $has_codeword == "true")
    {
      $method = "codeword";
    }else {
      $method = "none";
    }//end else


    //return "method = " . $method . " has codeword = " . $has_codeword . " has_GPS = " . $has_GPS;
		/*
		$db = jFactory::getDbo();
        $query = $db->getQuery(true);
        $query->select($db->quoteName('trans_nbr'));//data_str
        $query->from('#__ali_gpscnx');
        $query->where('`lattitude` BETWEEN '. $db->quote($lat_high) . ' AND ' . $db->quote($lat_low)
		. ' AND `longitude` BETWEEN ' . $db->quote($lon_high) . ' AND ' . $db->quote($lon_low));//mobileMenu Test Page
        $db->setQuery($query);
		*/
		$db = jFactory::getDbo();
		//$query = "SELECT * FROM #__ali_gpscnx WHERE 'lattitude' BETWEEN ". $lat_high . " AND " . $lat_low
		//. " AND 'longitude' BETWEEN " . $lon_high . " AND " . $lon_low;
		//$query = "SELECT * FROM #__ali_gpscnx WHERE milliseconds = " . $db->quote($dStr->timestamp); //works
		//$query = "SELECT * FROM #__ali_gpscnx WHERE lattitude = " . $db->quote($dStr->latti); //works
		//$query = "SELECT * FROM #__ali_gpscnx WHERE `lattitude` BETWEEN 38 AND 39";//works
		//$query = "SELECT * FROM #__ali_gpscnx WHERE `lattitude` BETWEEN '38' AND '39'";//works
		//$query = "SELECT * FROM #__ali_gpscnx WHERE `lattitude` BETWEEN '39' AND '38'";//didn't work []
		//$query = "SELECT * FROM #__ali_gpscnx WHERE `lattitude` BETWEEN " . $lat_1 . " AND " . $lat_2;//works

		//$query = "SELECT * FROM #__ali_gpscnx WHERE `lattitude` BETWEEN " . $lat_1 . " AND " . $lat_2
		//. " AND `longitude` BETWEEN " . $lon_1 . " AND " . $lon_2;//works

		/*
		$query = " SELECT * FROM #__ali_gpscnx WHERE `lattitude` BETWEEN " . $lat_1 . " AND " . $lat_2
		. " AND `longitude` BETWEEN " . $lon_1 . " AND " . $lon_2 . " AND `milliseconds` BETWEEN "
		. $past_span . " AND " . $future_span;//works
		*/

		/*$query = " SELECT `data_str` FROM #__ali_gpscnx WHERE `lattitude` BETWEEN " . $lat_1 . " AND " . $lat_2
		. " AND `longitude` BETWEEN " . $lon_1 . " AND " . $lon_2 . " AND `milliseconds` BETWEEN "
		. $past_span . " AND " . $future_span;*/

    switch($method)
    {
      //device will use the method available to them. I need to be able to cut gps off.
      //maybe turn the grn gps icon into a btn when available.
      case "GPS":
    		$query = " SELECT `id`,`picture`,`trans_nbr`,`milliseconds`,`expires`,`user_type`,`user_id`,`text`,`share_info`,`my_notes`,`public_notes`,`token_endpoint` FROM #__ali_gpscnx WHERE `lattitude` BETWEEN " . $lat_1 . " AND " . $lat_2
    		. " AND `longitude` BETWEEN " . $lon_1 . " AND " . $lon_2 . " AND `milliseconds` BETWEEN "
    		. $past_span . " AND " . $future_span;
        break;

        case "codeword":
        $codeword = (isset($dStr->password)) ? $dStr->password : "";
        if($codeword == "")return "codeword is not set.";
        $query = " SELECT `id`,`picture`,`trans_nbr`,`milliseconds`,`expires`,`user_type`,`user_id`,`text`,`share_info`,`my_notes`,`public_notes`,`token_endpoint` FROM #__ali_gpscnx WHERE `password` = "
         . $db->quote(htmlentities($dStr->password));
        break;

        case "both":
        $codeword = (isset($dStr->password)) ? $dStr->password : "";
        if($codeword == "")return "codeword is not set.";

        $query = " SELECT `id`,`picture`,`trans_nbr`,`milliseconds`,`expires`,`user_type`,`user_id`,`text`,`share_info`,`my_notes`,`public_notes`,`token_endpoint` FROM #__ali_gpscnx WHERE `lattitude` BETWEEN " . $lat_1 . " AND " . $lat_2
    		. " AND `longitude` BETWEEN " . $lon_1 . " AND " . $lon_2 . " AND `milliseconds` BETWEEN "
    		. $past_span . " AND " . $future_span . " AND " . "`password` = " . $db->quote(htmlentities($dStr->password));
        break;

        default:
          return "no cnx method selected.";
        break;
    }
        $db->setQuery($query);

       //$results = $db->loadObjectList();////loadRowList()
		//$results = $db->loadResult();
		//$results = $db->loadAssocList();
		$rows = $db->loadRowList();
		$results = "";

		for($i = 0;$i < count($rows);$i++)
		{

			$id = ($rows[$i][0] != "") ? "\"id\":\"" . $rows[$i][0] . "\"" : "";
			$picture = ($rows[$i][1] != "") ? ",\"picture\":\"" . $rows[$i][1] . "\"" : "";
			$trans_nbr = ($rows[$i][2] != "") ? ",\"transaction\":\"" . $rows[$i][2] . "\"" : "";
			$milli = ($rows[$i][3] != "") ? ",\"timestamp\":" . $rows[$i][3] . "" : "";
			$expires = ($rows[$i][4] != "") ? ",\"expires\":" . $rows[$i][4] . "" : "";
			$user_type = ($rows[$i][5] != "") ? ",\"user_type\":\"" . $rows[$i][5] . "\"" : "";
			$user_id = ($rows[$i][6] != "") ? ",\"user_id\":\"" . $rows[$i][6] . "\"" : "";
			$text = ($rows[$i][7] != "") ? ",\"text\":\"" . $rows[$i][7] . "\"" : "";
			$share_info = ($rows[$i][8] != "") ? ",\"share_info\":\"" . $rows[$i][8] . "\"" : "";
			$my_notes = ($rows[$i][9] != "") ? ",\"my_notes\":\"" . $rows[$i][9] . "\"" : "";
			$public_notes = ($rows[$i][10] != "") ? ",\"public_notes\":" . $rows[$i][10] . "" : "";
			$token_endpoint = ($rows[$i][11] != "") ? ",\"token_endpoint\":\"" . $rows[$i][11] . "\"" : "";


			if($i == 0)
			{

				//$results = implode(",",$rows[$i]);
				$results = "{" . $id . $picture . $trans_nbr . $milli . $expires . $user_type . $user_id . $text . $share_info . $my_notes .  $public_notes . $token_endpoint . "}";

			}
			else
			{
				//huge problem with the json being sent back so here
				//im making my own string to send back separated with "|xfr|"
				//$results .= "|xfr|" . implode(",",$rows[$i]);


				//$results = implode(",",$rows[$i]);
				$results .= "|xfr|{" . $id . $picture . $trans_nbr . $milli . $expires . $user_type . $user_id . $text . $share_info .  $public_notes . $token_endpoint . "}";
			}
		}

        if($results == "")
        {
           return "false";
        }
        else
        {
           //return html_entity_decode(json_encode($results));
		   return html_entity_decode($results);

        }//end if

	}//end scanRequests

	function seeMyData($str)
	{
		$dStr = json_decode($str);

		$db = jFactory::getDbo();

		//$query = " SELECT `data_str` FROM #__ali_gpscnx WHERE `trans_nbr` = " . $db->quote(htmlentities($dStr->transaction));
		$query = " SELECT `id`,`picture`,`trans_nbr`,`milliseconds`,`expires`,`user_type`,`user_id`,`text`,`share_info`,`my_notes`,`public_notes`,`token_endpoint` FROM #__ali_gpscnx WHERE `trans_nbr` = " . $db->quote(htmlentities($dStr->transaction));

        $db->setQuery($query);

       //$results = $db->loadObjectList();////loadRowList()
		//$results = $db->loadResult();
		//$results = $db->loadAssocList();
		$rows = $db->loadRowList();
		$results = "";

		for($i = 0;$i < count($rows);$i ++)
		{

			$id = ($rows[$i][0] != "") ? "\"id\":\"" . $rows[$i][0] . "\"" : "";
			$picture = ($rows[$i][1] != "") ? ",\"picture\":\"" . $rows[$i][1] . "\"" : "";
			$trans_nbr = ($rows[$i][2] != "") ? ",\"transaction\":\"" . $rows[$i][2] . "\"" : "";
			$milli = ($rows[$i][3] != "") ? ",\"timestamp\":" . $rows[$i][3] . "" : "";
			$expires = ($rows[$i][4] != "") ? ",\"expires\":" . $rows[$i][4] . "" : "";
			$user_type = ($rows[$i][5] != "") ? ",\"user_type\":\"" . $rows[$i][5] . "\"" : "";
			$user_id = ($rows[$i][6] != "") ? ",\"user_id\":\"" . $rows[$i][6] . "\"" : "";
			$text = ($rows[$i][7] != "") ? ",\"text\":\"" . $rows[$i][7] . "\"" : "";
			$share_info = ($rows[$i][8] != "") ? ",\"share_info\":\"" . $rows[$i][8] . "\"" : "";
			$my_notes = ($rows[$i][9] != "") ? ",\"my_notes\":\"" . $rows[$i][9] . "\"" : "";
			$public_notes = ($rows[$i][10] != "") ? ",\"public_notes\":" . $rows[$i][10] . "" : "";
			$token_endpoint = ($rows[$i][11] != "") ? ",\"token_endpoint\":\"" . $rows[$i][11] . "\"" : "";


			if($i == 0)
			{

				//$results = implode(",",$rows[$i]);
				$results = "{" . $id . $picture . $trans_nbr . $milli . $expires . $user_type . $user_id . $text . $share_info . $my_notes . $public_notes . $token_endpoint . "}";

			}

		}
		//$db->setQuery($query);

		//$results = $db->loadResult();


        if($results == "")
        {
           return "false";
        }
        else
        {
           //return html_entity_decode(json_encode($results));
		   return html_entity_decode($results);

        }//end if


	}//end seeMyData

	function updateData($str)
	{
		$dStr = json_decode($str);

		$db = jFactory::getDbo();
        $query = $db->getQuery(true);

    if(!isset($dStr->latti)){$dStr->latti = "";}
    if(!isset($dStr->longi)){$dStr->longi = "";}
    if(!isset($dStr->accur)){$dStr->accur = "";}
    if(!isset($dStr->duration)){$dStr->duration = "";}
		if(!isset($dStr->picture)){$dStr->picture = "";}
		if(!isset($dStr->text)){$dStr->text = "";}
		if(!isset($dStr->share_info)){$dStr->share_info = "";}
		if(!isset($dStr->my_notes)){$dStr->my_notes = "";}
		if(!isset($dStr->public_notes)){$dStr->public_notes = "";}
		if(!isset($dStr->token_endpoint)){$dStr->token_endpoint = "";}
		if(!isset($dStr->phone)){$dStr->phone = "";}
		if(!isset($dStr->email)){$dStr->email = "";}
		if(!isset($dStr->password)){$dStr->password = "";}


        //insert fields
        $fields = array(
		$db->quoteName('lattitude') . ' = ' . $db->quote($dStr->latti),
		$db->quoteName('longitude') . ' = ' . $db->quote($dStr->longi),
		$db->quoteName('accuracy') . ' = ' . $db->quote($dStr->accur),
		$db->quoteName('milliseconds') . ' = ' . $db->quote($dStr->timestamp),
		/*$db->quoteName('expires') . ' = ' . $db->quote($dStr->temp_expires),
		$db->quoteName('duration') . ' = ' . $db->quote(htmlentities($dStr->temp_duration)), //updating shouldn't add more time*/
		/* $db->quoteName('user_type') . ' = ' . $db->quote(htmlentities($dStr->user_type)), //this doesn't change when editing so it doesn't need to be updated*/
		$db->quoteName('picture') . ' = ' . $db->quote(htmlentities($dStr->picture)),
		$db->quoteName('text') . ' = ' . $db->quote(htmlentities($dStr->text)),
		$db->quoteName('share_info') . ' = ' . $db->quote(htmlentities($dStr->share_info)),
		$db->quoteName('my_notes') . ' = ' . $db->quote(htmlentities($dStr->my_notes)),
		$db->quoteName('public_notes') . ' = ' . $db->quote(htmlentities($dStr->public_notes)),
		$db->quoteName('token_endpoint') . ' = ' . $db->quote(htmlentities($dStr->token_endpoint)),
		$db->quoteName('phone') . ' = ' . $db->quote(htmlentities($dStr->phone)),
		$db->quoteName('email') . ' = ' . $db->quote(htmlentities($dStr->email)),
		$db->quoteName('password') . ' = ' . $db->quote(htmlentities($dStr->password)),
		$db->quoteName('data_str') . ' = ' . $db->quote(htmlentities($dStr->data_str))
		);//$db->quote(htmlentities($str))


        $conditions = array($db->quoteName('trans_nbr') . ' = ' . $db->quote($dStr->transaction));

        $query->update($db->quoteName('#__ali_gpscnx'))->set($fields )->where($conditions);
        $db->setQuery($query);
        $results = $db->execute();

		//return $results .= " update function processed ";

		$rev_Data = $this->get_review($dStr->transaction);

		return $rev_Data;

	}//end updateData

	function sendFCM($oStr)
	{

		//formerly sendFCM($message, $id)

		$oData = json_decode($oStr);

		$url = 'https://fcm.googleapis.com/fcm/send';


		/******************************************************/

		// prep the bundle

			$msg = array();

			if(isset($oData->message)){$msg['message'] = $oData->message;}
			if(isset($oData->title)){$msg['title'] = $oData->title;}
			if(isset($oData->subtitle)){$msg['subtitle'] = $oData->subtitle;}
			if(isset($oData->tickerText)){$msg['tickerText'] = $oData->tickerText;}
			if(isset($oData->vibrate)){$msg['vibrate'] = $oData->vibrate;}
			if(isset($oData->sound)){$msg['sound'] = $oData->sound;}
			if(isset($oData->largeIcon)){$msg['largeIcon'] = $oData->largeIcon; }
			if(isset($oData->smallIcon)){$msg['smallIcon'] = $oData->smallIcon;}
			if(isset($oData->icon)){$msg['icon'] = $oData->icon;}
			if(isset($oData->tag)){$msg['tag'] = $oData->tag;}
			if(isset($oData->body)){$msg['body'] = $oData->body;}


		/*
		$msg = array
		(
			'message' 	=> 'here is a message. message',
			'title'		=> 'This is a title. title',
			'subtitle'	=> 'This is a subtitle. subtitle',
			'tickerText'	=> 'Ticker text here...Ticker text here...Ticker text here',
			'vibrate'	=> 1,
			'sound'		=> 1,
			'largeIcon'	=> 'large_icon',
			'smallIcon'	=> 'small_icon'
		);



		$fields = array
		(
			'registration_ids' 	=> $registrationIds,
			'data'			=> $msg
		);
		*/


		/******************************************************/
		//turn id string into an array
		$registrationIds =  explode(",",$oData->endpoint);

		$fields = array (
				'registration_ids' => $registrationIds,
				'notification' => $msg,
				/*
				'data' => $msg
				use data instead of notification when push api is fully implemented
				it really seems like the same difference.

				data requires encryption
				*/
		);

		$fields = json_encode ( $fields );

		$headers = array (
				/*'Authorization: key=' . "YOUR_KEY_HERE",*/
				'Authorization: key=AIzaSyDRIFGUmEN9J37cST0EXJeyBcEC-W90qwE', /*//deprecated but regenerated server key 5Q
				'Authorization: key=AAAA8LV77Uw:APA91bFGZ7Gn8nO3qA5Ta1wmI23d_aJNDbP5FXaApXh5ZmfNhqXrPokElxMJEV9KuFZVnEV7wDgT1Zs9M0a3pwDJZ5-G3ThLPBdJZBDe8AIYFvjIr-Gp8kW6KooX_8iHoPFnkJQBMxFA4dAR2RykPBN9j3d1efZXog',*/
				'Content-Type: application/json;charset=utf-8'
		);

		$ch = curl_init ();
		curl_setopt ( $ch, CURLOPT_URL, $url );
		curl_setopt ( $ch, CURLOPT_POST, true );
		curl_setopt ( $ch, CURLOPT_HTTPHEADER, $headers );
		curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, true );
		curl_setopt ( $ch, CURLOPT_POSTFIELDS, $fields );
		//curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );

		$result = curl_exec ( $ch );
		//echo $result;
		curl_close ( $ch );

		return $result;

	}//end sendFCM

	function googleLogin($tID)
	{
		$id_token = $tID;
		$log_string = "";


    //client id for webapp
    $this->console_log("google login here ");

		$CLIENTID = "1033836948812-jrge6nv090i395ts1tgt06dj5qjavtsd.apps.googleusercontent.com";

    //localhost test client id for other
    // $CLIENTID = "1033836948812-olech7klh71vn51s8uq8oji6s0m5rhka.apps.googleusercontent.com";

		$url = 'https://www.googleapis.com/oauth2/v3/tokeninfo';

		/*
		the variable $post_data contains a string where each parameter is
		separated by  unencoded ampersands
		*/

		$post_data = 'id_token='. $id_token;
		//$post_data .= '&id_token='. $id_token;//for another field

		$ch = curl_init ();
		curl_setopt ( $ch, CURLOPT_URL, $url );
		curl_setopt ( $ch, CURLOPT_POST, true );
		//curl_setopt ( $ch, CURLOPT_HTTPHEADER, $headers );

    // header('Content-Type: image/jpeg');
    // header("Access-Control-Allow-Origin: *");

		curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, true );
		curl_setopt ( $ch, CURLOPT_POSTFIELDS, $post_data );
		curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );
		curl_setopt( $ch,CURLOPT_SSL_VERIFYHOST, 2 );
		$result = curl_exec ( $ch );
		$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		//echo $result;
		curl_close ( $ch );

		$login_data = json_decode($result);
    $login_data->host = "google";

    //TODO:150 put an if != "" empty set?
		$log_string .= " [google_result]" . $result . "[google_result] ";
    // return $log_string;

    // checks for client side tampering
    // what if it returns an error? how do i skip this
		if($login_data-> aud == $CLIENTID)
		{
      $cur_arc_user = jFactory::getUser();
  		$arc_user_id = $cur_arc_user->id;

  		// if($arc_user_id == 0){return "unregistered user";}
			//if the curl works try the db code here

			//check to see if the id exists
			//select from id where G_name = $login_data-> sub;

      //here is where the google data & json string goes into the log_string
			$id_check = $this->google_db_check($login_data-> sub,'G_name');
			$log_string .= "id check returned value = " . $id_check;
      //return $log_string;

			//if they do exist do this
      $client_type = ($cur_arc_user->guest == 1) ? "guest" :  "member";

      $log_string .= " client type = " . $client_type . "client type id = " . $arc_user_id . " id check = " . $id_check;
      //return $log_string;

      echo "id check = " . $id_check;

			if($id_check != null && $id_check != "")
			{
        //id's match
        // echo "entering id check area";
        $this->console_log("entering id match section");
        $this->console_log("check id = $id_check & user id = $arc_user_id");
        //$this->console_log("user data = " . var_export($cur_arc_user) . " \n");

        if($id_check != $arc_user_id)
        {
          $this->console_log("the ids match");
          $setUser = $this->setCurrentUser($id_check);
          $starter_data = $this->initiate_starter_data($login_data);
          //return "\n\n test";
          $basic_profile_data = $this->get_user_profile("default");

          $log_string .= "set user data = " . $setUser . " starter data = " . $starter_data . " [profile_Data]" . json_encode($basic_profile_data) . "[profile_Data] ";


          //return $log_string;
          $log_string .= "[user_id]" . $id_check. "[user_id]" ;
          return $log_string;
        }else {
          //for mismatches
          // echo "not entering id check area";
          $this->console_log("user mismatch entered");
          $log_string .= "[user_id]" . $id_check. "[user_id]";
            $log_string .=  " current id = " . $arc_user_id;
          return $log_string . "you may already have an account with us, \n try logging in directly or with a different social login host.";
        }

			}//end if
			else
			{
				//if it doesn't exist it will return a 'null' string


				//check for duplicate email
				$email_check = $this->google_db_check($login_data->email,'email');//returns and id if valid
        // i don't think the email check matters here. as long as the user isn't a mismatch

        // question is am i prepared to update a user's gname instead of making a completely new user?

				//if no email is found
        $has_email = ($email_check == 'null' OR $email_check == "") ? false : true;
        echo "check email = " . $email_check;
        echo "has email = " . $has_email;

        $conv_has_email = ($has_email) ? 'true' : 'false';
        $log_string .= "has mail = " . $conv_has_email . " has email client = " . $client_type . " email check = " . $email_check;
				//return $log_string;

				if($has_email == false && $client_type == "guest")
				{
          //return "create record entered";
					//create a new record
					$createUser = $this->google_create_user($login_data->sub,$login_data->email,$login_data->name);

					$log_string .= " createUser returned value = " . $createUser;

					if($createUser == 1)
					{

						//if user successfully added set the user
						$id_check = $this->google_db_check($login_data-> sub,'G_name');
						$log_string .= " createUser id check returned value = " . $id_check;

						//register user
						$reg_user = $this->register_user($id_check);

						$setUser = $this->setCurrentUser($id_check);

            // echo "starter data section"
            $starter_data = $this->initiate_starter_data($login_data);

						$log_string .= " createUser set user data = " . $setUser . "starter data = " . $starter_data . " register_user = " . $reg_user;

					}//end if

					return  $log_string . "[user_id]" . $id_check . "[user_id]";
					//return $log_string;


				}elseif($has_email == true && $client_type == "member" && $email_check == $arc_user_id)
        {
          return "update user entered";
          $updateUser = $this->google_update_user($login_data->sub);

          if($updateUser == 1)
          {
            // do i need to do this starter data? - what if im adding a social login after using it for a while
            // or after using a different social login from another site?

            // ok it looks like it does tthe appropriate checks to prevent duplicates
            $starter_data = $this->initiate_starter_data($login_data);

            //get user profile data for profile
            $basic_profile_data = $this->get_user_profile("default");

            $log_string .= " updateUser = " . $updateUser . "starter data = " . $starter_data  . " [profile_Data]" . json_encode($basic_profile_data) . "[profile_Data] ";
          }
        }else
				{
          //for mismatches
          $log_string2 = "";
          // $log_string2 .= $log_string;
          $log_string2 .=  "email user mismatch entered";
            $log_string2 .=  " email check = " . $email_check . " current id = " . $arc_user_id;
					return $log_string2 . "you may already have an account with us, \n try logging in directly or with a different social login host.";
				}

				//it should never get to this section - this code here is obsolete
				//return "id infor = " . $id_check . " http code = " . $http_code;
				//return "login sub = " . $login_data-> sub . " http code = " . $http_code . " log string = " . $log_string;
				//return "http code = " . $http_code;

			}//end else $id_check

		}else
		{
			return "invalid client" . " http code = " . $http_code;
			//return "invalid client" . " http code = " . $http_code  . " log string = " . $log_string;

		}


	}//end googleLogin

	function google_db_check($tData,$fName)
	{

	  $db = jFactory::getDbo();
    $query = $db->getQuery(true);
    $query->select($db->quoteName(array('id')));
    $query->from($db->quoteName('#__users'));
    $query->where($db->quoteName($fName) . ' LIKE '. $db->quote($tData));//aliintro Test Page
    // $query->where($db->quoteName($fName) . ' = '. $db->quote($tData));
    $db->setQuery($query);

    // echo "im using = instead of like";
        //$idData = json_encode($db->loadResult());//this json_encode was messing up my conversion code
		$idData = $db->loadResult();
        return $idData;
	}//end google_db_check

	function google_create_user($tSub,$tMail,$tName)
	{

        //creates a random login password
        // require_once "/random_compat-2.0.9/lib/random.php";
        require_once(realpath(dirname(__FILE__) . "/random_compat-2.0.9/lib/random.php"));

        try {
            $pass_string = random_bytes(32);
        } catch (TypeError $e) {
            // Well, it's an integer, so this IS unexpected.
            die("An unexpected error has occurred");
        } catch (Error $e) {
            // This is also unexpected because 32 is a reasonable integer.
            die("An unexpected error has occurred");
        } catch (Exception $e) {
            // If you get this message, the CSPRNG failed hard.
            die("Could not generate a random string. Is our OS secure?");
        }
        $pass_string = bin2hex($pass_string);
        //var_dump(bin2hex($string));

		    $db = jFactory::getDbo();
        $query = $db->getQuery(true);


        //insert columns
        $columns = array('name','username','G_name','email','password');

        //insert values
        $values = array(
        $db->quote(htmlentities($tName)),
        /*sub is used here for the username b/c the username must be unique*/
        /*the email should work here too - its unique*/
    		$db->quote(htmlentities($tMail)),
    		$db->quote(htmlentities($tSub)),
    		$db->quote(htmlentities($tMail)),
        $db->quote(htmlentities($pass_string))
    		);//$db->quote(htmlentities($str))

        //TODO:230 what about the password? if they login using sites login there is not password?


        //prep the insert query
        $query->insert($db->quoteName('#__users'))
        ->columns($db->quoteName($columns))
        ->values(implode(',',$values));
        $db->setQuery($query);

    		$results = $db->execute();

    		return $results;


	}//end google_create_user

  function google_update_user($tSub)
	{

		    $db = jFactory::getDbo();
        $query = $db->getQuery(true);

        // get update user id
        $cur_upd_user = jFactory::getUser();
    		$upd_user_id = $cur_upd_user->id;

        if($upd_user_id == 0){return "unregistered user";}

        $fields = array(
          $db->quoteName('G_name') . ' = ' . $db->quote(htmlentities($tSub))
        );


        $conditions = array($db->quoteName('id') . ' = ' . $db->quote($upd_user_id));

        $query->update($db->quoteName('#__users'))->set($fields)->where($conditions);
        $db->setQuery($query);
        $results = $db->execute();
        //$ret_txt = " update user = " . $results;

    		return $results;


	}//end google_update_user


	function setCurrentUser($uID)
	{
		//this works to log in the user
		$user = JFactory::getUser($uID);//variable must be an int not a string
		$session = JFactory::getSession();
		$session->set('user', new JUser($user->id));
		//new data for your user after the update
		//$user = JFactory::getUser();

		$new_user = jFactory::getUser();
		return " modified get user = " . $new_user->id;

		//make this id the user
				/*shows session persistence
				$og_User = jFactory::getUser();
				$log_string .= " initial get user = " . $og_User->id;
				*/


				//try this
				//http://stackoverflow.com/questions/15028816/joomla-getuser-does-not-show-the-updated-user-data

				/* sign out
				//resets to zero - will be userful for logging out or signing out a user
				$user = JFactory::getUser(0);//variable must be an int not a string
				$session = JFactory::getSession();
				$session->set('user', new JUser($user->id));
				$rep_user = JFactory::getUser();

				$log_string .= " replaced user = " . $rep_user->id;
				*/
	}//end setCurrentUser

	function register_user($uID)
	{
    //is classifies the user as registerd, editor, superuser etc.
		$db = jFactory::getDbo();
    $query = $db->getQuery(true);

    //insert columns
    //creates a 'registered' classification
    $columns = array('user_id','group_id');

    //insert values
    $values = array(
    $uID,
		2
		);//$db->quote(htmlentities($str))


    //prep the insert query
    $query->insert($db->quoteName('#__user_usergroup_map'))
    ->columns($db->quoteName($columns))
    ->values(implode(',',$values));
    $db->setQuery($query);
		$results = $db->execute();

		return $results;

	}//end register_user

	function dataCleanUp()
	{
		$db = jFactory::getDbo();

		$now = new DateTime();
		$ms_exp_check = $now->getTimestamp() * 1000;//miliseconds expired check
		$cleanDB = "";

		/*
		return "table clean up happening, date = " . $ms_exp_check . " now = " . $now->format('Y-m-d H:i:s') . " another format = " . $now->format('ga jS M Y');

		//return value table clean up happening, date = 1480482819000 now = 2016-11-29 23:13:39 another format = 11pm 29th Nov 2016

		*/

		$conditions = array(
		$db->quoteName('expires') . ' < ' . $ms_exp_check
		);


        $query = $db->getQuery(true);
        $query->delete($db->quoteName('#__ali_gpscnx'));
        $query->where($conditions);//aliintro Test Page
        $db->setQuery($query);
		    $results = $db->execute();

		if($results == 1)
		{
			$cleanDB .=  " _gpscnx cleaned ";
		}

		$conditions = array(
		$db->quoteName('rcvr_user_type') . ' = ' . $db->quote('guest'),
		$db->quoteName('exp_ms') . ' < ' . $ms_exp_check
		);

		$db2 = jFactory::getDbo();
    $query = $db2->getQuery(true);
    $query->delete($db2->quoteName('#__arc_pair_user_user'));
    $query->where($conditions);//aliintro Test Page
    $db2->setQuery($query);
		$results2 = $db2->execute();

		//$starter_data = $this->initiate_starter_data();

		if($results2 == 1)
		{
			$cleanDB .=  " _pair cleaned ";
		}


		return $cleanDB . " cleanDB results " /*. " starter data = " . $starter_data*/;


	}//end dataCleanUp

	function initiate_starter_data($log_Data)
	{
		$ret_txt = "guest starter data  prohibited";
		//make sure user is registered

		$init_user = jFactory::getUser();
    $db = jFactory::getDbo();

		//if the user is not a guest
		if($init_user->guest != 1)
		{
      $this->console_log("starter data is not a guest");
      $ret_txt = "";
      //check the existence of the public group
			$conditions = array(
			$db->quoteName('user_id') . ' = ' . $db->quote($init_user->id),
      $db->quoteName('category') . ' = ' . $db->quote('public'),
      $db->quoteName('type') . ' = ' . $db->quote('group'),
      $db->quoteName('admin') . ' = 1',
			);


			$query = $db->getQuery(true);
			$query->select($db->quoteName('data_id'));
			$query->from($db->quoteName('#__arc_my_data'));
			$query->where($conditions);//aliintro Test Page
			$db->setQuery($query);
			$com_check = $db->loadResult();

      $this->console_log("com check return value = $com_check");

			if($com_check == "")
			{
        //if its not there make one
				$ret_txt = "no communities file exists for this user. ";
        $db2 = jFactory::getDbo();
        $query = $db2->getQuery(true);

        //insert columns
        $columns = array('type','user_id','category','title_data','admin');

            //insert values
        $values = array(
        $db2->quote('group'),
        $db2->quote($init_user->id),
    		$db2->quote('public'),
    		$db2->quote('public (default)'),
    		$db2->quote('1')
        );//$db2->quote(htmlentities($str))


        //prep the insert query
        $query->insert($db->quoteName('#__arc_my_data'))
        ->columns($db->quoteName($columns))
        ->values(implode(',',$values));
        $db->setQuery($query);
    		$ret_value = $db->execute();

        //add the data id
        $last_id = $db->insertid();

        //update the data_id
        $dId = $this->create_data_id($last_id,'group');


        if($ret_value == 1)
        {
          $ret_txt .= " new group added. ";

        }else
        {
          $ret_txt .= " failure to add group. ";
        }


			}else{
				$ret_txt = json_encode($com_check);
			}

      //check info table for values
      $check1 = $this->check_info('name',$log_Data);
      $check2 = $this->check_info('email',$log_Data);
      $check3 = $this->check_info('picture',$log_Data);

      //check group for info
      $check4 = $this->check_group($check1,'name');//checks for name association
      //return "test";
      $check5 = $this->check_group($check2,'email');//checks for email association
      $check6 = $this->check_group($check3,'profile picture');

      $ret_txt .= "c1= " . $check1 . " c2= " . $check2 . " c3= " . $check3 . " c4= " . $check4 . " c5= " . $check5 . " c6= " . $check6;

		}//end if guest != 1

    return $ret_txt;

	}//end initiate_starter_data

  function check_info($nfo,$lD)
  {
    //$nfo passes in name or email
    $curr_user = jFactory::getUser();
    //$user_field = (($nfo == "name") ? "username" : (($nfo == "picture") ? "picture" : "email"));
    $this->console_log("check_info $nfo entered");

    switch($nfo)
    {
      case "name":
        $user_field = "username";
      break;

      case "picture":
        $user_field = "picture";
      break;

      default:
        $user_field = "email";
      break;

    }//end switch
    //return "test" . $user_field;


    //get user info
    if($user_field != "picture")
    {
      $db3 = jFactory::getDbo();
      $query = $db3->getQuery(true);

      $query->select($db3->quoteName($user_field));
      $query->from($db3->quoteName('#__users'));
      $query->where($db3->quoteName('id') . ' = '. $db3->quote($curr_user->id));//aliintro Test Page
      $db3->setQuery($query);
      $ret_us_data = $db3->loadResult();
    }else
    {
      $ret_us_data = $lD->picture;
      //return "picture #ld = " . $ret_us_data;
    }

    $this->console_log("returned user data =  $ret_us_data");
    //return "test";
    //use users id to check for site generated info
    if($ret_us_data !="")
    {
      //see if it exists
      $field_cat = (($nfo == "name") ? "name" : (($nfo == "picture") ? "profile picture" : "email"));
      //what if the user changes it form contact us to something else?
      //what of they change the desc from username to something else?
      //ok this seems to be prep for the absence of the category and the admin tag
      $field_desc = (($nfo == "name") ? "username" :  (($nfo == "picture") ? $lD->host . " picture" :"contact us"));
      //return " test field desc = " . $field_desc;
      $field_core = $ret_us_data;

      $db = jFactory::getDbo();
      $query = $db->getQuery(true);

      $conditions = array(
			$db->quoteName('user_id') . ' = ' . $db->quote($curr_user->id),
      $db->quoteName('category') . ' = ' . $db->quote($field_cat),
      $db->quoteName('type') . ' = ' . $db->quote('info'),
      $db->quoteName('admin') . ' = 1',
			);


      $query->select($db->quoteName('data_id'));
      $query->from($db->quoteName('#__arc_my_data'));
      $query->where($conditions);//aliintro Test Page
      $db->setQuery($query);
      $ret_info_id = $db->loadResult();


      if($ret_info_id =="")
      {
        //if it isnt found using broad seach perameters then make it.
        //insert columns

        //if i used google login to create this user then the username it will generate will be
        //the users google number.  can i change that?
        $db5 = jFactory::getDbo();
        $query = $db5->getQuery(true);
        $columns = array('type','user_id','category','title_data','core_data','admin');

            //insert values
        $values = array(
        $db5->quote('info'),
        $db5->quote($curr_user->id),
        $db5->quote($field_cat),
        $db5->quote($field_desc),
        $db5->quote($field_core),
        $db5->quote('1')
        );//$db5->quote(htmlentities($str))


        //prep the insert query
        $query->insert($db5->quoteName('#__arc_my_data'))
        ->columns($db5->quoteName($columns))
        ->values(implode(',',$values));
        $db5->setQuery($query);
        $ret_value = $db5->execute();

        //add the data id
        $last_id = $db5->insertid();

        //update the data_id
        $dId = $this->create_data_id($last_id,$display_data);


        //the run it one last time to get the id

        $db6 = jFactory::getDbo();
        $query = $db6->getQuery(true);

        $conditions = array(
  			$db6->quoteName('user_id') . ' = ' . $db6->quote($curr_user->id),
        $db6->quoteName('category') . ' = ' . $db6->quote($field_cat),
        $db6->quoteName('core_data') . ' = ' . $db6->quote($field_core),
        $db6->quoteName('type') . ' = ' . $db6->quote('info'),
        $db6->quoteName('admin') . ' = 1',
  			);

        //this is a query to get the last entry id: $last_id = $db->insertid();
        $query->select($db6->quoteName('data_id'));
        $query->from($db6->quoteName('#__arc_my_data'));
        $query->where($conditions);//aliintro Test Page
        $db6->setQuery($query);
        $ret_info_id = $db6->loadResult();

      }//end if $ret_info_id

      $this->console_log("check_info $nfo result = $ret_info_id");
      return $ret_info_id;

    }//end if $ret_us_data



  }///end check_info

  function check_group($gid,$iCat)
  {
    $curr_user = jFactory::getUser();
    $info_category = $iCat;

    $this->console_log("check group active");

    //prep known transfer data
    $pairData = (object)[];
    $pairData->link_id = $gid;
    $pairData->owner_id = $curr_user->id;
    $pairData->editor_id = $curr_user->id;

      $db = jFactory::getDbo();
      $query = $db->getQuery(true);

      //get the public group id
      $conditions = array(
			$db->quoteName('user_id') . ' = ' . $db->quote($curr_user->id),
      $db->quoteName('category') . ' = ' . $db->quote('public'),
      $db->quoteName('type') . ' = ' . $db->quote('group'),
      $db->quoteName('admin') . ' = 1',
			);


      $query->select($db->quoteName(array('data_id')));
      $query->from($db->quoteName('#__arc_my_data'));
      $query->where($conditions);//aliintro Test Page
      $db->setQuery($query);
      $grp_row = $db->loadAssoc();

      $this->console_log("returned group row: ",$grp_row);

        $pairData->host_id = $grp_row['data_id'];

        //get the profile data to check the presence of the big 3
        $profile_data = $this->get_profile_data("default");
        //return "check group profile pair data = " . $profile_data;

        $has_profile_pic = (isset($profile_data->profile_picture) && $profile_data->profile_picture != ""
         || isset($profile_data->picture_extra) && $profile_data->picture_extra != "") ? "true" : "false";
        $has_profile_name = (isset($profile_data->profile_name) && $profile_data->profile_name != "") ? "true" : "false";
        //$has_profile_email = (isset($profile_data->profile_name) && $profile_data->profile_name != "") ? "true" : "false";

        $this->console_log("getting profile data");


        //get pair data
        $ret_col = $this->pick_pairs($pairData);
        //return "test pair data = " . implode($ret_col);

        $this->console_log("picking pairs",$ret_col);

        //i moved this down a bit so i could return the pick pairs data
        if($info_category == "profile picture" && $has_profile_pic == "true"){return " has picture " . implode(",",$ret_col);}
        if($info_category == "name" && $has_profile_name == "true"){return " has name " . implode(",",$ret_col);}
        if($info_category == "email"){return " email deprecated " . implode(",",$ret_col);}

        $this->console_log("info category is ",$info_category);

        if($ret_col != false)
        {
          //see if the id is in the pair list array
          $is_it_there = array_search($gid,$ret_col,true);
          //return "is " . $gid  . " there in " . implode(",",$ret_col) . " = " . $is_it_there;

          //if it isn't add it
          //php booleans made this a challenge to filter (leading array index is 0)

          //this works
          if($is_it_there == "" && $is_it_there !== 0)
          {
            $add_data = "true";
            //return " test: writing true sequence for " . $gid;
          }else {
            return implode(",",$ret_col);
          }

          //if it is return the array as a string?
        }else{
          //if the db is empty of any related values
          $add_data = "true";
        }


        if($add_data == "true")
        {
          //add the data
          //return "process pair entered";
          $this->console_log("processing pairs",$pairData);
          $process_data = $this->process_pair($pairData);
          //return $process_data;
          //return "test";

          $ret_col = $this->pick_pairs($pairData);

        }


        return implode($ret_col);


  }///end check_group

  function pick_pairs($pObj)
  {
    $curr_user = jFactory::getUser();
    $pairObj = $pObj;

    //use it to check the pair ids
    $db = jFactory::getdbo();
    $query = $db->getQuery(true);

    $conditions = array(
    $db->quoteName('owner_id') . ' = ' . $db->quote($curr_user->id),
    $db->quoteName('host_id') . ' = ' . $db->quote($pairObj->host_id),
    /*$db->quoteName('link_id') . ' LIKE ' . $db->quote("i-%")*/
    $db->quoteName('link_id') . ' LIKE ' . $db->quote($pairObj->link_id)
    );

    $query->select($db->quoteName('link_id'));
    $query->from($db->quoteName('#__arc_pair_host_link'));
    $query->where($conditions);//aliintro Test Page
    $db->setQuery($query);
    $ret_col = $db->loadColumn();

    $this->console_log("pairs returned = ",$ret_col);

    return $ret_col;
  }//pick_pairs

  function process_pair($pObj)
  {

    $process_data = $pObj;
    $pair_table = '#__arc_pair_host_link';
    $display_data = "";

    $this->console_log("process pair running");
    //return "test";
    $db = jFactory::getDbo();
    $query = $db->getQuery(true);

    //test run
    $conditions = array(
    $db->quoteName('host_id') . ' = ' . $db->quote(htmlentities($process_data->host_id)),
    $db->quoteName('link_id') . ' = ' . $db->quote(htmlentities($process_data->link_id)),
    );

    //test run
    $query->select('id');
    $query->from($db->quoteName($pair_table));
    $query->where($conditions);//aliintro Test Page
    $db->setQuery($query);
    $test_result = $db->loadResult();

    if($test_result == false)
    {

      $db = jFactory::getDbo();
      $query = $db->getQuery(true);


      $columns = array('host_id','link_id','owner_id','editor_id');

      $values = array(
      $db->quote(htmlentities($process_data->host_id)),
      $db->quote(htmlentities($process_data->link_id)),
      $db->quote(htmlentities($process_data->owner_id)),
      $db->quote(htmlentities($process_data->editor_id))
      );


      //prep the insert query
      $query->insert($db->quoteName($pair_table))
      ->columns($db->quoteName($columns))
      ->values(implode(',',$values));
      $db->setQuery($query);
      $results = $db->execute();

      if($results == -1){
        return $display_data . " add pairing failed";
      }else {
        return $display_data . " add pairing success";
      }
    }else {
      $d_rec = "duplicate record detected";
      $this->console_log($d_rec);

      return $d_rec;
    }

  }//end process_pair;

  function check_group_og($gid)
  {
    $curr_user = jFactory::getUser();
    $ret_txt = "";
      //see if it exists

      $db = jFactory::getDbo();
      $query = $db->getQuery(true);

      $conditions = array(
			$db->quoteName('user_id') . ' = ' . $db->quote($curr_user->id),
      $db->quoteName('category') . ' = ' . $db->quote('public'),
      $db->quoteName('info_ids') . ' LIKE ' . $db->quote("%" . $gid . "%"),
      $db->quoteName('admin') . ' = 1',
			);


      $query->select($db->quoteName(array('id','info_ids')));
      $query->from($db->quoteName('#__arc_my_group'));
      $query->where($conditions);//aliintro Test Page
      $db->setQuery($query);
      $grp_row = $db->loadAssoc();

      if($grp_row == "" || $grp_row['id'] == "")
      {

        //get the group
        $db2 = jFactory::getdbo();
        $query = $db2->getQuery(true);

        $conditions = array(
        $db->quoteName('user_id') . ' = ' . $db->quote($curr_user->id),
        $db->quoteName('category') . ' = ' . $db->quote('public'),
        $db->quoteName('admin') . ' = 1',
        );

        $query->select($db2->quoteName(array('id','info_ids')));
        $query->from($db2->quoteName('#__arc_my_group'));
        $query->where($conditions);//aliintro Test Page
        $db2->setQuery($query);
        $row = $db2->loadAssoc();

        $ret_txt = "info_ids  = " . $row['info_ids'];

        if($row['info_ids'] == ""){
          $row['info_ids'] = $gid;
        }else{
          $row['info_ids'] = $row['info_ids'] . "," . $gid;
        }//end else

        //put it back

        //insert fields
        $fields = array(
        $db->quoteName('info_ids') . ' = ' . $db->quote($row['info_ids'])
        );


        $conditions = array($db->quoteName('id') . ' = ' . $db->quote($row['id']));

        $query->update($db->quoteName('#__arc_my_group'))->set($fields )->where($conditions);
        $db->setQuery($query);
        $results = $db->execute();
        $ret_txt .= "group update = " . $results;


      }//end if $grp_id
      else{
        $ret_txt = "grp info_ids = " . $grp_row['info_ids'];
      }

      return $ret_txt;


  }///end check_group_og




  function addSimpleData($str)
  {
    //used in simple scan to add data without user input
    $dStr = json_decode($str);
    //return "add simple Data occured";
    //make a pit stop and add user selected profile data

     $profile_data = $this->get_user_profile("simple");

    //add profile data to the $dStr
    if(isset($profile_data->profile_name)){$dStr->text = $profile_data->profile_name;}
    if(isset($profile_data->profile_picture)){$dStr->picture = $profile_data->profile_picture;}
    if(isset($profile_data->picture_extra)){$dStr->picture = $profile_data->picture_extra;}

    //add the data to the gpsData table
    //$dStr = json_encode($dStr);
    $right_back_at_cha = $this->uploadGPSData($dStr);

    return $right_back_at_cha;

    //return "src group result = " . $src_grp;


    //now use what you've got


  }//addSimpleData


  function get_user_profile($md)
  {

    //get_user_profile runs get_profile_data and adds things like user specifications and preferences

    $mode = $md;

    $curr_user = jFactory::getUser();

    //TODO:100 create preferences if not exits with initiate_starter_data use public id
    //TODO:110 get prefernece for src_group - default public - use public id
    //use the users id and src_grp community id to get profile picture, username
    //if not exists get the public one -  add them to the $dstr JSON
    //re-encode the string and pass it to uploadGPSData

    if($mode == "simple")
    {
      $src_grp = "";

      //see if user params exist
      $db = jFactory::getDbo();
      $query = $db->getQuery(true);

      $query->select($db->quoteName('params'));
      $query->from($db->quoteName('#__ali_user_params'));
      $query->where($db->quoteName('id') . ' = '. $db->quote($curr_user->id));//aliintro Test Page
      $db->setQuery($query);
      $param_results = $db->loadResult();

      //return "params result = " . $param_results;

      if($param_results != "")
      {
          //if so get the id of the simple scan src_group
          $params = json_decode($param_results);
          $src_grp = (isset($params->simpleScan_src_group)) ? $params->simpleScan_src_group : "";

      }//end if

      $info_id = ($src_grp != "") ? $src_grp : "default";

    }else
    {
      $info_id = "default";

    }//end else $mode == simple

    //get the info ids
    $profile_data = $this->get_profile_data($info_id);
    //backup just in case != public group returns no data
    if($info_id != "default" && $profile_data == "")
    {
      //get the public data
      $profile_data = $this->get_profile_data("default");
      //$profile_data = json_decode($profile_data);
    }

    //return "ppp = " . json_encode($profile_data);

    if($profile_data == ""){
      $profile_data = (object)[];
      $profile_data->profile_name = $curr_user->email;
    }
    if($mode == "default" OR $mode == "simple")
    {
      //simple need to be here too or client side error
      return $profile_data;
    }else{
      //get_user_profile("profile"); there is a profile mode in the controller.php file
      return " [profile_Data]" . json_encode($profile_data) . "[profile_Data] ";

    }



  }//end get_user_profile

  function get_profile_data($tData)
  {

      $curr_user = jFactory::getUser();

      //get the public id
      $db = jFactory::getDbo();
      $query = $db->getQuery(true);

      if($tData == "default")
      {
        //get public info
        $conditions = array(
  			$db->quoteName('user_id') . ' = ' . $db->quote($curr_user->id),
        $db->quoteName('category') . ' = ' . $db->quote('public'),
        $db->quoteName('type') . ' = ' . $db->quote('group'),
        $db->quoteName('admin') . ' = 1'
  			);
      }else
      {
        $conditions = array(
  			$db->quoteName('user_id') . ' = ' . $db->quote($curr_user->id),
        $db->quoteName('data_id') . ' = ' . $db->quote($tData)
  			);
      }

        //i need to get the src groups id
        $query->select($db->quoteName('data_id'));
        $query->from($db->quoteName('#__arc_my_data'));
        $query->where($conditions);//aliintro Test Page
        $db->setQuery($query);
        $id_result = $db->loadResult();
        //return "id_result =" .  $id_result;//works


        if($id_result == ""){return "";}

        //here i need to use the id to look up the info values
        $db = jFactory::getDbo();
        $query = $db->getQuery(true);

        $conditions = array(
        $db->quoteName('owner_id') . ' = ' . $db->quote($curr_user->id),
        $db->quoteName('host_id') . ' = ' . $db->quote($id_result),
        $db->quoteName('link_id') . ' LIKE ' . $db->quote("i-%"),
        );

        $query->select($db->quoteName('link_id'));
        $query->from($db->quoteName('#__arc_pair_host_link'));
        $query->where($conditions);//aliintro Test Page
        $db->setQuery($query);
        $pair_result = $db->loadColumn();

        //return " pair_result = " . implode(",",$pair_result);//works

        $pair_result_str = "'" . implode("','",$pair_result) . "'";
        if($pair_result_str == ""){return "";}

        //put it all together in an object
        $db = jFactory::getDbo();
        $query = $db->getQuery(true);

        //give me any info whose data_ids are found in the string
        $t_conditions = array(
  			$db->quoteName('user_id') . ' = ' . $db->quote($curr_user->id),
        $db->quoteName('published') . ' = 1 ',
        $db->quoteName('type') . ' = ' . $db->quote('info'),
        $db->quoteName('data_id') . ' IN (' .  $pair_result_str . ')'
  			);

        $query->select($db->quoteName(array('type','category','title_data','desc_data','core_data','url_data','extra')));
        $query->from($db->quoteName('#__arc_my_data'));
        $query->where($t_conditions);//aliintro Test Page
        $db->setQuery($query);
        $rows = $db->loadObjectList();
        //return " rows = " . json_encode($rows);//works

        //look through the row categories and find name and profile picture
        $has_profile_pic = "false";
        $db_profile_pic = "";
        $has_profile_name = "false";
        $db_profile_name = "";

        $result_obj = (object)[];

        for($i = 0; $i < count($rows); $i ++)
        {
          if($has_profile_name == "false" && $rows[$i]->category == "name")
          {
            $result_obj->profile_name = $rows[$i]->core_data;
            $has_profile_name = "true";
          }//end if pname

          if($has_profile_pic == "false" && $rows[$i]->category == "profile picture")
          {
            $result_obj->profile_picture = $rows[$i]->core_data;
            if($rows[$i]->extra != "")
            {
              $result_obj->picture_extra = $rows[$i]->extra;//id like a better name than picture_extra
            }
            $has_profile_pic = "true";

          }//end if ppic
        }//end form

        if($has_profile_pic == "true" || $has_profile_name == "true")
        {
          return $result_obj;
        }else
        {
          return "";
        }

        //return "data result = " . json_encode($data_result) . "query = " . $query;

  }//end get_profile_data

  function create_data_id($lId,$dsp_Dta)
  {
    $last_id = $lId;

    $display_data = $dsp_Dta;
    echo "display data = " . $display_data;

    switch($display_data)
    {
      case "info":
        $data_loc = "i-";
        echo "info data loc";
      break;

      case "media":
        $data_loc = "m-";
        echo "media data loc";
      break;

      case "group":
        $data_loc = "g-";
        echo "group data loc";
      break;
    }
    $info_table = '#__arc_my_data';
    echo "data loc = " . $data_loc;

    //update the data_id

    $db = jFactory::getDbo();
    $query = $db->getQuery(true);

    $fields = array(
    $db->quoteName('data_id') . ' = ' . $db->quote($data_loc . $lId),
    );//$db->quote(htmlentities($str))

    $conditions = array($db->quoteName('id') . ' = ' . $db->quote($last_id));

    $query->update($db->quoteName($info_table))->set($fields)->where($conditions);
    $db->setQuery($query);
    $results = $db->execute();

    return $results;

  }//end create_data_id

  function console_log($msg,$val = '')
  {
    $msg_type = gettype($msg);
    $val_type = gettype($val);

    $msg_str = "\n " . (($msg_type == "object") ? var_export($msg) :
    (($msg_type == "array") ? implode($msg): $msg ));

    $val_str = "\n " . (($val_type == "object") ? var_export($val) :
    (($val_type == "array") ? implode($val): $val ));

    $message = ($this->mode == "dev" || $this->mode == "development") ? $msg_str .  $val_str : "";
    echo $message;
  }//console_log

}//end class
