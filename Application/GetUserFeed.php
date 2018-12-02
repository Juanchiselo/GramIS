<?php
    require_once('Response.php');
    require_once('Photo.php');

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

        $nextMaxID = $_POST['nextMaxID'];

        if(empty($nextMaxID))
            $nextMaxID = null;

        // Initialize an array to store the Photo objects.
        $photos = array();

        // Request the page corresponding to maxId.
        $userId = $instagram->people->getUserIdForName(test_input($_POST['username']));
        $userFeed = $instagram->timeline->getUserFeed($userId, test_input($_POST["nextMaxID"]));

        // Creates the Photo object with the data received from Instagram.
        foreach ($userFeed->getItems() as $item) 
        {
            if($item->getLocation() != null && $item->getCarouselMedia() == null)
            {
                $photo = new Photo($item->getTakenAt(), 
                    $item->getLocation()->getName(),
                    $item->getLocation()->getLat(),
                    $item->getLocation()->getLng(),
                    $item->getUser()->getUsername(),
                    $item->getUser()->getIsPrivate(),
                    $item->getUser()->getProfilePicUrl(),
                    $item->getImageVersions2()->getCandidates()[0]->getUrl());

                    if($item->getLocation()->getAddress() != null)
                        $photo->setAddress($item->getLocation()->getAddress());
                    if($item->getLocation()->getCity() != null)
                        $photo->setAddress($item->getLocation()->getCity());
                    if($item->getCaption() != null)
                        $photo->setCaption($item->getCaption()->getText());
                    if($item->getLikeCount() != null)
                        $photo->setLikes($item->getLikeCount());
                $photos[] = $photo;
            }
        }

        $response = new Response('OK', null, $photos, $userFeed->getNextMaxId(), sizeof($userFeed->getItems()), null);
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
