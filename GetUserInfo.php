<?php
    require_once('Response.php');
    require_once('User.php');

    header("Access-Control-Allow-Credentials: true");
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Allow-Headers: Accept, X-Access-Token, X-Application-Name, X-Request-Sent-Time');

    set_time_limit(0);
    date_default_timezone_set('UTC');

    require __DIR__.'/../vendor/autoload.php';
    \InstagramAPI\Instagram::$allowDangerousWebUsageAtMyOwnRisk = true;

    /////// CONFIG ///////
    $username = '';
    $password = '';
    $debug = false;
    $truncatedDebug = false;
    //////////////////////

    $instagram = new \InstagramAPI\Instagram($debug, $truncatedDebug);
    $response;

    try 
    {
        $instagram->login($username, $password);

        $userId = $instagram->people->getUserIdForName(test_input($_POST['username']));  
        $userInfo = $instagram->people->getInfoById($userId)->getUser();

        $user = new User($userInfo->getBiography(),
                         $userInfo->getExternalUrl(),
                         $userInfo->getFollowerCount(),
                         $userInfo->getFollowingCount(),
                         $userInfo->getFullName(),
                         $userInfo->getIsPrivate(),
                         $userInfo->getMediaCount(),
                         $userInfo->getHdProfilePicUrlInfo()->getUrl(),
                         $userInfo->getUsername());

        $response = new Response('OK', null, $user, null, null, null);
    }
    catch (\Exception $exception) 
    {
        $response = new Response('ERROR', $exception->getMessage(), null, null, null, null);
    }
    finally
    {
        echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    }

    function test_input($data) 
    {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        return $data;
    }
?>
