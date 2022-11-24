# MeanMessageApp
A simple messaging app using AngularJS, HTML &amp; CSS for front-end, Node/Express for back-end and MongoDB (mongoose) database.

1. Sign Up Page

	a. Signup page has the following fields

		i.	Username
		ii.	Password
		iii.	First Name
		iv.	Last Name
		v.	Phone
		vi.	Gender (radio button)

	b. After successful registration user is rediected to login page

2. Login Page

	a. Option to enter username and password

	b. If the user is valid redirect to home page else display an error message

3.	Home page

	a. Page has a navbar with the following links.

		i.	Home
		ii.	Message
		iii.	Logout

	b.	Links are highlighted once clicked.

	c.	Once logout is clicked the navbar is updated with the following links and user is redirected to login page.

		i.	Login
		ii.	Register

4.	Message Page

	a.	Displays all the message the user received
	
	b.	From the list page the following has been provided 
	
		i.	Option to navigate to detailed page
		ii.	Mark as important
		iii.	Delete message

	c.	Provided link to send message to another user registered in the system.

5.	Message detail page

	a.	Displays the message

	b.	Option for marking message as important

	c.	Option to send reply to the message

	d.	Option to delete the message

6.	Home / Message / Message detail page can be accessed only if the user is logged, else redirected to login page.

