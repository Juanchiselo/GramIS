<?php
    class Response
    {
        var $code;
        var $error;
        var $data;
        var $nextMaxID;
        var $progress;
        var $rankToken;

        function __construct($code, $error, $data, $nextMaxID, $progress, $rankToken)
        {
            $this->code = $code;
            $this->error = $error;
            $this->data = $data;
            $this->nextMaxID = $nextMaxID;
            $this->progress = $progress;
            $this->rankToken = $rankToken;
        }
    }
?>
