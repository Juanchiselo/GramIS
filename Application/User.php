<?php
    class User
    {
        var $biography;
        var $externalURL;
        var $followerCount;
        var $followingCount;
        var $fullName;
        var $isPrivate;
        var $mediaCount;
        var $profilePicUrl;
        var $username;

        function __construct($biography, $externalURL, $followerCount, $followingCount,
            $fullName, $isPrivate, $mediaCount, $profilePicUrl, $username)
        {
            $this->biography = $biography;
            $this->externalURL = $externalURL;
            $this->followerCount = $followerCount;
            $this->followingCount = $followingCount;
            $this->fullName = $fullName;
            $this->isPrivate = $isPrivate;
            $this->mediaCount = $mediaCount;
            $this->profilePicUrl = $profilePicUrl;
            $this->username = $username;
        }
    }
?>
