<?php
    class Photo
    {
        var $takenAt;
        var $location;
        var $address;
        var $city;
        var $latitude;
        var $longitude;
        var $username;
        var $isPrivate;
        var $profilePicUrl;
        var $url;
        var $caption;
        var $likes;

        function __construct($takenAt, $location, $latitude, $longitude,
            $username, $isPrivate, $profilePicUrl, $url)
        {
            $this->takenAt = date("F j, Y", $takenAt);
            $this->location = $location;
            $this->latitude = $latitude;
            $this->longitude = $longitude;
            $this->username = $username;
            $this->isPrivate = $isPrivate;
            $this->profilePicUrl = $profilePicUrl;
            $this->url = $url;
        }

        function setTakenAt($takenAt)
        {
            $this->takenAt = $takenAt;
        }
        function getTakenAt()
        {
            return $this->takenAt;
        }
        function setLocation($location)
        {
            $this->location = $location;
        }
        function getLocation()
        {
            return $this->location;
        }
        function setAddress($address)
        {
            $this->address = $address;
        }
        function getAddress()
        {
            return $this->address;
        }
        function setCity($city)
        {
            $this->city = $city;
        }
        function getCity()
        {
            return $this->city;
        }
        function setLatitude($latitude)
        {
            $this->latitude = $latitude;
        }
        function getLatitude()
        {
            return $this->latitude;
        }
        function setLongitude($longitude)
        {
            $this->longitude = $longitude;
        }
        function getLongitude()
        {
            return $this->longitude;
        }
        function setUsername($username)
        {
            $this->username = $username;
        }
        function getUsername()
        {
            return $this->username;
        }
        function setIsPrivate()
        {
            $this->isPrivate = $isPrivate;
        }
        function getIsPrivate()
        {
            return $this->isPrivate;
        }
        function setProfilePicUrl($profilePicUrl)
        {
            $this->profilePicUrl = $profilePicUrl;
        }
        function getProfilePicUrl()
        {
            return $this->profilePicUrl;
        }
        function setUrl($url)
        {
            $this->url = $url;
        }
        function getUrl()
        {
            return $this->url;
        }
        function setCaption($caption)
        {
            $this->caption = $caption;
        }
        function getCaption()
        {
            return $this->caption;
        }
        function setLikes($likes)
        {
            $this->likes = $likes;
        }
        function getLikes()
        {
            return $this->likes;
        }
    }
?>
