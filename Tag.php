<?php
    class Tag
    {
        var $id;
        var $mediaCount;
        var $nonViolating;

        function __construct($id, $mediaCount, $nonViolating)
        {
            $this->id = $id;
            $this->mediaCount = $mediaCount;
            $this->nonViolating = $nonViolating;
        }
    }
?>
