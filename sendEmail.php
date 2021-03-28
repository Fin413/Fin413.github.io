<?php
    $data = json_decode(file_get_contents('php://input'));
    $sender = 'campisawesome2015@gmail.com';
    $recipient = 'campisawesome2015@gmail.com';
    
    $subject = "php mail test";
    $message = $data->message;
    $headers = 'From:' . $sender;
    
    if (mail($recipient, $subject, $message, $headers)) echo "Message accepted";
    else echo "Error: Message not accepted";
?>