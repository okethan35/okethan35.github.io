<?php
$name = $_POST['name'];
$visitor_email = $_POST['email'];
$subject = $_POST['subject'];
$message = $_POST['message'];

$email_from = 'info@okethan35.github.io';

$email_subject = 'New Form Submission';

$email_body = "User Name : $name.\n".
			  "User Email : $visitor_email.\n".
			  "User Name : $subject.\n".
			  "User Name : $message.\n".;

$to = 'ethantran35@hotmail.com'

$headers = "From: $email_from \r\n";

$headers .= "Reply-To: $visitor_email \r\n";

mail($to, $email_subject, $email_body, $headers);

header("Location: contact.html");

?>