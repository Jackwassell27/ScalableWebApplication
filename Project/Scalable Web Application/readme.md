# Scalable Web Application with Auto-Scaling & Elastic Load Balancer

This respository will contain three main files for this project, you will be presented with a basic php and Node.js code for your Web Application, and a readme file for setup instructions, architectural design and more.

## Table of Contents
- [Architecture](#architecture)
- [Requirements](#requirements)
- [Features](#features)
- [Setup Instructions](#setup-instructions)
    - [EC2 Instance](#1-ec2-instance)
    - [Elastic Load Balancer](#2-elastic-load-balancer)
    - [Auto Scaling Group](#3-auto-scaling-group)
    - [CloudWatch](#4-cloudwatch)
    - [Cost Cosniderations](#6-cost-considerations-and-free-tier)

## Architecture
The Architecture for your scalable web application involves several key AWS Components that ensure load balancing, auto-scaling, and monitoring.
- **High-Level Architecture Diagram**
    - **EC2 Instances**: Hosting the web application.
    - **Auto-Scaling Group**: Automatically adjusts the number of EC2 instances based on traffic.
    - **Elastic Load Balancer**: Distributes incoming traffic among multiple EC2 Instances.
    - **CloudWatch**: Monitors the application performance and triggers scaling policies.
    - **Optional Components**:
        - S3: For serving statuc content (images, CSS, JS).
        - RDS or DynamoDB: For database management.

## Requirements
- **Skills and Tools**.
    - Basic AWS Knowledge: Setting up EC2 Instances, ASG, ELB, and CloudWatch.
    - Basic Linux CLI skills: For deploying applications and managing servers.
    - Web Application Development: Familiarity with PHP or Node.Js. 
    - Traffic Simulation Tools: Experience with tools like Apache Benchmark or Locust to simulate and test the system's scaling capabilities.
- **AWS Services** 
    - **EC2 Instances**: 
        - t2.micro instances (for the AWS Free Trial).
    - **Auto Scaling Group**:
        - Automaticlaly scales based on CPU or traffic metrics.
    - **Elastic Load Balancer**:
        - Distributes traffic among the EC2 instaces.
    - **CloudWatch**
        - Monitors instance health, CPU, memory, and custom metrics.

## Features
- **Scalability**:
    - Automatically scales EC2 instances horizontally based on traffic.
    - Handles varying traffic loads efficiently with cost optimization
- **Load Balancing**:
    - Traffic is evenly distributed across all running EC2 instances using an Elastic Load Balancer
- **Dynamic and Predictive Scaling Options**:
    - Dynamic Scaling: Responds to real-time metrics like CPU usage or traffic.
    - Predictive Scaling: Forecasts future traffic trends and scales proactively.
- **Real-Time Monitoring**:
    - CloudWatch provides detailed metrics and alarms to monitor application performance and resource usage.
- **Customizable Web Application**:
    - Deploy a simple **PHP** or **Node.js** application to test scalability.
    - Easily adaptable to diferent web applications or frameworks.
- **Traffic Simulation**
    - Use tools like **Apache Benchmark** or **Locust** to simulate traffic and test the auto-scaling behavior.

## Setup Instructions
---
#### 1. EC2 Instance

1. **Launch an EC2 Instance**
    - Go to the EC2 Dashboard.
    - Click Launch Instance.
    - Name it (eg. Web-Application).
    - Choose the **Amazon Linux 2 AMI**
    - Select **t2.micro** (to stay within the Free Tier).
    - Configure **instance details** (defaults are fine).
    - Add **storage** *(default 8 GB is fine).
    - **Security Group**: Allow **SSH (22)** and **HTTP (80)**
    - Launch the instance and connect via SSH.
2. **Install Apache and PHP**:
`sudo yum update -y`
`sudo yum install -y httpd php`
3. **Deploy the PHP App**:
    - Create the **index.php** file in the Apache document root:
    `sudo vi /var/www/html/index.php`
    - Paste this PHP code:
    `<?php
    $instance_id = file_get_contents('http://169.254.169.254/latest/meta-data/instance-id');
    echo "<h1>Welcome to My Scalable Web Application</h1>";
    echo "<p>This is running on EC2 instance: <b>$instance_id</b></p>";
?>`
4. **Start Apache**
    `sudo systemctl start httpd`
    `sudo systemctl enable httpd`

**Option 2**: Node.js Web Application
1. Launch an EC2 Instance (same steps as above).
2. Install Node.js
`sudo yum update -y`
`curl -sL https://rpm.nodesource.com/setup_14.x | sudo bash -`
`sudo yum install -y nodejs`
3. **Deploy the Node.js App**:
    - Create the ap.js file:
    `sudo vi /var/www/app.js`
    - Paste this Node.js code:
```const http = require('http');
const fs = require('fs');

function getInstanceId(callback) {
    fs.readFile('/sys/devices/virtual/dmi/id/board_asset_tag', 'utf8', (err, data) => {
        if (err) callback('Unknown');
        else callback(data.trim());
    });
}

const server = http.createServer((req, res) => {
    getInstanceId((instanceId) => {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('<h1>Welcome to My Scalable Web Application</h1>');
        res.write('<p>This is running on EC2 instance: <b>' + instanceId + '</b></p>');
        res.end();
    });
});

server.listen(80, () => {
    console.log('Server is listening on port 80');
});
```
4. **Start the Node.js App**:
`cd /var/www
sudo node app.js
`
---
#### 2. Elastic Load Balancer
1. Create a Load Balancer:
    - Go to the **EC2 Dashboard** → **Load Balancers**
    - Click **Create Load Balancer**.
    - Choose **Application Load Balancer**. 
    - Configure:
        - Name your Load Balancer.
        - Set it to **internet-facing**
        - Add a **listener** for **HTTP (80)**.
        - Choose your **VPC** and select at least 2 **availability zones**.
2. **Create Target Group**
    - Choose **Instances** as the target type.
    - Set **Protocol** to **HTTP**.
    - Register your **EC2 instance** to the target group.
3. **Review and Create** the Load Balancer.
---
#### 3. Auto Scaling Group

1. **Create Launch Template**:
    - Go to **EC2 Dashboard** → **Launch Templates**.
    - Click **Create Launch Template** 
    - Use the settings from your EC2 instance for the template (same AMI, instance type, etc.)
2. **Create Auto Scaling Group**:
    - Go to **EC2 Dashboard** → **Auto Scaling Groups**.
    - Click **Create Auto Scaling Group**.
    - Select your **Launch template**.
    - Attach your **Load Balancer**.
    - Set **minimum**, **desired**, and **maximum** number of instances (e.g., min:1, desired:2, max: 4).
    - **Health Checks:** Set them to **ELB**
---
#### 4. CloudWatch
1. **Create CloudWatch Alarms**:
    - Go to **CloudWatch Dashboard** → **Alarms**
    - Click **Create Alarm.**
    - Choose a metric like **EC2 → Per-Instance Metrics → CPU Utilization**.
    - Set the threshhold (e.g., trigger if CPU > 60%)
    - Attach this alarm to your **Auto Scaling Policy**.
2. **Monitor the App:**
    - Use **CloudWatch** to observe instance performance and traffic distribution.**
---
#### 5. Traffic and Observe Scaling
1. **Install Apache Benchmark** (on another EC2 instance or local machine):
`sudo yum install httpd-tools`
2. **Run a Traffic Test**:
`ab -n 10000 -c 100 http://your-load-balancer-dns/`
    - This sends 10,000 requests to your load balancer, with 100 concurrent users.
3. **Observe Auto Scaling:**
    - Go to **EC2 Dashboard** and see new instances launching as traffic increases.
---
#### 6. Cost Considerations and Free Tier
- **EC2 (t2.micro)**: 750 hours/month (free).
- **ELB**: 750 hours and 15 GB data processing (free).
- **CloudWatch**: 10 custom metrics, 1,000,000 requests (free).
- **Monitor your usage** in the AWS Billing Dashboard to avoid exceeding the Free Tier Limits.
---

### Conclusion
- Test your application with real traffic simulation
- Monitor scaling behavior in **Auto Scaling Groups** and performance via **CloudWatch**
- Optimize your application based on metrics.

### Following these steps will help you build a Scalable Web Application using AWS.