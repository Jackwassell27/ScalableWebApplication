<?php
    // Get instance ID to display on the page
    $instance_id = file_get_contents('http://169.254.169.254/latest/meta-data/instance-id');

    // Simple HTML with a welcome message
    echo "<h1>Welcome to My Scalable Web Application</h1>";
    echo "<p>This is running on EC2 instance: <b>$instance_id</b></p>";
?>
