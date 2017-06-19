# Tizen Boilerplate
All featureres working only on Ubuntu 16.04. 
Also you need to install Tizen Studio SDK to generate certificate. After you crate certificate you can sign certificate to cli by "signCertificateToCli" grunt task.
To send app by CLI to Tizen 2.4 use "deploy-tizen-2-4" grunt task.

## Main Features
- sass to css (with autoprefixer)
- es6 by babel
- compile wgt package (need Tizen SDK)
- sending app by Tizen CLI
- create URL Launcher Server with app 

## Installation
    npm install

Change yours settigns in Gruntfile.js

    appId: 'SnHl0SrqpF',
    tvIP: "106.116.154.6",
    tizenCLIPath: "/home/p.pupczyk/tizen-studio",
    tizenScriptPath: "/tools/ide/bin/tizen.sh",
    tvPath: "/home/owner/share/tmp/sdk_tools/tmp/",
    certificateName: "aaaa",
    certificatePath: "/home/p.pupczyk/workspace-studio/.metadata/.plugins/org.tizen.common.sign/profiles.xml"
    
Sending app by CLI run:
    
    grunt deploy-tizen-3

Sending app by URL Luncher:
    
    grunt url-luncher 

---
**Keep calm and develop on Tizen :]**