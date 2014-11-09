module.exports={
	userName: <<sendgrid username goes here>>,
	password: <<sendgrid password goes here>>,
	serviceName:'sendgrid',
	//sendgrid is a well known service to node-mailer.So, it knows what
	//hostname:portname to use.  We don't have to specify it.
	sendMode:'test', //'test'|'real'
	teacherEmail:<<cc email address goes here>>,
	headers: {
		'X-SMTPAPI': {
			category: 'Verde reminders',
			filters: {
				clicktrack: {
					settings: {
						enable: 0
					}
				},
				opentrack: {
					settings: {
						enable: 0
					}
				},
				subscriptiontrack: {
					settings: {
						enable: 0
					}
				}
			}
		}
	}
};